// Filtres et état de l'URL, sans DOM : testé dans tests/unit/rg-core.test.mjs.
(function (root) {
  'use strict';

  // Plusieurs catégories choisies = on garde les ressources qui les ont toutes.
  function filterResources(resources, cats) {
    if (cats.size === 0) return resources;
    return resources.filter(r => [...cats].every(c => r.cats.includes(c)));
  }

  // Combien de ressources resteraient si on ajoutait cette catégorie à la sélection.
  function countWith(resources, cats, catId) {
    return filterResources(resources, new Set([...cats, catId])).length;
  }

  // « #cats=images,video » ; les anciens liens avaient aussi « cats=all » et « q=… ».
  function parseHash(hash, knownIds) {
    const raw = new URLSearchParams(hash.replace(/^#/, '')).get('cats') || '';
    const ids = raw.split(',').filter(id => id && id !== 'all');
    return new Set(knownIds ? ids.filter(id => knownIds.includes(id)) : ids);
  }

  function buildHash(cats) {
    return cats.size ? `#cats=${[...cats].join(',')}` : '';
  }

  const api = { filterResources, countWith, parseHash, buildHash };

  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RGCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
