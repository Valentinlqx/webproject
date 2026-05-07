/* ── AutoVinted — script.js ──
   Client-side webapp: upload photos → GPT-4o vision → annonce Vinted optimisée
*/

// ─── State ───────────────────────────────────────────
const state = {
  photos: [],          // [{ id, file, dataUrl }]
  conversation: [],    // [{ role, content }] — for OpenAI messages
  apiKey: localStorage.getItem('av-api-key') || '',
  model: localStorage.getItem('av-model') || 'gpt-4o',
  history: JSON.parse(localStorage.getItem('av-history') || '[]'),
  lastListing: null,
};

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
  if (!checkApiKey()) return;
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
    const response = await callOpenAI();
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
    const response = await callOpenAI();
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

// ─── OpenAI call ─────────────────────────────────────
async function callOpenAI() {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${state.apiKey}`,
    },
    body: JSON.stringify({
      model: state.model,
      messages: state.conversation,
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  const content = data.choices[0].message.content;
  state.conversation.push({ role: 'assistant', content });
  return JSON.parse(content);
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
$('settings-toggle').addEventListener('click', () => {
  $('api-key').value = state.apiKey;
  $('model-select').value = state.model;
  settingsModal.hidden = false;
});
$('settings-close').addEventListener('click', () => { settingsModal.hidden = true; });
settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) settingsModal.hidden = true; });

$('settings-save').addEventListener('click', () => {
  state.apiKey = $('api-key').value.trim();
  state.model = $('model-select').value;
  localStorage.setItem('av-api-key', state.apiKey);
  localStorage.setItem('av-model', state.model);
  settingsModal.hidden = true;
  showToast('Paramètres enregistrés');
});

function checkApiKey() {
  if (!state.apiKey) {
    showToast('Ajoute ta clé API OpenAI dans les paramètres');
    settingsModal.hidden = false;
    return false;
  }
  return true;
}

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
