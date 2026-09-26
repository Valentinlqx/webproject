# Refonte du portfolio — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Accueil minimaliste avec photo et e-mail, AutoVinted avec une seule clé API, Ressources Gratuites corrigé, le tout couvert par des tests.

**Architecture:** Site statique sans build, qui doit aussi marcher en ouvrant les fichiers directement (file://) : donc scripts classiques, pas de modules ES. La logique testable de chaque projet sort dans un fichier `*-core.js` qui s'expose sur `globalThis` dans le navigateur et via `module.exports` sous Node. Les tests unitaires utilisent `node --test`, les tests navigateur Playwright avec un petit serveur statique Node.

**Tech Stack:** HTML/CSS/JS vanilla, Node 24 (`node:test`), `@playwright/test` (Chromium).

## Global Constraints

- Aucune dépendance à l'exécution ; `package.json` sert uniquement aux tests.
- Les pages doivent marcher en file:// comme en http.
- Pas de défilement horizontal de 320 à 1440px.
- Pas de réseaux sociaux ; e-mail provisoire `contact@exemple.fr`, marqué TODO.
- Ne pas changer le style d'AutoVinted ni de Ressources Gratuites.
- Commentaires rares, écrits comme par un humain ; pas de bandeaux `── … ──`.
- Un commit par tâche, poussé sur `main`, terminé par `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Modèles retenus (vérifiés le 2026-09-26)

| Fournisseur | Préfixe de clé | Modèles (défaut en premier) | $/1M in / out |
|---|---|---|---|
| Anthropic | `sk-ant-` | claude-opus-5, claude-sonnet-5, claude-haiku-4-5 | 5/25, 2/10, 1/5 |
| OpenAI | `sk-` | gpt-6-sol, gpt-6-luna, gpt-6-astra | 2/10, 0.10/0.50, 10/50 |
| Gemini | `AIza` | gemini-3.8-flash, gemini-3.5-flash-lite | 0.75/3.75, 0.30/2.50 |
| Mistral | 32 caractères alphanumériques | mistral-medium-latest, mistral-small-latest | 1.50/7.50, 0.15/0.60 |

Groq est retiré (3 images max par requête, un seul modèle vision). Les clés `gsk_` et OpenRouter `sk-or-` affichent un message dédié.

Particularités d'API :
- **OpenAI :** `max_completion_tokens`, pas de `temperature`.
- **Anthropic :** lire le premier bloc `type === 'text'`, gérer `stop_reason === 'refusal'`, repli serveur `fallbacks: "default"` avec l'en-tête `anthropic-beta: server-side-fallback-2026-07-01`.
- **Gemini :** concaténer les parts texte qui ne sont pas `thought`.
- **Tous :** marge de `max_tokens` à 16000, parce que la réflexion des modèles compte dedans.

---

### Task 1: Outillage de test

**Files:** Create `package.json`, `.gitignore`, `playwright.config.mjs`, `tests/serve.mjs`, `tests/e2e/smoke.spec.mjs`

- [ ] `package.json` : `"test": "node --test tests/unit/ && playwright test"`, `"test:unit"`, `"test:e2e"`, devDependency `@playwright/test`.
- [ ] `tests/serve.mjs` : serveur statique `node:http` sur le port 4173, racine = repo, bons types MIME, 404 sinon.
- [ ] `playwright.config.mjs` : `webServer` → `node tests/serve.mjs`, projet Chromium.
- [ ] `smoke.spec.mjs` : pour chaque page (`/`, AutoVinted, RG) × largeur (320, 375, 768, 1440) : aucune erreur console/page, `scrollWidth <= clientWidth`.
- [ ] Lancer : RG à 320/375 doit échouer (débordement connu) → confirme que le test attrape le bug.
- [ ] Commit.

### Task 2: Accueil

**Files:** Rewrite `index.html`, `style.css` ; Delete `assets/goya-caprichos-43.jpg`, `assets/fonts/LaBelleAurore.woff2`, `projects/ambience-forge/` ; Create `tests/e2e/home.spec.mjs`

- [ ] Test : h1 « Valentin L. », présence de `.portrait`, exactement 2 liens projet qui répondent en 200, un `mailto:`, aucun lien vers `ambience-forge`, aucun lien réseau social.
- [ ] Écrire `index.html` (colonne : figure.portrait avec placeholder, h1, p, section Projets en `ul`, section Contact) et `style.css` (tokens clair/sombre, `clamp`, cibles de 44px, flèche au survol souris uniquement, reduced-motion).
- [ ] Supprimer Goya, la police et Ambience Forge.
- [ ] Tests verts (home + smoke `/`). Commit.

### Task 3: AutoVinted — cœur testable

**Files:** Create `projects/AutoVinted/autovinted-core.js`, `tests/unit/autovinted-core.test.mjs`

Exporte `AutoVintedCore = { PROVIDERS, detectProvider, resolveModel, estimateCost, parseJSON, buildRequest, extractText, migrateLegacyKey }`.
- `detectProvider(key)` → `{ ok: true, id }` ou `{ ok: false, reason: 'empty'|'groq'|'openrouter'|'unknown' }` ; on retire les espaces ; ordre des tests : sk-ant- → sk-or- → sk- → AIza → gsk_ → /^[A-Za-z0-9]{32}$/.
- `resolveModel(id, stored)` → `stored` s'il fait partie de la liste, sinon le défaut.
- `estimateCost({ providerId, modelId, photos, textChars, listings })` → `{ inTokens, outTokens, eur }`.
- `parseJSON(text)` → objet ; tolère les blocs ``` et le texte autour ; lève une `Error` en français sinon.
- `buildRequest({ providerId, model, key, conversation, maxTokens })` → `{ url, init }` au format de chaque fournisseur.
- `extractText(providerId, data)` → string ; lève sur refus / réponse vide.
- `migrateLegacyKey(storage)` : si `av-key` est absent, reprend `av-key-<av-provider>` ou la première `av-key-*` trouvée (hors groq), puis l'écrit dans `av-key`.
- [ ] Écrire les tests d'abord (détection de chaque préfixe, espaces, clé vide, groq, openrouter ; resolveModel ; parseJSON avec 4 formes + erreur ; buildRequest pour chaque fournisseur, dont les règles OpenAI et Anthropic ci-dessus ; extractText avec bloc thinking en tête + refus ; migration).
- [ ] Voir les tests échouer, implémenter, les voir passer. Commit.

### Task 4: AutoVinted — branchement et relecture

**Files:** Modify `projects/AutoVinted/autovinted.html`, `script.js`, `style.css` (minimal) ; Create `tests/e2e/autovinted.spec.mjs`

- [ ] Test e2e : ouvrir les paramètres (sur desktop c'est un panneau latéral), taper `sk-ant-xxx` → le texte d'état contient « Claude » ; `gsk_…` → message Groq ; enregistrer → `localStorage['av-key']` est rempli ; une ancienne clé `av-key-openai` est migrée ; mocker `api.anthropic.com` (via `page.route`) avec une réponse `generate` → le titre du résultat s'affiche.
- [ ] Paramètres : remplacer le select de fournisseur et les champs de clé par un seul champ + une ligne d'état (`aria-live`) + un `<details>` « Choisir le modèle » + des liens vers les clés.
- [ ] `script.js` : utiliser `AutoVintedCore` ; supprimer `PROVIDERS`/`PRICING`/les appels par fournisseur/`callPollinations`/`compressThumbnail`/le monkey-patch de `renderPreviews`/le double écouteur de mode ; corriger le double sélecteur de fichiers, l'erreur de `downscaleImage` (+ `revokeObjectURL`), « copier toutes les annonces », `JSON.parse` de l'historique, le texte du tutoriel (Groq) ; `aria-label` sur les boutons icônes ; nettoyer les commentaires.
- [ ] Tests verts. Commit.

### Task 5: Ressources Gratuites

**Files:** Create `projects/RessourcesGratuites/rg-core.js`, `tests/unit/rg-core.test.mjs`, `tests/unit/rg-data.test.mjs`, `tests/e2e/rg.spec.mjs` ; Modify `ressourcesgratuites.html`, `script.js`, `style.css`

- [ ] `RGCore = { filterResources(resources, cats, q), countWith(resources, cats, catId, q), parseHash(hash), buildHash(cats, q) }` ; supprimer le cas spécial « opensource par défaut » qui fait que l'URL et l'état ne correspondent plus.
- [ ] Tests de données : chaque ressource a name/desc/url https valide/emoji/cats non vide, chaque cat existe, pas d'URL ni de nom en double, status ∈ {free, freemium}.
- [ ] e2e : cliquer sur une catégorie filtre la grille et met à jour le hash ; le changement de langue marche ; pas de débordement à 320/375.
- [ ] Corriger : débordement de la grille des catégories sur mobile, `</div>` manquant, `&lt;` dans le bouton retour, écouteur `keydown` vide, script Phosphor inutilisé (le retirer s'il ne sert pas), commentaires.
- [ ] Tests verts. Commit.

### Task 6: Finition

- [ ] `npm test` complet ; captures à 375 et 1440 des 3 pages, vérifiées à l'œil.
- [ ] Mettre à jour la mémoire du projet (état final, où mettre la photo, où changer l'e-mail, comment lancer les tests, points ouverts : `aajouter.txt`).
- [ ] Commit + push.
