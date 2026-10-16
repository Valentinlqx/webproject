// Même bascule de langue que l'accueil. Sans JavaScript, la page reste en français.
const texts = {
  fr: {
    title: 'Pop Doudou — Valoche',
    back: 'Retour à l’accueil',
    switchTo: 'English',
    kicker: 'Valoche · identité visuelle',
    tagline: 'Doux dedans, pop dehors.',
    lede: 'Une direction artistique pour Valoche, une boutique en ligne imaginaire de pelotes bio et éthiques. Pop Doudou mêle le réconfort de l’enfance et l’énergie d’aujourd’hui : des couleurs chaudes, des formes rondes qu’on a envie de toucher, et le tricot vu comme un rituel câlin plutôt qu’un passe-temps de grand-mère.',
    typeLabel: 'Type',
    type: 'Projet personnel',
    yearLabel: 'Année',
    roleLabel: 'Rôle',
    role: 'Direction artistique, identité visuelle',
    toolsLabel: 'Outils',
    pages: 'Pages du brand book',
    altBrief: 'Le brief : positionnement, vision, mission et valeurs de Valoche.',
    altVibe: 'Moodboard : pelotes, mains qui tricotent et ateliers, avec les mots de la marque (doux, handmade, slow-living…).',
    altCore: 'Le concept « Doux dedans, pop dehors », avec ses forces et ses risques.',
    altColors: 'La palette : corail tomate, jaune moutarde, menthe d’eau, abricot poudré et bleu nuit.',
    altType: 'Les typographies : SetoFont pour les titres, Bricolage Grotesque pour le texte.',
    altShapes: 'Les formes : le cœur câlin, le pompon et les blobs doudous, en rouge, jaune et menthe.',
    altIdea: 'Mise en situation : une page produit pour une laine Arlequin et un kit débutant, aux couleurs de Pop Doudou.',
    home: 'Retour aux projets',
  },
  en: {
    title: 'Pop Doudou — Valoche',
    back: 'Back to home',
    switchTo: 'Français',
    kicker: 'Valoche · visual identity',
    tagline: 'Soft inside, pop outside.',
    lede: 'An art direction for Valoche, an imaginary online shop selling organic, ethical yarn. Pop Doudou blends childhood comfort with today’s energy: warm colours, round shapes you want to touch, and knitting as a cosy ritual rather than a grandma hobby.',
    typeLabel: 'Type',
    type: 'Personal project',
    yearLabel: 'Year',
    roleLabel: 'Role',
    role: 'Art direction, visual identity',
    toolsLabel: 'Tools',
    pages: 'Brand book pages (in French)',
    altBrief: 'The brief: Valoche’s positioning, vision, mission and values.',
    altVibe: 'Moodboard: yarn, knitting hands and workshops, with the brand’s keywords (soft, handmade, slow living…).',
    altCore: 'The concept “Soft inside, pop outside”, with its strengths and risks.',
    altColors: 'The palette: tomato coral, mustard yellow, mint, powder apricot and midnight blue.',
    altType: 'Typefaces: SetoFont for headings, Bricolage Grotesque for text.',
    altShapes: 'Shapes: the cuddly heart, the pompom and the soft blobs, in red, yellow and mint.',
    altIdea: 'Mock-up: a product page for a multicolour yarn and a beginner kit, in the Pop Doudou style.',
    home: 'Back to projects',
  },
};

const button = document.getElementById('lang');

function apply(lang) {
  const t = texts[lang];
  document.documentElement.lang = lang;
  document.title = t.title;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t[el.dataset.i18n]; });
  document.querySelectorAll('[data-i18n-label]').forEach(el => { el.setAttribute('aria-label', t[el.dataset.i18nLabel]); });
  document.querySelectorAll('[data-i18n-alt]').forEach(el => { el.alt = t[el.dataset.i18nAlt]; });
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
