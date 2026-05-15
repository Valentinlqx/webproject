let categories = [];
let resources = [];

// ── OpenMoji sprite URLs ──
// Convert an emoji to its codepoint sequence (joined by "-", uppercase, 4-pad)
// then build a jsDelivr URL to the OpenMoji SVG for that codepoint.
// Some glyphs aren't in OpenMoji — map them to a close cousin that is
const OPENMOJI_FALLBACKS = {
  '✦': '✨',  // four-pointed star → sparkles
};
function normalizeEmoji(emoji) {
  return OPENMOJI_FALLBACKS[emoji] || emoji;
}

function emojiToCodepoint(emoji) {
  return [...normalizeEmoji(emoji)]
    .map(c => c.codePointAt(0))
    .filter(cp => cp !== 0xFE0F)            // strip VS-16; OpenMoji files don't include it
    .map(cp => cp.toString(16).toUpperCase().padStart(4, '0'))
    .join('-');
}
function openmojiUrl(emoji) {
  return `https://cdn.jsdelivr.net/npm/openmoji@latest/color/svg/${emojiToCodepoint(emoji)}.svg`;
}

// "🖼️ Images" → ["🖼️", "Images"]
function splitLeadingEmoji(label) {
  const m = label.match(/^([^\p{L}\p{N}\s]+)\s+(.*)$/u);
  if (m) return [m[1].trim(), m[2].trim()];
  return ['', label];
}

function inlineEmojiImg(emoji, cls) {
  if (!emoji) return '';
  return `<img class="${cls || 'pixel-emoji-inline'}" src="${openmojiUrl(emoji)}" alt="" aria-hidden="true" onerror="this.replaceWith(document.createTextNode('${emoji.replace(/'/g, "\\'")}'))" />`;
}

// ── State ──
let selectedCats = new Set();
let searchQuery = '';
let lang = localStorage.getItem('lang') || 'fr';

// ── i18n ──
const i18n = {
  fr: {
    title:       'Ressources Gratuites — Design & Création',
    h1:          'Ressources Gratuites',
    heroSub:     'Une encyclopédie d\'outils et ressources pour designers & créateurs',
    placeholder: '',
    footer:      '© 2026 Valentin L. — Ressources mises à jour régulièrement',
    empty:       'Aucune ressource trouvée',
    all:         'Tout',
    results:     n => `${n} ressource${n > 1 ? 's' : ''}`,
    visit:       'Visiter →',
    freemium:    'Peut contenir des ressources payantes',
    cats: {
      images: 'Images', polices: 'Polices', icones: 'Icônes', illustrations: 'Illustrations',
      couleurs: 'Couleurs', design: 'Design', sons: 'Sons', musiques: 'Musiques',
      mockups: 'Mockups', jeux: 'Jeux Vidéos', web: 'Web', video: 'Vidéo',
      textures: 'Textures', brushes: 'Brushes', png: 'PNG', ia: 'Outils IA',
      outils: 'Outils', tutos: 'Tutos', inspi: 'Inspiration', motion: 'Motion Design',
      '3d': '3D Assets', opensource: 'Open Source',
    },
  },
  en: {
    title:       'Free Resources — Design & Creation',
    h1:          'Free Resources',
    heroSub:     'An encyclopedia of tools and resources for designers & creators',
    placeholder: '',
    footer:      '© 2026 Valentin L. — Resources updated regularly',
    empty:       'No resource found',
    all:         'All',
    results:     n => `${n} resource${n > 1 ? 's' : ''}`,
    visit:       'Visit →',
    freemium:    'May contain paid resources',
    cats: {
      images: 'Images', polices: 'Fonts', icones: 'Icons', illustrations: 'Illustrations',
      couleurs: 'Colors', design: 'Design', sons: 'Sounds', musiques: 'Music',
      mockups: 'Mockups', jeux: 'Video Games', web: 'Web', video: 'Video',
      textures: 'Textures', brushes: 'Brushes', png: 'PNG', ia: 'AI Tools',
      outils: 'Tools', tutos: 'Tutorials', inspi: 'Inspiration', motion: 'Motion Design',
      '3d': '3D Assets', opensource: 'Open Source',
    },
  },
};

function catLabel(catId) {
  const cat = categories.find(c => c.id === catId);
  if (!cat) return '';
  const tr = i18n[lang].cats && i18n[lang].cats[catId];
  if (tr) return tr;
  const [, txt] = splitLeadingEmoji(cat.label);
  return txt || cat.label;
}

function applyLang() {
  const t = i18n[lang];
  document.title = t.title;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) el.textContent = t[key];
  });
  document.getElementById('lang-toggle').textContent = lang === 'fr' ? '🇬🇧' : '🇫🇷';
}

// ── URL hash state ──
function pushURLState() {
  const params = new URLSearchParams();
  const isDefault = selectedCats.size === 1 && selectedCats.has('opensource');
  if (selectedCats.size === 0) {
    params.set('cats', 'all');
  } else if (!isDefault) {
    params.set('cats', [...selectedCats].join(','));
  }
  if (searchQuery) params.set('q', searchQuery);
  const str = params.toString();
  history.replaceState(null, '', str ? '#' + str : location.pathname + location.search);
}

function readURLState() {
  const params = new URLSearchParams(location.hash.slice(1));
  const catsParam = params.get('cats');
  if (!catsParam) {
    selectedCats = new Set();
  } else if (catsParam === 'all') {
    selectedCats = new Set();
  } else {
    selectedCats = new Set(catsParam.split(',').filter(Boolean));
  }
  searchQuery = params.get('q') || '';
}

// ── Filtering ──
function getFiltered() {
  const q = searchQuery.toLowerCase();
  return resources.filter(r => {
    const matchCat = selectedCats.size === 0 || [...selectedCats].every(c => r.cats.includes(c));
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });
}

function getCatCount(catId) {
  const q = searchQuery.toLowerCase();
  const testCats = new Set([...selectedCats, catId]);
  return resources.filter(r => {
    const matchCat = [...testCats].every(c => r.cats.includes(c));
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q);
    return matchCat && matchSearch;
  }).length;
}

// ── Render categories ──
function renderCategories() {
  const container = document.getElementById('categories');
  container.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = 'cat-btn' + (selectedCats.size === 0 ? ' active' : '');
  allBtn.dataset.cat = 'all';
  allBtn.innerHTML = `${i18n[lang].all} <span class="cat-count"></span>`;
  allBtn.addEventListener('click', () => {
    selectedCats.clear();
    renderCategories();
    render();
  });
  container.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn' + (selectedCats.has(cat.id) ? ' active' : '');
    btn.dataset.cat = cat.id;
    const [emoji, text] = splitLeadingEmoji(cat.label);
    btn.innerHTML = `${inlineEmojiImg(emoji)}<span>${catLabel(cat.id)}</span> <span class="cat-count"></span>`;
    btn.addEventListener('click', () => toggleCategory(cat.id));
    container.appendChild(btn);
  });
}

function updateCatCounts() {
  document.querySelectorAll('.cat-btn').forEach(btn => {
    const count = getCatCount(btn.dataset.cat);
    const span = btn.querySelector('.cat-count');
    if (span) span.textContent = count || '';
    btn.style.opacity = count === 0 ? '0.3' : '';
  });
}

function toggleCategory(id) {
  if (selectedCats.has(id)) {
    selectedCats.delete(id);
  } else {
    selectedCats.add(id);
  }
  renderCategories();
  render();
}

// ── Render cards ──
function render() {
  const filtered = getFiltered();
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');

  grid.innerHTML = '';
  updateCatCounts();
  pushURLState();

  if (filtered.length === 0) {
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  filtered.forEach((r, i) => {
    const card = document.createElement('a');
    card.href = r.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.className = 'card';
    // Cap stagger so a 50-card grid doesn't make the last cards wait a full second.
    card.style.animationDelay = `${Math.min(i, 8) * 20}ms`;

    const tagsHTML = r.cats.map(catId => {
      const cat = categories.find(c => c.id === catId);
      if (!cat) return '';
      const [, text] = splitLeadingEmoji(cat.label);
      return `<span class="card-tag" style="background:${cat.color};border-color:#1a0307">${catLabel(catId)}</span>`;
    }).join('');

    const emojiUrl = openmojiUrl(r.emoji);
    const safeEmoji = (r.emoji || '').replace(/'/g, "\\'");

    card.innerHTML = `
      <div class="card-top">
        <img class="card-emoji" src="${emojiUrl}" alt="" aria-hidden="true"
             onerror="this.outerHTML='<span class=&quot;card-emoji card-emoji-fallback&quot;>${safeEmoji}</span>'" />
        <div class="card-tags">${tagsHTML}</div>
      </div>
      <div class="card-name">${r.name}</div>
      <div class="card-desc">${r.desc}</div>
      <div class="card-footer">
        <span class="card-visit">${i18n[lang].visit}</span>
        ${r.status === 'freemium' ? `<span class="card-warning">${i18n[lang].freemium}</span>` : ''}
      </div>
    `;

    grid.appendChild(card);
  });
}

// ── Events ──
// (search removed)

document.addEventListener('keydown', e => {
  // no-op
});

// ── Language toggle ──
document.getElementById('lang-toggle').addEventListener('click', () => {
  lang = lang === 'fr' ? 'en' : 'fr';
  localStorage.setItem('lang', lang);
  applyLang();
  renderCategories();
  render();
});

// Flag shown ON the button = the language you'll SWITCH TO
function updateLangFlag() {
  const btn = document.getElementById('lang-toggle');
  btn.textContent = lang === 'fr' ? '🇬🇧' : '🇫🇷';
}

// ── Init ──
categories = RESOURCES_DATA.categories;
resources = RESOURCES_DATA.resources;
readURLState();
applyLang();
renderCategories();
render();
