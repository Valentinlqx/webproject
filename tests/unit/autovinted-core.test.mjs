import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const core = require('../../projects/AutoVinted/autovinted-core.js');

const PHOTO = 'data:image/jpeg;base64,AAAA';
const conversation = [
  { role: 'system', content: 'consignes' },
  { role: 'user', content: [
    { type: 'text', text: 'voici les photos' },
    { type: 'image_url', image_url: { url: PHOTO } },
  ] },
  { role: 'assistant', content: '{"action":"ask","message":"Quelle taille ?"}' },
  { role: 'user', content: 'M' },
];

test('detectProvider reconnaît chaque fournisseur à son préfixe', () => {
  assert.deepEqual(core.detectProvider('sk-ant-api03-abc'), { ok: true, id: 'anthropic' });
  assert.deepEqual(core.detectProvider('sk-proj-abc123'), { ok: true, id: 'openai' });
  assert.deepEqual(core.detectProvider('sk-abc123'), { ok: true, id: 'openai' });
  assert.deepEqual(core.detectProvider('AIzaSyD-abc'), { ok: true, id: 'gemini' });
  assert.deepEqual(core.detectProvider('a'.repeat(16) + 'B'.repeat(16)), { ok: true, id: 'mistral' });
});

test('detectProvider ignore les espaces autour de la clé collée', () => {
  assert.deepEqual(core.detectProvider('  sk-ant-xyz\n'), { ok: true, id: 'anthropic' });
});

test('detectProvider explique pourquoi une clé est refusée', () => {
  assert.deepEqual(core.detectProvider(''), { ok: false, reason: 'empty' });
  assert.deepEqual(core.detectProvider('   '), { ok: false, reason: 'empty' });
  assert.deepEqual(core.detectProvider(undefined), { ok: false, reason: 'empty' });
  assert.deepEqual(core.detectProvider('gsk_abc'), { ok: false, reason: 'groq' });
  assert.deepEqual(core.detectProvider('sk-or-v1-abc'), { ok: false, reason: 'openrouter' });
  assert.deepEqual(core.detectProvider('bonjour'), { ok: false, reason: 'unknown' });
});

test('chaque fournisseur a un lien vers ses clés et des modèles tarifés', () => {
  for (const [id, p] of Object.entries(core.PROVIDERS)) {
    assert.match(p.keyUrl, /^https:\/\//, id);
    assert.ok(p.models.length > 0, id);
    for (const m of p.models) {
      assert.equal(typeof m.in, 'number', m.id);
      assert.equal(typeof m.out, 'number', m.id);
    }
  }
});

test('resolveModel garde le choix enregistré seulement s\'il existe chez ce fournisseur', () => {
  assert.equal(core.resolveModel('anthropic', 'claude-sonnet-5'), 'claude-sonnet-5');
  assert.equal(core.resolveModel('anthropic', 'gpt-6-sol'), core.PROVIDERS.anthropic.models[0].id);
  assert.equal(core.resolveModel('gemini', null), core.PROVIDERS.gemini.models[0].id);
});

test('estimateCost compte le texte, les photos et les annonces', () => {
  const one = core.estimateCost({ providerId: 'openai', modelId: 'gpt-6-sol', photos: 1, textChars: 400, listings: 1 });
  const three = core.estimateCost({ providerId: 'openai', modelId: 'gpt-6-sol', photos: 3, textChars: 400, listings: 1 });
  assert.ok(three.inTokens > one.inTokens);
  assert.ok(one.eur > 0 && one.eur < 1);
  assert.equal(core.estimateCost({ providerId: 'openai', modelId: 'inconnu', photos: 1, textChars: 0, listings: 1 }).eur, null);
});

test('parseJSON accepte du JSON brut, dans un bloc de code, ou noyé dans du texte', () => {
  assert.deepEqual(core.parseJSON('{"a":1}'), { a: 1 });
  assert.deepEqual(core.parseJSON('```json\n{"a":1}\n```'), { a: 1 });
  assert.deepEqual(core.parseJSON('```\n{"a":1}\n```'), { a: 1 });
  assert.deepEqual(core.parseJSON('Voici : {"a":{"b":2}} voilà'), { a: { b: 2 } });
});

test('parseJSON lève une erreur lisible sinon', () => {
  assert.throws(() => core.parseJSON(''), /vide/);
  assert.throws(() => core.parseJSON('désolé, je ne peux pas'), /désolé, je ne peux pas/);
});

test('buildRequest OpenAI : max_completion_tokens, JSON, pas de temperature', () => {
  const { url, init } = core.buildRequest({ providerId: 'openai', model: 'gpt-6-sol', key: 'sk-x', conversation, maxTokens: 1000 });
  const body = JSON.parse(init.body);
  assert.equal(url, 'https://api.openai.com/v1/chat/completions');
  assert.equal(init.headers.Authorization, 'Bearer sk-x');
  assert.equal(body.max_completion_tokens, 1000);
  assert.equal(body.max_tokens, undefined);
  assert.equal(body.temperature, undefined);
  assert.deepEqual(body.response_format, { type: 'json_object' });
  assert.deepEqual(body.messages, conversation);
});

test('buildRequest Mistral : images en chaîne data URL', () => {
  const { url, init } = core.buildRequest({ providerId: 'mistral', model: 'mistral-medium-latest', key: 'k', conversation, maxTokens: 1000 });
  const body = JSON.parse(init.body);
  assert.equal(url, 'https://api.mistral.ai/v1/chat/completions');
  assert.equal(body.max_tokens, 1000);
  assert.deepEqual(body.messages[1].content[1], { type: 'image_url', image_url: PHOTO });
});

test('buildRequest Anthropic : system à part, images en base64, en-têtes navigateur', () => {
  const { url, init } = core.buildRequest({ providerId: 'anthropic', model: 'claude-opus-5', key: 'sk-ant-x', conversation, maxTokens: 1000 });
  const body = JSON.parse(init.body);
  assert.equal(url, 'https://api.anthropic.com/v1/messages');
  assert.equal(init.headers['x-api-key'], 'sk-ant-x');
  assert.equal(init.headers['anthropic-version'], '2023-06-01');
  assert.equal(init.headers['anthropic-dangerous-direct-browser-access'], 'true');
  assert.equal(body.system, 'consignes');
  assert.equal(body.messages.length, 3);
  assert.deepEqual(body.messages[0].content[1], {
    type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: 'AAAA' },
  });
  assert.equal(body.temperature, undefined);
});

test('buildRequest Anthropic : repli serveur seulement sur Opus 5', () => {
  const opus = core.buildRequest({ providerId: 'anthropic', model: 'claude-opus-5', key: 'k', conversation, maxTokens: 10 });
  assert.equal(JSON.parse(opus.init.body).fallbacks, 'default');
  assert.equal(opus.init.headers['anthropic-beta'], 'server-side-fallback-2026-07-01');

  const haiku = core.buildRequest({ providerId: 'anthropic', model: 'claude-haiku-4-5', key: 'k', conversation, maxTokens: 10 });
  assert.equal(JSON.parse(haiku.init.body).fallbacks, undefined);
  assert.equal(haiku.init.headers['anthropic-beta'], undefined);
});

test('buildRequest Gemini : clé dans un en-tête, pas dans l\'URL', () => {
  const { url, init } = core.buildRequest({ providerId: 'gemini', model: 'gemini-3.8-flash', key: 'AIza-secret', conversation, maxTokens: 1000 });
  const body = JSON.parse(init.body);
  assert.equal(url, 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent');
  assert.ok(!url.includes('AIza-secret'));
  assert.equal(init.headers['x-goog-api-key'], 'AIza-secret');
  assert.equal(body.systemInstruction.parts[0].text, 'consignes');
  assert.equal(body.contents[1].role, 'model');
  assert.deepEqual(body.contents[0].parts[1], { inline_data: { mime_type: 'image/jpeg', data: 'AAAA' } });
  assert.equal(body.generationConfig.responseMimeType, 'application/json');
});

test('extractText lit la bonne partie de chaque réponse', () => {
  assert.equal(core.extractText('openai', { choices: [{ message: { content: '{"a":1}' } }] }), '{"a":1}');
  assert.equal(core.extractText('mistral', { choices: [{ message: { content: [{ type: 'text', text: 'x' }] } }] }), 'x');
  assert.equal(core.extractText('anthropic', {
    stop_reason: 'end_turn',
    content: [{ type: 'thinking', thinking: '' }, { type: 'text', text: '{"a":1}' }],
  }), '{"a":1}');
  assert.equal(core.extractText('gemini', {
    candidates: [{ content: { parts: [{ text: 'réflexion', thought: true }, { text: '{"a":1}' }] } }],
  }), '{"a":1}');
});

test('extractText signale un refus ou une réponse vide', () => {
  assert.throws(() => core.extractText('anthropic', { stop_reason: 'refusal', content: [] }), /refus/i);
  assert.throws(() => core.extractText('gemini', { promptFeedback: { blockReason: 'SAFETY' } }), /bloqu/i);
  assert.throws(() => core.extractText('openai', { choices: [{ message: { content: '' } }] }), /vide/);
});

test('apiErrorMessage traduit les erreurs courantes', () => {
  assert.match(core.apiErrorMessage(401, {}), /clé/i);
  assert.match(core.apiErrorMessage(429, {}), /quota|trop/i);
  assert.match(core.apiErrorMessage(400, { error: { message: 'bad image' } }), /bad image/);
  assert.match(core.apiErrorMessage(500, null), /500/);
});

function memoryStorage(initial) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: k => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: k => data.delete(k),
    dump: () => Object.fromEntries(data),
  };
}

test('migrateLegacyKey reprend la clé du fournisseur qui était choisi', () => {
  const s = memoryStorage({ 'av-provider': 'gemini', 'av-key-openai': 'sk-1', 'av-key-gemini': 'AIza-2' });
  core.migrateLegacyKey(s);
  assert.equal(s.getItem('av-key'), 'AIza-2');
  assert.equal(s.getItem('av-key-openai'), null);
  assert.equal(s.getItem('av-provider'), null);
});

test('migrateLegacyKey ne remplace jamais une clé déjà migrée', () => {
  const s = memoryStorage({ 'av-key': 'sk-ant-new', 'av-key-openai': 'sk-old' });
  core.migrateLegacyKey(s);
  assert.equal(s.getItem('av-key'), 'sk-ant-new');
});

test('migrateLegacyKey ignore les anciennes clés Groq', () => {
  const s = memoryStorage({ 'av-provider': 'groq', 'av-key-groq': 'gsk_1' });
  core.migrateLegacyKey(s);
  assert.equal(s.getItem('av-key'), null);
  assert.equal(s.getItem('av-key-groq'), null);
});
