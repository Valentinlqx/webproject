import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const { iconCode } = createRequire(import.meta.url)('../../projects/RessourcesGratuites/rg-core.js');

// resources.js est un script de navigateur (const RESOURCES_DATA = …) : on l'exécute dans un bac à sable.
const dir = new URL('../../projects/RessourcesGratuites/', import.meta.url);
const sandbox = {};
vm.runInNewContext(`${readFileSync(new URL('resources.js', dir), 'utf8')};this.data = RESOURCES_DATA;`, sandbox);
const { checked, families, categories, licenses, legacyCats, resources } = sandbox.data;
const familyIds = new Set(families.map(f => f.id));
const catIds = new Set(categories.map(c => c.id));
const licenseIds = new Set(licenses.map(l => l.id));

const bilingual = (value, where) => {
  for (const lang of ['fr', 'en']) {
    assert.equal(typeof value?.[lang], 'string', `${where} : ${lang} manquant`);
    assert.ok(value[lang].trim(), `${where} : ${lang} vide`);
  }
};

test('la date de vérification est une vraie date', () => {
  assert.match(checked, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(!Number.isNaN(Date.parse(checked)));
});

test('familles, sous-catégories et licences ont un id unique et un libellé dans les deux langues', () => {
  for (const [list, ids] of [[families, familyIds], [categories, catIds], [licenses, licenseIds]]) {
    assert.equal(ids.size, list.length);
    for (const item of list) bilingual(item, item.id);
  }
  for (const l of licenses) bilingual(l.hint, `${l.id} (explication)`);
});

test('chaque sous-catégorie appartient à une famille, et chaque famille en a', () => {
  for (const c of categories) assert.ok(familyIds.has(c.family), `${c.id} : famille « ${c.family} » inconnue`);
  for (const f of families) assert.ok(categories.some(c => c.family === f.id), `famille vide : ${f.id}`);
});

test('les anciens liens mènent à une sous-catégorie ou une licence qui existe', () => {
  for (const [old, cat] of Object.entries(legacyCats)) {
    assert.ok(cat === null ? true : catIds.has(cat), `${old} → ${cat}`);
  }
});

test('chaque ressource est complète', () => {
  for (const r of resources) {
    for (const field of ['name', 'url', 'emoji', 'licenseName']) {
      assert.equal(typeof r[field], 'string', `${r.name} : ${field}`);
      assert.ok(r[field].trim(), `${r.name} : ${field} vide`);
    }
    bilingual(r.desc, r.name);
    assert.equal(typeof r.account, 'boolean', `${r.name} : account`);
  }
});

test('chaque ressource a une licence connue', () => {
  for (const r of resources) assert.ok(licenseIds.has(r.license), `${r.name} : licence « ${r.license} » inconnue`);
});

test('chaque lien est en https', () => {
  for (const r of resources) assert.equal(new URL(r.url).protocol, 'https:', `${r.name} : ${r.url}`);
});

test('chaque ressource a au moins une sous-catégorie, et elles existent', () => {
  for (const r of resources) {
    assert.ok(r.cats.length > 0, r.name);
    for (const c of r.cats) assert.ok(catIds.has(c), `${r.name} : sous-catégorie « ${c} » inconnue`);
    assert.equal(new Set(r.cats).size, r.cats.length, `${r.name} : sous-catégorie en double`);
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

test('chaque sous-catégorie et chaque licence sert au moins une fois', () => {
  const usedCats = new Set(resources.flatMap(r => r.cats));
  for (const id of catIds) assert.ok(usedCats.has(id), `sous-catégorie vide : ${id}`);
  const usedLicenses = new Set(resources.map(r => r.license));
  for (const id of licenseIds) assert.ok(usedLicenses.has(id), `licence jamais utilisée : ${id}`);
});

test('chaque icône est copiée dans icons/ (npm run icons)', () => {
  const emojis = new Set(['✨', ...families.map(f => f.emoji), ...resources.map(r => r.emoji)]);
  const missing = [...emojis].filter(e => !existsSync(new URL(`icons/${iconCode(e)}.svg`, dir)));
  assert.deepEqual(missing, []);
});
