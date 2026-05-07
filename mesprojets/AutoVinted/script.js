/* ── AutoVinted — script.js ──
   Client-side webapp: upload photos → GPT-4o vision → annonce Vinted optimisée
*/

// ─── Providers ───────────────────────────────────────
const PROVIDERS = {
  pollinations: {
    label: 'Gratuit — Pollinations (aucune clé)',
    needsKey: false,
    vision: true,
    hint: "Fonctionne sans inscription, idéal pour tester. Plus lent et moins fiable que les options payantes.",
    models: [{ id: 'openai-large', label: 'GPT-4o (gratuit, via Pollinations)' }],
    call: callPollinations,
  },
  openai: {
    label: 'OpenAI — ChatGPT',
    needsKey: true,
    vision: true,
    keyUrl: 'https://platform.openai.com/api-keys',
    keyLabel: 'Clé API OpenAI',
    keyPrefix: 'sk-',
    hint: "Meilleure qualité de vision. Compte ~0.01€ par annonce avec GPT-4o.",
    models: [
      { id: 'gpt-4o', label: 'GPT-4o (recommandé)' },
      { id: 'gpt-4o-mini', label: 'GPT-4o mini (économique)' },
    ],
    call: (s) => callOpenAICompatible(s, 'https://api.openai.com/v1/chat/completions', true),
  },
  anthropic: {
    label: 'Anthropic — Claude',
    needsKey: true,
    vision: true,
    keyUrl: 'https://console.anthropic.com/settings/keys',
    keyLabel: 'Clé API Anthropic',
    keyPrefix: 'sk-ant-',
    hint: "Excellent pour les descriptions naturelles. Vision native Claude.",
    models: [
      { id: 'claude-sonnet-4-5-20250929', label: 'Claude Sonnet 4.5' },
      { id: 'claude-3-5-sonnet-20241022', label: 'Claude Sonnet 3.5' },
      { id: 'claude-3-5-haiku-20241022', label: 'Claude Haiku 3.5 (rapide)' },
    ],
    call: callAnthropic,
  },
  gemini: {
    label: 'Google — Gemini',
    needsKey: true,
    vision: true,
    keyUrl: 'https://aistudio.google.com/app/apikey',
    keyLabel: 'Clé API Google AI Studio',
    keyPrefix: 'AIza',
    hint: "Quota gratuit généreux sur Google AI Studio.",
    models: [
      { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (rapide)' },
      { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    ],
    call: callGemini,
  },
  groq: {
    label: 'Groq — Llama Vision (rapide)',
    needsKey: true,
    vision: true,
    keyUrl: 'https://console.groq.com/keys',
    keyLabel: 'Clé API Groq',
    keyPrefix: 'gsk_',
    hint: "Très rapide. Quota gratuit sur Groq Cloud.",
    models: [
      { id: 'llama-3.2-90b-vision-preview', label: 'Llama 3.2 90B Vision' },
      { id: 'llama-3.2-11b-vision-preview', label: 'Llama 3.2 11B Vision' },
    ],
    call: (s) => callOpenAICompatible(s, 'https://api.groq.com/openai/v1/chat/completions', false),
  },
  mistral: {
    label: 'Mistral — Pixtral',
    needsKey: true,
    vision: true,
    keyUrl: 'https://console.mistral.ai/api-keys/',
    keyLabel: 'Clé API Mistral',
    keyPrefix: '',
    hint: "Modèle Pixtral spécialisé vision, made in France.",
    models: [
      { id: 'pixtral-large-latest', label: 'Pixtral Large' },
      { id: 'pixtral-12b-2409', label: 'Pixtral 12B' },
    ],
    call: (s) => callOpenAICompatible(s, 'https://api.mistral.ai/v1/chat/completions', false),
  },
  deepseek: {
    label: 'DeepSeek (texte uniquement)',
    needsKey: true,
    vision: false,
    keyUrl: 'https://platform.deepseek.com/api_keys',
    keyLabel: 'Clé API DeepSeek',
    keyPrefix: 'sk-',
    hint: "⚠️ DeepSeek ne lit pas les images : il te demandera de tout décrire en texte.",
    models: [
      { id: 'deepseek-chat', label: 'DeepSeek V3' },
      { id: 'deepseek-reasoner', label: 'DeepSeek R1 (raisonnement)' },
    ],
    call: (s) => callOpenAICompatible(s, 'https://api.deepseek.com/chat/completions', true),
  },
};

// ─── State ───────────────────────────────────────────
const state = {
  photos: [],          // [{ id, file, dataUrl }]
  conversation: [],    // [{ role, content }] — messages
  provider: localStorage.getItem('av-provider') || 'pollinations',
  model: localStorage.getItem('av-model-' + (localStorage.getItem('av-provider') || 'pollinations')) || '',
  history: JSON.parse(localStorage.getItem('av-history') || '[]'),
  lastListing: null,
};

function getApiKey(providerId) {
  return localStorage.getItem('av-key-' + providerId) || '';
}
function setApiKey(providerId, key) {
  localStorage.setItem('av-key-' + providerId, key);
}
function getStoredModel(providerId) {
  return localStorage.getItem('av-model-' + providerId) || PROVIDERS[providerId].models[0].id;
}

const MAX_PHOTOS = 8;
const MAX_PHOTO_SIZE = 1280; // px (downscale before sending)

// ─── System prompt (le cœur de l'IA) ─────────────────
const SYSTEM_PROMPT = `Tu es un vendeur Vinted expérimenté qui rédige des annonces qui se vendent vite. Tu écris comme un humain, pas comme une IA marketing : ton simple, naturel, concis, crédible. Phrases courtes et vendeuses.

Tu analyses les photos d'un vêtement ou accessoire et tu rédiges une annonce Vinted optimisée pour la visibilité, la confiance et la rapidité de vente.

INFORMATIONS NÉCESSAIRES avant de générer l'annonce :
- marque, taille, état, couleur, type de vêtement, matière
- défauts éventuels, prix d'achat approximatif
- si c'est tendance / vintage / rare, sexe/catégorie

Si certaines de ces infos ne sont pas visibles ou déductibles avec certitude depuis les photos, POSE des questions courtes et conversationnelles (1 à 3 questions max par message). N'invente jamais ce qui n'est pas visible.

Quand tu as toutes les infos importantes, génère l'annonce.

PRICING : estime un prix cohérent selon marque, état, demande actuelle, rareté, prix marché seconde main. Donne 3 prix en euros : idéal, vente rapide, minimum acceptable.

FORMAT DE RÉPONSE — tu réponds TOUJOURS en JSON valide avec ce schéma :

{
  "action": "ask" | "generate",
  "message": "ton message si action=ask, sinon court résumé",
  "listing": null | {
    "title": "titre Vinted optimisé (max 60 caractères, sans emojis abusifs)",
    "description": "description prête à copier-coller, naturelle, courte, vendeuse, avec retours ligne",
    "details": {
      "marque": "...",
      "taille": "...",
      "etat": "Neuf avec étiquette | Neuf sans étiquette | Très bon état | Bon état | Satisfaisant",
      "couleur": "...",
      "categorie": "...",
      "matiere": "..."
    },
    "prices": {
      "ideal": "15€",
      "rapide": "10€",
      "minimum": "8€"
    },
    "tips": ["conseil 1", "conseil 2"]
  }
}

Aucun texte hors JSON. Pas de markdown autour du JSON.`;

// ─── DOM ─────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const dropzone = $('dropzone');
const fileInput = $('file-input');
const previews = $('previews');
const analyzeBtn = $('analyze-btn');
const uploadSection = $('upload-section');
const chatSection = $('chat-section');
const chatMessages = $('chat-messages');
const chatForm = $('chat-form');
const chatText = $('chat-text');
const generateBtn = $('generate-btn');
const resultSection = $('result-section');
const toast = $('toast');

// ─── Theme ───────────────────────────────────────────
$('theme-toggle').addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('av-theme', isDark ? 'dark' : 'light');
  $('theme-toggle').textContent = isDark ? '☀️' : '🌙';
});
$('theme-toggle').textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';

// ─── Toast ───────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2200);
}

// ─── Upload ──────────────────────────────────────────
dropzone.addEventListener('click', () => fileInput.click());

['dragenter', 'dragover'].forEach(evt =>
  dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.add('drag'); })
);
['dragleave', 'drop'].forEach(evt =>
  dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.remove('drag'); })
);
dropzone.addEventListener('drop', (e) => {
  const files = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/'));
  addPhotos(files);
});

fileInput.addEventListener('change', (e) => addPhotos([...e.target.files]));

async function addPhotos(files) {
  const room = MAX_PHOTOS - state.photos.length;
  const accepted = files.slice(0, room);
  if (files.length > room) showToast(`Maximum ${MAX_PHOTOS} photos`);

  for (const file of accepted) {
    const dataUrl = await downscaleImage(file, MAX_PHOTO_SIZE);
    state.photos.push({ id: crypto.randomUUID(), file, dataUrl });
  }
  renderPreviews();
}

function downscaleImage(file, maxSide) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = URL.createObjectURL(file);
  });
}

function renderPreviews() {
  previews.innerHTML = '';
  state.photos.forEach(p => {
    const el = document.createElement('div');
    el.className = 'preview';
    el.innerHTML = `
      <img src="${p.dataUrl}" alt="" />
      <button class="preview-remove" aria-label="Supprimer">✕</button>
    `;
    el.querySelector('.preview-remove').addEventListener('click', () => {
      state.photos = state.photos.filter(x => x.id !== p.id);
      renderPreviews();
    });
    previews.appendChild(el);
  });
  analyzeBtn.disabled = state.photos.length === 0;
}

// ─── Analyse (1er appel) ─────────────────────────────
analyzeBtn.addEventListener('click', async () => {
  if (!checkProvider()) return;
  if (state.photos.length === 0) return;

  setBtnLoading(analyzeBtn, true, 'Analyse...');

  // Build initial message with all images
  const userContent = [
    { type: 'text', text: `Voici ${state.photos.length} photo(s) du produit. Analyse-les et soit pose-moi des questions sur les infos manquantes, soit génère directement l'annonce si tu as toutes les infos.` },
    ...state.photos.map(p => ({ type: 'image_url', image_url: { url: p.dataUrl } }))
  ];

  state.conversation = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userContent }
  ];

  try {
    const response = await callAI();
    handleAIResponse(response);
  } catch (err) {
    showToast('Erreur : ' + err.message);
    setBtnLoading(analyzeBtn, false, 'Analyser mes photos');
  }
});

// ─── Chat ────────────────────────────────────────────
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = chatText.value.trim();
  if (!text) return;
  chatText.value = '';
  await sendUserMessage(text);
});

generateBtn.addEventListener('click', async () => {
  await sendUserMessage("Génère l'annonce maintenant avec ce que tu as.");
});

async function sendUserMessage(text) {
  addBubble('user', text);
  state.conversation.push({ role: 'user', content: text });

  const thinking = addBubble('thinking');
  try {
    const response = await callAI();
    thinking.remove();
    handleAIResponse(response);
  } catch (err) {
    thinking.remove();
    addBubble('ai', 'Erreur : ' + err.message);
  }
}

function addBubble(type, text = '') {
  const el = document.createElement('div');
  el.className = 'bubble ' + type;
  if (type === 'thinking') {
    el.innerHTML = '<span></span><span></span><span></span>';
  } else {
    el.textContent = text;
  }
  chatMessages.appendChild(el);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return el;
}

// ─── AI call (dispatch on provider) ──────────────────
async function callAI() {
  const provider = PROVIDERS[state.provider];
  if (!provider) throw new Error('Fournisseur inconnu');
  // Make sure model belongs to current provider
  if (!provider.models.find(m => m.id === state.model)) {
    state.model = getStoredModel(state.provider);
  }
  return provider.call(state);
}

// Pollinations.ai — gratuit, sans clé
async function callPollinations() {
  const res = await fetch('https://text.pollinations.ai/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'openai-large',
      messages: state.conversation,
      temperature: 0.7,
      max_tokens: 1500,
      referrer: 'autovinted',
    }),
  });
  if (!res.ok) {
    throw new Error(`Service gratuit indisponible (${res.status}). Réessaie ou passe à un autre fournisseur.`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '';
  state.conversation.push({ role: 'assistant', content });
  return parseJSON(content);
}

// OpenAI-compatible (OpenAI, Groq, Mistral, DeepSeek)
async function callOpenAICompatible(s, endpoint, supportsJsonMode) {
  const key = getApiKey(s.provider);
  const provider = PROVIDERS[s.provider];

  // Strip image parts for text-only providers (e.g. DeepSeek)
  const messages = provider.vision ? s.conversation : s.conversation.map(m => {
    if (typeof m.content === 'string') return m;
    const text = m.content.filter(p => p.type === 'text').map(p => p.text).join('\n');
    return { role: m.role, content: text || "(L'utilisateur a joint des photos. Demande-lui de les décrire en texte.)" };
  });

  const body = {
    model: s.model,
    messages,
    temperature: 0.7,
    max_tokens: 1500,
  };
  if (supportsJsonMode) body.response_format = { type: 'json_object' };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || err.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  const content = data.choices[0].message.content;
  s.conversation.push({ role: 'assistant', content });
  return parseJSON(content);
}

// Anthropic Claude — different API shape
async function callAnthropic(s) {
  const key = getApiKey(s.provider);
  // Convert OpenAI-style messages → Anthropic format
  const system = s.conversation.find(m => m.role === 'system')?.content || '';
  const messages = s.conversation
    .filter(m => m.role !== 'system')
    .map(m => {
      if (typeof m.content === 'string') return { role: m.role, content: m.content };
      // OpenAI vision format → Anthropic format
      const content = m.content.map(part => {
        if (part.type === 'text') return { type: 'text', text: part.text };
        if (part.type === 'image_url') {
          const url = part.image_url.url;
          const match = url.match(/^data:(image\/[a-z]+);base64,(.+)$/);
          if (!match) return { type: 'text', text: '[image]' };
          return {
            type: 'image',
            source: { type: 'base64', media_type: match[1], data: match[2] }
          };
        }
        return part;
      });
      return { role: m.role, content };
    });

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: s.model,
      max_tokens: 1500,
      system,
      messages,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  const content = data.content?.[0]?.text || '';
  s.conversation.push({ role: 'assistant', content });
  return parseJSON(content);
}

// Google Gemini — different API shape
async function callGemini(s) {
  const key = getApiKey(s.provider);
  const system = s.conversation.find(m => m.role === 'system')?.content || '';
  const contents = s.conversation
    .filter(m => m.role !== 'system')
    .map(m => {
      const role = m.role === 'assistant' ? 'model' : 'user';
      if (typeof m.content === 'string') return { role, parts: [{ text: m.content }] };
      const parts = m.content.map(part => {
        if (part.type === 'text') return { text: part.text };
        if (part.type === 'image_url') {
          const url = part.image_url.url;
          const match = url.match(/^data:(image\/[a-z]+);base64,(.+)$/);
          if (!match) return { text: '[image]' };
          return { inline_data: { mime_type: match[1], data: match[2] } };
        }
        return { text: '' };
      });
      return { role, parts };
    });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${s.model}:generateContent?key=${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 1500, responseMimeType: 'application/json' },
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  s.conversation.push({ role: 'assistant', content });
  return parseJSON(content);
}

// Parse JSON tolerantly — Pollinations may wrap in markdown code blocks
function parseJSON(text) {
  try { return JSON.parse(text); } catch {}
  // strip ```json ... ``` fences
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()); } catch {}
  }
  // grab first {...} block
  const braced = text.match(/\{[\s\S]*\}/);
  if (braced) {
    try { return JSON.parse(braced[0]); } catch {}
  }
  throw new Error('Réponse IA invalide. Réessaie.');
}

// ─── Handle AI response ──────────────────────────────
function handleAIResponse(resp) {
  // Move from upload to chat view on first response
  if (uploadSection.style.display !== 'none') {
    uploadSection.style.display = 'none';
    chatSection.hidden = false;
    setBtnLoading(analyzeBtn, false, 'Analyser mes photos');
  }

  if (resp.action === 'ask') {
    addBubble('ai', resp.message);
    generateBtn.hidden = false;
  } else if (resp.action === 'generate' && resp.listing) {
    renderListing(resp.listing);
    chatSection.hidden = true;
    resultSection.hidden = false;
    saveToHistory(resp.listing);
  } else {
    addBubble('ai', resp.message || 'Réponse inattendue.');
  }
}

// ─── Result rendering ────────────────────────────────
function renderListing(listing) {
  state.lastListing = listing;
  $('r-title').textContent = listing.title || '';
  $('r-description').textContent = listing.description || '';

  const details = listing.details || {};
  const detailLabels = {
    marque: 'Marque', taille: 'Taille', etat: 'État',
    couleur: 'Couleur', categorie: 'Catégorie', matiere: 'Matière'
  };
  $('r-details').innerHTML = Object.entries(detailLabels)
    .filter(([k]) => details[k])
    .map(([k, label]) => `<li><strong>${label}</strong>${escapeHtml(details[k])}</li>`)
    .join('');

  const prices = listing.prices || {};
  $('r-prices').innerHTML = `
    <div class="price-cell"><span class="price-cell-label">Idéal</span><span class="price-cell-value">${escapeHtml(prices.ideal || '—')}</span></div>
    <div class="price-cell"><span class="price-cell-label">Vente rapide</span><span class="price-cell-value">${escapeHtml(prices.rapide || '—')}</span></div>
    <div class="price-cell"><span class="price-cell-label">Minimum</span><span class="price-cell-value">${escapeHtml(prices.minimum || '—')}</span></div>
  `;

  const tips = listing.tips || [];
  if (tips.length) {
    $('r-tips').innerHTML = tips.map(t => `<li>${escapeHtml(t)}</li>`).join('');
    $('r-tips-block').hidden = false;
  } else {
    $('r-tips-block').hidden = true;
  }

  resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ─── Copy buttons ────────────────────────────────────
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.copy-btn');
  if (!btn) return;
  const key = btn.dataset.copy;
  const text = key === 'title' ? state.lastListing?.title : state.lastListing?.description;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.textContent;
    btn.textContent = '✓ Copié';
    btn.classList.add('done');
    setTimeout(() => { btn.textContent = original; btn.classList.remove('done'); }, 1500);
  });
});

$('copy-all-btn').addEventListener('click', () => {
  const l = state.lastListing;
  if (!l) return;
  const d = l.details || {};
  const p = l.prices || {};
  const text = `${l.title}\n\n${l.description}\n\n— Marque : ${d.marque || ''}\n— Taille : ${d.taille || ''}\n— État : ${d.etat || ''}\n— Couleur : ${d.couleur || ''}\n— Catégorie : ${d.categorie || ''}\n${d.matiere ? '— Matière : ' + d.matiere + '\n' : ''}\nPrix : ${p.ideal || ''}`;
  navigator.clipboard.writeText(text).then(() => showToast('Annonce copiée ✓'));
});

$('restart-btn').addEventListener('click', () => {
  state.photos = [];
  state.conversation = [];
  state.lastListing = null;
  renderPreviews();
  chatMessages.innerHTML = '';
  resultSection.hidden = true;
  chatSection.hidden = true;
  generateBtn.hidden = true;
  uploadSection.style.display = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Settings ────────────────────────────────────────
const settingsModal = $('settings-modal');
const providerSelect = $('provider-select');
const modelSelect = $('model-select');
const apikeyField = $('apikey-field');
const modelField = $('model-field');
const apiKeyInput = $('api-key');
const apikeyLabel = $('apikey-label');
const apikeyLink = $('apikey-link');
const providerHint = $('provider-hint');

// Populate provider dropdown once
Object.entries(PROVIDERS).forEach(([id, p]) => {
  const opt = document.createElement('option');
  opt.value = id;
  opt.textContent = p.label;
  providerSelect.appendChild(opt);
});

function syncProviderUI() {
  const id = providerSelect.value;
  const p = PROVIDERS[id];
  if (!p) return;

  providerHint.textContent = p.hint || '';

  // Models
  modelSelect.innerHTML = '';
  p.models.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = m.label;
    modelSelect.appendChild(opt);
  });
  modelSelect.value = getStoredModel(id);
  modelField.hidden = p.models.length <= 1;

  // API key
  apikeyField.hidden = !p.needsKey;
  if (p.needsKey) {
    apikeyLabel.textContent = p.keyLabel;
    apiKeyInput.placeholder = (p.keyPrefix || '') + '...';
    apiKeyInput.value = getApiKey(id);
    if (p.keyUrl) {
      apikeyLink.href = p.keyUrl;
      apikeyLink.style.display = '';
    } else {
      apikeyLink.style.display = 'none';
    }
  }
}
providerSelect.addEventListener('change', syncProviderUI);

// Save key/model on change so user doesn't lose them between providers
modelSelect.addEventListener('change', () => {
  localStorage.setItem('av-model-' + providerSelect.value, modelSelect.value);
});

$('settings-toggle').addEventListener('click', () => {
  providerSelect.value = state.provider;
  syncProviderUI();
  settingsModal.hidden = false;
});
$('settings-close').addEventListener('click', () => { settingsModal.hidden = true; });
settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) settingsModal.hidden = true; });

$('settings-save').addEventListener('click', () => {
  const providerId = providerSelect.value;
  state.provider = providerId;
  state.model = modelSelect.value;
  localStorage.setItem('av-provider', providerId);
  if (state.model) localStorage.setItem('av-model-' + providerId, state.model);
  if (PROVIDERS[providerId].needsKey) {
    setApiKey(providerId, apiKeyInput.value.trim());
  }
  settingsModal.hidden = true;
  showToast('Paramètres enregistrés');
});

// Close modals with Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    settingsModal.hidden = true;
    historyModal.hidden = true;
  }
});

function checkProvider() {
  const p = PROVIDERS[state.provider];
  if (!p) {
    state.provider = 'pollinations';
    return true;
  }
  if (p.needsKey && !getApiKey(state.provider)) {
    showToast(`Ajoute ta clé ${p.keyLabel} ou choisis le mode gratuit`);
    providerSelect.value = state.provider;
    syncProviderUI();
    settingsModal.hidden = false;
    return false;
  }
  return true;
}

// Initialize state.model with the current provider's default
if (!state.model) state.model = getStoredModel(state.provider);

// ─── History ─────────────────────────────────────────
const historyModal = $('history-modal');
$('history-toggle').addEventListener('click', () => { renderHistory(); historyModal.hidden = false; });
$('history-close').addEventListener('click', () => { historyModal.hidden = true; });
historyModal.addEventListener('click', (e) => { if (e.target === historyModal) historyModal.hidden = true; });

$('history-clear').addEventListener('click', () => {
  state.history = [];
  localStorage.setItem('av-history', '[]');
  renderHistory();
  showToast('Historique effacé');
});

function saveToHistory(listing) {
  state.history.unshift({
    listing,
    date: new Date().toISOString(),
    id: crypto.randomUUID(),
  });
  state.history = state.history.slice(0, 30);
  localStorage.setItem('av-history', JSON.stringify(state.history));
}

function renderHistory() {
  const list = $('history-list');
  if (state.history.length === 0) {
    list.innerHTML = '<p class="history-empty">Aucune annonce pour l\'instant</p>';
    $('history-clear').hidden = true;
    return;
  }
  $('history-clear').hidden = false;
  list.innerHTML = state.history.map(h => {
    const d = new Date(h.date);
    const dateStr = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    return `<div class="history-item" data-id="${h.id}">
      <span class="history-item-title">${escapeHtml(h.listing.title || '(sans titre)')}</span>
      <span class="history-item-date">${dateStr}</span>
    </div>`;
  }).join('');

  list.querySelectorAll('.history-item').forEach(el => {
    el.addEventListener('click', () => {
      const item = state.history.find(h => h.id === el.dataset.id);
      if (!item) return;
      historyModal.hidden = true;
      uploadSection.style.display = 'none';
      chatSection.hidden = true;
      renderListing(item.listing);
      resultSection.hidden = false;
    });
  });
}

// ─── Helpers ─────────────────────────────────────────
function setBtnLoading(btn, loading, label) {
  btn.disabled = loading;
  btn.querySelector('.btn-label').textContent = label;
  btn.querySelector('.btn-spinner').hidden = !loading;
}
