// AutoVinted : des photos à l'annonce Vinted. Tout tourne dans le navigateur,
// la clé API de l'utilisateur ne quitte jamais sa machine (sauf vers son fournisseur).
// La partie « API » est dans autovinted-core.js.

const {
  PROVIDERS, detectProvider, resolveModel, estimateCost,
  parseJSON, buildRequest, extractText, apiErrorMessage, migrateLegacyKey,
} = window.AutoVintedCore;

// Les modèles récents réfléchissent avant de répondre, et cette réflexion compte
// dans la limite : une limite trop basse donne une réponse coupée.
const MAX_OUTPUT_TOKENS = 16000;

const MAX_PHOTOS_SINGLE = 8;
const MAX_PHOTOS_BULK = 30;
const MAX_PHOTO_SIZE = 1024; // px, on réduit avant l'envoi : moins cher et plus rapide
const JPEG_QUALITY = 0.8;

const $ = (id) => document.getElementById(id);

function readJSON(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

migrateLegacyKey(localStorage);

const state = {
  photos: [],        // [{ id, dataUrl }]
  conversation: [],  // format « chat » OpenAI, converti par le core pour chaque fournisseur
  mode: 'single',    // 'single' | 'bulk'
  context: '',
  history: Array.isArray(readJSON('av-history', [])) ? readJSON('av-history', []) : [],
  lastListing: null,
  features: null,
  busy: false,
};

const maxPhotos = () => state.mode === 'bulk' ? MAX_PHOTOS_BULK : MAX_PHOTOS_SINGLE;

// Retourne { providerId, key, model } ou null si aucune clé valable n'est enregistrée.
function currentSetup() {
  const key = (localStorage.getItem('av-key') || '').trim();
  const detected = detectProvider(key);
  if (!detected.ok) return null;
  return { providerId: detected.id, key, model: resolveModel(detected.id, localStorage.getItem('av-model')) };
}

function formatEuro(eur) {
  if (eur < 0.005) return '< 0,01 €';
  return `≈ ${eur.toFixed(eur < 1 ? 3 : 2).replace('.', ',')} €`;
}

// Prompts

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

// Chaque option désactivée raccourcit le prompt et la réponse, donc coûte moins cher.
const DEFAULT_FEATURES = {
  warnings: true,
  hashtags: true,
  details: true,
  prices: true,
  tips: true,
};
const FEATURE_LABELS = {
  warnings: { label: 'Vérifier règles Vinted',    hint: 'Détecte les risques de retrait (contrefaçon, interdits…)' },
  hashtags: { label: 'Hashtags dans description', hint: '6-10 #hashtags ajoutés à la fin' },
  details:  { label: 'Détails (marque, taille…)', hint: 'Marque, taille, état, couleur, catégorie, matière' },
  prices:   { label: 'Prix conseillés',           hint: '3 niveaux : idéal / vente rapide / minimum' },
  tips:     { label: 'Conseils vendeur',          hint: 'Astuces pour vendre plus vite' },
};

function loadFeatures() {
  const saved = readJSON('av-features', {});
  return { ...DEFAULT_FEATURES, ...(saved && typeof saved === 'object' ? saved : {}) };
}
function saveFeatures(f) { localStorage.setItem('av-features', JSON.stringify(f)); }
state.features = loadFeatures();

function buildSystemPrompt() {
  const f = state.features;
  const parts = [];
  parts.push('Tu es un vendeur Vinted humain. Style: naturel, vendeur, phrases courtes, jamais "IA marketing".');
  parts.push('Analyse les photos et rédige une annonce Vinted optimisée pour vente rapide.');

  parts.push(`MÉTHODE OBLIGATOIRE :
1. IDENTIFIE D'ABORD le type d'objet visible : livre, vêtement, chaussure, sac, bijou, électronique, jouet, déco, vaisselle, etc. Regarde forme, format, texte visible, logo.
2. Lis TOUT le texte visible sur les photos (titre, auteur, marque, étiquette, ISBN, taille…).
3. Génère l'annonce UNIQUEMENT à partir de ce que tu vois réellement.

INTERDIT ABSOLU :
- N'invente JAMAIS de marque, taille, matière ou catégorie qui n'est pas clairement visible.
- Si tu hésites entre "livre" et "vêtement" ou n'importe quoi d'autre, utilise action="ask" pour demander à l'utilisateur.
- Pas de "Dolce Gabbana", "Nike", "Zara" etc. sans logo/étiquette visible.`);

  parts.push(`PAR TYPE :
- LIVRE : titre exact, auteur, éditeur (Pocket/Folio/Gallimard…), ISBN si visible (4ème couv ou page de garde), genre, état. categorie="Livre". marque=éditeur.
- VÊTEMENT : marque (étiquette), taille (étiquette), matière (composition), couleur, coupe.
- CHAUSSURE : marque, pointure (semelle), modèle, couleur.
- AUTRE : marque visible, dimensions/capacité si pertinent.`);

  const hashtagsRule = f.hashtags
    ? 'La description finit par une ligne vide puis 6-10 #hashtags minuscules sans accents.'
    : 'PAS de hashtags dans la description.';
  parts.push(`RÈGLE ABSOLUE : "title" et "description" prêts à coller sur Vinted, SANS aucun conseil/recommandation/astuce. ${hashtagsRule}`);

  if (f.warnings) {
    parts.push(VINTED_POLICY);
    parts.push('"warnings" = strings courtes signalant uniquement des risques RÉELS détectés. [] si rien.');
  }

  const fields = ['"title":"max 60 chars"', '"description":"courte, vendeuse"'];
  if (f.details) fields.push('"details":{"marque":"","taille":"","etat":"Neuf avec étiquette|Neuf sans étiquette|Très bon état|Bon état|Satisfaisant","couleur":"","categorie":"","matiere":"","isbn":"(livres uniquement, sinon vide)"}');
  if (f.prices) fields.push('"prices":{"ideal":"15€","rapide":"10€","minimum":"8€"}');
  if (f.tips) fields.push('"tips":["conseils pour le vendeur"]');
  if (f.warnings) fields.push('"warnings":["risques ou []"]');

  parts.push(`RÉPONDS UNIQUEMENT EN JSON VALIDE, sans texte/markdown autour:\n{"action":"ask"|"generate","message":"...","listing":null|{${fields.join(',')}}}`);
  return parts.join('\n\n');
}

function buildBulkSystemPrompt() {
  const f = state.features;
  const parts = [];
  parts.push('Tu es un vendeur Vinted humain. Style: naturel, vendeur, court.');
  parts.push('Photos NUMÉROTÉES (Photo 0, 1, 2…). Plusieurs photos peuvent montrer le MÊME article.');
  parts.push('Tâche : identifie chaque article distinct, regroupe les photos, génère 1 annonce par article.');

  parts.push(`MÉTHODE OBLIGATOIRE pour chaque article :
1. IDENTIFIE le type : livre, vêtement, chaussure, sac, électronique, jouet, déco… Regarde forme et texte.
2. Lis TOUT le texte visible (titre, marque, étiquette, ISBN, taille…).
3. Génère uniquement à partir du visible. INTERDIT d'inventer une marque/taille/matière non visible.
- LIVRE : titre, auteur, éditeur (Pocket/Folio…), ISBN si visible, categorie="Livre", marque=éditeur.
- VÊTEMENT : marque (étiquette), taille (étiquette), matière, couleur.
- CHAUSSURE : marque, pointure, modèle.
Si tu n'es vraiment pas sûr du type d'objet, mets categorie="Inconnu" et donne une description neutre basée sur ce que tu vois.`);

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
  if (f.prices) fields.push('"prices":{"ideal":"15€","rapide":"10€","minimum":"8€"}');
  if (f.tips) fields.push('"tips":[]');
  if (f.warnings) fields.push('"warnings":[]');

  parts.push(`JSON UNIQUEMENT, sans texte/markdown autour:\n{"listings":[{${fields.join(',')}}]}`);
  parts.push('photo_indices = numéros des photos (0-indexés). Chaque photo dans UNE seule annonce.');
  return parts.join('\n\n');
}

// Appel à l'IA

// Ajoute la réponse à `conversation` (pour pouvoir continuer le dialogue) et renvoie le JSON.
async function callAI(conversation) {
  const setup = currentSetup();
  const { url, init } = buildRequest({ ...setup, conversation, maxTokens: MAX_OUTPUT_TOKENS });

  let res;
  try {
    res = await fetch(url, init);
  } catch {
    throw new Error('Impossible de joindre le fournisseur. Vérifie ta connexion.');
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(apiErrorMessage(res.status, data));

  const text = extractText(setup.providerId, data || {});
  conversation.push({ role: 'assistant', content: text });
  try {
    return parseJSON(text);
  } catch (err) {
    console.error('[AutoVinted] réponse brute :\n', text);
    throw err;
  }
}

function estimateUsage() {
  const setup = currentSetup();
  if (!setup) return null;
  const isBulk = state.mode === 'bulk';
  const prompt = isBulk ? buildBulkSystemPrompt() : buildSystemPrompt();
  const context = $('context-input').value;
  return estimateCost({
    providerId: setup.providerId,
    modelId: setup.model,
    photos: state.photos.length,
    textChars: prompt.length + context.length + 200,
    listings: isBulk ? Math.max(1, Math.ceil(state.photos.length / 2.5)) : 1,
  });
}

function updateEstimate() {
  const el = $('estimate');
  const usage = state.photos.length ? estimateUsage() : null;
  if (!usage) {
    el.textContent = '';
    el.hidden = true;
    return;
  }
  const tokens = `≈ ${(usage.inTokens + usage.outTokens).toLocaleString('fr-FR')} tokens`;
  el.textContent = usage.eur === null ? tokens : `${tokens} · ${formatEuro(usage.eur)}`;
  el.hidden = false;
}

// DOM

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

$('theme-toggle').addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('av-theme', isDark ? 'dark' : 'light');
  $('theme-toggle').textContent = isDark ? '☀️' : '🌙';
});
$('theme-toggle').textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';

let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3200);
}

function setBtnLoading(btn, loading, label) {
  btn.disabled = loading;
  btn.querySelector('.btn-label').textContent = label;
  btn.querySelector('.btn-spinner').hidden = !loading;
}

function copyText(text) {
  return navigator.clipboard.writeText(text).catch(() => {
    showToast('Copie impossible : sélectionne le texte à la main.');
    throw new Error('clipboard');
  });
}

function flashCopied(btn) {
  const original = btn.textContent;
  btn.textContent = '✓ Copié';
  btn.classList.add('done');
  setTimeout(() => { btn.textContent = original; btn.classList.remove('done'); }, 1500);
}

// Photos

// La dropzone est un <label> relié au champ fichier : le clic ouvre déjà le sélecteur.
// Il reste le clavier à gérer.
dropzone.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fileInput.click();
  }
});

['dragenter', 'dragover'].forEach(evt =>
  dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.add('drag'); })
);
['dragleave', 'drop'].forEach(evt =>
  dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.remove('drag'); })
);
dropzone.addEventListener('drop', (e) => {
  addPhotos([...e.dataTransfer.files].filter(f => f.type.startsWith('image/')));
});

fileInput.addEventListener('change', async () => {
  await addPhotos([...fileInput.files]);
  fileInput.value = ''; // sinon re-choisir la même photo ne déclenche rien
});

async function addPhotos(files) {
  const room = maxPhotos() - state.photos.length;
  if (files.length > room) showToast(`Maximum ${maxPhotos()} photos`);

  let unreadable = 0;
  for (const file of files.slice(0, room)) {
    const dataUrl = await downscaleImage(file, MAX_PHOTO_SIZE);
    if (dataUrl) state.photos.push({ id: crypto.randomUUID(), dataUrl });
    else unreadable++;
  }
  if (unreadable) showToast(`${unreadable} photo${unreadable > 1 ? 's' : ''} illisible${unreadable > 1 ? 's' : ''} (format non pris en charge ?)`);
  renderPreviews();
}

// Renvoie null si le navigateur ne sait pas lire l'image (HEIC sur certains navigateurs, fichier abîmé…).
function downscaleImage(file, maxSide) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

function renderPreviews() {
  previews.innerHTML = '';
  state.photos.forEach(p => {
    const el = document.createElement('div');
    el.className = 'preview';
    el.innerHTML = `
      <img src="${p.dataUrl}" alt="" />
      <button class="preview-remove" type="button" aria-label="Retirer cette photo">✕</button>
    `;
    el.querySelector('.preview-remove').addEventListener('click', () => {
      state.photos = state.photos.filter(x => x.id !== p.id);
      renderPreviews();
    });
    previews.appendChild(el);
  });
  analyzeBtn.disabled = state.photos.length === 0;
  updateAnalyzeBtnLabel();
  updateEstimate();
}

// Analyse d'un seul article

function requireSetup() {
  if (currentSetup()) return true;
  showToast('Ajoute ta clé API dans les paramètres');
  openSettings();
  return false;
}

analyzeBtn.addEventListener('click', async () => {
  if (state.photos.length === 0 || !requireSetup()) return;

  if (state.mode === 'bulk') {
    await runBulk();
    return;
  }

  setBtnLoading(analyzeBtn, true, 'Analyse...');
  state.context = $('context-input').value.trim();

  const ctxLine = state.context ? `\n\nContexte donné par le vendeur : "${state.context}"` : '';
  state.conversation = [
    { role: 'system', content: buildSystemPrompt() },
    {
      role: 'user',
      content: [
        { type: 'text', text: `Voici ${state.photos.length} photo(s) du produit. Analyse-les et soit pose-moi des questions sur les infos manquantes, soit génère directement l'annonce si tu as toutes les infos.${ctxLine}` },
        ...state.photos.map(p => ({ type: 'image_url', image_url: { url: p.dataUrl } })),
      ],
    },
  ];

  try {
    handleAIResponse(await callAI(state.conversation));
  } catch (err) {
    showToast('Erreur : ' + err.message);
    setBtnLoading(analyzeBtn, false, 'Analyser mes photos');
  }
});

// Mode une annonce / en lot

const modeBtns = document.querySelectorAll('.mode-btn');
const dropzoneSub = $('dropzone-sub');

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    if (mode === state.mode) return;
    state.mode = mode;
    modeBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.mode === mode);
      b.setAttribute('aria-pressed', String(b.dataset.mode === mode));
    });
    if (mode === 'bulk') {
      dropzoneSub.textContent = `Plusieurs articles à la fois — l'IA détecte chaque article (jusqu'à ${MAX_PHOTOS_BULK} photos)`;
      $('context-hint').textContent = 'Info qui s\'applique à tous les articles, pour éviter que l\'IA pose des questions.';
      $('context-input').placeholder = 'Ex : tous des livres en bon état, prix d\'achat ~10€, je veux vendre vite';
    } else {
      dropzoneSub.textContent = `ou clique pour parcourir — jusqu'à ${MAX_PHOTOS_SINGLE} photos`;
      $('context-hint').textContent = 'Toute info utile que l\'IA ne peut pas deviner (taille, état réel, prix d\'achat...).';
      $('context-input').placeholder = 'Ex : porté 3 fois, prix d\'achat 80€, je veux vendre vite';
      // On repasse à 8 photos max : on garde les 8 premières.
      if (state.photos.length > MAX_PHOTOS_SINGLE) {
        state.photos = state.photos.slice(0, MAX_PHOTOS_SINGLE);
        showToast(`Seules les ${MAX_PHOTOS_SINGLE} premières photos sont gardées`);
        renderPreviews();
      }
    }
    updateAnalyzeBtnLabel();
    updateEstimate();
  });
});

function updateAnalyzeBtnLabel() {
  const label = analyzeBtn.querySelector('.btn-label');
  const n = state.photos.length;
  if (state.mode === 'bulk') {
    label.textContent = n > 0 ? `Détecter & générer (${n} photo${n > 1 ? 's' : ''})` : 'Générer les annonces';
  } else {
    label.textContent = 'Analyser mes photos';
  }
}

$('context-input').addEventListener('input', updateEstimate);

// Mode lot

const bulkSection = $('bulk-section');
const bulkResults = $('bulk-results');
const bulkActions = $('bulk-actions');
const bulkProgress = $('bulk-progress');
const bulkProgressText = $('bulk-progress-text');
const bulkProgressFill = $('bulk-progress-fill');
const bulkListings = new WeakMap(); // carte affichée → annonce, pour « copier toutes les annonces »

async function runBulk() {
  state.context = $('context-input').value.trim();
  const total = state.photos.length;

  uploadSection.style.display = 'none';
  bulkSection.hidden = false;
  bulkResults.innerHTML = '';
  bulkProgress.hidden = false;
  bulkActions.hidden = true;
  bulkProgressText.textContent = `L'IA analyse ${total} photo${total > 1 ? 's' : ''} et regroupe les articles…`;
  bulkProgressFill.style.width = '15%';

  const ctxLine = state.context ? `\n\nContexte donné par le vendeur (s'applique à tous les articles) : "${state.context}"` : '';
  const intro = `Voici ${total} photos. Plusieurs photos peuvent montrer le MÊME article (sous différents angles, étiquettes, défauts...). Identifie chaque article distinct, regroupe les photos qui appartiennent au même article, et génère UNE annonce Vinted par article détecté.${ctxLine}`;

  const userContent = [{ type: 'text', text: intro }];
  state.photos.forEach((p, i) => {
    userContent.push({ type: 'text', text: `\nPhoto ${i} :` });
    userContent.push({ type: 'image_url', image_url: { url: p.dataUrl } });
  });
  const conversation = [
    { role: 'system', content: buildBulkSystemPrompt() },
    { role: 'user', content: userContent },
  ];

  bulkProgressFill.style.width = '40%';

  try {
    const resp = await callAI(conversation);
    bulkProgressFill.style.width = '100%';

    const listings = Array.isArray(resp.listings) ? resp.listings : [];
    if (listings.length === 0) throw new Error(resp.message || 'Aucun article détecté dans les photos');

    for (let i = 0; i < listings.length; i++) {
      const listing = listings[i];
      const indices = Array.isArray(listing.photo_indices) ? listing.photo_indices : [i];
      const photos = indices.map(idx => state.photos[idx]).filter(Boolean);
      const card = createBulkCard(photos, i);
      bulkResults.appendChild(card.el);
      card.fillListing(listing);
      bulkListings.set(card.el, listing);
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
  const el = document.createElement('div');
  el.className = 'bulk-item';
  el.innerHTML = `
    <div class="bulk-item-head">
      <img class="bulk-item-thumb" src="${photos[0]?.dataUrl || ''}" alt="" />
      <div class="bulk-item-info">
        <div class="bulk-item-title">Article ${index + 1}</div>
        <div class="bulk-item-meta">${photos.length} photo${photos.length > 1 ? 's' : ''}</div>
      </div>
      <span class="bulk-item-status"><span class="spinner-sm"></span></span>
      <button class="bulk-item-delete" type="button" title="Supprimer cet article" aria-label="Supprimer cet article">✕</button>
    </div>
    <div class="bulk-item-body"></div>
  `;
  const head = el.querySelector('.bulk-item-head');
  const titleEl = el.querySelector('.bulk-item-title');
  const metaEl = el.querySelector('.bulk-item-meta');
  const statusEl = el.querySelector('.bulk-item-status');
  const bodyEl = el.querySelector('.bulk-item-body');

  el.querySelector('.bulk-item-delete').addEventListener('click', (e) => {
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
      metaEl.textContent = `${l.prices?.ideal || '—'} • ${l.details?.etat || '—'} • ${photos.length} photo${photos.length > 1 ? 's' : ''}`;
      statusEl.className = 'bulk-item-status done' + (hasWarn ? ' has-warn' : '');
      statusEl.innerHTML = (hasWarn ? '⚠ ' : '✓ ') + '<span class="bulk-chevron">▾</span>';
      bodyEl.innerHTML = renderBulkBody(l, photos);
      bindBulkBodyActions(bodyEl, l);
    },
  };
}

const DETAIL_LABELS = {
  marque: 'Marque', taille: 'Taille', etat: 'État', couleur: 'Couleur',
  categorie: 'Catégorie', matiere: 'Matière', isbn: 'ISBN',
};

function renderBulkBody(l, photos) {
  const f = state.features;
  const d = l.details || {};
  const p = l.prices || {};
  const tips = f.tips ? (l.tips || []).map(t => `<li>${escapeHtml(t)}</li>`).join('') : '';
  const details = f.details ? Object.entries(DETAIL_LABELS)
    .filter(([k]) => d[k])
    .map(([k, label]) => `<li><strong>${label}</strong>${escapeHtml(d[k])}</li>`).join('') : '';

  const thumbs = photos.length > 1
    ? `<div class="bulk-item-thumbs">${photos.map(ph => `<img src="${ph.dataUrl}" alt="">`).join('')}</div>`
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
        <button class="copy-btn" type="button" data-bcopy="title">Copier</button>
      </div>
      <p class="result-title">${escapeHtml(l.title || '')}</p>
    </div>
    <div class="result-block">
      <div class="result-block-head">
        <span class="result-label">Description</span>
        <button class="copy-btn" type="button" data-bcopy="description">Copier</button>
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
    <div class="result-actions"><button class="btn-ghost" type="button" data-bcopy="all">Copier toute l'annonce</button></div>
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
      copyText(text || '').then(() => flashCopied(btn), () => {});
    });
  });
}

function formatFullListing(l) {
  const f = state.features;
  const d = l.details || {};
  let out = `${l.title || ''}\n\n${l.description || ''}`;
  if (f.details) {
    const lines = Object.entries(DETAIL_LABELS).filter(([k]) => d[k]).map(([k, label]) => `— ${label} : ${d[k]}`);
    if (lines.length) out += '\n\n' + lines.join('\n');
  }
  if (f.prices && l.prices?.ideal) out += `\n\nPrix : ${l.prices.ideal}`;
  return out;
}

$('bulk-copy-all-btn').addEventListener('click', () => {
  const texts = [...bulkResults.querySelectorAll('.bulk-item')]
    .map(el => bulkListings.get(el))
    .filter(Boolean)
    .map((l, i) => `━━━ Article ${i + 1} ━━━\n${l.title || ''}\n\n${l.description || ''}`);
  if (texts.length === 0) { showToast('Aucune annonce à copier'); return; }
  copyText(texts.join('\n\n\n')).then(() => showToast(`${texts.length} annonces copiées ✓`), () => {});
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
  setBtnLoading(analyzeBtn, false, 'Analyser mes photos');
  updateAnalyzeBtnLabel();
  analyzeBtn.disabled = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function isOnUploadView() {
  return uploadSection.style.display !== 'none';
}

// Hors de l'écran d'accueil, « retour » ramène au début au lieu de quitter l'app.
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

// Dialogue avec l'IA quand il lui manque des infos

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = chatText.value.trim();
  if (!text || state.busy) return;
  chatText.value = '';
  await sendUserMessage(text);
});

generateBtn.addEventListener('click', async () => {
  if (state.busy) return;
  await sendUserMessage("Génère l'annonce maintenant avec ce que tu as.");
});

async function sendUserMessage(text) {
  state.busy = true;
  addBubble('user', text);
  state.conversation.push({ role: 'user', content: text });

  const thinking = addBubble('thinking');
  try {
    const response = await callAI(state.conversation);
    thinking.remove();
    handleAIResponse(response);
  } catch (err) {
    thinking.remove();
    // Le message n'a pas eu de réponse : on le retire pour que l'utilisateur puisse le renvoyer.
    state.conversation.pop();
    addBubble('ai', 'Erreur : ' + err.message);
  } finally {
    state.busy = false;
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

function handleAIResponse(resp) {
  if (isOnUploadView()) {
    uploadSection.style.display = 'none';
    chatSection.hidden = false;
    setBtnLoading(analyzeBtn, false, 'Analyser mes photos');
  }

  if (resp.action === 'generate' && resp.listing) {
    renderListing(resp.listing, state.photos.map(p => p.dataUrl));
    chatSection.hidden = true;
    resultSection.hidden = false;
    saveToHistory(resp.listing).catch(() => {});
  } else {
    addBubble('ai', resp.message || 'Réponse inattendue, réessaie.');
    generateBtn.hidden = resp.action !== 'ask';
  }
}

// Résultat

function renderListing(listing, photos = null) {
  state.lastListing = listing;

  const photosEl = $('r-photos');
  if (photos && photos.length) {
    photosEl.innerHTML = photos.map((src, i) =>
      `<img class="result-photo" src="${escapeHtml(src)}" alt="Photo ${i + 1}" loading="lazy" />`
    ).join('');
    photosEl.hidden = false;
  } else {
    photosEl.innerHTML = '';
    photosEl.hidden = true;
  }

  $('r-title').textContent = listing.title || '';
  $('r-description').textContent = listing.description || '';

  const f = state.features;
  const details = listing.details || {};
  const detailsHtml = Object.entries(DETAIL_LABELS)
    .filter(([k]) => details[k])
    .map(([k, label]) => `<li><strong>${label}</strong>${escapeHtml(details[k])}</li>`)
    .join('');
  $('r-details').innerHTML = detailsHtml;
  $('r-details-block').hidden = !f.details || !detailsHtml;

  const prices = listing.prices || {};
  $('r-prices').innerHTML = `
    <div class="price-cell"><span class="price-cell-label">Idéal</span><span class="price-cell-value">${escapeHtml(prices.ideal || '—')}</span></div>
    <div class="price-cell"><span class="price-cell-label">Vente rapide</span><span class="price-cell-value">${escapeHtml(prices.rapide || '—')}</span></div>
    <div class="price-cell"><span class="price-cell-label">Minimum</span><span class="price-cell-value">${escapeHtml(prices.minimum || '—')}</span></div>
  `;
  $('r-prices-block').hidden = !(f.prices && (prices.ideal || prices.rapide || prices.minimum));

  const tips = Array.isArray(listing.tips) ? listing.tips : [];
  $('r-tips').innerHTML = tips.map(t => `<li>${escapeHtml(t)}</li>`).join('');
  $('r-tips-block').hidden = !(f.tips && tips.length);

  const warnings = (f.warnings && Array.isArray(listing.warnings)) ? listing.warnings.filter(Boolean) : [];
  const warnEl = $('r-warnings');
  if (warnings.length) {
    warnEl.innerHTML = `
      <div class="result-warnings-head">⚠ Attention — règles Vinted</div>
      <ul>${warnings.map(w => `<li>${escapeHtml(w)}</li>`).join('')}</ul>
      <div class="result-warnings-foot">Ton annonce risque d'être retirée par Vinted. Vérifie avant de publier.</div>
    `;
  }
  warnEl.hidden = !warnings.length;

  // Seule l'annonce d'exemple a un lien source (photos d'un site marchand).
  const srcBlock = $('r-source-block');
  if (listing.sourceLink) {
    $('r-source-link').href = listing.sourceLink;
    srcBlock.hidden = false;
  } else {
    srcBlock.hidden = true;
  }

  resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

document.addEventListener('click', (e) => {
  const img = e.target.closest('.result-photo');
  if (!img) return;
  const box = document.createElement('div');
  box.className = 'photo-lightbox';
  box.innerHTML = `<img src="${img.src}" alt="" />`;
  const close = () => {
    box.remove();
    document.removeEventListener('keydown', onEsc);
  };
  const onEsc = (ev) => { if (ev.key === 'Escape') close(); };
  box.addEventListener('click', close);
  document.addEventListener('keydown', onEsc);
  document.body.appendChild(box);
});

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.copy-btn[data-copy]');
  if (!btn) return;
  const text = btn.dataset.copy === 'title' ? state.lastListing?.title : state.lastListing?.description;
  if (text) copyText(text).then(() => flashCopied(btn), () => {});
});

$('copy-all-btn').addEventListener('click', () => {
  if (state.lastListing) copyText(formatFullListing(state.lastListing)).then(() => showToast('Annonce copiée ✓'), () => {});
});

$('restart-btn').addEventListener('click', doRestart);

// Paramètres : une seule clé, le fournisseur est deviné à partir de son préfixe

const settingsModal = $('settings-modal');
const apiKeyInput = $('api-key');
const keyStatus = $('key-status');
const modelPicker = $('model-picker');
const modelSelect = $('model-select');

const KEY_PROBLEMS = {
  empty: 'Claude, ChatGPT, Gemini ou Mistral : le fournisseur est reconnu tout seul.',
  groq: 'Groq n\'est plus pris en charge : son modèle vision n\'accepte que 3 photos.',
  openrouter: 'Les clés OpenRouter ne sont pas prises en charge. Utilise une clé Claude, ChatGPT, Gemini ou Mistral.',
  unknown: 'Clé non reconnue. Vérifie que tu l\'as copiée en entier.',
};

$('key-links').innerHTML = Object.values(PROVIDERS)
  .map(p => `<a href="${p.keyUrl}" target="_blank" rel="noopener">${p.label}</a>`)
  .join(' · ');

let shownProvider = null;

function syncKeyStatus() {
  const detected = detectProvider(apiKeyInput.value);
  keyStatus.classList.toggle('ok', detected.ok);
  keyStatus.classList.toggle('error', !detected.ok && detected.reason !== 'empty');

  if (!detected.ok) {
    keyStatus.textContent = KEY_PROBLEMS[detected.reason];
    modelPicker.hidden = true;
    shownProvider = null;
    return;
  }

  const provider = PROVIDERS[detected.id];
  if (shownProvider !== detected.id) {
    modelSelect.innerHTML = provider.models
      .map(m => `<option value="${m.id}">${m.label}</option>`)
      .join('');
    modelSelect.value = resolveModel(detected.id, localStorage.getItem('av-model'));
    shownProvider = detected.id;
  }
  modelPicker.hidden = false;

  const model = provider.models.find(m => m.id === modelSelect.value);
  const { eur } = estimateCost({
    providerId: detected.id,
    modelId: model.id,
    photos: 4,
    textChars: buildSystemPrompt().length + 200,
    listings: 1,
  });
  keyStatus.textContent = `✓ ${provider.label} reconnu · ${model.label} · ${formatEuro(eur)} par annonce de 4 photos`;
}

apiKeyInput.addEventListener('input', syncKeyStatus);
modelSelect.addEventListener('change', syncKeyStatus);

function renderFeatureToggles() {
  $('features-list').innerHTML = Object.entries(FEATURE_LABELS).map(([key, info]) => `
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

function fillSettings() {
  apiKeyInput.value = localStorage.getItem('av-key') || '';
  shownProvider = null;
  syncKeyStatus();
  renderFeatureToggles();
}

function openSettings() {
  fillSettings();
  settingsModal.hidden = false;
  apiKeyInput.focus();
}

$('settings-toggle').addEventListener('click', openSettings);
$('settings-close').addEventListener('click', () => { settingsModal.hidden = true; });
settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) settingsModal.hidden = true; });

$('settings-save').addEventListener('click', () => {
  const key = apiKeyInput.value.trim();
  const detected = detectProvider(key);
  if (key && !detected.ok) {
    showToast(KEY_PROBLEMS[detected.reason]);
    apiKeyInput.focus();
    return;
  }
  if (key) {
    localStorage.setItem('av-key', key);
    localStorage.setItem('av-model', modelSelect.value);
  } else {
    localStorage.removeItem('av-key');
    localStorage.removeItem('av-model');
  }

  const features = { ...state.features };
  document.querySelectorAll('#features-list input[data-feature]').forEach(cb => {
    features[cb.dataset.feature] = cb.checked;
  });
  state.features = features;
  saveFeatures(features);

  settingsModal.hidden = true;
  showToast('Paramètres enregistrés');
  updateEstimate();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    settingsModal.hidden = true;
    historyModal.hidden = true;
    closeTutorial();
  }
});

// Sur grand écran, les paramètres sont un panneau toujours visible : on le remplit dès le départ.
fillSettings();

// Tutoriel

const TUTORIAL_STEPS = [
  { target: '.hero',            emoji: '✦',  title: 'Bienvenue sur AutoVinted', text: 'Upload tes photos, l\'IA rédige ton annonce Vinted optimisée. Voici le tour en 30 secondes.', placement: 'bottom' },
  { target: '.mode-toggle',     emoji: '🔀', title: 'Une annonce ou en lot',    text: '<strong>Une annonce</strong> — photos d\'un seul article.<br><strong>En lot</strong> — jusqu\'à 30 photos, l\'IA détecte les articles automatiquement.', placement: 'bottom' },
  { target: '#dropzone',        emoji: '📸', title: 'Upload tes photos',        text: 'Glisse-dépose ici ou clique pour parcourir. 4 à 6 angles idéalement : face, dos, étiquette, défauts.', placement: 'bottom' },
  { target: '#context-input',   emoji: '💬', title: 'Ajoute du contexte',       text: 'Infos que l\'IA ne peut pas deviner : taille réelle, prix d\'achat, état... Optionnel mais recommandé.', placement: 'top' },
  { target: '#settings-toggle', emoji: '⚙',  title: 'Ta clé API',               text: 'Colle une clé <strong>Claude, ChatGPT, Gemini ou Mistral</strong> : le fournisseur est reconnu tout seul. Elle reste uniquement dans ton navigateur.', placement: 'bottom' },
  { target: '#history-toggle',  emoji: '⌛', title: 'Historique',               text: 'Retrouve toutes tes annonces ici. <strong>Un exemple Clarks est déjà disponible</strong> pour voir à quoi ressemble un résultat !', placement: 'bottom' },
];

const tutorialOverlay = $('tutorial-overlay');
const tutorialSpotlight = $('tutorial-spotlight');
const tutorialTooltip = $('tutorial-tooltip');
const tutorialTipDots = $('tutorial-tip-dots');
const tutorialTipPrev = $('tutorial-tip-prev');
const tutorialTipNext = $('tutorial-tip-next');
let tutorialStep = 0;

TUTORIAL_STEPS.forEach((step, i) => {
  const dot = document.createElement('button');
  dot.className = 'tutorial-tip-dot';
  dot.type = 'button';
  dot.setAttribute('aria-label', `Étape ${i + 1} : ${step.title}`);
  dot.addEventListener('click', () => goToStep(i));
  tutorialTipDots.appendChild(dot);
});

function positionTutorial(target, placement) {
  const rect = target.getBoundingClientRect();
  const pad = 8, gap = 14, tW = 270, tH = 200;

  tutorialSpotlight.style.left = `${rect.left - pad}px`;
  tutorialSpotlight.style.top = `${rect.top - pad}px`;
  tutorialSpotlight.style.width = `${rect.width + pad * 2}px`;
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
    ty = rect.top + rect.height / 2 - tH / 2;
  }
  tutorialTooltip.style.left = `${Math.max(8, Math.min(window.innerWidth - tW - 8, tx))}px`;
  tutorialTooltip.style.top = `${Math.max(8, Math.min(window.innerHeight - tH - 8, ty))}px`;
}

function goToStep(i) {
  tutorialStep = Math.max(0, Math.min(TUTORIAL_STEPS.length - 1, i));
  const step = TUTORIAL_STEPS[tutorialStep];

  tutorialTipDots.querySelectorAll('.tutorial-tip-dot').forEach((d, idx) =>
    d.classList.toggle('active', idx === tutorialStep)
  );
  $('tutorial-tip-emoji').textContent = step.emoji;
  $('tutorial-tip-title').textContent = step.title;
  $('tutorial-tip-text').innerHTML = step.text;
  tutorialTipPrev.hidden = tutorialStep === 0;
  tutorialTipNext.textContent = tutorialStep === TUTORIAL_STEPS.length - 1 ? 'Commencer ✦' : 'Suivant →';

  // Sur grand écran les boutons du haut sont cachés : on montre les panneaux latéraux à la place.
  let selector = step.target;
  let placement = step.placement;
  if (window.matchMedia('(min-width: 1180px)').matches) {
    if (selector === '#settings-toggle') { selector = '#settings-modal .modal-card'; placement = 'left'; }
    else if (selector === '#history-toggle') { selector = '#history-modal .modal-card'; placement = 'right'; }
  }
  const target = document.querySelector(selector);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    requestAnimationFrame(() => positionTutorial(target, placement));
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

// Historique

const historyModal = $('history-modal');
$('history-toggle').addEventListener('click', () => { renderHistory(); historyModal.hidden = false; });
$('history-close').addEventListener('click', () => { historyModal.hidden = true; });
historyModal.addEventListener('click', (e) => { if (e.target === historyModal) historyModal.hidden = true; });

$('history-clear').addEventListener('click', () => {
  // L'exemple Clarks reste : c'est la seule façon de voir un résultat sans clé API.
  const demoEntry = state.history.find(h => h.isDemo);
  state.history = demoEntry ? [demoEntry] : [];
  persistHistory();
  if (!demoEntry) {
    localStorage.removeItem('av-demo-seeded');
    seedDemoListing();
  }
  renderHistory();
  showToast('Historique effacé');
});

function compressImage(dataUrl, maxSize, quality) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

// Copies basse définition des photos, pour se souvenir de l'article.
const HISTORY_PHOTO_MAX = 6;
const HISTORY_PHOTO_SIZE = 480;
const HISTORY_PHOTO_QUALITY = 0.6;

// localStorage est limité (~5 Mo) : si ça déborde, on sacrifie d'abord les photos
// des plus vieilles annonces, puis les annonces elles-mêmes.
function persistHistory() {
  const write = () => localStorage.setItem('av-history', JSON.stringify(state.history));
  try { write(); return; } catch { /* quota dépassé */ }
  for (let i = state.history.length - 1; i >= 0; i--) {
    if (state.history[i].photos?.length) {
      state.history[i].photos = [];
      try { write(); return; } catch { /* encore trop gros */ }
    }
  }
  while (state.history.length > 1) {
    state.history.pop();
    try { write(); return; } catch { /* encore trop gros */ }
  }
}

async function saveToHistory(listing, photos = null) {
  const src = photos || state.photos;
  let thumbnail = null;
  let backupPhotos = [];
  if (src.length > 0) {
    thumbnail = await compressImage(src[0].dataUrl, 120, 0.5);
    const results = await Promise.all(
      src.slice(0, HISTORY_PHOTO_MAX).map(p => compressImage(p.dataUrl, HISTORY_PHOTO_SIZE, HISTORY_PHOTO_QUALITY))
    );
    backupPhotos = results.filter(Boolean);
  }
  state.history.unshift({
    listing,
    date: new Date().toISOString(),
    id: crypto.randomUUID(),
    thumbnail,
    photos: backupPhotos,
  });
  state.history = state.history.slice(0, 30);
  persistHistory();
  renderHistory();
}

function renderHistory() {
  const list = $('history-list');
  const entries = state.history.filter(h => h && h.listing);
  if (entries.length === 0) {
    list.innerHTML = '<p class="history-empty">Aucune annonce pour l\'instant</p>';
    $('history-clear').hidden = true;
    return;
  }
  $('history-clear').hidden = false;
  list.innerHTML = entries.map(h => {
    const dateStr = new Date(h.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    const thumbHtml = h.thumbnail
      ? `<img class="history-thumb" src="${escapeHtml(h.thumbnail)}" alt="" />`
      : '<div class="history-thumb-placeholder">👟</div>';
    const badge = h.isDemo ? '<span class="history-item-badge">Exemple</span>' : '';
    return `<button type="button" class="history-item" data-id="${escapeHtml(h.id)}">
      ${thumbHtml}
      <span class="history-item-info">
        <span class="history-item-title">${escapeHtml(h.listing.title || '(sans titre)')}</span>
        <span class="history-item-date">${dateStr}</span>
        ${badge}
      </span>
    </button>`;
  }).join('');

  list.querySelectorAll('.history-item').forEach(el => {
    el.addEventListener('click', () => {
      const item = state.history.find(h => h.id === el.dataset.id);
      if (!item) return;
      historyModal.hidden = true;
      uploadSection.style.display = 'none';
      chatSection.hidden = true;
      bulkSection.hidden = true;
      renderListing(item.listing, item.photos);
      resultSection.hidden = false;
    });
  });
}

// Annonce d'exemple, pour voir un résultat sans clé API

const DEMO_ID = 'demo-clarks-craftmaster-v3';
const DEMO_PHOTOS = [
  'demo/clarks-1.jpg',
  'demo/clarks-2.jpg',
  'demo/clarks-3.jpg',
  'demo/clarks-4.jpg',
];

function seedDemoListing() {
  if (localStorage.getItem('av-demo-seeded') === DEMO_ID && state.history.some(h => h.id === DEMO_ID)) return;
  state.history = state.history.filter(h => !h.isDemo);
  state.history.push({
    id: DEMO_ID,
    date: '2026-05-01T09:00:00.000Z',
    isDemo: true,
    thumbnail: DEMO_PHOTOS[0],
    photos: DEMO_PHOTOS,
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
  });
  persistHistory();
  localStorage.setItem('av-demo-seeded', DEMO_ID);
}

seedDemoListing();
renderHistory();
