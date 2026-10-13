// Copie dans projects/RessourcesGratuites/icons/ les icônes OpenMoji dont la page a besoin,
// et seulement celles-là. À relancer après avoir ajouté ou changé un emoji : npm run icons
import { readFileSync, readdirSync, copyFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import vm from 'node:vm';

const page = new URL('../projects/RessourcesGratuites/', import.meta.url);
const source = new URL('../node_modules/openmoji/color/svg/', import.meta.url);
const target = new URL('icons/', page);

const sandbox = {};
vm.runInNewContext(`${readFileSync(new URL('resources.js', page), 'utf8')};this.data = RESOURCES_DATA;`, sandbox);
const { families, resources } = sandbox.data;

const hex = cps => cps.map(cp => cp.toString(16).toUpperCase().padStart(4, '0')).join('-');
// Même nom que iconCode() dans script.js : sans le sélecteur de variante FE0F.
const nameOf = emoji => hex([...emoji].map(c => c.codePointAt(0)).filter(cp => cp !== 0xFE0F));

// « ✨ » sert à l'onglet « Tout ».
const emojis = new Set(['✨', ...families.map(f => f.emoji), ...resources.map(r => r.emoji)]);

mkdirSync(target, { recursive: true });
const wanted = new Set();
const missing = [];
for (const emoji of emojis) {
  const name = nameOf(emoji);
  // OpenMoji garde parfois le FE0F dans le nom du fichier (touches de clavier…).
  const file = [name, hex([...emoji].map(c => c.codePointAt(0)))].map(n => `${n}.svg`)
    .find(f => existsSync(new URL(f, source)));
  if (!file) { missing.push(`${emoji} (${name})`); continue; }
  copyFileSync(new URL(file, source), new URL(`${name}.svg`, target));
  wanted.add(`${name}.svg`);
}
for (const f of readdirSync(target)) if (!wanted.has(f)) rmSync(new URL(f, target));

console.log(`${wanted.size} icônes copiées.`);
if (missing.length) {
  console.error(`Absentes d'OpenMoji, à remplacer : ${missing.join(', ')}`);
  process.exitCode = 1;
}
