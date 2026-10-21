// Bascule FR/EN des pages projet. Les textes sont dans la page (data-lang="fr" / "en") ;
// les titres, aria-label et alt anglais sont dans data-title-en, data-label-en et data-alt-en.
// Sans JavaScript, la page reste en français.
(function () {
  'use strict';
  const html = document.documentElement;
  const button = document.getElementById('lang');
  const titleFr = document.title;

  // On garde la version française de chaque attribut pour pouvoir y revenir.
  const swaps = [
    ['data-label-en', 'aria-label'],
    ['data-alt-en', 'alt'],
  ].flatMap(([source, attr]) =>
    [...document.querySelectorAll(`[${source}]`)].map(el => ({ el, attr, fr: el.getAttribute(attr), en: el.getAttribute(source) })));

  function apply(lang) {
    html.lang = lang;
    document.title = lang === 'en' ? html.dataset.titleEn || titleFr : titleFr;
    swaps.forEach(s => s.el.setAttribute(s.attr, lang === 'en' ? s.en : s.fr));
    button.textContent = lang === 'fr' ? 'English' : 'Français';
    button.lang = lang === 'fr' ? 'en' : 'fr';
  }

  // youtube-nocookie : rien ne part vers YouTube avant le clic. Sans JavaScript, le lien ouvre YouTube.
  document.querySelectorAll('a.player').forEach(player => {
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

  let lang = SiteLang.get();
  apply(lang);
  button.addEventListener('click', () => {
    lang = lang === 'fr' ? 'en' : 'fr';
    SiteLang.set(lang);
    apply(lang);
  });
})();
