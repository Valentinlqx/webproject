import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const rg = require('../../projects/RessourcesGratuites/rg-core.js');

const resources = [
  { name: 'Unsplash', cats: ['images'] },
  { name: 'Pexels', cats: ['images', 'video'] },
  { name: 'Blender', cats: ['3d', 'opensource'] },
];

test('sans catégorie choisie, tout est affiché', () => {
  assert.equal(rg.filterResources(resources, new Set()).length, 3);
});

test('plusieurs catégories = ressources qui les ont toutes', () => {
  assert.deepEqual(rg.filterResources(resources, new Set(['images'])).map(r => r.name), ['Unsplash', 'Pexels']);
  assert.deepEqual(rg.filterResources(resources, new Set(['images', 'video'])).map(r => r.name), ['Pexels']);
});

test('countWith donne le nombre de résultats si on ajoutait cette catégorie', () => {
  assert.equal(rg.countWith(resources, new Set(), 'images'), 2);
  assert.equal(rg.countWith(resources, new Set(['images']), 'video'), 1);
  assert.equal(rg.countWith(resources, new Set(['images']), '3d'), 0);
  assert.equal(rg.countWith(resources, new Set(['images']), 'images'), 2);
});

test("le hash de l'URL garde les catégories choisies", () => {
  assert.equal(rg.buildHash(new Set()), '');
  assert.equal(rg.buildHash(new Set(['images', 'video'])), '#cats=images,video');
  assert.deepEqual([...rg.parseHash('#cats=images,video')], ['images', 'video']);
});

test('les anciens liens et les liens abîmés ne cassent rien', () => {
  assert.deepEqual([...rg.parseHash('')], []);
  assert.deepEqual([...rg.parseHash('#cats=all')], []);
  assert.deepEqual([...rg.parseHash('#cats=images,,')], ['images']);
  assert.deepEqual([...rg.parseHash('#cats=images,inconnue', ['images', 'video'])], ['images']);
  assert.deepEqual([...rg.parseHash('#q=police&cats=polices')], ['polices']);
});

test('buildHash puis parseHash redonne la même sélection', () => {
  const cats = new Set(['3d', 'ai-skills']);
  assert.deepEqual(rg.parseHash(rg.buildHash(cats)), cats);
});
