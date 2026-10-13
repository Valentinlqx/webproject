// AutoVinted : des photos à l'annonce Vinted. Tout tourne dans le navigateur,
// la clé API de l'utilisateur ne quitte jamais sa machine (sauf vers son fournisseur).
// La partie « API » est dans autovinted-core.js, les textes dans i18n.js.

const {
  PROVIDERS, detectProvider, resolveModel, estimateCost,
  parseJSON, buildRequest, extractText, apiErrorMessage, migrateLegacyKey,
  setLang: setCoreLang, message: coreMessage,
} = window.AutoVintedCore;

// Les modèles récents réfléchissent avant de répondre, et cette réflexion compte
// dans la limite : une limite trop basse donne une réponse coupée.
const MAX_OUTPUT_TOKENS = 16000;

const MAX_PHOTOS_SINGLE = 8;
const MAX_PHOTOS_BULK = 30;
const MAX_PHOTO_SIZE = 1024; // px, on réduit avant l'envoi : moins cher et plus rapide
const JPEG_QUALITY = 0.8;

const $ = (id) => document.getElementById(id);
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));

// En navigation privée, localStorage peut lever une erreur : l'app doit marcher quand même.
const store = {
  getItem(k) { try { return localStorage.getItem(k); } catch { return null; } },
  setItem(k, v) { try { localStorage.setItem(k, v); } catch (err) { if (err.name === 'QuotaExceededError') throw err; } },
  removeItem(k) { try { localStorage.removeItem(k); } catch { /* rien à effacer */ } },
};

function readJSON(key, fallback) {
  try {
    const value = JSON.parse(store.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

migrateLegacyKey(store);

let lang = SiteLang.get();
const T = () => window.AV_TEXT[lang];
setCoreLang(lang);

const state = {
  photos: [],        // [{ id, dataUrl }]
  conversation: [],  // format « chat » OpenAI, converti par le core pour chaque fournisseur
  mode: 'single',    // 'single' | 'bulk'
  context: '',
  history: Array.isArray(readJSON('av-history', [])) ? readJSON('av-history', []) : [],
  lastListing: null,
  lastPhotos: null,
  features: null,
  busy: false,
};

const maxPhotos = () => state.mode === 'bulk' ? MAX_PHOTOS_BULK : MAX_PHOTOS_SINGLE;

// Retourne { providerId, key, model } ou null si aucune clé valable n'est enregistrée.
function currentSetup() {
  const key = (store.getItem('av-key') || '').trim();
  const detected = detectProvider(key);
  if (!detected.ok) return null;
  return { providerId: detected.id, key, model: resolveModel(detected.id, store.getItem('av-model')) };
}

function formatEuro(eur) {
  if (eur < 0.005) return '< 0,01 €';
  const n = eur.toFixed(eur < 1 ? 3 : 2);
  return `≈ ${lang === 'fr' ? n.replace('.', ',') : n} €`;
}

const modelLabel = m => m.tag ? `${m.label} (${T()[m.tag]})` : m.label;

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

function loadFeatures() {
  const saved = readJSON('av-features', {});
  return { ...DEFAULT_FEATURES, ...(saved && typeof saved === 'object' ? saved : {}) };
}
function saveFeatures(f) { store.setItem('av-features', JSON.stringify(f)); }
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
  if (T().listingLanguage) parts.push(T().listingLanguage);

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
  if (T().listingLanguage) parts.push(T().listingLanguage);

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
    throw new Error(coreMessage('network'));
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
  const tokens = `≈ ${(usage.inTokens + usage.outTokens).toLocaleString(lang)} tokens`;
  el.textContent = usage.eur === null ? tokens : `${tokens} · ${formatEuro(usage.eur)}`;
  el.hidden = false;
}

// Dit, avant l'envoi, où partent les photos.
function updatePrivacyNote() {
  const setup = currentSetup();
  $('privacy-note').textContent = T().privacyNote(setup && PROVIDERS[setup.providerId].label);
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

// Langue

function applyStaticTexts() {
  const t = T();
  document.documentElement.lang = lang;
  document.title = t.title;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t[el.dataset.i18n]; });
  document.querySelectorAll('[data-i18n-label]').forEach(el => el.setAttribute('aria-label', t[el.dataset.i18nLabel]));
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t[el.dataset.i18nPlaceholder]; });

  // Le bouton est dit dans la langue vers laquelle il bascule (lecteurs d'écran : bonne voix).
  $('lang-short').textContent = lang === 'fr' ? 'EN' : 'FR';
  $('lang-label').textContent = t.switchLang;
  $('lang-label').lang = lang === 'fr' ? 'en' : 'fr';

  // Sur GitHub Pages, lastModified = date du dernier déploiement : pratique pour vérifier qu'un push est en ligne.
  $('last-updated').textContent = t.updated(new Date(document.lastModified).toLocaleString(lang, { dateStyle: 'short', timeStyle: 'short' }));
}

function applyLang() {
  applyStaticTexts();
  setCoreLang(lang);
  syncTheme();
  applyModeTexts();
  updateAnalyzeBtnLabel();
  updateEstimate();
  updatePrivacyNote();
  fillSettings();
  renderHistory();
  renderPreviews();
  buildTutorialDots();
  if (state.lastListing && !resultSection.hidden) renderListing(state.lastListing, state.lastPhotos, false);
}

$('lang-toggle').addEventListener('click', () => {
  lang = lang === 'fr' ? 'en' : 'fr';
  SiteLang.set(lang);
  applyLang();
});

// Thème : clair ou sombre, retenu ; sinon celui de l'appareil (script en tête de page).

function syncTheme() {
  const isDark = document.body.classList.contains('dark');
  $('theme-icon').textContent = isDark ? '☀️' : '🌙';
  $('theme-toggle').setAttribute('aria-label', isDark ? T().themeToLight : T().themeToDark);
}

$('theme-toggle').addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  store.setItem('av-theme', isDark ? 'dark' : 'light');
  syncTheme();
});

// Messages courts : la zone reste dans la page (role=status) pour que chaque message soit lu.
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.textContent = ''; }, 3200);
}

// Pendant l'analyse, le bouton garde le focus : aria-disabled plutôt que disabled,
// sinon le focus tombe au début de la page.
function setBtnLoading(btn, loading, label) {
  btn.dataset.loading = loading ? '1' : '';
  btn.setAttribute('aria-disabled', String(loading));
  btn.querySelector('.btn-label').textContent = label;
  btn.querySelector('.btn-spinner').hidden = !loading;
}

function copyText(text) {
  return navigator.clipboard.writeText(text).catch(() => {
    showToast(T().copyFailed);
    throw new Error('clipboard');
  });
}

function flashCopied(btn) {
  const original = btn.textContent;
  btn.textContent = `✓ ${T().copied}`;
  btn.classList.add('done');
  showToast(T().copied);
  setTimeout(() => { btn.textContent = original; btn.classList.remove('done'); }, 1500);
}

// Après une étape, le focus va au titre de ce qui vient d'apparaître.
function focusHeading(id) {
  const heading = $(id);
  heading.focus({ preventScroll: true });
  heading.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}

// Photos

$('add-photos').addEventListener('click', () => fileInput.click());

['dragenter', 'dragover'].forEach(evt =>
  dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.add('drag'); })
);
['dragleave', 'drop'].forEach(evt =>
  dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.remove('drag'); })
);
dropzone.addEventListener('drop', (e) => {
  addPhotos([...e.dataTransfer.files].filter(f => f.type.startsWith('image/') || isHeic(f)));
});

fileInput.addEventListener('change', async () => {
  await addPhotos([...fileInput.files]);
  fileInput.value = ''; // sinon re-choisir la même photo ne déclenche rien
});

async function addPhotos(files) {
  const room = maxPhotos() - state.photos.length;
  if (files.length > room) showToast(T().maxPhotos(maxPhotos()));

  let unreadable = 0;
  for (const file of files.slice(0, room)) {
    const dataUrl = await downscaleImage(file, MAX_PHOTO_SIZE);
    if (dataUrl) state.photos.push({ id: uid(), dataUrl });
    else unreadable++;
  }
  if (unreadable) showToast(T().unreadable(unreadable));
  renderPreviews();
}

// Windows donne souvent un type vide aux HEIC, d'où le test sur l'extension.
function isHeic(file) {
  return /image\/hei[cf]/.test(file.type) || /\.hei[cf]$/i.test(file.name);
}

// Seul Safari sait lire le HEIC des iPhone : ailleurs on le convertit en JPEG.
// heic2any pèse 1,3 Mo, on ne le charge qu'au premier HEIC.
let heicLib;
function loadHeicLib() {
  heicLib = heicLib || new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'vendor/heic2any.min.js'; // copié dans le site : aucun appel à un autre serveur
    s.onload = () => resolve(window.heic2any);
    s.onerror = () => { heicLib = null; reject(new Error('heic2any')); };
    document.head.appendChild(s);
  });
  return heicLib;
}

// Renvoie null si l'image reste illisible (fichier abîmé, format inconnu…).
async function downscaleImage(file, maxSide) {
  const dataUrl = await drawScaled(file, maxSide);
  if (dataUrl || !isHeic(file)) return dataUrl;
  try {
    const heic2any = await loadHeicLib();
    const jpeg = await heic2any({ blob: file, toType: 'image/jpeg', quality: JPEG_QUALITY });
    return drawScaled(Array.isArray(jpeg) ? jpeg[0] : jpeg, maxSide);
  } catch {
    return null;
  }
}

function drawScaled(blob, maxSide) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
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
  previews.replaceChildren(...state.photos.map((p, i) => {
    const el = document.createElement('div');
    el.className = 'preview';
    const img = document.createElement('img');
    img.src = p.dataUrl;
    img.alt = '';
    const remove = document.createElement('button');
    remove.className = 'preview-remove';
    remove.type = 'button';
    remove.setAttribute('aria-label', T().removePhoto(i + 1));
    remove.innerHTML = '<span aria-hidden="true">✕</span>';
    remove.addEventListener('click', () => {
      state.photos = state.photos.filter(x => x.id !== p.id);
      renderPreviews();
      // La photo retirée emporte le focus : on le rend à la suivante, ou au bouton d'ajout.
      (previews.querySelectorAll('.preview-remove')[i] || previews.querySelector('.preview-remove:last-of-type') || $('add-photos')).focus();
    });
    el.append(img, remove);
    return el;
  }));
  analyzeBtn.disabled = state.photos.length === 0;
  updateAnalyzeBtnLabel();
  updateEstimate();
}

// Analyse d'un seul article

function requireSetup() {
  if (currentSetup()) return true;
  showToast(T().needKey);
  openSettings(analyzeBtn);
  return false;
}

analyzeBtn.addEventListener('click', async () => {
  if (analyzeBtn.dataset.loading || state.photos.length === 0 || !requireSetup()) return;

  if (state.mode === 'bulk') {
    await runBulk();
    return;
  }

  setBtnLoading(analyzeBtn, true, T().analyzing);
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
    showToast(T().error(err.message));
    setBtnLoading(analyzeBtn, false, T().analyze);
  }
});

// Mode une annonce / en lot

const modeBtns = document.querySelectorAll('.mode-btn');

function applyModeTexts() {
  const bulk = state.mode === 'bulk';
  $('dropzone-sub').textContent = bulk ? T().dropSubBulk(MAX_PHOTOS_BULK) : T().dropSubSingle(MAX_PHOTOS_SINGLE);
  $('context-hint').textContent = bulk ? T().contextHintBulk : T().contextHintSingle;
}

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    if (mode === state.mode) return;
    state.mode = mode;
    modeBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.mode === mode);
      b.setAttribute('aria-pressed', String(b.dataset.mode === mode));
    });
    // On repasse à 8 photos max : on garde les 8 premières.
    if (mode === 'single' && state.photos.length > MAX_PHOTOS_SINGLE) {
      state.photos = state.photos.slice(0, MAX_PHOTOS_SINGLE);
      showToast(T().keptFirst(MAX_PHOTOS_SINGLE));
      renderPreviews();
    }
    applyModeTexts();
    updateAnalyzeBtnLabel();
    updateEstimate();
  });
});

function updateAnalyzeBtnLabel() {
  if (analyzeBtn.dataset.loading) return;
  const label = analyzeBtn.querySelector('.btn-label');
  label.textContent = state.mode === 'bulk' ? T().bulkGenerate(state.photos.length) : T().analyze;
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

  uploadSection.hidden = true;
  bulkSection.hidden = false;
  bulkResults.replaceChildren();
  bulkProgress.hidden = false;
  bulkActions.hidden = true;
  bulkProgressText.textContent = T().bulkWorking(total);
  bulkProgressFill.style.width = '15%';
  focusHeading('bulk-heading');

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
    if (listings.length === 0) throw new Error(resp.message || T().bulkNone);

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
    showToast(T().bulkFound(listings.length));
  } catch (err) {
    bulkProgress.hidden = true;
    const box = document.createElement('p');
    box.className = 'bulk-error';
    box.textContent = T().error(err.message);
    bulkResults.replaceChildren(box);
    bulkActions.hidden = false;
    showToast(T().error(err.message));
  }
}

// Chaque article : un titre qui est un bouton (ouvre/ferme), le détail en dessous.
function createBulkCard(photos, index) {
  const n = index + 1;
  const el = document.createElement('div');
  el.className = 'bulk-item';
  el.innerHTML = `
    <div class="bulk-item-head">
      <h3 class="bulk-item-heading">
        <button class="bulk-item-toggle" type="button" aria-expanded="false" aria-controls="bulk-body-${n}">
          <img class="bulk-item-thumb" src="${photos[0]?.dataUrl || ''}" alt="" />
          <span class="bulk-item-info">
            <span class="bulk-item-title">${escapeHtml(T().bulkItem(n))}</span>
            <span class="bulk-item-meta">${escapeHtml(T().bulkPhotos(photos.length))}</span>
          </span>
          <span class="bulk-item-status"><span class="spinner-sm" aria-hidden="true"></span></span>
        </button>
      </h3>
      <button class="bulk-item-delete" type="button"><span aria-hidden="true">✕</span></button>
    </div>
    <div class="bulk-item-body" id="bulk-body-${n}"></div>
  `;
  const toggle = el.querySelector('.bulk-item-toggle');
  const titleEl = el.querySelector('.bulk-item-title');
  const metaEl = el.querySelector('.bulk-item-meta');
  const statusEl = el.querySelector('.bulk-item-status');
  const bodyEl = el.querySelector('.bulk-item-body');
  const del = el.querySelector('.bulk-item-delete');
  del.setAttribute('aria-label', T().bulkDelete(n, T().bulkItem(n)));

  del.addEventListener('click', () => {
    const next = el.nextElementSibling || el.previousElementSibling;
    el.remove();
    (next ? next.querySelector('.bulk-item-toggle') : $('bulk-heading')).focus();
  });

  toggle.addEventListener('click', () => {
    if (bodyEl.children.length === 0) return;
    const open = el.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  return {
    el,
    fillListing(l) {
      const hasWarn = Array.isArray(l.warnings) && l.warnings.filter(Boolean).length > 0;
      const title = l.title || T().bulkItem(n);
      const warnBadge = hasWarn ? `<span class="bulk-item-warn" aria-hidden="true">⚠</span><span class="visually-hidden">${escapeHtml(T().bulkWarn)} : </span>` : '';
      titleEl.innerHTML = `<span class="bulk-item-num">#${n}</span> ${warnBadge} ${escapeHtml(title)}`;
      metaEl.textContent = `${l.prices?.ideal || '—'} • ${l.details?.etat || '—'} • ${T().bulkPhotos(photos.length)}`;
      statusEl.className = 'bulk-item-status done' + (hasWarn ? ' has-warn' : '');
      statusEl.innerHTML = `<span aria-hidden="true">${hasWarn ? '⚠ ' : '✓ '}<span class="bulk-chevron">▾</span></span>`;
      del.setAttribute('aria-label', T().bulkDelete(n, title));
      bodyEl.innerHTML = renderBulkBody(l, photos);
      bindBulkBodyActions(bodyEl, l);
    },
  };
}

function detailsList(details) {
  return Object.entries(T().details)
    .filter(([k]) => details[k])
    .map(([k, label]) => `<li><strong>${label}</strong>${escapeHtml(details[k])}</li>`).join('');
}

function pricesList(p) {
  const t = T();
  return [[t.priceIdeal, p.ideal], [t.priceFast, p.rapide], [t.priceMin, p.minimum]]
    .map(([label, value]) => `<div class="price-cell"><dt class="price-cell-label">${label}</dt><dd class="price-cell-value">${escapeHtml(value || '—')}</dd></div>`)
    .join('');
}

function warningsBox(warnings) {
  return `<h4 class="result-warnings-head"><span aria-hidden="true">⚠ </span>${escapeHtml(T().warningsHead)}</h4>
    <ul>${warnings.map(w => `<li>${escapeHtml(w)}</li>`).join('')}</ul>
    <p class="result-warnings-foot">${escapeHtml(T().warningsFoot)}</p>`;
}

function renderBulkBody(l, photos) {
  const t = T();
  const f = state.features;
  const tips = f.tips ? (l.tips || []).map(tip => `<li>${escapeHtml(tip)}</li>`).join('') : '';
  const details = f.details ? detailsList(l.details || {}) : '';

  const thumbs = photos.length > 1
    ? `<div class="bulk-item-thumbs">${photos.map(ph => `<img src="${ph.dataUrl}" alt="">`).join('')}</div>`
    : '';

  const warnings = (f.warnings && Array.isArray(l.warnings)) ? l.warnings.filter(Boolean) : [];
  const warningsHtml = warnings.length ? `<div class="result-warnings">${warningsBox(warnings)}</div>` : '';

  return `
    ${thumbs}
    ${warningsHtml}
    <div class="result-block">
      <div class="result-block-head">
        <h4 class="result-label">${t.labelTitle}</h4>
        <button class="copy-btn" type="button" data-bcopy="title" aria-label="${escapeHtml(t.copyTitle)}">${t.copy}</button>
      </div>
      <p class="result-title">${escapeHtml(l.title || '')}</p>
    </div>
    <div class="result-block">
      <div class="result-block-head">
        <h4 class="result-label">${t.labelDescription}</h4>
        <button class="copy-btn" type="button" data-bcopy="description" aria-label="${escapeHtml(t.copyDescription)}">${t.copy}</button>
      </div>
      <p class="result-description">${escapeHtml(l.description || '')}</p>
    </div>
    ${details ? `<div class="result-block"><h4 class="result-label">${t.labelDetails}</h4><ul class="result-details">${details}</ul></div>` : ''}
    ${f.prices ? `<div class="result-block">
      <h4 class="result-label">${t.labelPrices}</h4>
      <dl class="price-grid">${pricesList(l.prices || {})}</dl>
    </div>` : ''}
    ${tips ? `<div class="result-block"><h4 class="result-label">${t.labelTips}</h4><ul class="result-tips">${tips}</ul></div>` : ''}
    <div class="result-actions"><button class="btn-ghost" type="button" data-bcopy="all">${t.copyAll}</button></div>
  `;
}

function bindBulkBodyActions(bodyEl, listing) {
  bodyEl.querySelectorAll('[data-bcopy]').forEach(btn => {
    btn.addEventListener('click', () => {
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
    const lines = Object.entries(T().details).filter(([k]) => d[k]).map(([k, label]) => `— ${label} : ${d[k]}`);
    if (lines.length) out += '\n\n' + lines.join('\n');
  }
  if (f.prices && l.prices?.ideal) out += `\n\n${T().fullListingPrice} : ${l.prices.ideal}`;
  return out;
}

$('bulk-copy-all-btn').addEventListener('click', () => {
  const texts = [...bulkResults.querySelectorAll('.bulk-item')]
    .map(el => bulkListings.get(el))
    .filter(Boolean)
    .map((l, i) => `━━━ ${T().bulkItem(i + 1)} ━━━\n${l.title || ''}\n\n${l.description || ''}`);
  if (texts.length === 0) { showToast(T().nothingToCopy); return; }
  copyText(texts.join('\n\n\n')).then(() => showToast(T().copiedListings(texts.length)), () => {});
});

function doRestart() {
  state.photos = [];
  state.conversation = [];
  state.lastListing = null;
  state.lastPhotos = null;
  state.context = '';
  $('context-input').value = '';
  renderPreviews();
  chatMessages.replaceChildren();
  resultSection.hidden = true;
  chatSection.hidden = true;
  generateBtn.hidden = true;
  bulkResults.replaceChildren();
  bulkSection.hidden = true;
  bulkActions.hidden = true;
  uploadSection.hidden = false;
  setBtnLoading(analyzeBtn, false, T().analyze);
  updateAnalyzeBtnLabel();
  analyzeBtn.disabled = true;
  focusHeading('photos-heading');
}

function isOnUploadView() {
  return !uploadSection.hidden;
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
  await sendUserMessage(T().generateNowMessage);
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
    addBubble('ai', T().error(err.message));
  } finally {
    state.busy = false;
  }
}

function addBubble(type, text = '') {
  const el = document.createElement('div');
  el.className = 'bubble ' + type;
  if (type === 'thinking') {
    el.innerHTML = `<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span><span class="visually-hidden">${escapeHtml(T().thinking)}</span>`;
  } else {
    el.textContent = text;
  }
  chatMessages.appendChild(el);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return el;
}

function handleAIResponse(resp) {
  const fromUpload = isOnUploadView();
  if (fromUpload) {
    uploadSection.hidden = true;
    chatSection.hidden = false;
    setBtnLoading(analyzeBtn, false, T().analyze);
  }

  if (resp.action === 'generate' && resp.listing) {
    chatSection.hidden = true;
    resultSection.hidden = false;
    renderListing(resp.listing, state.photos.map(p => p.dataUrl));
    saveToHistory(resp.listing).catch(() => {});
  } else {
    addBubble('ai', resp.message || T().unexpected);
    generateBtn.hidden = resp.action !== 'ask';
    if (fromUpload) focusHeading('chat-heading');
  }
}

// Résultat

function renderListing(listing, photos = null, moveFocus = true) {
  const t = T();
  state.lastListing = listing;
  state.lastPhotos = photos;

  // Chaque photo est un bouton qui l'agrandit.
  const photosEl = $('r-photos');
  if (photos && photos.length) {
    photosEl.innerHTML = photos.map((src, i) =>
      `<button type="button" class="result-photo-btn" aria-label="${escapeHtml(t.zoomPhoto(i + 1))}"><img class="result-photo" src="${escapeHtml(src)}" alt="${escapeHtml(t.photoAlt(i + 1))}" loading="lazy" /></button>`
    ).join('');
    photosEl.hidden = false;
  } else {
    photosEl.replaceChildren();
    photosEl.hidden = true;
  }

  $('r-title').textContent = listing.title || '';
  $('r-description').textContent = listing.description || '';

  const f = state.features;
  const detailsHtml = detailsList(listing.details || {});
  $('r-details').innerHTML = detailsHtml;
  $('r-details-block').hidden = !f.details || !detailsHtml;

  const prices = listing.prices || {};
  $('r-prices').innerHTML = pricesList(prices);
  $('r-prices-block').hidden = !(f.prices && (prices.ideal || prices.rapide || prices.minimum));

  const tips = Array.isArray(listing.tips) ? listing.tips : [];
  $('r-tips').innerHTML = tips.map(tip => `<li>${escapeHtml(tip)}</li>`).join('');
  $('r-tips-block').hidden = !(f.tips && tips.length);

  const warnings = (f.warnings && Array.isArray(listing.warnings)) ? listing.warnings.filter(Boolean) : [];
  const warnEl = $('r-warnings');
  warnEl.innerHTML = warnings.length ? warningsBox(warnings) : '';
  warnEl.hidden = !warnings.length;

  // Seule l'annonce d'exemple a un lien source (photos d'un site marchand).
  const srcBlock = $('r-source-block');
  if (listing.sourceLink) {
    $('r-source-link').href = listing.sourceLink;
    srcBlock.hidden = false;
  } else {
    srcBlock.hidden = true;
  }

  if (moveFocus) focusHeading('result-heading');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Photo agrandie : une vraie fenêtre (Échap, bouton Fermer, le focus revient au bouton).
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.result-photo-btn');
  if (!btn) return;
  const img = btn.querySelector('img');
  const box = document.createElement('dialog');
  box.className = 'photo-lightbox';
  box.innerHTML = `<button type="button" class="lightbox-close">${escapeHtml(T().close)}</button><img src="${img.src}" alt="${escapeHtml(img.alt)}" />`;
  box.addEventListener('close', () => { box.remove(); btn.focus(); });
  box.addEventListener('click', (ev) => { if (ev.target === box || ev.target.closest('.lightbox-close')) box.close(); });
  document.body.appendChild(box);
  box.showModal();
});

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.copy-btn[data-copy]');
  if (!btn) return;
  const text = btn.dataset.copy === 'title' ? state.lastListing?.title : state.lastListing?.description;
  if (text) copyText(text).then(() => flashCopied(btn), () => {});
});

$('copy-all-btn').addEventListener('click', () => {
  if (state.lastListing) copyText(formatFullListing(state.lastListing)).then(() => showToast(T().copiedAll), () => {});
});

$('restart-btn').addEventListener('click', doRestart);

// Fenêtres (paramètres, historique). Sur petit écran ce sont des fenêtres modales :
// le focus y entre, y reste, et revient au bouton qui les a ouvertes. Sur grand écran
// (≥ 1180 px) ce sont des panneaux toujours visibles, de simples régions.

const panelLayout = matchMedia('(min-width: 1180px)');
const modals = [$('settings-modal'), $('history-modal')];
let openModal = null;
let modalOpener = null;

function syncModalRoles() {
  for (const modal of modals) {
    const card = modal.querySelector('.modal-card');
    if (panelLayout.matches) {
      card.setAttribute('role', 'region');
      card.removeAttribute('aria-modal');
    } else {
      card.setAttribute('role', 'dialog');
      card.setAttribute('aria-modal', 'true');
    }
  }
}
syncModalRoles();
panelLayout.addEventListener('change', syncModalRoles);

const FOCUSABLE = 'button:not([disabled]):not([hidden]), [href], input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])';

function showModal(modal, opener, focusEl) {
  modal.hidden = false;
  if (panelLayout.matches) {
    (focusEl || modal.querySelector(FOCUSABLE))?.focus();
    return;
  }
  openModal = modal;
  modalOpener = opener || document.activeElement;
  // Le reste de la page devient inerte pendant que la fenêtre est ouverte.
  document.querySelectorAll('header, main, #tutorial-overlay').forEach(el => { el.inert = true; });
  (focusEl || modal.querySelector(FOCUSABLE))?.focus();
}

function hideModal(modal) {
  if (panelLayout.matches) return;
  modal.hidden = true;
  if (openModal !== modal) return;
  openModal = null;
  document.querySelectorAll('header, main, #tutorial-overlay').forEach(el => { el.inert = false; });
  if (modalOpener && modalOpener.isConnected) modalOpener.focus();
  modalOpener = null;
}

// Tab ne sort pas de la fenêtre ouverte.
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (openModal) hideModal(openModal);
    else if (!tutorialOverlay.hidden) closeTutorial();
    return;
  }
  if (e.key !== 'Tab' || !openModal) return;
  const items = [...openModal.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

modals.forEach(modal => modal.addEventListener('click', (e) => { if (e.target === modal) hideModal(modal); }));

// Paramètres : une seule clé, le fournisseur est deviné à partir de son préfixe

const settingsModal = $('settings-modal');
const apiKeyInput = $('api-key');
const keyStatus = $('key-status');
const modelPicker = $('model-picker');
const modelSelect = $('model-select');

$('key-links').innerHTML = Object.values(PROVIDERS)
  .map(p => `<a href="${p.keyUrl}" target="_blank" rel="noopener noreferrer">${p.label}</a>`)
  .join(' · ');

let shownProvider = null;

function syncKeyStatus() {
  const detected = detectProvider(apiKeyInput.value);
  keyStatus.classList.toggle('ok', detected.ok);
  keyStatus.classList.toggle('error', !detected.ok && detected.reason !== 'empty');

  if (!detected.ok) {
    keyStatus.textContent = T().keyProblems[detected.reason];
    modelPicker.hidden = true;
    shownProvider = null;
    return;
  }

  const provider = PROVIDERS[detected.id];
  if (shownProvider !== detected.id) {
    modelSelect.innerHTML = provider.models
      .map(m => `<option value="${m.id}">${escapeHtml(modelLabel(m))}</option>`)
      .join('');
    modelSelect.value = resolveModel(detected.id, store.getItem('av-model'));
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
  keyStatus.textContent = `✓ ${T().keyOk(provider.label, modelLabel(model), formatEuro(eur))}`;
}

apiKeyInput.addEventListener('input', syncKeyStatus);
modelSelect.addEventListener('change', syncKeyStatus);

// Des cases à cocher natives (role=switch), dessinées en interrupteurs : clavier et lecteurs d'écran inclus.
function renderFeatureToggles() {
  $('features-list').innerHTML = Object.entries(T().features).map(([key, [label, hint]]) => `
    <label class="feature-toggle">
      <input type="checkbox" role="switch" data-feature="${key}" aria-describedby="feature-hint-${key}" ${state.features[key] ? 'checked' : ''} />
      <span class="feature-toggle-track" aria-hidden="true"><span class="feature-toggle-thumb"></span></span>
      <span class="feature-toggle-text">
        <span class="feature-toggle-label">${label}</span>
        <span class="feature-toggle-hint" id="feature-hint-${key}">${hint}</span>
      </span>
    </label>
  `).join('');
}

function fillSettings() {
  apiKeyInput.value = store.getItem('av-key') || '';
  shownProvider = null;
  syncKeyStatus();
  renderFeatureToggles();
}

function openSettings(opener) {
  fillSettings();
  showModal(settingsModal, opener, apiKeyInput);
}

$('settings-toggle').addEventListener('click', (e) => openSettings(e.currentTarget));
$('settings-close').addEventListener('click', () => hideModal(settingsModal));

$('settings-save').addEventListener('click', () => {
  const key = apiKeyInput.value.trim();
  const detected = detectProvider(key);
  if (key && !detected.ok) {
    showToast(T().keyProblems[detected.reason]);
    apiKeyInput.focus();
    return;
  }
  if (key) {
    store.setItem('av-key', key);
    store.setItem('av-model', modelSelect.value);
  } else {
    store.removeItem('av-key');
    store.removeItem('av-model');
  }

  const features = { ...state.features };
  document.querySelectorAll('#features-list input[data-feature]').forEach(cb => {
    features[cb.dataset.feature] = cb.checked;
  });
  state.features = features;
  saveFeatures(features);

  hideModal(settingsModal);
  showToast(T().saved);
  updateEstimate();
  updatePrivacyNote();
});

// Vie privée : tout ce que l'app garde est dans ce navigateur, et part d'un clic.
$('erase-all').addEventListener('click', () => {
  if (!confirm(T().eraseConfirm)) return;
  ['av-key', 'av-model', 'av-features', 'av-history', 'av-demo-seeded', 'av-theme', 'av-tutorial-seen']
    .forEach(k => store.removeItem(k));
  state.features = loadFeatures();
  state.history = [];
  seedDemoListing();
  fillSettings();
  renderHistory();
  updateEstimate();
  updatePrivacyNote();
  showToast(T().erased);
});

// Tutoriel : il ne s'ouvre plus tout seul, on le propose (bouton « Voir le tour » et « ? »).

const TUTORIAL_STEPS = [
  { target: '.hero',            emoji: '✦',  placement: 'bottom' },
  { target: '.mode-toggle',     emoji: '🔀', placement: 'bottom' },
  { target: '#dropzone',        emoji: '📸', placement: 'bottom' },
  { target: '#context-input',   emoji: '💬', placement: 'top' },
  { target: '#settings-toggle', emoji: '⚙',  placement: 'bottom' },
  { target: '#history-toggle',  emoji: '⌛', placement: 'bottom' },
];

const tutorialOverlay = $('tutorial-overlay');
const tutorialSpotlight = $('tutorial-spotlight');
const tutorialTooltip = $('tutorial-tooltip');
const tutorialTipDots = $('tutorial-tip-dots');
const tutorialTipPrev = $('tutorial-tip-prev');
const tutorialTipNext = $('tutorial-tip-next');
let tutorialStep = 0;
let tutorialOpener = null;

function buildTutorialDots() {
  tutorialTipDots.replaceChildren(...TUTORIAL_STEPS.map((step, i) => {
    const dot = document.createElement('button');
    dot.className = 'tutorial-tip-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', T().step(i + 1, T().steps[i][0]));
    dot.addEventListener('click', () => goToStep(i));
    return dot;
  }));
}

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
  const [title, text] = T().steps[tutorialStep];

  tutorialTipDots.querySelectorAll('.tutorial-tip-dot').forEach((d, idx) => {
    d.classList.toggle('active', idx === tutorialStep);
    if (idx === tutorialStep) d.setAttribute('aria-current', 'step');
    else d.removeAttribute('aria-current');
  });
  $('tutorial-tip-emoji').textContent = step.emoji;
  $('tutorial-tip-title').textContent = title;
  $('tutorial-tip-text').innerHTML = text;
  tutorialTipPrev.hidden = tutorialStep === 0;
  const last = tutorialStep === TUTORIAL_STEPS.length - 1;
  tutorialTipNext.innerHTML = `${escapeHtml(last ? T().start : T().next)} <span aria-hidden="true">${last ? '✦' : '→'}</span>`;

  // Sur grand écran les boutons du haut sont cachés : on montre les panneaux latéraux à la place.
  let selector = step.target;
  let placement = step.placement;
  if (panelLayout.matches) {
    if (selector === '#settings-toggle') { selector = '#settings-modal .modal-card'; placement = 'left'; }
    else if (selector === '#history-toggle') { selector = '#history-modal .modal-card'; placement = 'right'; }
  }
  const target = document.querySelector(selector);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    requestAnimationFrame(() => positionTutorial(target, placement));
  }
}

function openTutorial(opener) {
  tutorialOpener = opener || document.activeElement;
  tutorialOverlay.hidden = false;
  document.querySelectorAll('header, main').forEach(el => { el.inert = true; });
  goToStep(0);
  tutorialTipNext.focus();
}

function closeTutorial() {
  if (tutorialOverlay.hidden) return;
  tutorialOverlay.hidden = true;
  document.querySelectorAll('header, main').forEach(el => { el.inert = false; });
  store.setItem('av-tutorial-seen', '1');
  if (tutorialOpener && tutorialOpener.isConnected) tutorialOpener.focus();
}

// Tab reste dans la bulle du tour.
tutorialTooltip.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const items = [...tutorialTooltip.querySelectorAll('button:not([hidden])')];
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

tutorialTipPrev.addEventListener('click', () => goToStep(tutorialStep - 1));
tutorialTipNext.addEventListener('click', () => {
  if (tutorialStep === TUTORIAL_STEPS.length - 1) closeTutorial();
  else goToStep(tutorialStep + 1);
});
$('tutorial-toggle').addEventListener('click', (e) => openTutorial(e.currentTarget));
$('tour-btn').addEventListener('click', (e) => openTutorial(e.currentTarget));
$('tutorial-tip-close').addEventListener('click', closeTutorial);

// Historique

const historyModal = $('history-modal');
$('history-toggle').addEventListener('click', (e) => { renderHistory(); showModal(historyModal, e.currentTarget); });
$('history-close').addEventListener('click', () => hideModal(historyModal));

$('history-clear').addEventListener('click', () => {
  // L'exemple Clarks reste : c'est la seule façon de voir un résultat sans clé API.
  const demoEntry = state.history.find(h => h.isDemo);
  state.history = demoEntry ? [demoEntry] : [];
  persistHistory();
  if (!demoEntry) {
    store.removeItem('av-demo-seeded');
    seedDemoListing();
  }
  renderHistory();
  showToast(T().historyCleared);
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
  const write = () => store.setItem('av-history', JSON.stringify(state.history));
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
    id: uid(),
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
    list.innerHTML = `<p class="history-empty">${escapeHtml(T().historyEmpty)}</p>`;
    $('history-clear').hidden = true;
    return;
  }
  $('history-clear').hidden = false;
  list.innerHTML = entries.map(h => {
    const dateStr = new Date(h.date).toLocaleDateString(lang, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    const thumbHtml = h.thumbnail
      ? `<img class="history-thumb" src="${escapeHtml(h.thumbnail)}" alt="" width="52" height="52" loading="lazy" decoding="async" />`
      : '<span class="history-thumb-placeholder" aria-hidden="true">👟</span>';
    const badge = h.isDemo ? `<span class="history-item-badge">${escapeHtml(T().example)}</span>` : '';
    return `<button type="button" class="history-item" data-id="${escapeHtml(h.id)}">
      ${thumbHtml}
      <span class="history-item-info">
        <span class="history-item-title">${escapeHtml(h.listing.title || T().untitled)}</span>
        <span class="history-item-date">${dateStr}</span>
        ${badge}
      </span>
    </button>`;
  }).join('');

  list.querySelectorAll('.history-item').forEach(el => {
    el.addEventListener('click', () => {
      const item = state.history.find(h => h.id === el.dataset.id);
      if (!item) return;
      hideModal(historyModal);
      uploadSection.hidden = true;
      chatSection.hidden = true;
      bulkSection.hidden = true;
      resultSection.hidden = false;
      renderListing(item.listing, item.photos);
    });
  });
}

// Annonce d'exemple, pour voir un résultat sans clé API

const DEMO_ID = 'demo-clarks-craftmaster-v4';
const DEMO_PHOTOS = [
  'demo/clarks-1.jpg',
  'demo/clarks-2.jpg',
  'demo/clarks-3.jpg',
  'demo/clarks-4.jpg',
];

function seedDemoListing() {
  if (store.getItem('av-demo-seeded') === DEMO_ID && state.history.some(h => h.id === DEMO_ID)) return;
  state.history = state.history.filter(h => !h.isDemo);
  state.history.push({
    id: DEMO_ID,
    date: '2026-05-01T09:00:00.000Z',
    isDemo: true,
    thumbnail: 'demo/clarks-thumb.jpg', // 104 px : la photo entière pèse 74 Ko pour une vignette de 52 px
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
  store.setItem('av-demo-seeded', DEMO_ID);
}

seedDemoListing();
applyLang();
