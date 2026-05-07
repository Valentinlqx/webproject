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
      { id: 'claude-opus-4-7', label: 'Claude Opus 4.7 (max qualité)' },
      { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6 (recommandé)' },
      { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5 (rapide)' },
      { id: 'claude-sonnet-4-5-20250929', label: 'Claude Sonnet 4.5' },
      { id: 'claude-3-5-sonnet-20241022', label: 'Claude Sonnet 3.5' },
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
  ollama: {
    label: 'Ollama (local, gratuit, 100% privé)',
    needsKey: false,
    needsHost: true,
    vision: true,
    keyUrl: 'https://ollama.com/download',
    keyLabel: 'URL du serveur Ollama',
    keyPrefix: 'http',
    hint: "⚙️ Nécessite Ollama installé et lancé localement. 100 % privé, 100 % gratuit, aucun token consommé. Lance Ollama puis tire un modèle vision (ex: ollama pull llama3.2-vision). Si la page ne tourne pas en local, lance Ollama avec OLLAMA_ORIGINS=* ollama serve.",
    models: [
      { id: 'llama3.2-vision',       label: 'Llama 3.2 Vision (11B, défaut)' },
      { id: 'llama3.2-vision:11b',   label: 'Llama 3.2 Vision 11B' },
      { id: 'llama3.2-vision:90b',   label: 'Llama 3.2 Vision 90B (gros)' },
      { id: 'llava',                 label: 'LLaVA (par défaut)' },
      { id: 'llava:13b',             label: 'LLaVA 13B' },
      { id: 'llava:34b',             label: 'LLaVA 34B' },
      { id: 'bakllava',              label: 'BakLLaVA' },
      { id: 'minicpm-v',             label: 'MiniCPM-V' },
      { id: 'qwen2.5vl',             label: 'Qwen2.5-VL' },
      { id: 'gemma3:4b',             label: 'Gemma 3 4B (vision)' },
      { id: 'gemma3:12b',            label: 'Gemma 3 12B (vision)' },
    ],
    call: callOllama,
  },
};

const DEFAULT_OLLAMA_HOST = 'http://localhost:11434';
function getOllamaHost() {
  const stored = localStorage.getItem('av-ollama-host');
  return (stored && stored.trim()) ? stored.trim().replace(/\/$/, '') : DEFAULT_OLLAMA_HOST;
}
function setOllamaHost(h) { localStorage.setItem('av-ollama-host', h); }

async function callOllama(s) {
  const host = getOllamaHost();
  // Ollama expose un endpoint compatible OpenAI à /v1/chat/completions
  const endpoint = `${host}/v1/chat/completions`;
  const provider = PROVIDERS[s.provider];

  const messages = provider.vision ? s.conversation : s.conversation.map(m => {
    if (typeof m.content === 'string') return m;
    const text = m.content.filter(p => p.type === 'text').map(p => p.text).join('\n');
    return { role: m.role, content: text };
  });

  const body = {
    model: s.model || 'llama3.2-vision',
    messages,
    temperature: 0.7,
    max_tokens: state.mode === 'bulk' ? 6000 : 2000,
    response_format: { type: 'json_object' },
  };

  let res;
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (e) {
    throw new Error(`Connexion à Ollama impossible (${host}). Vérifie qu'Ollama est lancé. Si la page n'est pas en local, lance : OLLAMA_ORIGINS=* ollama serve`);
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || err.message || `HTTP ${res.status} — modèle "${body.model}" introuvable ? Tire-le avec : ollama pull ${body.model}`);
  }
  const data = await res.json();
  const content = data.choices[0].message.content;
  s.conversation.push({ role: 'assistant', content });
  return parseJSON(content);
}

// Récupère la liste des modèles installés sur le serveur Ollama
async function fetchOllamaModels(host) {
  const res = await fetch(`${host}/api/tags`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return (data.models || []).map(m => ({ id: m.name, label: m.name + (m.size ? ` (${(m.size / 1e9).toFixed(1)} Go)` : '') }));
}

// ─── Pricing & token estimation ─────────────────────
// Prix indicatifs en USD (≈ EUR) par 1M tokens [input, output]
// Source : pages tarifaires officielles, novembre 2025
const PRICING = {
  // OpenAI
  'gpt-4o':                      { in: 2.50, out: 10.00 },
  'gpt-4o-mini':                 { in: 0.15, out: 0.60 },
  // Anthropic
  'claude-opus-4-7':             { in: 15.00, out: 75.00 },
  'claude-sonnet-4-6':           { in: 3.00, out: 15.00 },
  'claude-sonnet-4-5-20250929':  { in: 3.00, out: 15.00 },
  'claude-3-5-sonnet-20241022':  { in: 3.00, out: 15.00 },
  'claude-haiku-4-5-20251001':   { in: 1.00, out: 5.00 },
  // Google
  'gemini-2.0-flash':            { in: 0.10, out: 0.40 },
  'gemini-1.5-pro':              { in: 1.25, out: 5.00 },
  // Groq
  'llama-3.2-90b-vision-preview':{ in: 0.90, out: 0.90 },
  'llama-3.2-11b-vision-preview':{ in: 0.18, out: 0.18 },
  // Mistral
  'pixtral-large-latest':        { in: 2.00, out: 6.00 },
  'pixtral-12b-2409':            { in: 0.15, out: 0.15 },
  // DeepSeek
  'deepseek-chat':               { in: 0.27, out: 1.10 },
  'deepseek-reasoner':           { in: 0.55, out: 2.19 },
  // Pollinations free
  'openai-large':                { in: 0, out: 0 },
};

// Tokens approximatifs par image selon le provider
const IMAGE_TOKENS_PER_PROVIDER = {
  pollinations: 425,   // OpenAI tile-based, image ≤1024 = 425 tokens (85 + 4 tiles)
  openai:       425,
  anthropic:    1300,  // Claude ~1568 max, ~1300 moyenne pour 1024
  gemini:       258,   // forfait par image
  groq:         1200,
  mistral:      1000,
  deepseek:     0,     // pas de vision
  ollama:       800,   // dépend du modèle, ordre de grandeur (LLaVA/Llama-Vision)
};

const USD_TO_EUR = 0.93;

function estimateUsage() {
  const isBulk = state.mode === 'bulk';
  const sys = isBulk ? buildBulkSystemPrompt() : buildSystemPrompt();
  const ctx = state.context || $('context-input')?.value || '';
  // ~4 chars / token (français)
  const userTextChars = ctx.length + 200; // intro + numérotation photos
  const textTokens = Math.ceil((sys.length + userTextChars) / 4);

  const imgPer = IMAGE_TOKENS_PER_PROVIDER[state.provider] ?? 425;
  const imgTokens = state.photos.length * imgPer;

  const numListings = isBulk ? Math.max(1, Math.ceil(state.photos.length / 2.5)) : 1;
  const outputTokens = numListings * 350; // ~350 tokens / annonce JSON

  const inTokens = textTokens + imgTokens;

  const price = PRICING[state.model];
  let cost = null; // EUR
  if (price) {
    const usd = (inTokens * price.in + outputTokens * price.out) / 1_000_000;
    cost = usd * USD_TO_EUR;
  }

  return { inTokens, outputTokens, cost };
}

function updateEstimate() {
  const el = $('estimate');
  if (!el) return;
  if (state.photos.length === 0) {
    el.textContent = '';
    el.hidden = true;
    return;
  }
  el.hidden = false;
  const { inTokens, outputTokens, cost } = estimateUsage();
  const total = inTokens + outputTokens;
  const tokenStr = `≈ ${total.toLocaleString('fr-FR')} tokens`;

  let costStr;
  if (state.provider === 'pollinations') {
    costStr = ' · gratuit';
  } else if (state.provider === 'ollama') {
    costStr = ' · local & gratuit';
  } else if (cost === null) {
    costStr = '';
  } else if (cost < 0.005) {
    costStr = ' · < 0,01 €';
  } else if (cost < 1) {
    costStr = ` · ≈ ${cost.toFixed(3).replace('.', ',')} €`;
  } else {
    costStr = ` · ≈ ${cost.toFixed(2).replace('.', ',')} €`;
  }
  el.textContent = tokenStr + costStr;
}

// ─── State ───────────────────────────────────────────
const state = {
  photos: [],          // [{ id, file, dataUrl }]
  conversation: [],    // [{ role, content }] — messages
  mode: 'single',      // 'single' | 'bulk'
  context: '',         // optional user-provided context for current run
  provider: localStorage.getItem('av-provider') || 'pollinations',
  model: localStorage.getItem('av-model-' + (localStorage.getItem('av-provider') || 'pollinations')) || '',
  history: JSON.parse(localStorage.getItem('av-history') || '[]'),
  lastListing: null,
  features: null, // initialized below once DEFAULT_FEATURES + loadFeatures exist
};

function getApiKey(providerId) {
  return localStorage.getItem('av-key-' + providerId) || '';
}
function setApiKey(providerId, key) {
  localStorage.setItem('av-key-' + providerId, key);
}
function getStoredModel(providerId) {
  const stored = localStorage.getItem('av-model-' + providerId);
  const valid = PROVIDERS[providerId].models.find(m => m.id === stored);
  return valid ? stored : PROVIDERS[providerId].models[0].id;
}

const MAX_PHOTOS_SINGLE = 8;
const MAX_PHOTOS_BULK = 30;
const MAX_PHOTO_SIZE = 1024; // px (downscale before sending — saves tokens & bandwidth)
const JPEG_QUALITY = 0.80;
const maxPhotos = () => state.mode === 'bulk' ? MAX_PHOTOS_BULK : MAX_PHOTOS_SINGLE;

// ─── System prompts (compacts pour économiser les tokens) ─────
// Règles Vinted (résumé des CGU/CGV vinted.fr) injectées dans les prompts
const VINTED_POLICY = `RÈGLES VINTED (détecte si visible et signale dans "warnings"):
- Contrefaçons / répliques / faux (sacs, sneakers, montres de luxe, parfums)
- Produits sans marque vendus comme luxe ; logos non authentiques
- Sous-vêtements/chaussettes/maillots de bain D'OCCASION (interdit ; neufs avec étiquette OK)
- Cosmétiques/parfums OUVERTS ou usagés ; médicaments, compléments, dispositifs médicaux
- Aliments, boissons, alcool, tabac, e-cigarettes, vapes, CBD
- Armes (vraies/répliques), couteaux, gaz, munitions, articles dangereux
- Animaux, produits issus d'espèces protégées (ivoire, fourrure, écaille)
- Contenu adulte, jouets sexuels usagés, lingerie d'occasion sexualisée
- Articles cassés/non fonctionnels non clairement signalés
- Billets, cartes cadeaux, devises, services, NFT
- Produits rappelés ou non conformes CE
- Textiles avec gros défauts non visibles sur photo
Signale aussi si la photo n'est clairement pas de toi (image stock, fond pro évident).`;

// Personnalisation : chaque feature désactivée allège le prompt et la réponse
const DEFAULT_FEATURES = {
  warnings: true,   // détection règles Vinted
  hashtags: true,   // hashtags en fin de description
  details:  true,   // marque/taille/état/couleur/catégorie/matière/isbn
  prices:   true,   // 3 niveaux de prix conseillés
  tips:     true,   // conseils vendeur
};
const FEATURE_LABELS = {
  warnings: { label: 'Vérifier règles Vinted',     hint: 'Détecte les risques de retrait (contrefaçon, interdits…)' },
  hashtags: { label: 'Hashtags dans description',  hint: '6-10 #hashtags ajoutés à la fin' },
  details:  { label: 'Détails (marque, taille…)',  hint: 'Marque, taille, état, couleur, catégorie, matière' },
  prices:   { label: 'Prix conseillés',            hint: '3 niveaux : idéal / vente rapide / minimum' },
  tips:     { label: 'Conseils vendeur',           hint: 'Astuces pour vendre plus vite' },
};

function loadFeatures() {
  try { return { ...DEFAULT_FEATURES, ...JSON.parse(localStorage.getItem('av-features') || '{}') }; }
  catch { return { ...DEFAULT_FEATURES }; }
}
function saveFeatures(f) { localStorage.setItem('av-features', JSON.stringify(f)); }
state.features = loadFeatures();

function buildSystemPrompt() {
  const f = state.features;
  const parts = [];
  parts.push('Tu es un vendeur Vinted humain. Style: naturel, vendeur, phrases courtes, jamais "IA marketing".');
  parts.push('Analyse les photos et rédige une annonce Vinted optimisée pour vente rapide.');
  parts.push('Si une info clé manque, pose 1-3 questions courtes. Sinon, génère. N\'invente jamais ce qui n\'est pas visible.');
  parts.push('LIVRES : si c\'est un livre, remplis "isbn" et mentionne auteur/éditeur/format dans la description.');

  const hashtagsRule = f.hashtags
    ? 'La description finit par une ligne vide puis 6-10 #hashtags minuscules sans accents.'
    : 'PAS de hashtags dans la description.';
  parts.push(`RÈGLE ABSOLUE : "title" et "description" prêts à coller sur Vinted, SANS aucun conseil/recommandation/astuce. ${hashtagsRule}`);

  if (f.warnings) {
    parts.push(VINTED_POLICY);
    parts.push('"warnings" = strings courtes signalant uniquement des risques RÉELS détectés. [] si rien.');
  }

  // Schema dynamique
  const fields = ['"title":"max 60 chars"', '"description":"courte, vendeuse"'];
  if (f.details) fields.push('"details":{"marque":"","taille":"","etat":"Neuf avec étiquette|Neuf sans étiquette|Très bon état|Bon état|Satisfaisant","couleur":"","categorie":"","matiere":"","isbn":"(livres uniquement, sinon vide)"}');
  if (f.prices)  fields.push('"prices":{"ideal":"15€","rapide":"10€","minimum":"8€"}');
  if (f.tips)    fields.push('"tips":["conseils pour le vendeur"]');
  if (f.warnings) fields.push('"warnings":["risques ou []"]');

  parts.push(`RÉPONDS UNIQUEMENT EN JSON VALIDE, sans texte/markdown autour:\n{"action":"ask"|"generate","message":"...","listing":null|{${fields.join(',')}}}`);
  return parts.join('\n\n');
}

function buildBulkSystemPrompt() {
  const f = state.features;
  const parts = [];
  parts.push('Tu es un vendeur Vinted humain. Style: naturel, vendeur, court.');
  parts.push('Photos NUMÉROTÉES (Photo 0, 1, 2…). Plusieurs photos peuvent montrer le MÊME article.');
  parts.push('Tâche : identifie chaque article distinct, regroupe les photos, génère 1 annonce par article. PAS de questions, déduis.');
  parts.push('LIVRES : si c\'est un livre, remplis "isbn" et mentionne auteur/éditeur/format dans la description.');

  const hashtagsRule = f.hashtags
    ? 'Description finit par ligne vide + 6-10 #hashtags minuscules sans accents.'
    : 'PAS de hashtags dans la description.';
  parts.push(`RÈGLE ABSOLUE : "title" et "description" prêts à coller sur Vinted, SANS conseil/astuce. ${hashtagsRule}`);

  if (f.warnings) {
    parts.push(VINTED_POLICY);
    parts.push('"warnings" = strings courtes signalant uniquement des risques RÉELS pour cet article. [] sinon.');
  }

  const fields = ['"photo_indices":[0,1]', '"title":"max 60 chars"', '"description":"..."'];
  if (f.details) fields.push('"details":{"marque":"","taille":"","etat":"Neuf|Neuf sans étiquette|Très bon état|Bon état|Satisfaisant","couleur":"","categorie":"","matiere":"","isbn":"(livres uniquement, sinon vide)"}');
  if (f.prices)  fields.push('"prices":{"ideal":"15€","rapide":"10€","minimum":"8€"}');
  if (f.tips)    fields.push('"tips":[]');
  if (f.warnings) fields.push('"warnings":[]');

  parts.push(`JSON UNIQUEMENT, sans texte/markdown autour:\n{"listings":[{${fields.join(',')}}]}`);
  parts.push('photo_indices = numéros des photos (0-indexés). Chaque photo dans UNE seule annonce.');
  return parts.join('\n\n');
}

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
  const room = maxPhotos() - state.photos.length;
  const accepted = files.slice(0, room);
  if (files.length > room) showToast(`Maximum ${maxPhotos()} photos`);

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
      resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
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

  if (state.mode === 'bulk') {
    await runBulk();
    return;
  }

  setBtnLoading(analyzeBtn, true, 'Analyse...');
  state.context = $('context-input').value.trim();

  // Build initial message with all images
  const ctxLine = state.context ? `\n\nContexte donné par le vendeur : "${state.context}"` : '';
  const userContent = [
    { type: 'text', text: `Voici ${state.photos.length} photo(s) du produit. Analyse-les et soit pose-moi des questions sur les infos manquantes, soit génère directement l'annonce si tu as toutes les infos.${ctxLine}` },
    ...state.photos.map(p => ({ type: 'image_url', image_url: { url: p.dataUrl } }))
  ];

  state.conversation = [
    { role: 'system', content: buildSystemPrompt() },
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

// ─── Mode toggle ─────────────────────────────────────
const modeBtns = document.querySelectorAll('.mode-btn');
const dropzoneTitle = $('dropzone-title');
const dropzoneSub = $('dropzone-sub');

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    if (mode === state.mode) return;
    state.mode = mode;
    modeBtns.forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    if (mode === 'bulk') {
      dropzoneSub.textContent = `Plusieurs articles à la fois — l'IA détecte chaque article (jusqu'à ${MAX_PHOTOS_BULK} photos)`;
      $('context-hint').textContent = 'Info qui s\'applique à tous les articles, pour éviter que l\'IA pose des questions.';
      $('context-input').placeholder = 'Ex : tous des livres en bon état, prix d\'achat ~10€, je veux vendre vite';
    } else {
      dropzoneSub.textContent = `ou clique pour parcourir — jusqu'à ${MAX_PHOTOS_SINGLE} photos`;
      $('context-hint').textContent = 'Toute info utile que l\'IA ne peut pas deviner (taille, état réel, prix d\'achat...).';
      $('context-input').placeholder = 'Ex : porté 3 fois, prix d\'achat 80€, je veux vendre vite';
    }
    updateAnalyzeBtnLabel();
  });
});

function updateAnalyzeBtnLabel() {
  const label = analyzeBtn.querySelector('.btn-label');
  if (state.mode === 'bulk') {
    label.textContent = state.photos.length > 0
      ? `Détecter & générer (${state.photos.length} photo${state.photos.length > 1 ? 's' : ''})`
      : 'Générer les annonces';
  } else {
    label.textContent = 'Analyser mes photos';
  }
}

// Hook into renderPreviews to refresh button label + estimate
const _origRenderPreviews = renderPreviews;
renderPreviews = function () {
  _origRenderPreviews();
  updateAnalyzeBtnLabel();
  updateEstimate();
};

// Refresh estimate when context changes
$('context-input').addEventListener('input', updateEstimate);

// Refresh estimate when mode changes
modeBtns.forEach(b => b.addEventListener('click', () => {
  // state.mode is updated by the earlier handler — defer one tick
  setTimeout(updateEstimate, 0);
}));

// ─── Bulk run ────────────────────────────────────────
const bulkSection = $('bulk-section');
const bulkResults = $('bulk-results');
const bulkActions = $('bulk-actions');
const bulkProgress = $('bulk-progress');
const bulkProgressText = $('bulk-progress-text');
const bulkProgressFill = $('bulk-progress-fill');

async function runBulk() {
  state.context = $('context-input').value.trim();
  const total = state.photos.length;

  // Switch UI
  uploadSection.style.display = 'none';
  bulkSection.hidden = false;
  bulkResults.innerHTML = '';
  bulkProgress.hidden = false;
  bulkActions.hidden = true;
  bulkProgressText.textContent = `L'IA analyse ${total} photo${total > 1 ? 's' : ''} et regroupe les articles…`;
  bulkProgressFill.style.width = '15%';

  // Build single multi-image request with photo numbering
  const ctxLine = state.context ? `\n\nContexte donné par le vendeur (s'applique à tous les articles) : "${state.context}"` : '';
  const intro = `Voici ${total} photos. Plusieurs photos peuvent montrer le MÊME article (sous différents angles, étiquettes, défauts...). Identifie chaque article distinct, regroupe les photos qui appartiennent au même article, et génère UNE annonce Vinted par article détecté.${ctxLine}`;

  const userContent = [{ type: 'text', text: intro }];
  state.photos.forEach((p, i) => {
    userContent.push({ type: 'text', text: `\nPhoto ${i} :` });
    userContent.push({ type: 'image_url', image_url: { url: p.dataUrl } });
  });

  const conv = [
    { role: 'system', content: buildBulkSystemPrompt() },
    { role: 'user', content: userContent },
  ];

  bulkProgressFill.style.width = '40%';

  const tmpState = { ...state, conversation: conv };
  const provider = PROVIDERS[state.provider];
  if (!provider.models.find(m => m.id === state.model)) {
    state.model = getStoredModel(state.provider);
    tmpState.model = state.model;
  }

  try {
    const resp = await provider.call(tmpState);
    bulkProgressFill.style.width = '100%';

    const listings = Array.isArray(resp.listings) ? resp.listings : [];
    if (listings.length === 0) {
      throw new Error(resp.message || 'Aucun article détecté dans les photos');
    }

    // Render each detected article
    for (let i = 0; i < listings.length; i++) {
      const listing = listings[i];
      const indices = Array.isArray(listing.photo_indices) ? listing.photo_indices : [i];
      const photos = indices.map(idx => state.photos[idx]).filter(Boolean);
      const card = createBulkCard(photos, i);
      bulkResults.appendChild(card.el);
      card.fillListing(listing);
      await saveToHistory(listing, photos);
    }

    bulkProgress.hidden = true;
    bulkActions.hidden = false;
    showToast(`${listings.length} article${listings.length > 1 ? 's' : ''} détecté${listings.length > 1 ? 's' : ''} ✓`);
  } catch (err) {
    bulkProgress.hidden = true;
    bulkResults.innerHTML = `<div class="bulk-item"><div class="bulk-item-head"><div class="bulk-item-info"><div class="bulk-item-title">Erreur</div><div class="bulk-item-meta">${escapeHtml(err.message)}</div></div></div></div>`;
    bulkActions.hidden = false;
    showToast('Erreur : ' + err.message);
  }
}

function createBulkCard(photos, index) {
  const photoArr = Array.isArray(photos) ? photos : [photos];
  const mainPhoto = photoArr[0];
  const el = document.createElement('div');
  el.className = 'bulk-item';
  el.innerHTML = `
    <div class="bulk-item-head">
      <img class="bulk-item-thumb" src="${mainPhoto?.dataUrl || ''}" alt="" />
      <div class="bulk-item-info">
        <div class="bulk-item-title">Article ${index + 1}</div>
        <div class="bulk-item-meta">${photoArr.length} photo${photoArr.length > 1 ? 's' : ''}</div>
      </div>
      <span class="bulk-item-status"><span class="spinner-sm"></span></span>
      <button class="bulk-item-delete" title="Supprimer cet article">✕</button>
    </div>
    <div class="bulk-item-body"></div>
  `;
  const head = el.querySelector('.bulk-item-head');
  const titleEl = el.querySelector('.bulk-item-title');
  const metaEl = el.querySelector('.bulk-item-meta');
  const statusEl = el.querySelector('.bulk-item-status');
  const bodyEl = el.querySelector('.bulk-item-body');
  const deleteBtn = el.querySelector('.bulk-item-delete');

  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    el.remove();
  });

  head.addEventListener('click', () => {
    if (bodyEl.children.length > 0) el.classList.toggle('open');
  });

  return {
    el,
    fillListing(l) {
      const hasWarn = Array.isArray(l.warnings) && l.warnings.filter(Boolean).length > 0;
      const warnBadge = hasWarn ? '<span class="bulk-item-warn" title="Risque règles Vinted">⚠</span>' : '';
      titleEl.innerHTML = `<span class="bulk-item-num">#${index + 1}</span> ${warnBadge} ${escapeHtml(l.title || `Article ${index + 1}`)}`;
      const priceTxt = l.prices?.ideal || '—';
      const etatTxt = l.details?.etat || '—';
      metaEl.textContent = `${priceTxt} • ${etatTxt} • ${photoArr.length} photo${photoArr.length > 1 ? 's' : ''}`;
      statusEl.className = 'bulk-item-status done' + (hasWarn ? ' has-warn' : '');
      statusEl.innerHTML = (hasWarn ? '⚠ ' : '✓ ') + '<span class="bulk-chevron">▾</span>';
      bodyEl.innerHTML = renderBulkBody(l, index, photoArr);
      bindBulkBodyActions(bodyEl, l);
    },
    setError(msg) {
      titleEl.innerHTML = `<span class="bulk-item-num">#${index + 1}</span> Article ${index + 1}`;
      metaEl.textContent = msg.length > 60 ? msg.slice(0, 60) + '…' : msg;
      statusEl.className = 'bulk-item-status error';
      statusEl.textContent = '⚠ Erreur';
    },
  };
}

function renderBulkBody(l, index, photoArr) {
  const f = state.features || DEFAULT_FEATURES;
  const d = l.details || {};
  const p = l.prices || {};
  const tipsRaw = (f.tips ? (l.tips || []) : []);
  const tips = tipsRaw.map(t => `<li>${escapeHtml(t)}</li>`).join('');
  const detailLabels = { marque: 'Marque', taille: 'Taille', etat: 'État', couleur: 'Couleur', categorie: 'Catégorie', matiere: 'Matière', isbn: 'ISBN' };
  const details = f.details ? Object.entries(detailLabels)
    .filter(([k]) => d[k])
    .map(([k, label]) => `<li><strong>${label}</strong>${escapeHtml(d[k])}</li>`).join('') : '';

  const thumbs = (photoArr && photoArr.length > 1)
    ? `<div class="bulk-item-thumbs">${photoArr.map(p => `<img src="${p.dataUrl}" alt="">`).join('')}</div>`
    : '';

  const warnings = (f.warnings && Array.isArray(l.warnings)) ? l.warnings.filter(Boolean) : [];
  const warningsHtml = warnings.length
    ? `<div class="result-warnings">
         <div class="result-warnings-head">⚠ Attention — règles Vinted</div>
         <ul>${warnings.map(w => `<li>${escapeHtml(w)}</li>`).join('')}</ul>
         <div class="result-warnings-foot">Risque de retrait par Vinted — à vérifier avant publication.</div>
       </div>`
    : '';

  return `
    ${thumbs}
    ${warningsHtml}
    <div class="result-block">
      <div class="result-block-head">
        <span class="result-label">Titre</span>
        <button class="copy-btn" data-bcopy="title">Copier</button>
      </div>
      <p class="result-title">${escapeHtml(l.title || '')}</p>
    </div>
    <div class="result-block">
      <div class="result-block-head">
        <span class="result-label">Description</span>
        <button class="copy-btn" data-bcopy="description">Copier</button>
      </div>
      <p class="result-description">${escapeHtml(l.description || '')}</p>
    </div>
    ${details ? `<div class="result-block"><span class="result-label">Détails</span><ul class="result-details">${details}</ul></div>` : ''}
    ${f.prices ? `<div class="result-block">
      <span class="result-label">Prix conseillés</span>
      <div class="price-grid">
        <div class="price-cell"><span class="price-cell-label">Idéal</span><span class="price-cell-value">${escapeHtml(p.ideal || '—')}</span></div>
        <div class="price-cell"><span class="price-cell-label">Vente rapide</span><span class="price-cell-value">${escapeHtml(p.rapide || '—')}</span></div>
        <div class="price-cell"><span class="price-cell-label">Minimum</span><span class="price-cell-value">${escapeHtml(p.minimum || '—')}</span></div>
      </div>
    </div>` : ''}
    ${tips ? `<div class="result-block"><span class="result-label">Conseils</span><ul class="result-tips">${tips}</ul></div>` : ''}
    <div class="result-actions"><button class="btn-ghost" data-bcopy="all">Copier toute l'annonce</button></div>
  `;
}

function bindBulkBodyActions(bodyEl, listing) {
  bodyEl.querySelectorAll('[data-bcopy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const what = btn.dataset.bcopy;
      const text = what === 'all' ? formatFullListing(listing)
        : what === 'title' ? listing.title
        : listing.description;
      navigator.clipboard.writeText(text).then(() => {
        const orig = btn.textContent;
        btn.textContent = '✓ Copié';
        btn.classList.add('done');
        setTimeout(() => { btn.textContent = orig; btn.classList.remove('done'); }, 1500);
      });
    });
  });
}

function formatFullListing(l) {
  const f = state.features || DEFAULT_FEATURES;
  const d = l.details || {};
  const p = l.prices || {};
  let out = `${l.title}\n\n${l.description}`;
  if (f.details) {
    const lines = [];
    if (d.marque)    lines.push(`— Marque : ${d.marque}`);
    if (d.taille)    lines.push(`— Taille : ${d.taille}`);
    if (d.etat)      lines.push(`— État : ${d.etat}`);
    if (d.couleur)   lines.push(`— Couleur : ${d.couleur}`);
    if (d.categorie) lines.push(`— Catégorie : ${d.categorie}`);
    if (d.matiere)   lines.push(`— Matière : ${d.matiere}`);
    if (d.isbn)      lines.push(`— ISBN : ${d.isbn}`);
    if (lines.length) out += '\n\n' + lines.join('\n');
  }
  if (f.prices && p.ideal) out += `\n\nPrix : ${p.ideal}`;
  return out;
}

$('bulk-copy-all-btn').addEventListener('click', () => {
  const items = bulkResults.querySelectorAll('.bulk-item');
  const texts = [];
  items.forEach((el, i) => {
    const titleEl = el.querySelector('.bulk-item-title');
    const descEl = el.querySelector('.result-description');
    if (titleEl && descEl) {
      texts.push(`━━━ Article ${i + 1} ━━━\n${titleEl.textContent}\n\n${descEl.textContent}`);
    }
  });
  if (texts.length === 0) { showToast('Aucune annonce à copier'); return; }
  navigator.clipboard.writeText(texts.join('\n\n\n')).then(() => showToast(`${texts.length} annonces copiées ✓`));
});

function doRestart() {
  state.photos = [];
  state.conversation = [];
  state.lastListing = null;
  state.context = '';
  $('context-input').value = '';
  renderPreviews();
  chatMessages.innerHTML = '';
  resultSection.hidden = true;
  chatSection.hidden = true;
  generateBtn.hidden = true;
  bulkResults.innerHTML = '';
  bulkSection.hidden = true;
  bulkActions.hidden = true;
  uploadSection.style.display = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function isOnUploadView() {
  return uploadSection.style.display !== 'none';
}

$('back-btn').addEventListener('click', (e) => {
  if (!isOnUploadView()) {
    e.preventDefault();
    doRestart();
  }
});

$('site-title').addEventListener('click', () => {
  if (!isOnUploadView()) doRestart();
});

$('bulk-restart-btn').addEventListener('click', doRestart);

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
      max_tokens: state.mode === 'bulk' ? 6000 : 2000,
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
    max_tokens: state.mode === 'bulk' ? 6000 : 2000,
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
      max_tokens: state.mode === 'bulk' ? 6000 : 2000,
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
      generationConfig: { temperature: 0.7, maxOutputTokens: state.mode === 'bulk' ? 6000 : 2000, responseMimeType: 'application/json' },
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

// Parse JSON tolerantly — providers may wrap in markdown code blocks
function parseJSON(text) {
  const raw = text || '';
  try { return JSON.parse(raw); } catch {}

  // strip ```json ... ``` fences
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()); } catch {}
  }

  // grab first balanced {...} block
  const braced = raw.match(/\{[\s\S]*\}/);
  if (braced) {
    try { return JSON.parse(braced[0]); } catch {}
  }

  // Diagnostic info for the user + console
  console.error('[AutoVinted] Raw AI response that failed to parse:\n', raw);
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("L'IA a renvoyé une réponse vide. Vérifie ta clé API et réessaie.");
  }
  // Show beginning of the response so user/dev can see what's wrong
  const snippet = trimmed.length > 220 ? trimmed.slice(0, 220) + '…' : trimmed;
  throw new Error(`Réponse IA non-JSON (extrait) : « ${snippet} » — Détails complets dans la console (F12).`);
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
    saveToHistory(resp.listing).catch(() => {});
  } else {
    addBubble('ai', resp.message || 'Réponse inattendue.');
  }
}

// ─── Result rendering ────────────────────────────────
function renderListing(listing) {
  state.lastListing = listing;
  $('r-title').textContent = listing.title || '';
  $('r-description').textContent = listing.description || '';

  const f = state.features || DEFAULT_FEATURES;
  const details = listing.details || {};
  const detailLabels = {
    marque: 'Marque', taille: 'Taille', etat: 'État',
    couleur: 'Couleur', categorie: 'Catégorie', matiere: 'Matière',
    isbn: 'ISBN'
  };
  const detailsHtml = Object.entries(detailLabels)
    .filter(([k]) => details[k])
    .map(([k, label]) => `<li><strong>${label}</strong>${escapeHtml(details[k])}</li>`)
    .join('');
  $('r-details').innerHTML = detailsHtml;
  $('r-details-block').hidden = !f.details || !detailsHtml;

  const prices = listing.prices || {};
  const hasPrices = f.prices && (prices.ideal || prices.rapide || prices.minimum);
  $('r-prices').innerHTML = `
    <div class="price-cell"><span class="price-cell-label">Idéal</span><span class="price-cell-value">${escapeHtml(prices.ideal || '—')}</span></div>
    <div class="price-cell"><span class="price-cell-label">Vente rapide</span><span class="price-cell-value">${escapeHtml(prices.rapide || '—')}</span></div>
    <div class="price-cell"><span class="price-cell-label">Minimum</span><span class="price-cell-value">${escapeHtml(prices.minimum || '—')}</span></div>
  `;
  $('r-prices-block').hidden = !hasPrices;

  const tips = listing.tips || [];
  if (f.tips && tips.length) {
    $('r-tips').innerHTML = tips.map(t => `<li>${escapeHtml(t)}</li>`).join('');
    $('r-tips-block').hidden = false;
  } else {
    $('r-tips-block').hidden = true;
  }

  const warnings = (f.warnings && Array.isArray(listing.warnings)) ? listing.warnings.filter(Boolean) : [];
  const warnEl = $('r-warnings');
  if (warnings.length) {
    warnEl.innerHTML = `
      <div class="result-warnings-head">⚠ Attention — règles Vinted</div>
      <ul>${warnings.map(w => `<li>${escapeHtml(w)}</li>`).join('')}</ul>
      <div class="result-warnings-foot">Ton annonce risque d'être retirée par Vinted. Vérifie avant de publier.</div>
    `;
    warnEl.hidden = false;
  } else {
    warnEl.hidden = true;
  }

  const srcBlock = $('r-source-block');
  const srcLink  = $('r-source-link');
  if (listing.sourceLink) {
    srcLink.href = listing.sourceLink;
    srcBlock.hidden = false;
  } else {
    srcBlock.hidden = true;
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
  navigator.clipboard.writeText(formatFullListing(l)).then(() => showToast('Annonce copiée ✓'));
});

$('restart-btn').addEventListener('click', doRestart);

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
  modelField.hidden = p.models.length <= 1 && !p.needsHost;

  // API key OU URL host
  apikeyField.hidden = !(p.needsKey || p.needsHost);
  if (p.needsKey || p.needsHost) {
    apikeyLabel.textContent = p.keyLabel;
    apiKeyInput.type = p.needsHost ? 'text' : 'password';
    apiKeyInput.placeholder = p.needsHost ? DEFAULT_OLLAMA_HOST : ((p.keyPrefix || '') + '...');
    apiKeyInput.value = p.needsHost ? getOllamaHost() : getApiKey(id);
    if (p.keyUrl) {
      apikeyLink.href = p.keyUrl;
      apikeyLink.textContent = p.needsHost ? 'Installer Ollama →' : 'Obtenir une clé →';
      apikeyLink.style.display = '';
    } else {
      apikeyLink.style.display = 'none';
    }
  }

  // Bouton "charger modèles installés" + lien guide pour Ollama
  $('ollama-fetch-models').hidden = !p.needsHost;
  $('ollama-open-guide').hidden = !p.needsHost;
}

// ─── Ollama modal open/close ────────────────────────
const ollamaModal = $('ollama-modal');
function openOllamaModal()  { ollamaModal.hidden = false; startOllamaStatusPolling(); }
function closeOllamaModal() { ollamaModal.hidden = true;  stopOllamaStatusPolling(); }
$('ollama-open-guide').addEventListener('click', openOllamaModal);
$('ollama-modal-close').addEventListener('click', closeOllamaModal);
ollamaModal.addEventListener('click', (e) => { if (e.target === ollamaModal) closeOllamaModal(); });

// ─── Ollama : OS picker + launcher generator + live status ──
function detectDefaultOS() {
  const ua = (navigator.userAgent || '').toLowerCase();
  if (ua.includes('windows')) return 'windows';
  if (ua.includes('mac')) return 'mac';
  return 'linux';
}
let ollamaOS = detectDefaultOS();

function setOllamaOSPick(os) {
  ollamaOS = os;
  document.querySelectorAll('#ollama-os-pick .ollama-os-tab').forEach(b => {
    b.classList.toggle('active', b.dataset.os === os);
  });
  const hint = $('ollama-launcher-hint');
  if (hint) {
    hint.innerHTML = os === 'windows'
      ? 'Une fois téléchargé, <b>double-clique</b> sur <code>autovinted-launcher.bat</code>. Windows peut afficher un avertissement de sécurité — clique sur "Plus d\'infos" puis "Exécuter quand même".'
      : 'Une fois téléchargé, ouvre un terminal dans le dossier de téléchargement et lance : <code>bash autovinted-launcher.sh</code> (ou <code>chmod +x autovinted-launcher.sh && ./autovinted-launcher.sh</code>).';
  }
}
setOllamaOSPick(ollamaOS);
document.querySelectorAll('#ollama-os-pick .ollama-os-tab').forEach(b => {
  b.addEventListener('click', (e) => {
    e.preventDefault();
    setOllamaOSPick(b.dataset.os);
    refreshLauncherPreview();
  });
});

const OLLAMA_DEFAULT_MODEL = 'llama3.2-vision';

// Tailles approximatives des modèles (informationnel)
const MODEL_SIZES = {
  'llama3.2-vision':       '7.9 Go',
  'llama3.2-vision:11b':   '7.9 Go',
  'llama3.2-vision:90b':   '55 Go',
  'llava':                 '4.7 Go',
  'llava:13b':             '8.0 Go',
  'llava:34b':             '20 Go',
  'bakllava':              '4.7 Go',
  'minicpm-v':             '5.5 Go',
  'qwen2.5vl':             '6 Go',
  'gemma3:4b':             '3.3 Go',
  'gemma3:12b':            '8.1 Go',
};
function modelSizeHint(model) {
  return MODEL_SIZES[model] || '? Go';
}

function buildLauncherWindows(model) {
  const size = modelSizeHint(model);
  return `@echo off
title AutoVinted - Ollama Launcher
echo ===============================
echo  AutoVinted x Ollama Launcher
echo  Modele : ${model} (~${size})
echo ===============================
echo.

where ollama >nul 2>nul
if errorlevel 1 (
  echo [X] Ollama n'est pas installe.
  echo     Telecharge-le sur https://ollama.com/download
  echo.
  pause
  exit /b 1
)

echo [1/3] Arret des instances Ollama existantes...
taskkill /F /IM ollama.exe >nul 2>nul
taskkill /F /IM "ollama app.exe" >nul 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2/3] Verification / telechargement du modele "${model}" (~${size})
echo       Premiere fois : peut prendre plusieurs minutes selon ta connexion.
echo       Si le modele est deja installe, c'est instantane.
echo.
ollama pull ${model}
if errorlevel 1 (
  echo.
  echo [X] Echec du telechargement. Verifie ta connexion ou choisis un modele plus leger.
  pause
  exit /b 1
)

echo.
echo [3/3] Demarrage du serveur avec CORS active...
echo.
echo ============================================================
echo  Pret ! Tu peux maintenant utiliser AutoVinted.
echo  GARDE CETTE FENETRE OUVERTE pendant que tu utilises l'app.
echo  Ferme-la (ou Ctrl+C) pour arreter Ollama.
echo ============================================================
echo.
set OLLAMA_ORIGINS=*
ollama serve
`;
}

function buildLauncherUnix(model) {
  const size = modelSizeHint(model);
  return `#!/usr/bin/env bash
echo "==============================="
echo " AutoVinted x Ollama Launcher"
echo " Modèle : ${model} (~${size})"
echo "==============================="
echo

if ! command -v ollama &> /dev/null; then
  echo "[X] Ollama n'est pas installé."
  echo "    Télécharge-le sur https://ollama.com/download"
  echo
  read -p "Appuie sur Entrée pour quitter..."
  exit 1
fi

echo "[1/3] Arrêt des instances Ollama existantes..."
pkill -f "ollama serve" 2>/dev/null || true
sleep 2

echo
echo "[2/3] Vérification / téléchargement du modèle \\"${model}\\" (~${size})"
echo "      Première fois : peut prendre plusieurs minutes selon ta connexion."
echo "      Si déjà installé, c'est instantané."
echo
if ! ollama pull ${model}; then
  echo
  echo "[X] Échec du téléchargement. Vérifie ta connexion ou choisis un modèle plus léger."
  read -p "Appuie sur Entrée pour quitter..."
  exit 1
fi

echo
echo "[3/3] Démarrage du serveur avec CORS activé..."
echo
echo "============================================================"
echo " Prêt ! Tu peux maintenant utiliser AutoVinted."
echo " GARDE CE TERMINAL OUVERT pendant que tu utilises l'app."
echo " (Ctrl+C pour arrêter Ollama)"
echo "============================================================"
echo
OLLAMA_ORIGINS=* ollama serve
`;
}

function downloadLauncher() {
  const model = state.model || OLLAMA_DEFAULT_MODEL;
  const size = modelSizeHint(model);
  // Avertit pour les modèles >15 Go
  const heavy = ['llama3.2-vision:90b', 'llava:34b'];
  if (heavy.includes(model)) {
    const ok = confirm(
      `⚠️ Le modèle ${model} pèse ~${size} et peut mettre plus d'1 heure à télécharger sur une connexion classique.\n\n` +
      `Confirme pour continuer, ou clique Annuler et choisis un modèle plus léger dans le menu Modèle (ex : llama3.2-vision = 7.9 Go, gemma3:4b = 3.3 Go).`
    );
    if (!ok) return;
  }
  const isWin = ollamaOS === 'windows';
  const content = isWin ? buildLauncherWindows(model) : buildLauncherUnix(model);
  const filename = isWin ? 'autovinted-launcher.bat' : 'autovinted-launcher.sh';
  const blob = new Blob([content], { type: isWin ? 'application/octet-stream' : 'text/x-shellscript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast(`✓ ${filename} téléchargé (modèle : ${model}, ~${size})`);
}

$('ollama-download-launcher').addEventListener('click', downloadLauncher);

// Aperçu du contenu du launcher
function getCurrentLauncherContent() {
  const model = state.model || OLLAMA_DEFAULT_MODEL;
  return ollamaOS === 'windows' ? buildLauncherWindows(model) : buildLauncherUnix(model);
}
function refreshLauncherPreview() {
  const previewEl = $('ollama-launcher-preview');
  if (previewEl.hidden) return; // ne mets à jour que s'il est ouvert
  $('ollama-launcher-code').textContent = getCurrentLauncherContent();
  $('ollama-launcher-filename').textContent = ollamaOS === 'windows' ? 'autovinted-launcher.bat' : 'autovinted-launcher.sh';
}
$('ollama-preview-launcher').addEventListener('click', () => {
  const previewEl = $('ollama-launcher-preview');
  const btn = $('ollama-preview-launcher');
  if (previewEl.hidden) {
    $('ollama-launcher-code').textContent = getCurrentLauncherContent();
    $('ollama-launcher-filename').textContent = ollamaOS === 'windows' ? 'autovinted-launcher.bat' : 'autovinted-launcher.sh';
    previewEl.hidden = false;
    btn.textContent = '✕ Masquer';
  } else {
    previewEl.hidden = true;
    btn.textContent = '👁 Voir le contenu';
  }
});
$('ollama-launcher-copy').addEventListener('click', () => {
  const txt = $('ollama-launcher-code').textContent;
  navigator.clipboard.writeText(txt).then(() => {
    const btn = $('ollama-launcher-copy');
    const orig = btn.textContent;
    btn.textContent = '✓ Copié';
    btn.classList.add('done');
    setTimeout(() => { btn.textContent = orig; btn.classList.remove('done'); }, 1500);
  });
});

// Live status check while modal is open
let ollamaStatusTimer = null;
async function checkOllamaStatus() {
  const statusEl = $('ollama-status');
  if (!statusEl) return;
  const dot = statusEl.querySelector('.ollama-status-dot');
  const txt = statusEl.querySelector('.ollama-status-text');
  const host = getOllamaHost();
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 1500);
    const res = await fetch(`${host}/api/tags`, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const count = (data.models || []).length;
    statusEl.className = 'ollama-status ok';
    txt.innerHTML = count > 0
      ? `✓ Ollama tourne et ${count} modèle${count > 1 ? 's' : ''} installé${count > 1 ? 's' : ''} — tout est prêt !`
      : `⚠ Ollama tourne mais aucun modèle installé — le launcher va le télécharger`;
  } catch {
    statusEl.className = 'ollama-status off';
    txt.textContent = `⊘ Ollama ne répond pas sur ${host} — utilise le launcher ci-dessous`;
  }
}

function startOllamaStatusPolling() {
  checkOllamaStatus();
  ollamaStatusTimer = setInterval(checkOllamaStatus, 2500);
}
function stopOllamaStatusPolling() {
  if (ollamaStatusTimer) { clearInterval(ollamaStatusTimer); ollamaStatusTimer = null; }
}

document.querySelectorAll('.ollama-copy').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const target = $(btn.dataset.copyTarget);
    if (!target) return;
    navigator.clipboard.writeText(target.textContent).then(() => {
      const orig = btn.textContent;
      btn.textContent = '✓ Copié';
      btn.classList.add('done');
      setTimeout(() => { btn.textContent = orig; btn.classList.remove('done'); }, 1500);
    });
  });
});
providerSelect.addEventListener('change', syncProviderUI);

// ─── Ollama : récupérer la liste des modèles installés ─────
$('ollama-fetch-models').addEventListener('click', async () => {
  const btn = $('ollama-fetch-models');
  const host = (apiKeyInput.value.trim() || DEFAULT_OLLAMA_HOST).replace(/\/$/, '');
  btn.disabled = true;
  btn.textContent = '… recherche en cours';
  try {
    const models = await fetchOllamaModels(host);
    if (!models.length) {
      showToast('Aucun modèle installé. Lance : ollama pull llama3.2-vision');
    } else {
      // Remplace la liste de modèles
      PROVIDERS.ollama.models = models;
      modelSelect.innerHTML = '';
      models.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = m.label;
        modelSelect.appendChild(opt);
      });
      modelSelect.value = getStoredModel('ollama') || models[0].id;
      showToast(`${models.length} modèle${models.length > 1 ? 's' : ''} trouvé${models.length > 1 ? 's' : ''} ✓`);
    }
  } catch (e) {
    showToast(`Connexion impossible : ${e.message}. Vérifie qu'Ollama tourne (OLLAMA_ORIGINS=*).`);
  } finally {
    btn.disabled = false;
    btn.textContent = '↻ Charger les modèles installés';
  }
});

// Save key/model on change so user doesn't lose them between providers
modelSelect.addEventListener('change', () => {
  localStorage.setItem('av-model-' + providerSelect.value, modelSelect.value);
});

// ─── Personnalisation (features) ─────────────────────
function renderFeatureToggles() {
  const list = $('features-list');
  list.innerHTML = Object.entries(FEATURE_LABELS).map(([key, info]) => `
    <label class="feature-toggle">
      <input type="checkbox" data-feature="${key}" ${state.features[key] ? 'checked' : ''} />
      <span class="feature-toggle-track"><span class="feature-toggle-thumb"></span></span>
      <span class="feature-toggle-text">
        <span class="feature-toggle-label">${info.label}</span>
        <span class="feature-toggle-hint">${info.hint}</span>
      </span>
    </label>
  `).join('');
}
renderFeatureToggles();

$('settings-toggle').addEventListener('click', () => {
  providerSelect.value = state.provider;
  syncProviderUI();
  renderFeatureToggles();
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
  } else if (PROVIDERS[providerId].needsHost) {
    setOllamaHost(apiKeyInput.value.trim() || DEFAULT_OLLAMA_HOST);
  }
  // Save feature toggles
  const newFeatures = { ...state.features };
  document.querySelectorAll('#features-list input[data-feature]').forEach(cb => {
    newFeatures[cb.dataset.feature] = cb.checked;
  });
  state.features = newFeatures;
  saveFeatures(newFeatures);
  settingsModal.hidden = true;
  showToast('Paramètres enregistrés');
  updateEstimate();
});

// Close modals with Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    settingsModal.hidden = true;
    historyModal.hidden = true;
    closeOllamaModal();
    closeTutorial();
  }
});

// ─── Spotlight Tutorial ───────────────────────────────
const TUTORIAL_STEPS = [
  { target: '.hero',           emoji: '✦',  title: 'Bienvenue sur AutoVinted', text: 'Upload tes photos, l\'IA rédige ton annonce Vinted optimisée. Voici le tour en 30 secondes.', placement: 'bottom' },
  { target: '.mode-toggle',    emoji: '🔀', title: 'Une annonce ou en lot',     text: '<strong>Une annonce</strong> — photos d\'un seul article.<br><strong>En lot</strong> — jusqu\'à 30 photos, l\'IA détecte les articles automatiquement.', placement: 'bottom' },
  { target: '#dropzone',       emoji: '📸', title: 'Upload tes photos',         text: 'Glisse-dépose ici ou clique pour parcourir. 4 à 6 angles idéalement : face, dos, étiquette, défauts.', placement: 'bottom' },
  { target: '#context-input',  emoji: '💬', title: 'Ajoute du contexte',        text: 'Infos que l\'IA ne peut pas deviner : taille réelle, prix d\'achat, état... Optionnel mais recommandé.', placement: 'top' },
  { target: '#settings-toggle',emoji: '⚙', title: 'Configure ton IA',          text: '<strong>Gratuit (Pollinations)</strong> — sans clé, fonctionne tout de suite.<br><strong>OpenAI / Claude / Gemini…</strong> — qualité supérieure avec ta clé API.', placement: 'bottom' },
  { target: '#history-toggle', emoji: '⌛', title: 'Historique',                text: 'Retrouve toutes tes annonces ici. <strong>Un exemple Clarks est déjà disponible</strong> pour voir à quoi ressemble un résultat !', placement: 'bottom' },
];

const tutorialOverlay  = $('tutorial-overlay');
const tutorialSpotlight= $('tutorial-spotlight');
const tutorialTooltip  = $('tutorial-tooltip');
const tutorialTipDots  = $('tutorial-tip-dots');
const tutorialTipPrev  = $('tutorial-tip-prev');
const tutorialTipNext  = $('tutorial-tip-next');
let tutorialStep = 0;

for (let i = 0; i < TUTORIAL_STEPS.length; i++) {
  const d = document.createElement('button');
  d.className = 'tutorial-tip-dot';
  d.addEventListener('click', () => goToStep(i));
  tutorialTipDots.appendChild(d);
}

function positionTutorial(target, placement) {
  const rect = target.getBoundingClientRect();
  const pad = 8, gap = 14, tW = 270, tH = 200;

  tutorialSpotlight.style.left   = `${rect.left - pad}px`;
  tutorialSpotlight.style.top    = `${rect.top  - pad}px`;
  tutorialSpotlight.style.width  = `${rect.width  + pad * 2}px`;
  tutorialSpotlight.style.height = `${rect.height + pad * 2}px`;

  let tx, ty;
  if (placement === 'bottom') {
    tx = rect.left + rect.width / 2 - tW / 2;
    ty = rect.bottom + pad + gap;
  } else if (placement === 'top') {
    tx = rect.left + rect.width / 2 - tW / 2;
    ty = rect.top - pad - gap - tH;
  } else if (placement === 'right') {
    tx = rect.right + pad + gap;
    ty = rect.top + rect.height / 2 - tH / 2;
  } else {
    tx = rect.left - pad - gap - tW;
    ty = rect.top  + rect.height / 2 - tH / 2;
  }
  tx = Math.max(8, Math.min(window.innerWidth  - tW - 8, tx));
  ty = Math.max(8, Math.min(window.innerHeight - tH - 8, ty));
  tutorialTooltip.style.left = `${tx}px`;
  tutorialTooltip.style.top  = `${ty}px`;
}

function goToStep(i) {
  tutorialStep = Math.max(0, Math.min(TUTORIAL_STEPS.length - 1, i));
  const step = TUTORIAL_STEPS[tutorialStep];

  tutorialTipDots.querySelectorAll('.tutorial-tip-dot').forEach((d, idx) =>
    d.classList.toggle('active', idx === tutorialStep)
  );
  $('tutorial-tip-emoji').textContent    = step.emoji;
  $('tutorial-tip-title').textContent    = step.title;
  $('tutorial-tip-text').innerHTML       = step.text;
  tutorialTipPrev.hidden = tutorialStep === 0;
  tutorialTipNext.textContent = tutorialStep === TUTORIAL_STEPS.length - 1 ? 'Commencer ✦' : 'Suivant →';

  const target = document.querySelector(step.target);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    requestAnimationFrame(() => positionTutorial(target, step.placement));
  }
}

function openTutorial() {
  tutorialOverlay.hidden = false;
  tutorialOverlay.removeAttribute('aria-hidden');
  goToStep(0);
}
function closeTutorial() {
  tutorialOverlay.hidden = true;
  tutorialOverlay.setAttribute('aria-hidden', 'true');
  localStorage.setItem('av-tutorial-seen', '1');
}

tutorialTipPrev.addEventListener('click', () => goToStep(tutorialStep - 1));
tutorialTipNext.addEventListener('click', () => {
  if (tutorialStep === TUTORIAL_STEPS.length - 1) closeTutorial();
  else goToStep(tutorialStep + 1);
});
$('tutorial-toggle').addEventListener('click', openTutorial);
$('tutorial-tip-close').addEventListener('click', closeTutorial);

if (!localStorage.getItem('av-tutorial-seen')) {
  setTimeout(openTutorial, 350);
}

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

async function compressThumbnail(dataUrl, maxSize = 120, quality = 0.5) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

async function saveToHistory(listing, photos = null) {
  let thumbnail = null;
  const src = photos || state.photos;
  if (src && src.length > 0) thumbnail = await compressThumbnail(src[0].dataUrl);
  state.history.unshift({ listing, date: new Date().toISOString(), id: crypto.randomUUID(), thumbnail });
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
    const thumbHtml = h.thumbnail
      ? `<img class="history-thumb" src="${h.thumbnail}" alt="" />`
      : `<div class="history-thumb-placeholder">👟</div>`;
    const badge = h.isDemo ? '<span class="history-item-badge">Exemple</span>' : '';
    return `<div class="history-item" data-id="${h.id}">
      ${thumbHtml}
      <div class="history-item-info">
        <span class="history-item-title">${escapeHtml(h.listing.title || '(sans titre)')}</span>
        <span class="history-item-date">${dateStr}</span>
        ${badge}
      </div>
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

// ─── Demo listing ────────────────────────────────────
const DEMO_ID = 'demo-clarks-craftmaster-v2';
function seedDemoListing() {
  if (localStorage.getItem('av-demo-seeded') === DEMO_ID) return;
  const demo = {
    id: DEMO_ID,
    date: '2026-05-01T09:00:00.000Z',
    isDemo: true,
    thumbnail: null,
    listing: {
      title: 'Mocassins Clarks × Walk in Paris Craftmaster — Cuir Bordeaux',
      description: 'Superbes penny loafers en collaboration exclusive Walk in Paris × Clarks Craftmaster. Cuir pleine fleur bordeaux profond, doublure intérieure verte, semelle noire. Coupe classique intemporelle, parfaits habillés ou casual chic.\n\n#Clarks #WalkInParis #Craftmaster #PennyLoafer #Mocassins #Loafer #CuirVeritable #Bordeaux #Chaussures #MadeInEngland #ClassiqueChic #Workwear #SmartCasual #Vintage #CapsuleWardrobe',
      details: { marque: 'Clarks × Walk in Paris', categorie: 'Chaussures', couleur: 'Bordeaux', etat: 'Neuf avec étiquettes', matiere: 'Cuir pleine fleur' },
      prices: { ideal: '115 €', rapide: '95 €', minimum: '80 €' },
      tips: [
        'Mesure la semelle intérieure (en cm) — les pointures Clarks varient et ça rassure les acheteurs.',
        'Ajoute une photo portée si possible, les chaussures se vendent bien mieux avec la coupe visible.',
        'Précise si la boîte d\'origine est disponible — ça peut justifier un prix légèrement plus élevé.',
      ],
      sourceLink: 'https://walkinparis.com/en/products/walk-in-paris-x-clarks-craft-james-lo-bordeaux',
    },
  };
  state.history = [...state.history, demo];
  localStorage.setItem('av-history', JSON.stringify(state.history));
  localStorage.setItem('av-demo-seeded', DEMO_ID);
}
seedDemoListing();

// ─── Helpers ─────────────────────────────────────────
function setBtnLoading(btn, loading, label) {
  btn.disabled = loading;
  btn.querySelector('.btn-label').textContent = label;
  btn.querySelector('.btn-spinner').hidden = !loading;
}
