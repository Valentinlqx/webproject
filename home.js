// Accueil en français ou en anglais. Sans JavaScript, la page reste en français.
const texts = {
  fr: {
    title: 'Vlqx',
    video: 'Projets vidéo',
    web: 'Projets web',
    games: 'Jeux vidéo',
    design: 'Projets design',
    commercial: 'Projets commerciaux',
    avDesc: 'Des photos à l’annonce Vinted, rédigée par l’IA.',
    rgDesc: 'Des ressources vraiment gratuites pour designers, avec leur licence.',
    pdDesc: 'Une identité douce et pop pour une boutique de laine.',
    svDesc: 'Boutique Etsy (s’ouvre dans un nouvel onglet).',
    nnDesc: 'Jeu sur itch.io (s’ouvre dans un nouvel onglet).',
    newTab: ' (nouvel onglet)',
    social: 'Réseaux',
    upmDesc: 'Un court-métrage pour un concours étudiant.',
    revDesc: 'Une vidéo, à regarder sur sa page.',
    soon: 'Bientôt en ligne.',
    switchTo: 'English',
    prev: 'Projets précédents',
    next: 'Projets suivants',
  },
  en: {
    title: 'Vlqx',
    video: 'Video projects',
    web: 'Web projects',
    games: 'Video games',
    design: 'Design projects',
    commercial: 'Commercial projects',
    avDesc: 'From photos to a Vinted listing, written by AI.',
    rgDesc: 'Truly free resources for designers, each with its license.',
    pdDesc: 'A soft, pop identity for a yarn shop.',
    svDesc: 'Etsy shop (opens in a new tab).',
    nnDesc: 'Game on itch.io (opens in a new tab).',
    newTab: ' (new tab)',
    social: 'Social links',
    upmDesc: 'A short film for a student contest.',
    revDesc: 'A video, to watch on its page.',
    soon: 'Coming soon.',
    switchTo: 'Français',
    prev: 'Previous projects',
    next: 'Next projects',
  },
};

const button = document.getElementById('lang');

function apply(lang) {
  const t = texts[lang];
  document.documentElement.lang = lang;
  document.title = t.title;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t[el.dataset.i18n]; });
  document.querySelectorAll('[data-i18n-label]').forEach(el => { el.setAttribute('aria-label', t[el.dataset.i18nLabel]); });
  // Le bouton est écrit dans la langue vers laquelle il bascule.
  button.textContent = t.switchTo;
  button.lang = lang === 'fr' ? 'en' : 'fr';
}

// La catégorie qui a le plus de projets passe en premier ; à égalité, l'ordre de la page reste.
const main = document.querySelector('main');
[...main.querySelectorAll(':scope > section')]
  .map((section, i) => ({ section, i, n: section.querySelectorAll('.tile').length }))
  .sort((a, b) => b.n - a.n || a.i - b.i)
  .forEach(({ section }) => main.append(section));

// Flèches pour faire défiler chaque rangée à la souris. Sans JavaScript, la rangée défile quand même.
const arrowIcon = d => `<svg viewBox="0 0 12 12" aria-hidden="true"><path d="${d}" /></svg>`;

document.querySelectorAll('.grid').forEach(row => {
  const arrows = document.createElement('div');
  arrows.className = 'arrows';
  arrows.innerHTML =
    `<button class="arrow" type="button" data-dir="-1" data-i18n-label="prev">${arrowIcon('M8 1 3 6l5 5')}</button>` +
    `<button class="arrow" type="button" data-dir="1" data-i18n-label="next">${arrowIcon('M4 1l5 5-5 5')}</button>`;
  row.previousElementSibling.append(arrows);
  const [prev, next] = arrows.children;

  const update = () => {
    const max = row.scrollWidth - row.clientWidth;
    arrows.hidden = max <= 1;
    prev.disabled = row.scrollLeft <= 1;
    next.disabled = row.scrollLeft >= max - 1;
  };
  arrows.addEventListener('click', e => {
    const button = e.target.closest('.arrow');
    if (button) row.scrollBy({ left: Number(button.dataset.dir) * row.clientWidth * 0.8 });
  });
  row.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(row);
});

// Le titre change ses lettres au hasard un court instant (au chargement, puis au survol ou au toucher).
// Moins de 5 secondes à chaque fois : pas besoin de bouton pause. Rien ne bouge si l'appareil le demande.
const STYLES = 8;
const letters = [...document.querySelectorAll('.ransom span')];
const pick = n => Math.floor(Math.random() * n);

function restyle(span, i) {
  const taken = [letters[i - 1], letters[i + 1]].filter(Boolean).map(l => l.dataset.s);
  let s;
  do s = String(pick(STYLES)); while (s === span.dataset.s || taken.includes(s));
  span.dataset.s = s;
  span.style.setProperty('--r', `${pick(15) - 7}deg`);
  span.style.textTransform = pick(2) ? 'uppercase' : 'lowercase';
}

let shuffling = null;
function shuffle(duration) {
  if (shuffling || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  shuffling = setInterval(() => { const i = pick(letters.length); restyle(letters[i], i); }, 160);
  setTimeout(() => { clearInterval(shuffling); shuffling = null; }, duration);
}

letters.forEach(restyle);
shuffle(2500);
const title = document.querySelector('.ransom');
title.addEventListener('pointerenter', () => shuffle(1200));
title.addEventListener('click', () => shuffle(1200));

let lang = SiteLang.get();
apply(lang);
button.addEventListener('click', () => {
  lang = lang === 'fr' ? 'en' : 'fr';
  SiteLang.set(lang);
  apply(lang);
});
