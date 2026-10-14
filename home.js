// Accueil en français ou en anglais. Sans JavaScript, la page reste en français.
const texts = {
  fr: {
    title: 'Valentin L. — Graphiste indépendant',
    web: 'Projets web',
    design: 'Projets design',
    avDesc: 'Des photos à l’annonce Vinted, rédigée par l’IA.',
    rgDesc: 'Des ressources vraiment gratuites pour designers, avec leur licence.',
    switchTo: 'English',
  },
  en: {
    title: 'Valentin L. — Freelance graphic designer',
    web: 'Web projects',
    design: 'Design projects',
    avDesc: 'From photos to a Vinted listing, written by AI.',
    rgDesc: 'Truly free resources for designers, each with its license.',
    switchTo: 'Français',
  },
};

const button = document.getElementById('lang');

function apply(lang) {
  const t = texts[lang];
  document.documentElement.lang = lang;
  document.title = t.title;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t[el.dataset.i18n]; });
  // Le bouton est écrit dans la langue vers laquelle il bascule.
  button.textContent = t.switchTo;
  button.lang = lang === 'fr' ? 'en' : 'fr';
}

let lang = SiteLang.get();
apply(lang);
button.addEventListener('click', () => {
  lang = lang === 'fr' ? 'en' : 'fr';
  SiteLang.set(lang);
  apply(lang);
});
