// Page vidéo : bascule de langue, et le lecteur YouTube qui ne se charge qu'au clic.
const texts = {
  fr: {
    back: 'Retour à l’accueil',
    switchTo: 'English',
    kicker: 'Vidéo',
    play: 'Lancer la vidéo',
    note: 'La vidéo est hébergée sur YouTube : elle ne se charge qu’au clic.',
    home: 'Retour aux projets',
    upm1: 'Un court-métrage tourné pour les Trois Quarts de Cinéma, le concours de l’association étudiante Trois Quarts de Pouce, à Valenciennes. On avait un mois pour écrire, tourner et monter le film.',
    upm2: 'Il a reçu le prix du jury, du scénario, du montage et du son.',
  },
  en: {
    back: 'Back to home',
    switchTo: 'Français',
    kicker: 'Video',
    play: 'Play the video',
    note: 'The video is hosted on YouTube: it only loads when you click.',
    home: 'Back to projects',
    upm1: 'A short film made for Trois Quarts de Cinéma, the contest run by the Trois Quarts de Pouce student club in Valenciennes. We had one month to write, shoot and edit it.',
    upm2: 'It won the jury, screenplay, editing and sound awards.',
  },
};

const button = document.getElementById('lang');

function apply(lang) {
  const t = texts[lang];
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t[el.dataset.i18n]; });
  // L'affiche porte sa description dans les deux langues : elle change d'une vidéo à l'autre.
  document.querySelectorAll('[data-alt-fr]').forEach(el => { el.alt = lang === 'fr' ? el.dataset.altFr : el.dataset.altEn; });
  document.querySelectorAll('[data-i18n-label]').forEach(el => { el.setAttribute('aria-label', t[el.dataset.i18nLabel]); });
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

// youtube-nocookie : YouTube ne dépose pas de cookie tant qu'on ne lance pas la lecture.
document.querySelectorAll('.player').forEach(player => {
  player.addEventListener('click', e => {
    e.preventDefault();
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${player.dataset.video}?autoplay=1&rel=0`;
    frame.title = player.dataset.title;
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    const box = document.createElement('div');
    box.className = 'player';
    box.append(frame);
    player.replaceWith(box);
    frame.focus();
  });
});
