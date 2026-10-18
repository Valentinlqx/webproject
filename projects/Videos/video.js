// Page vidéo : bascule de langue, et le lecteur YouTube qui ne se charge qu'au clic.
const texts = {
  fr: {
    back: 'Retour à l’accueil',
    switchTo: 'English',
    kicker: 'Vidéo',
    play: 'Lancer la vidéo',
    note: 'La vidéo est hébergée sur YouTube : elle ne se charge qu’au clic.',
    altPoster: 'Affiche du film : une part de pizza flotte entre deux mains tendues, sur fond noir. Récompensé aux Trois Quarts de Cinéma : prix du jury, du scénario, du montage et du son.',
    home: 'Retour aux projets',
  },
  en: {
    back: 'Back to home',
    switchTo: 'Français',
    kicker: 'Video',
    play: 'Play the video',
    note: 'The video is hosted on YouTube: it only loads when you click.',
    altPoster: 'Film poster: a slice of pizza floats between two reaching hands on a black background. Awarded at the Trois Quarts de Cinéma ceremony: jury, screenplay, editing and sound prizes.',
    home: 'Back to projects',
  },
};

const button = document.getElementById('lang');

function apply(lang) {
  const t = texts[lang];
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t[el.dataset.i18n]; });
  document.querySelectorAll('[data-i18n-alt]').forEach(el => { el.alt = t[el.dataset.i18nAlt]; });
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
