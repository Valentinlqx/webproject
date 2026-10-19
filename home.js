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
    upmDesc: 'Une vidéo, à regarder sur sa page.',
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
    upmDesc: 'A video, to watch on its page.',
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

let lang = SiteLang.get();
apply(lang);
button.addEventListener('click', () => {
  lang = lang === 'fr' ? 'en' : 'fr';
  SiteLang.set(lang);
  apply(lang);
});
