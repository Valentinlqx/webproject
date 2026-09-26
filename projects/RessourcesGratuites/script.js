const { filterResources, countWith, parseHash, buildHash } = window.RGCore;
const { categories, resources } = RESOURCES_DATA;

let selectedCats = new Set();
let lang = localStorage.getItem('lang') === 'en' ? 'en' : 'fr';

const i18n = {
  fr: {
    title: 'Ressources Gratuites — Design & Création',
    h1: 'Ressources Gratuites',
    heroSub: 'Une encyclopédie d\'outils et ressources pour designers & créateurs',
    empty: 'Aucune ressource trouvée',
    visit: 'Visiter →',
    freemium: 'Peut contenir des ressources payantes',
    cats: {
      images: 'Images', polices: 'Polices', icones: 'Icônes', illustrations: 'Illustrations',
      couleurs: 'Couleurs', design: 'Design', sons: 'Sons', musiques: 'Musiques',
      mockups: 'Mockups', jeux: 'Jeux Vidéos', web: 'Web', video: 'Vidéo',
      textures: 'Textures', brushes: 'Brushes', png: 'PNG', ia: 'Outils IA',
      outils: 'Outils', tutos: 'Tutos', inspi: 'Inspiration', motion: 'Motion Design',
      '3d': '3D Assets', opensource: 'Open Source', 'ai-skills': 'Skills IA',
    },
  },
  en: {
    title: 'Free Resources — Design & Creation',
    h1: 'Free Resources',
    heroSub: 'An encyclopedia of tools and resources for designers & creators',
    empty: 'No resource found',
    visit: 'Visit →',
    freemium: 'May contain paid resources',
    cats: {
      images: 'Images', polices: 'Fonts', icones: 'Icons', illustrations: 'Illustrations',
      couleurs: 'Colors', design: 'Design', sons: 'Sounds', musiques: 'Music',
      mockups: 'Mockups', jeux: 'Video Games', web: 'Web', video: 'Video',
      textures: 'Textures', brushes: 'Brushes', png: 'PNG', ia: 'AI Tools',
      outils: 'Tools', tutos: 'Tutorials', inspi: 'Inspiration', motion: 'Motion Design',
      '3d': '3D Assets', opensource: 'Open Source', 'ai-skills': 'AI Skills',
    },
  },
};

// Emojis dessinés par OpenMoji (même style partout), avec l'emoji système en secours.

// Quelques glyphes n'existent pas chez OpenMoji : on prend le plus proche.
const OPENMOJI_FALLBACKS = { '✦': '✨' };

function openmojiUrl(emoji) {
  const code = [...(OPENMOJI_FALLBACKS[emoji] || emoji)]
    .map(c => c.codePointAt(0))
    .filter(cp => cp !== 0xFE0F) // OpenMoji nomme ses fichiers sans le sélecteur de variante
    .map(cp => cp.toString(16).toUpperCase().padStart(4, '0'))
    .join('-');
  return `https://cdn.jsdelivr.net/npm/openmoji@latest/color/svg/${code}.svg`;
}

function emojiImage(emoji, className) {
  const img = document.createElement('img');
  img.className = className;
  img.src = openmojiUrl(emoji);
  img.alt = '';
  img.setAttribute('aria-hidden', 'true');
  img.addEventListener('error', () => {
    const span = document.createElement('span');
    span.className = `${className} ${className}-fallback`;
    span.setAttribute('aria-hidden', 'true');
    span.textContent = emoji;
    img.replaceWith(span);
  }, { once: true });
  return img;
}

// "🖼️ Images" → "🖼️"
function leadingEmoji(label) {
  const m = label.match(/^([^\p{L}\p{N}\s]+)\s/u);
  return m ? m[1] : '';
}

function catLabel(id) {
  return i18n[lang].cats[id] || categories.find(c => c.id === id)?.label || id;
}

// Langue

const FLAG_GB = '<svg viewBox="0 0 24 16" shape-rendering="crispEdges" aria-hidden="true">'
  + '<rect width="24" height="16" fill="#012169"/>'
  + '<rect x="0" y="6" width="24" height="4" fill="#ffffff"/>'
  + '<rect x="10" y="0" width="4" height="16" fill="#ffffff"/>'
  + '<rect x="0" y="7" width="24" height="2" fill="#C8102E"/>'
  + '<rect x="11" y="0" width="2" height="16" fill="#C8102E"/>'
  + '</svg>';
const FLAG_FR = '<svg viewBox="0 0 24 16" shape-rendering="crispEdges" aria-hidden="true">'
  + '<rect x="0" y="0" width="8" height="16" fill="#0055A4"/>'
  + '<rect x="8" y="0" width="8" height="16" fill="#F5F5F5"/>'
  + '<rect x="16" y="0" width="8" height="16" fill="#EF4135"/>'
  + '</svg>';

function applyLang() {
  const t = i18n[lang];
  document.title = t.title;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if (t[el.dataset.i18n]) el.textContent = t[el.dataset.i18n];
  });

  // Le drapeau montre la langue vers laquelle on bascule.
  document.getElementById('lang-flag').innerHTML = lang === 'fr' ? FLAG_GB : FLAG_FR;
  const label = lang === 'fr' ? 'Switch to English' : 'Passer en français';
  const btn = document.getElementById('lang-toggle');
  btn.title = label;
  btn.setAttribute('aria-label', label);
}

document.getElementById('lang-toggle').addEventListener('click', () => {
  lang = lang === 'fr' ? 'en' : 'fr';
  localStorage.setItem('lang', lang);
  applyLang();
  render();
});

// Catégories

const categoriesEl = document.getElementById('categories');

categories.forEach(cat => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'cat-btn';
  btn.dataset.cat = cat.id;
  const emoji = leadingEmoji(cat.label);
  if (emoji) btn.append(emojiImage(emoji, 'pixel-emoji-inline'));
  const label = document.createElement('span');
  label.className = 'cat-label';
  const count = document.createElement('span');
  count.className = 'cat-count';
  btn.append(label, count);
  btn.addEventListener('click', () => {
    if (selectedCats.has(cat.id)) selectedCats.delete(cat.id);
    else selectedCats.add(cat.id);
    render();
  });
  categoriesEl.append(btn);
});

function updateCategories() {
  categoriesEl.querySelectorAll('.cat-btn').forEach(btn => {
    const id = btn.dataset.cat;
    const active = selectedCats.has(id);
    const count = countWith(resources, selectedCats, id);
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
    btn.querySelector('.cat-label').textContent = catLabel(id);
    btn.querySelector('.cat-count').textContent = count || '';
    btn.style.opacity = count === 0 ? '0.3' : '';
  });
}

// Cartes

const gridEl = document.getElementById('grid');
const emptyEl = document.getElementById('empty');

function createCard(r, index) {
  const card = document.createElement('a');
  card.className = 'card';
  card.href = r.url;
  card.target = '_blank';
  card.rel = 'noopener noreferrer';
  card.dataset.cats = r.cats.join(',');
  // Décalage plafonné : sur une grande grille, les dernières cartes n'attendent pas une seconde.
  card.style.animationDelay = `${Math.min(index, 8) * 20}ms`;

  const top = document.createElement('div');
  top.className = 'card-top';
  const tags = document.createElement('div');
  tags.className = 'card-tags';
  for (const id of r.cats) {
    const cat = categories.find(c => c.id === id);
    if (!cat) continue;
    const tag = document.createElement('span');
    tag.className = 'card-tag';
    tag.textContent = catLabel(id);
    tags.append(tag);
  }
  top.append(emojiImage(r.emoji, 'card-emoji'), tags);

  const name = document.createElement('div');
  name.className = 'card-name';
  name.textContent = r.name;

  const desc = document.createElement('div');
  desc.className = 'card-desc';
  desc.textContent = r.desc;

  const footer = document.createElement('div');
  footer.className = 'card-footer';
  const visit = document.createElement('span');
  visit.className = 'card-visit';
  visit.textContent = i18n[lang].visit;
  footer.append(visit);
  if (r.status === 'freemium') {
    const warning = document.createElement('span');
    warning.className = 'card-warning';
    warning.textContent = i18n[lang].freemium;
    footer.append(warning);
  }

  card.append(top, name, desc, footer);
  return card;
}

function render() {
  const filtered = filterResources(resources, selectedCats);
  updateCategories();
  history.replaceState(null, '', buildHash(selectedCats) || location.pathname + location.search);

  gridEl.replaceChildren(...filtered.map(createCard));
  emptyEl.hidden = filtered.length > 0;
}

selectedCats = parseHash(location.hash, categories.map(c => c.id));
applyLang();
render();
