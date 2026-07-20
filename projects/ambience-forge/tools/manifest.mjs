// Rebuilds sounds/manifest.json from the folders in sounds/.
// Usage: node tools/manifest.mjs
// Drop .wav/.mp3/.ogg files into sounds/<category>/ and re-run.
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOUNDS = join(ROOT, "sounds");
const EXTS = /\.(wav|mp3|ogg|flac)$/i;

const manifest = {};
for (const cat of readdirSync(SOUNDS).sort()) {
  const dir = join(SOUNDS, cat);
  if (!statSync(dir).isDirectory()) continue;
  const files = readdirSync(dir).filter(f => EXTS.test(f)).sort();
  if (files.length) manifest[cat] = files;
}

writeFileSync(join(SOUNDS, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
const total = Object.values(manifest).reduce((n, f) => n + f.length, 0);
console.log(`manifest.json: ${Object.keys(manifest).length} categories, ${total} sounds`);
