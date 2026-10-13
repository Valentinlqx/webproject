// Filtres, recherche et état de l'URL, sans DOM : testé dans tests/unit/rg-core.test.mjs.
(function (root) {
  'use strict';

  function emptyState() {
    return { family: '', cats: new Set(), licenses: new Set(), noAccount: false, query: '' };
  }

  // Ce qui ne dépend que des données : on le calcule une fois.
  function makeContext({ categories, licenses, legacyCats = {} }) {
    return {
      familyOf: new Map(categories.map(c => [c.id, c.family])),
      catById: new Map(categories.map(c => [c.id, c])),
      licenseById: new Map(licenses.map(l => [l.id, l])),
      legacyCats,
    };
  }

  // « Icônes » et « icones » doivent se trouver l'un l'autre.
  function normalize(text) {
    return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
  }

  const searchCache = new WeakMap();

  function searchText(r, ctx, lang) {
    let byLang = searchCache.get(r);
    if (!byLang) searchCache.set(r, byLang = {});
    if (!byLang[lang]) {
      const license = ctx.licenseById.get(r.license);
      byLang[lang] = normalize([
        r.name, r.desc[lang], r.licenseName, license && license[lang],
        ...r.cats.map(id => ctx.catById.get(id)?.[lang]),
      ].filter(Boolean).join(' '));
    }
    return byLang[lang];
  }

  function matches(r, s, ctx, lang, words) {
    if (s.family && !r.cats.some(id => ctx.familyOf.get(id) === s.family)) return false;
    if (s.cats.size && !r.cats.some(id => s.cats.has(id))) return false;
    if (s.licenses.size && !s.licenses.has(r.license)) return false;
    if (s.noAccount && r.account) return false;
    if (words.length) {
      const text = searchText(r, ctx, lang);
      if (!words.every(w => text.includes(w))) return false;
    }
    return true;
  }

  function filterResources(resources, s, ctx, lang) {
    const words = normalize(s.query).split(/\s+/).filter(Boolean);
    return resources.filter(r => matches(r, s, ctx, lang, words));
  }

  // Compteurs des boutons : combien de résultats si on choisissait ce bouton seul dans son groupe.
  function countFamily(resources, s, ctx, lang, family) {
    return filterResources(resources, { ...s, family, cats: new Set() }, ctx, lang).length;
  }

  function countCat(resources, s, ctx, lang, catId) {
    return filterResources(resources, { ...s, cats: new Set([catId]) }, ctx, lang).length;
  }

  function countLicense(resources, s, ctx, lang, licenseId) {
    return filterResources(resources, { ...s, licenses: new Set([licenseId]) }, ctx, lang).length;
  }

  // « #f=visuels&c=photos,icones&l=cc0,pro&nc=1&q=papier »
  function buildHash(s) {
    const parts = [];
    if (s.family) parts.push(`f=${s.family}`);
    if (s.cats.size) parts.push(`c=${[...s.cats].join(',')}`);
    if (s.licenses.size) parts.push(`l=${[...s.licenses].join(',')}`);
    if (s.noAccount) parts.push('nc=1');
    if (s.query.trim()) parts.push(`q=${encodeURIComponent(s.query.trim())}`);
    return parts.length ? `#${parts.join('&')}` : '';
  }

  const list = value => (value || '').split(',').filter(Boolean);

  function parseHash(hash, ctx) {
    const p = new URLSearchParams(hash.replace(/^#/, ''));
    const s = emptyState();
    if (p.has('cats')) return parseLegacy(list(p.get('cats')), ctx);

    const families = new Set(ctx.familyOf.values());
    if (families.has(p.get('f'))) s.family = p.get('f');
    // Une sous-catégorie n'a de sens que dans sa famille.
    for (const id of list(p.get('c'))) if (s.family && ctx.familyOf.get(id) === s.family) s.cats.add(id);
    for (const id of list(p.get('l'))) if (ctx.licenseById.has(id)) s.licenses.add(id);
    s.noAccount = p.get('nc') === '1';
    s.query = p.get('q') || '';
    return s;
  }

  // Anciens liens « #cats=images,video » (avant les familles) : on ouvre la famille de la première.
  function parseLegacy(ids, ctx) {
    const s = emptyState();
    for (const id of ids) {
      const cat = ctx.legacyCats[id];
      if (cat && ctx.familyOf.has(cat)) {
        const family = ctx.familyOf.get(cat);
        if (!s.family) s.family = family;
        if (family === s.family) s.cats.add(cat);
      } else if (ctx.licenseById.has(id)) {
        s.licenses.add(id);
      }
    }
    return s;
  }

  const api = {
    emptyState, makeContext, normalize, filterResources,
    countFamily, countCat, countLicense, buildHash, parseHash,
  };

  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RGCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
