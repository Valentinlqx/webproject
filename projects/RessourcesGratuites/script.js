const RG = window.RGCore;
const { families, categories, licenses, resources, checked } = RESOURCES_DATA;
const ctx = RG.makeContext(RESOURCES_DATA);

// En navigation privée, localStorage peut lever une erreur : la page doit marcher quand même.
const store = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* rien à garder */ } },
};

// La langue choisie vaut pour tout le site (lang.js à la racine).
let lang = SiteLang.get();
let state = RG.parseHash(location.hash, ctx);

const i18n = {
  fr: {
    title: 'Ressources Gratuites — Design & Création',
    h1: 'Ressources Gratuites',
    heroSub: 'Des ressources vraiment gratuites pour designers et créateurs, avec la licence de chacune',
    back: 'Retour à l\'accueil',
    skip: 'Aller aux résultats',
    switchLang: 'Switch to English',
    newTab: '(nouvel onglet)',
    pauseMotion: 'Mettre le fond en pause',
    searchLabel: 'Rechercher une ressource',
    searchPlaceholder: 'Police manuscrite, texture papier, bruitage…',
    familiesLabel: 'Familles',
    subcatsLabel: 'Sous-catégories',
    resultsLabel: 'Résultats',
    licensesLabel: 'Licences',
    all: 'Tout',
    noAccount: 'Sans compte',
    account: 'Compte requis',
    guideTitle: 'Comment lire les badges ?',
    guideNote: 'Une licence peut changer : relis toujours celle du site avant de t\'en servir pour un client.',
    reset: 'Tout effacer',
    empty: 'Aucune ressource trouvée',
    visit: 'Visiter →',
    count: n => n === 0 ? 'Aucune ressource' : n === 1 ? '1 ressource' : `${n} ressources`,
    checked: d => `Licences vérifiées le ${d}.`,
    updated: d => `Mis à jour le ${d}`,
    credits: 'Icônes : <a href="https://openmoji.org" target="_blank" rel="noopener noreferrer">OpenMoji</a>, sous licence <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>. Polices : Basteleur (Keussel, Velvetyne) et Coconat (Sara Lavazza, Collletttivo), sous licence SIL OFL.',
  },
  en: {
    title: 'Free Resources — Design & Creation',
    h1: 'Free Resources',
    heroSub: 'Truly free resources for designers and creators, each with its license',
    back: 'Back to home',
    skip: 'Skip to results',
    switchLang: 'Passer en français',
    newTab: '(new tab)',
    pauseMotion: 'Pause the background',
    searchLabel: 'Search a resource',
    searchPlaceholder: 'Script font, paper texture, sound effect…',
    familiesLabel: 'Families',
    subcatsLabel: 'Subcategories',
    resultsLabel: 'Results',
    licensesLabel: 'Licenses',
    all: 'All',
    noAccount: 'No account',
    account: 'Account needed',
    guideTitle: 'How to read the badges?',
    guideNote: 'A license can change: always reread the site\'s own license before using it for a client.',
    reset: 'Clear all',
    empty: 'No resource found',
    visit: 'Visit →',
    count: n => n === 0 ? 'No resources' : n === 1 ? '1 resource' : `${n} resources`,
    checked: d => `Licenses checked on ${d}.`,
    updated: d => `Updated on ${d}`,
    credits: 'Icons: <a href="https://openmoji.org" target="_blank" rel="noopener noreferrer">OpenMoji</a>, under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>. Fonts: Basteleur (Keussel, Velvetyne) and Coconat (Sara Lavazza, Collletttivo), under the SIL OFL.',
  },
};

const t = () => i18n[lang];
const $ = id => document.getElementById(id);
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
};

// Icônes OpenMoji copiées dans icons/ (tools/openmoji-icons.mjs) ; l'emoji du système en secours.
function icon(emoji, className) {
  const img = el('img', className);
  img.src = `icons/${RG.iconCode(emoji)}.svg`;
  img.alt = '';
  img.width = img.height = 56;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.addEventListener('error', () => {
    const span = el('span', `${className} icon-fallback`, emoji);
    span.setAttribute('aria-hidden', 'true');
    img.replaceWith(span);
  }, { once: true });
  return img;
}

const label = item => item[lang];

// Langue

const FLAG_GB = '<svg viewBox="0 0 24 16" shape-rendering="crispEdges"><rect width="24" height="16" fill="#012169"/><rect y="6" width="24" height="4" fill="#fff"/><rect x="10" width="4" height="16" fill="#fff"/><rect y="7" width="24" height="2" fill="#C8102E"/><rect x="11" width="2" height="16" fill="#C8102E"/></svg>';
const FLAG_FR = '<svg viewBox="0 0 24 16" shape-rendering="crispEdges"><rect width="8" height="16" fill="#0055A4"/><rect x="8" width="8" height="16" fill="#F5F5F5"/><rect x="16" width="8" height="16" fill="#EF4135"/></svg>';

function applyLang() {
  const tr = t();
  document.title = tr.title;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = tr[node.dataset.i18n]; });
  document.querySelectorAll('[data-i18n-label]').forEach(node => node.setAttribute('aria-label', tr[node.dataset.i18nLabel]));
  document.querySelectorAll('[data-i18n-placeholder]').forEach(node => { node.placeholder = tr[node.dataset.i18nPlaceholder]; });
  document.querySelectorAll('[data-i18n-html]').forEach(node => { node.innerHTML = tr[node.dataset.i18nHtml]; });

  // Le drapeau montre la langue vers laquelle on bascule.
  $('lang-flag').innerHTML = lang === 'fr' ? FLAG_GB : FLAG_FR;
  const switchLabel = $('lang-label');
  switchLabel.textContent = tr.switchLang;
  switchLabel.lang = lang === 'fr' ? 'en' : 'fr';

  const date = new Date(`${checked}T12:00:00`).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' });
  $('checked').textContent = tr.checked(date);
  // Comme AutoVinted : GitHub Pages date la page de sa dernière mise en ligne.
  const updated = new Date(document.lastModified);
  $('last-updated').textContent = tr.updated(updated.toLocaleString(lang, { dateStyle: 'long', timeStyle: 'short' }));

  buildGuide();
  cards.clear();
}

$('lang-toggle').addEventListener('click', () => {
  lang = lang === 'fr' ? 'en' : 'fr';
  SiteLang.set(lang);
  applyLang();
  render();
});

// Fond animé : on peut l'arrêter (WCAG 2.2.2), et le choix est retenu.

const motionBtn = $('motion-toggle');
function applyMotion(off) {
  document.documentElement.classList.toggle('motion-off', off);
  motionBtn.setAttribute('aria-pressed', String(off));
}
applyMotion(store.get('motion') === 'off');
motionBtn.addEventListener('click', () => {
  const off = !document.documentElement.classList.contains('motion-off');
  store.set('motion', off ? 'off' : 'on');
  applyMotion(off);
});

// Badges de licence

function licenseBadge(id) {
  const lic = ctx.licenseById.get(id);
  const badge = el('span', `badge badge-${id}`);
  badge.append(el('span', 'badge-seal'), el('span', 'badge-label', label(lic)));
  return badge;
}

function buildGuide() {
  const list = $('guide-list');
  list.replaceChildren();
  for (const lic of licenses) {
    const dt = el('dt');
    dt.append(licenseBadge(lic.id));
    list.append(dt, el('dd', null, label(lic.hint)));
  }
}

// Boutons de filtre

function chip(className, text, onClick) {
  const btn = el('button', className);
  btn.type = 'button';
  btn.append(el('span', 'chip-label', text), el('span', 'chip-count'));
  btn.addEventListener('click', onClick);
  return btn;
}

function setChip(btn, active, count) {
  btn.classList.toggle('active', active);
  btn.setAttribute('aria-pressed', String(active));
  btn.querySelector('.chip-count').textContent = count;
  btn.classList.toggle('is-empty', count === 0 && !active);
}

function toggleIn(set, id) {
  const next = new Set(set);
  if (!next.delete(id)) next.add(id);
  return next;
}

function update(patch, animate = true) {
  state = { ...state, ...patch };
  render(animate);
}

// Les boutons sont créés une fois (par langue, ou par famille pour les sous-catégories) puis mis à jour :
// les recréer à chaque clic ferait perdre sa place à qui navigue au clavier.
const built = { lang: null, family: null };

function buildFilters() {
  if (built.lang !== lang) {
    $('families').replaceChildren(...[{ id: '', emoji: '✨', fr: t().all, en: t().all }, ...families].map(fam => {
      const btn = chip('family', label(fam), () => update({ family: state.family === fam.id ? '' : fam.id, cats: new Set() }));
      btn.prepend(icon(fam.emoji, 'family-icon'));
      btn.dataset.family = fam.id;
      return btn;
    }));
    $('licenses').replaceChildren(...licenses.map(lic => {
      const btn = chip(`license-btn badge-${lic.id}`, label(lic), () => update({ licenses: toggleIn(state.licenses, lic.id) }));
      btn.prepend(el('span', 'badge-seal'));
      btn.dataset.license = lic.id;
      btn.title = label(lic.hint);
      return btn;
    }));
  }
  if (built.lang !== lang || built.family !== state.family) {
    const subs = categories.filter(c => c.family === state.family);
    // Une famille d'une seule sous-catégorie n'a rien à affiner.
    $('subcats').hidden = subs.length < 2;
    $('subcats').replaceChildren(...subs.map(cat => {
      const btn = chip('cat-btn', label(cat), () => update({ cats: toggleIn(state.cats, cat.id) }));
      btn.dataset.cat = cat.id;
      return btn;
    }));
  }
  built.lang = lang;
  built.family = state.family;
}

function updateFilters() {
  buildFilters();
  for (const btn of $('families').children) {
    const id = btn.dataset.family;
    setChip(btn, state.family === id, RG.countFamily(resources, state, ctx, lang, id));
  }
  for (const btn of $('subcats').children) {
    const id = btn.dataset.cat;
    setChip(btn, state.cats.has(id), RG.countCat(resources, state, ctx, lang, id));
  }
  for (const btn of $('licenses').children) {
    const id = btn.dataset.license;
    setChip(btn, state.licenses.has(id), RG.countLicense(resources, state, ctx, lang, id));
  }
  const noAccount = $('no-account');
  noAccount.classList.toggle('active', state.noAccount);
  noAccount.setAttribute('aria-pressed', String(state.noAccount));
}

$('no-account').addEventListener('click', () => update({ noAccount: !state.noAccount }));

const search = $('search');
search.value = state.query;
// Pendant la frappe, pas d'animation de distribution : les cartes clignoteraient à chaque lettre.
search.addEventListener('input', () => update({ query: search.value }, false));

function reset() {
  search.value = '';
  update(RG.emptyState());
  // Le bouton cliqué vient de disparaître : on rend la main à la recherche.
  search.focus();
}
document.querySelectorAll('#reset, [data-reset]').forEach(btn => btn.addEventListener('click', reset));

// Cartes, gardées en mémoire par langue : filtrer ne les reconstruit pas.

const cards = new Map();

function createCard(r) {
  const id = `r${resources.indexOf(r)}`;
  const card = el('a', 'card');
  // Nom court pour les lecteurs d'écran : le site, et le fait qu'il s'ouvre dans un nouvel onglet.
  card.setAttribute('aria-labelledby', `${id}-name ${id}-tab`);
  card.setAttribute('aria-describedby', `${id}-desc ${id}-legal`);
  card.href = r.url;
  card.target = '_blank';
  card.rel = 'noopener noreferrer';
  card.dataset.cats = r.cats.join(',');
  card.dataset.license = r.license;

  const top = el('div', 'card-top');
  const tags = el('div', 'card-tags');
  for (const id of r.cats) tags.append(el('span', 'card-tag', label(ctx.catById.get(id))));
  top.append(icon(r.emoji, 'card-emoji'), tags);

  const footer = el('div', 'card-footer');
  const legal = el('div', 'card-legal');
  legal.id = `${id}-legal`;
  legal.append(licenseBadge(r.license), el('span', 'license-name', r.licenseName));
  if (r.account) legal.append(el('span', 'account-tag', t().account));
  const visit = el('span', 'card-visit', t().visit);
  visit.setAttribute('aria-hidden', 'true');
  const tab = el('span', 'visually-hidden', t().newTab);
  tab.id = `${id}-tab`;
  footer.append(legal, visit, tab);

  const name = el('h2', 'card-name', r.name);
  name.id = `${id}-name`;
  const desc = el('p', 'card-desc', r.desc[lang]);
  desc.id = `${id}-desc`;
  card.append(top, name, desc, footer);
  return card;
}

function cardFor(r) {
  if (!cards.has(r)) cards.set(r, createCard(r));
  return cards.get(r);
}

// Le nombre de résultats est lu par les lecteurs d'écran : pendant la frappe,
// on attend une pause pour ne pas l'annoncer à chaque lettre.
let countTimer;
function showCount(n, now) {
  clearTimeout(countTimer);
  const write = () => { $('count').textContent = t().count(n); };
  if (now) write();
  else countTimer = setTimeout(write, 400);
}

function render(animate = true) {
  const filtered = RG.filterResources(resources, state, ctx, lang);
  updateFilters();

  const hash = RG.buildHash(state);
  history.replaceState(null, '', hash || location.pathname + location.search);

  const grid = $('grid');
  grid.classList.toggle('dealing', animate);
  grid.replaceChildren(...filtered.map((r, i) => {
    const card = cardFor(r);
    // Décalage plafonné : sur une grande grille, les dernières cartes n'attendent pas.
    card.style.animationDelay = `${Math.min(i, 8) * 20}ms`;
    return card;
  }));

  showCount(filtered.length, animate);
  // L'écran vide a déjà son propre bouton.
  $('reset').hidden = !hash || filtered.length === 0;
  $('empty').hidden = filtered.length > 0;
}

// Un lien partagé ouvert dans un onglet déjà sur la page, ou le bouton « précédent ».
addEventListener('hashchange', () => {
  state = RG.parseHash(location.hash, ctx);
  search.value = state.query;
  render();
});

applyLang();
render();
