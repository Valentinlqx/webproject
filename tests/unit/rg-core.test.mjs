import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const rg = require('../../projects/RessourcesGratuites/rg-core.js');

const data = {
  families: [
    { id: 'visuels', fr: 'Visuels', en: 'Visuals' },
    { id: 'son', fr: 'Son', en: 'Sound' },
    { id: '3d', fr: '3D & Jeux', en: '3D & Games' },
  ],
  categories: [
    { id: 'photos', family: 'visuels', fr: 'Photos', en: 'Photos' },
    { id: 'icones', family: 'visuels', fr: 'Icônes', en: 'Icons' },
    { id: 'effets', family: 'son', fr: 'Effets sonores', en: 'Sound effects' },
    { id: '3d', family: '3d', fr: '3D & HDRI', en: '3D & HDRI' },
  ],
  licenses: [
    { id: 'cc0', fr: 'Libre total', en: 'Public domain' },
    { id: 'pro', fr: 'Usage pro OK', en: 'Commercial OK' },
    { id: 'opensource', fr: 'Open source', en: 'Open source' },
  ],
  legacyCats: { images: 'photos', sons: 'effets', opensource: null, ia: null },
};

const resources = [
  { name: 'Unsplash', cats: ['photos'], license: 'pro', licenseName: 'Unsplash License', account: false,
    desc: { fr: 'Photos haute résolution.', en: 'High-resolution photos.' } },
  { name: 'Phosphor', cats: ['icones'], license: 'pro', licenseName: 'MIT', account: false,
    desc: { fr: 'Icônes souples.', en: 'Flexible icons.' } },
  { name: 'Freesound', cats: ['effets'], license: 'cc0', licenseName: 'CC0, CC BY', account: true,
    desc: { fr: 'Bruitages du monde entier.', en: 'Sound effects from everywhere.' } },
  { name: 'Blender', cats: ['3d'], license: 'opensource', licenseName: 'GPL-3.0', account: false,
    desc: { fr: 'Logiciel 3D complet.', en: 'Full 3D software.' } },
  { name: 'Poly Haven', cats: ['3d', 'photos'], license: 'cc0', licenseName: 'CC0', account: false,
    desc: { fr: 'Textures et HDRI.', en: 'Textures and HDRIs.' } },
];

const ctx = rg.makeContext(data);
const state = (s = {}) => ({ ...rg.emptyState(), ...s });
const names = list => list.map(r => r.name);

test('sans filtre, tout est affiché', () => {
  assert.equal(rg.filterResources(resources, state(), ctx, 'fr').length, 5);
});

test('une famille garde les ressources dont une sous-catégorie en fait partie', () => {
  assert.deepEqual(names(rg.filterResources(resources, state({ family: 'visuels' }), ctx, 'fr')),
    ['Unsplash', 'Phosphor', 'Poly Haven']);
});

test("plusieurs sous-catégories = l'une ou l'autre", () => {
  const s = state({ family: 'visuels', cats: new Set(['photos', 'icones']) });
  assert.equal(rg.filterResources(resources, s, ctx, 'fr').length, 3);
  assert.deepEqual(names(rg.filterResources(resources, state({ family: 'visuels', cats: new Set(['icones']) }), ctx, 'fr')),
    ['Phosphor']);
});

test("plusieurs licences = l'une ou l'autre", () => {
  assert.deepEqual(names(rg.filterResources(resources, state({ licenses: new Set(['cc0']) }), ctx, 'fr')),
    ['Freesound', 'Poly Haven']);
  assert.equal(rg.filterResources(resources, state({ licenses: new Set(['cc0', 'opensource']) }), ctx, 'fr').length, 3);
});

test('« sans compte » retire ce qui demande une inscription', () => {
  assert.ok(!names(rg.filterResources(resources, state({ noAccount: true }), ctx, 'fr')).includes('Freesound'));
});

test('la recherche ignore accents et majuscules, et lit la langue choisie', () => {
  assert.deepEqual(names(rg.filterResources(resources, state({ query: 'ICONES' }), ctx, 'fr')), ['Phosphor']);
  assert.deepEqual(names(rg.filterResources(resources, state({ query: 'résolution' }), ctx, 'fr')), ['Unsplash']);
  assert.deepEqual(names(rg.filterResources(resources, state({ query: 'resolution' }), ctx, 'en')), ['Unsplash']);
  assert.deepEqual(names(rg.filterResources(resources, state({ query: 'libre total' }), ctx, 'fr')), ['Freesound', 'Poly Haven']);
  assert.deepEqual(names(rg.filterResources(resources, state({ query: 'gpl' }), ctx, 'fr')), ['Blender']);
});

test('la recherche trouve les familles, plie œ, et ne cherche que des débuts de mots', () => {
  assert.deepEqual(names(rg.filterResources(resources, state({ query: 'visuels' }), ctx, 'fr')), ['Unsplash', 'Phosphor', 'Poly Haven']);
  assert.deepEqual(names(rg.filterResources(resources, state({ query: 'son' }), ctx, 'fr')), ['Freesound']);
  assert.deepEqual(names(rg.filterResources(resources, state({ query: 'oeuvre' }), ctx, 'fr')), []);
  const met = { name: 'The Met', cats: ['photos'], license: 'cc0', licenseName: 'CC0', account: false,
    desc: { fr: 'Œuvres du domaine public.', en: 'Public domain works.' } };
  assert.deepEqual(names(rg.filterResources([met], state({ query: 'oeuvres' }), ctx, 'fr')), ['The Met']);
  assert.deepEqual(names(rg.filterResources(resources, state({ query: 'resolution' }), ctx, 'en')), ['Unsplash']);
});

test("le nom d'icône suit OpenMoji", () => {
  assert.equal(rg.iconCode('🖼️'), '1F5BC');
  assert.equal(rg.iconCode('🧑‍🎨'), '1F9D1-200D-1F3A8');
});

test('chaque mot de la recherche doit se trouver', () => {
  assert.deepEqual(names(rg.filterResources(resources, state({ query: 'textures cc0' }), ctx, 'fr')), ['Poly Haven']);
  assert.equal(rg.filterResources(resources, state({ query: '   ' }), ctx, 'fr').length, 5);
});

test('les compteurs donnent le résultat si on choisissait ce bouton, avec les autres filtres', () => {
  const s = state({ licenses: new Set(['cc0']) });
  assert.equal(rg.countFamily(resources, s, ctx, 'fr', 'visuels'), 1);
  assert.equal(rg.countFamily(resources, s, ctx, 'fr', ''), 2);
  assert.equal(rg.countCat(resources, state({ family: 'visuels', cats: new Set(['icones']) }), ctx, 'fr', 'photos'), 2);
  assert.equal(rg.countLicense(resources, state({ licenses: new Set(['cc0']) }), ctx, 'fr', 'pro'), 2);
});

test("l'URL garde tout l'état et le relit", () => {
  const s = state({ family: 'visuels', cats: new Set(['photos']), licenses: new Set(['cc0', 'pro']), noAccount: true, query: 'papier kraft' });
  const hash = rg.buildHash(s);
  assert.equal(hash, '#f=visuels&c=photos&l=cc0,pro&nc=1&q=papier%20kraft');
  assert.deepEqual(rg.parseHash(hash, ctx), s);
  assert.equal(rg.buildHash(state()), '');
});

test('les liens abîmés ne cassent rien', () => {
  assert.deepEqual(rg.parseHash('', ctx), state());
  assert.deepEqual(rg.parseHash('#f=inconnue&c=photos,nope&l=zzz', ctx), state());
  // Une sous-catégorie qui n'est pas dans la famille choisie est ignorée.
  assert.deepEqual(rg.parseHash('#f=son&c=photos,effets', ctx), state({ family: 'son', cats: new Set(['effets']) }));
});

test('les anciens liens #cats=… ouvrent la bonne famille', () => {
  assert.deepEqual(rg.parseHash('#cats=images', ctx), state({ family: 'visuels', cats: new Set(['photos']) }));
  assert.deepEqual(rg.parseHash('#cats=opensource', ctx), state({ licenses: new Set(['opensource']) }));
  assert.deepEqual(rg.parseHash('#cats=ia', ctx), state());
  assert.deepEqual(rg.parseHash('#cats=all', ctx), state());
});

test('buildHash puis parseHash redonne le même état', () => {
  const s = state({ family: '3d', cats: new Set(['3d']), query: 'été' });
  assert.deepEqual(rg.parseHash(rg.buildHash(s), ctx), s);
});
