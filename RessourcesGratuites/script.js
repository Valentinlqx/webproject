let categories = [];
let resources = [];

// ── State ──
let selectedCats = new Set();
let searchQuery = '';
let lang = localStorage.getItem('lang') || 'fr';

// ── i18n ──
const i18n = {
  fr: {
    title:       'Ressources Gratuites — Design & Création',
    h1:          '✦ Ressources Gratuites',
    heroSub:     'Une encyclopédie d\'outils et ressources pour designers & créateurs',
    placeholder: 'Rechercher une ressource...',
    footer:      '© 2026 Valentin L. — Ressources mises à jour régulièrement',
    empty:       'Aucune ressource trouvée',
    all:         'Tout',
    results:     n => `${n} ressource${n > 1 ? 's' : ''}`,
    visit:       'Visiter →',
    freemium:    'Peut contenir des ressources payantes',
  },
  en: {
    title:       'Free Resources — Design & Creation',
    h1:          '✦ Free Resources',
    heroSub:     'An encyclopedia of tools and resources for designers & creators',
    placeholder: 'Search a resource...',
    footer:      '© 2026 Valentin L. — Resources updated regularly',
    empty:       'No resource found',
    all:         'All',
    results:     n => `${n} resource${n > 1 ? 's' : ''}`,
    visit:       'Visit →',
    freemium:    'May contain paid resources',
  },
};

function applyLang() {
  const t = i18n[lang];
  document.title = t.title;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) el.textContent = t[key];
  });
  document.getElementById('search').placeholder = t.placeholder;
  document.getElementById('lang-toggle').textContent = lang === 'fr' ? 'EN' : 'FR';
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
    selectedCats = new Set(['opensource']);
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

// Count results if this cat is added to current selection (or total if 'all')
function getCatCount(catId) {
  const q = searchQuery.toLowerCase();
  const testCats = catId === 'all' ? new Set() : new Set([...selectedCats, catId]);
  return resources.filter(r => {
    const matchCat = testCats.size === 0 || [...testCats].every(c => r.cats.includes(c));
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
    btn.innerHTML = `${cat.label} <span class="cat-count"></span>`;
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
  const count = document.getElementById('count');

  grid.innerHTML = '';
  updateCatCounts();
  pushURLState();

  if (filtered.length === 0) {
    empty.style.display = 'block';
    count.textContent = '';
    return;
  }

  empty.style.display = 'none';
  count.textContent = i18n[lang].results(filtered.length);

  filtered.forEach((r, i) => {
    const card = document.createElement('a');
    card.href = r.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.className = 'card';
    card.style.animationDelay = `${i * 20}ms`;

    const tagsHTML = r.cats.map(catId => {
      const cat = categories.find(c => c.id === catId);
      if (!cat) return '';
      return `<span class="card-tag" style="color:${cat.color};background:${cat.color}1a">${cat.label}</span>`;
    }).join('');

    card.innerHTML = `
      <div class="card-top">
        <span class="card-emoji">${r.emoji}</span>
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
document.getElementById('search').addEventListener('input', e => {
  searchQuery = e.target.value.trim();
  render();
});

document.addEventListener('keydown', e => {
  const searchEl = document.getElementById('search');
  if (e.key === '/' && document.activeElement !== searchEl) {
    e.preventDefault();
    searchEl.focus();
  }
  if (e.key === 'Escape') {
    if (searchQuery) {
      searchQuery = '';
      searchEl.value = '';
      render();
    }
    searchEl.blur();
  }
});

// ── Language toggle ──
document.getElementById('lang-toggle').addEventListener('click', () => {
  lang = lang === 'fr' ? 'en' : 'fr';
  localStorage.setItem('lang', lang);
  applyLang();
  renderCategories();
  render();
});

// ── Dark mode ──
const themeToggle = document.getElementById('theme-toggle');

themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ── Init ──
categories = RESOURCES_DATA.categories;
resources = RESOURCES_DATA.resources;
readURLState();
applyLang();
renderCategories();
document.getElementById('search').value = searchQuery;
render();
