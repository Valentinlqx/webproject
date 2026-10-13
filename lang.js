// Langue commune à tout le site : celle choisie par le visiteur, sinon celle de son navigateur.
// En navigation privée, localStorage peut lever une erreur : on retombe alors sur le navigateur.
(function (root) {
  'use strict';
  const KEY = 'lang';
  const browser = () => ((navigator.languages && navigator.languages[0]) || navigator.language || '').toLowerCase();

  function get() {
    let saved = null;
    try { saved = localStorage.getItem(KEY); } catch { /* rien de gardé */ }
    if (saved === 'fr' || saved === 'en') return saved;
    return browser().startsWith('fr') ? 'fr' : 'en';
  }

  function set(lang) {
    try { localStorage.setItem(KEY, lang); } catch { /* le choix vaudra pour cette page seulement */ }
  }

  root.SiteLang = { get, set };
})(this);
