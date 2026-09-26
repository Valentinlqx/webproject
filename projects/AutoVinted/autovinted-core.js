// Tout ce qui parle aux API d'IA, sans toucher au DOM : ça se teste sous Node
// (tests/unit/autovinted-core.test.mjs) et ça se charge tel quel dans la page.
(function (root) {
  'use strict';

  // Prix en dollars pour 1M de tokens, relevés le 2026-09-26.
  // Le premier modèle de chaque liste est celui utilisé par défaut.
  const PROVIDERS = {
    anthropic: {
      label: 'Claude',
      keyUrl: 'https://console.anthropic.com/settings/keys',
      imageTokens: 1300,
      models: [
        { id: 'claude-opus-5', label: 'Claude Opus 5', in: 5, out: 25 },
        { id: 'claude-sonnet-5', label: 'Claude Sonnet 5', in: 2, out: 10 },
        { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 (économique)', in: 1, out: 5 },
      ],
    },
    openai: {
      label: 'ChatGPT',
      keyUrl: 'https://platform.openai.com/api-keys',
      imageTokens: 425,
      models: [
        { id: 'gpt-6-sol', label: 'GPT-6 Sol', in: 2, out: 10 },
        { id: 'gpt-6-luna', label: 'GPT-6 Luna (économique)', in: 0.1, out: 0.5 },
        { id: 'gpt-6-astra', label: 'GPT-6 Astra (le plus puissant)', in: 10, out: 50 },
      ],
    },
    gemini: {
      label: 'Gemini',
      keyUrl: 'https://aistudio.google.com/app/apikey',
      imageTokens: 258,
      models: [
        { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash', in: 0.75, out: 3.75 },
        { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash-Lite (économique)', in: 0.3, out: 2.5 },
      ],
    },
    mistral: {
      label: 'Mistral',
      keyUrl: 'https://console.mistral.ai/api-keys/',
      imageTokens: 1000,
      models: [
        { id: 'mistral-medium-latest', label: 'Mistral Medium', in: 1.5, out: 7.5 },
        { id: 'mistral-small-latest', label: 'Mistral Small (économique)', in: 0.15, out: 0.6 },
      ],
    },
  };

  const USD_TO_EUR = 0.93;
  // À la louche : une annonce en JSON plus un peu de réflexion du modèle.
  const OUTPUT_TOKENS_PER_LISTING = 500;

  function detectProvider(raw) {
    const key = (raw || '').trim();
    if (!key) return { ok: false, reason: 'empty' };
    if (key.startsWith('sk-ant-')) return { ok: true, id: 'anthropic' };
    // OpenRouter commence aussi par sk-, il faut le tester avant OpenAI.
    if (key.startsWith('sk-or-')) return { ok: false, reason: 'openrouter' };
    if (key.startsWith('sk-')) return { ok: true, id: 'openai' };
    if (key.startsWith('AIza')) return { ok: true, id: 'gemini' };
    if (key.startsWith('gsk_')) return { ok: false, reason: 'groq' };
    // Les clés Mistral n'ont pas de préfixe : 32 caractères alphanumériques.
    if (/^[A-Za-z0-9]{32}$/.test(key)) return { ok: true, id: 'mistral' };
    return { ok: false, reason: 'unknown' };
  }

  function resolveModel(providerId, stored) {
    const models = PROVIDERS[providerId].models;
    return models.some(m => m.id === stored) ? stored : models[0].id;
  }

  function estimateCost({ providerId, modelId, photos, textChars, listings }) {
    const provider = PROVIDERS[providerId];
    // Environ 4 caractères par token en français.
    const inTokens = Math.ceil(textChars / 4) + photos * provider.imageTokens;
    const outTokens = listings * OUTPUT_TOKENS_PER_LISTING;
    const model = provider.models.find(m => m.id === modelId);
    const eur = model ? ((inTokens * model.in + outTokens * model.out) / 1e6) * USD_TO_EUR : null;
    return { inTokens, outTokens, eur };
  }

  // Les modèles emballent parfois le JSON dans ```json … ``` ou dans une phrase.
  function parseJSON(text) {
    const raw = (text || '').trim();
    if (!raw) throw new Error("L'IA a renvoyé une réponse vide. Réessaie.");

    const attempts = [raw];
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenced) attempts.push(fenced[1].trim());
    const braced = raw.match(/\{[\s\S]*\}/);
    if (braced) attempts.push(braced[0]);

    for (const candidate of attempts) {
      try { return JSON.parse(candidate); } catch { /* on essaie la forme suivante */ }
    }
    const snippet = raw.length > 220 ? raw.slice(0, 220) + '…' : raw;
    throw new Error(`Réponse de l'IA illisible : « ${snippet} »`);
  }

  function splitDataUrl(url) {
    const m = /^data:(image\/[a-z+]+);base64,(.+)$/.exec(url);
    return m ? { mime: m[1], data: m[2] } : null;
  }

  function toAnthropicContent(content) {
    if (typeof content === 'string') return content;
    return content.map(part => {
      if (part.type !== 'image_url') return { type: 'text', text: part.text };
      const img = splitDataUrl(part.image_url.url);
      if (!img) return { type: 'text', text: '[image illisible]' };
      return { type: 'image', source: { type: 'base64', media_type: img.mime, data: img.data } };
    });
  }

  function toGeminiParts(content) {
    if (typeof content === 'string') return [{ text: content }];
    return content.map(part => {
      if (part.type !== 'image_url') return { text: part.text };
      const img = splitDataUrl(part.image_url.url);
      return img ? { inline_data: { mime_type: img.mime, data: img.data } } : { text: '[image illisible]' };
    });
  }

  function systemText(conversation) {
    const sys = conversation.find(m => m.role === 'system');
    return sys ? sys.content : '';
  }

  function buildRequest({ providerId, model, key, conversation, maxTokens }) {
    const json = { 'Content-Type': 'application/json' };
    const turns = conversation.filter(m => m.role !== 'system');

    if (providerId === 'openai') {
      // Les modèles GPT-6 réfléchissent : ils refusent max_tokens et une temperature fixée.
      return {
        url: 'https://api.openai.com/v1/chat/completions',
        init: {
          method: 'POST',
          headers: { ...json, Authorization: `Bearer ${key}` },
          body: JSON.stringify({
            model,
            messages: conversation,
            max_completion_tokens: maxTokens,
            response_format: { type: 'json_object' },
          }),
        },
      };
    }

    if (providerId === 'mistral') {
      const messages = conversation.map(m => typeof m.content === 'string' ? m : {
        role: m.role,
        content: m.content.map(p => p.type === 'image_url' ? { type: 'image_url', image_url: p.image_url.url } : p),
      });
      return {
        url: 'https://api.mistral.ai/v1/chat/completions',
        init: {
          method: 'POST',
          headers: { ...json, Authorization: `Bearer ${key}` },
          body: JSON.stringify({
            model,
            messages,
            max_tokens: maxTokens,
            temperature: 0.7,
            response_format: { type: 'json_object' },
          }),
        },
      };
    }

    if (providerId === 'anthropic') {
      const headers = {
        ...json,
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      };
      const body = {
        model,
        max_tokens: maxTokens,
        system: systemText(conversation),
        messages: turns.map(m => ({ role: m.role, content: toAnthropicContent(m.content) })),
      };
      // Si Opus refuse par excès de prudence, l'API relance d'elle-même sur un autre modèle.
      if (model === 'claude-opus-5') {
        headers['anthropic-beta'] = 'server-side-fallback-2026-07-01';
        body.fallbacks = 'default';
      }
      return {
        url: 'https://api.anthropic.com/v1/messages',
        init: { method: 'POST', headers, body: JSON.stringify(body) },
      };
    }

    if (providerId === 'gemini') {
      return {
        url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        init: {
          method: 'POST',
          headers: { ...json, 'x-goog-api-key': key },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemText(conversation) }] },
            contents: turns.map(m => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: toGeminiParts(m.content),
            })),
            generationConfig: { maxOutputTokens: maxTokens, responseMimeType: 'application/json' },
          }),
        },
      };
    }

    throw new Error(`Fournisseur inconnu : ${providerId}`);
  }

  function extractText(providerId, data) {
    let text = '';

    if (providerId === 'anthropic') {
      if (data.stop_reason === 'refusal') {
        throw new Error('Claude a refusé de traiter ces photos. Essaie avec d\'autres photos ou un autre modèle.');
      }
      text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    } else if (providerId === 'gemini') {
      if (data.promptFeedback && data.promptFeedback.blockReason) {
        throw new Error('Gemini a bloqué la demande (filtre de sécurité).');
      }
      const parts = data.candidates?.[0]?.content?.parts || [];
      text = parts.filter(p => p.text && !p.thought).map(p => p.text).join('');
    } else {
      const content = data.choices?.[0]?.message?.content;
      text = Array.isArray(content)
        ? content.filter(p => p.type === 'text').map(p => p.text).join('')
        : content || '';
    }

    if (!text.trim()) throw new Error("L'IA a renvoyé une réponse vide. Réessaie.");
    return text;
  }

  function apiErrorMessage(status, body) {
    if (status === 401 || status === 403) return 'Clé API refusée. Vérifie-la dans les paramètres.';
    if (status === 429) return 'Trop de requêtes ou quota épuisé chez ton fournisseur. Réessaie dans un moment.';
    const detail = body && (body.error?.message || body.message);
    return detail || `Erreur du fournisseur (HTTP ${status}).`;
  }

  // Avant, on stockait une clé par fournisseur (av-key-openai, …). Il n'y en a plus qu'une.
  function migrateLegacyKey(storage) {
    const ids = ['anthropic', 'openai', 'gemini', 'mistral'];
    const legacy = [...ids, 'groq'];
    if (!storage.getItem('av-key')) {
      const preferred = storage.getItem('av-provider');
      const order = ids.includes(preferred) ? [preferred, ...ids.filter(id => id !== preferred)] : ids;
      const found = order.map(id => storage.getItem('av-key-' + id)).find(Boolean);
      if (found) storage.setItem('av-key', found);
    }
    for (const id of legacy) {
      storage.removeItem('av-key-' + id);
      storage.removeItem('av-model-' + id);
    }
    storage.removeItem('av-provider');
  }

  const api = {
    PROVIDERS,
    detectProvider,
    resolveModel,
    estimateCost,
    parseJSON,
    buildRequest,
    extractText,
    apiErrorMessage,
    migrateLegacyKey,
  };

  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.AutoVintedCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
