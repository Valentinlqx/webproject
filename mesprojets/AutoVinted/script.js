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
};

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
};

const USD_TO_EUR = 0.93;

function estimateUsage() {
  const isBulk = state.mode === 'bulk';
  const sys = isBulk ? BULK_SYSTEM_PROMPT : SYSTEM_PROMPT;
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
const SYSTEM_PROMPT = `Tu es un vendeur Vinted humain. Style: naturel, vendeur, phrases courtes, jamais "IA marketing".

Analyse les photos et rédige une annonce Vinted optimisée pour vente rapide.

Si une info clé manque (marque, taille, état, défauts, matière), pose 1-3 questions courtes. Sinon, génère.
N'invente jamais ce qui n'est pas visible.

Prix idéal/rapide/min selon marque, état, demande marché 2nde main. En euros.

RÉPONDS UNIQUEMENT EN JSON VALIDE, sans texte/markdown autour:
{"action":"ask"|"generate","message":"...","listing":null|{"title":"max 60 chars","description":"courte, vendeuse, retours ligne, FINIR par ligne vide + 6-10 #hashtags minuscules sans accents","details":{"marque":"","taille":"","etat":"Neuf avec étiquette|Neuf sans étiquette|Très bon état|Bon état|Satisfaisant","couleur":"","categorie":"","matiere":""},"prices":{"ideal":"15€","rapide":"10€","minimum":"8€"},"tips":["..."]}}`;

// MODE LOT — auto-détection d'articles parmi N photos
const BULK_SYSTEM_PROMPT = `Tu es un vendeur Vinted humain. Style: naturel, vendeur, court.

Photos NUMÉROTÉES (Photo 0, 1, 2…). Plusieurs photos peuvent montrer le MÊME article (face/dos/étiquette/défaut).

Tâche:
1. Identifie chaque article distinct
2. Regroupe les photos du même article
3. Génère 1 annonce par article — PAS de questions, déduis ou utilise des valeurs génériques cohérentes

Description: courte, vendeuse, FINIR par ligne vide + 6-10 #hashtags minuscules sans accents.
Prix idéal/rapide/min en euros selon marché 2nde main.

JSON UNIQUEMENT, sans texte/markdown autour:
{"listings":[{"photo_indices":[0,1],"title":"max 60 chars","description":"...","details":{"marque":"","taille":"","etat":"Neuf|Neuf sans étiquette|Très bon état|Bon état|Satisfaisant","couleur":"","categorie":"","matiere":""},"prices":{"ideal":"15€","rapide":"10€","minimum":"8€"},"tips":[]}]}

photo_indices = numéros des photos (0-indexés). Chaque photo dans UNE seule annonce.`;

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
    { role: 'system', content: BULK_SYSTEM_PROMPT },
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
    listings.forEach((listing, i) => {
      const indices = Array.isArray(listing.photo_indices) ? listing.photo_indices : [i];
      const photos = indices
        .map(idx => state.photos[idx])
        .filter(Boolean);
      const card = createBulkCard(photos, i);
      bulkResults.appendChild(card.el);
      card.fillListing(listing);
      saveToHistory(listing);
    });

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
    </div>
    <div class="bulk-item-body"></div>
  `;
  const head = el.querySelector('.bulk-item-head');
  const titleEl = el.querySelector('.bulk-item-title');
  const metaEl = el.querySelector('.bulk-item-meta');
  const statusEl = el.querySelector('.bulk-item-status');
  const bodyEl = el.querySelector('.bulk-item-body');

  head.addEventListener('click', () => {
    if (bodyEl.children.length > 0) el.classList.toggle('open');
  });

  return {
    el,
    fillListing(l) {
      titleEl.textContent = l.title || `Article ${index + 1}`;
      const priceTxt = l.prices?.ideal || '—';
      const etatTxt = l.details?.etat || '—';
      metaEl.textContent = `${priceTxt} • ${etatTxt} • ${photoArr.length} photo${photoArr.length > 1 ? 's' : ''}`;
      statusEl.className = 'bulk-item-status done';
      statusEl.innerHTML = '✓ <span class="bulk-chevron">▾</span>';
      bodyEl.innerHTML = renderBulkBody(l, index, photoArr);
      bindBulkBodyActions(bodyEl, l);
    },
    setError(msg) {
      titleEl.textContent = `Article ${index + 1}`;
      metaEl.textContent = msg.length > 60 ? msg.slice(0, 60) + '…' : msg;
      statusEl.className = 'bulk-item-status error';
      statusEl.textContent = '⚠ Erreur';
    },
  };
}

function renderBulkBody(l, index, photoArr) {
  const d = l.details || {};
  const p = l.prices || {};
  const tips = (l.tips || []).map(t => `<li>${escapeHtml(t)}</li>`).join('');
  const detailLabels = { marque: 'Marque', taille: 'Taille', etat: 'État', couleur: 'Couleur', categorie: 'Catégorie', matiere: 'Matière' };
  const details = Object.entries(detailLabels)
    .filter(([k]) => d[k])
    .map(([k, label]) => `<li><strong>${label}</strong>${escapeHtml(d[k])}</li>`).join('');

  const thumbs = (photoArr && photoArr.length > 1)
    ? `<div class="bulk-item-thumbs">${photoArr.map(p => `<img src="${p.dataUrl}" alt="">`).join('')}</div>`
    : '';

  return `
    ${thumbs}
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
    <div class="result-block">
      <span class="result-label">Prix conseillés</span>
      <div class="price-grid">
        <div class="price-cell"><span class="price-cell-label">Idéal</span><span class="price-cell-value">${escapeHtml(p.ideal || '—')}</span></div>
        <div class="price-cell"><span class="price-cell-label">Vente rapide</span><span class="price-cell-value">${escapeHtml(p.rapide || '—')}</span></div>
        <div class="price-cell"><span class="price-cell-label">Minimum</span><span class="price-cell-value">${escapeHtml(p.minimum || '—')}</span></div>
      </div>
    </div>
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
  const d = l.details || {};
  const p = l.prices || {};
  return `${l.title}\n\n${l.description}\n\n— Marque : ${d.marque || ''}\n— Taille : ${d.taille || ''}\n— État : ${d.etat || ''}\n— Couleur : ${d.couleur || ''}\n— Catégorie : ${d.categorie || ''}\n${d.matiere ? '— Matière : ' + d.matiere + '\n' : ''}\nPrix : ${p.ideal || ''}`;
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

$('bulk-restart-btn').addEventListener('click', () => {
  state.photos = [];
  renderPreviews();
  bulkResults.innerHTML = '';
  bulkSection.hidden = true;
  bulkActions.hidden = true;
  uploadSection.style.display = '';
  $('context-input').value = '';
  state.context = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
  state.context = '';
  $('context-input').value = '';
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
  updateEstimate();
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
