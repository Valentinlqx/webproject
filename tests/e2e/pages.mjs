export const PAGES = {
  home: '/',
  autovinted: '/projects/AutoVinted/autovinted.html',
  rg: '/projects/RessourcesGratuites/ressourcesgratuites.html',
};

export const WIDTHS = [320, 375, 768, 1440];

// Erreurs JS + fichiers locaux manquants. Les CDN externes (emojis OpenMoji)
// sont ignorés pour que les tests passent aussi hors ligne.
export function collectErrors(page) {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => {
    if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text());
  });
  page.on('response', r => {
    if (r.url().startsWith('http://localhost') && r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
  });
  return errors;
}
