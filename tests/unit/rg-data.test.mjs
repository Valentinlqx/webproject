import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// resources.js est un script de navigateur (const RESOURCES_DATA = …) : on l'exécute dans un bac à sable.
const source = readFileSync(new URL('../../projects/RessourcesGratuites/resources.js', import.meta.url), 'utf8');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(`${source};this.data = RESOURCES_DATA;`, sandbox);
const { categories, resources } = sandbox.data;
const catIds = new Set(categories.map(c => c.id));

test('les catégories ont un id unique, un libellé et une couleur', () => {
  assert.equal(catIds.size, categories.length);
  for (const c of categories) {
    assert.ok(c.label, c.id);
    assert.match(c.color, /^#[0-9a-f]{6}$/i, c.id);
  }
});

test('chaque ressource est complète', () => {
  for (const r of resources) {
    for (const field of ['name', 'desc', 'url', 'emoji']) {
      assert.equal(typeof r[field], 'string', `${r.name} : ${field}`);
      assert.ok(r[field].trim(), `${r.name} : ${field} vide`);
    }
  }
});

// Choix du 2026-09-26 : que du 100 % gratuit, pas de freemium.
test('aucune ressource freemium', () => {
  const paid = resources.filter(r => r.status !== 'free').map(r => r.name);
  assert.equal(paid.length, 0, `freemium : ${paid.join(', ')}`);
});

test('chaque lien est en https', () => {
  for (const r of resources) {
    assert.equal(new URL(r.url).protocol, 'https:', `${r.name} : ${r.url}`);
  }
});

test('chaque ressource a au moins une catégorie, et elles existent', () => {
  for (const r of resources) {
    assert.ok(r.cats.length > 0, r.name);
    for (const c of r.cats) assert.ok(catIds.has(c), `${r.name} : catégorie « ${c} » inconnue`);
  }
});

test('pas de doublon (nom ou lien)', () => {
  const norm = u => u.toLowerCase().replace('://www.', '://').replace(/\/$/, '');
  const names = new Map();
  const urls = new Map();
  for (const r of resources) {
    const n = r.name.toLowerCase().trim();
    assert.ok(!names.has(n), `nom en double : ${r.name}`);
    assert.ok(!urls.has(norm(r.url)), `lien en double : ${r.name} et ${urls.get(norm(r.url))}`);
    names.set(n, r.name);
    urls.set(norm(r.url), r.name);
  }
});

test('chaque catégorie contient au moins une ressource', () => {
  const used = new Set(resources.flatMap(r => r.cats));
  for (const id of catIds) assert.ok(used.has(id), `catégorie vide : ${id}`);
});
