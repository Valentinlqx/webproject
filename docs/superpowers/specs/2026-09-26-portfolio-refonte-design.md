# Refonte du portfolio — design

Date : 2026-09-26. Validé par Valentin avant implémentation.

## Objectif

Un site portfolio sobre pour un graphiste indépendant : une page d'accueil avec photo, présentation, deux projets et un e-mail. Les deux projets gardés (AutoVinted, Ressources Gratuites) sont relus en profondeur et gardent leur direction artistique.

## Hors périmètre

- Mention de l'hôpital ou de travaux clients.
- Réseaux sociaux.
- Changer le style d'AutoVinted (clone Vinted) ou de Ressources Gratuites (Balatro).

## 1. Accueil

Fichiers : `index.html`, `style.css` (réécrits).

- Une colonne alignée à gauche, max ~36rem, marges généreuses.
- Ordre : photo → nom → présentation → projets → contact.
- Photo : cadre 3:4, ~160px de large. Sans image, le cadre affiche « photo » sur fond gris. Remplacement : déposer `assets/portrait.jpg` et décommenter/changer une ligne dans `index.html`.
- Nom : « Valentin L. » (h1).
- Présentation : « Graphiste indépendant. Affiches, identités visuelles, vidéo et motion — et parfois de petits outils web. »
- Projets (liste, flèche →) :
  - Ressources Gratuites — « Une sélection de ressources gratuites pour designers. »
  - AutoVinted — « Des photos à l'annonce Vinted, rédigée par l'IA. »
- Contact : lien `mailto:` vers une adresse provisoire `contact@exemple.fr`, marquée `TODO` dans le HTML (un seul endroit).
- Style : sans serif système, encre #111 sur #fafaf8, un accent pour les liens, mode sombre via `prefers-color-scheme`, rayon 0, pas d'ombre. Seule animation : la flèche glisse de quelques px au survol (souris uniquement, coupée par `prefers-reduced-motion`).
- Responsive : colonne fluide, tailles en `clamp()`, cibles tactiles ≥ 44px. Pas de défilement horizontal de 320 à 1440px.
- Suppressions : `assets/goya-caprichos-43.jpg`, `assets/fonts/LaBelleAurore.woff2`, `projects/ambience-forge/`.

## 2. AutoVinted — une seule clé API

- Un seul champ « Clé API » dans les paramètres. Le fournisseur est déduit du préfixe :
  - `sk-ant-` → Anthropic
  - `AIza` → Gemini
  - `gsk_` → Groq
  - `sk-` → OpenAI
  - 32 caractères alphanumériques sans préfixe → Mistral
  - autre → message « clé non reconnue »
- Retour en direct sous le champ : fournisseur détecté, modèle, coût estimé par annonce.
- Modèle par défaut choisi par fournisseur ; volet repliable « Choisir le modèle ». Liste de modèles et prix vérifiés en ligne le jour de l'implémentation ; modèles retirés supprimés.
- Migration : au chargement, si l'ancien stockage (`av-provider` + `av-key-<id>`) contient une clé, elle devient la clé unique (`av-key`).
- La logique (détection, choix du modèle, estimation, parsing JSON) vit dans un module de fonctions pures testable sous Node, chargé par le HTML avant `script.js`.

## 3. Relecture des deux projets

Bugs connus à corriger :
- Ressources Gratuites : la grille de catégories à 2 colonnes déborde à 375px (scrollWidth 490).
- Ressources Gratuites : `<div class="page-panel">` jamais fermé ; `<` brut dans le bouton retour.
- AutoVinted : code mort (`callPollinations`, écouteurs vides, etc.).

À vérifier : échappement HTML de tout ce qui vient de l'IA ou des données, historique, tutoriel, mode lot, copie, thème, accessibilité (focus, labels), liens morts dans `resources.js`.

`aajouter.txt` : demander à Valentin avant d'ajouter ces sites.

Commentaires : retirer les bandeaux décoratifs et les commentaires qui paraphrasent ; garder les rares « pourquoi », écrits simplement.

## 4. Tests

- `package.json` de dev à la racine (le site n'en dépend pas).
- `node --test` : détection de clé, choix du modèle, estimation, parsing JSON, filtres et état d'URL de Ressources Gratuites, intégrité des données (URLs https valides, catégories existantes, pas de doublons).
- Playwright : les 3 pages à 320 / 375 / 768 / 1440px — aucune erreur console, pas de défilement horizontal, liens internes valides, aucun lien vers Ambience Forge, détection de clé dans l'interface, filtre de catégories.
- `npm test` lance tout.

## 5. Suivi

Mémoire Claude du projet mise à jour à chaque étape. Un commit par étape logique, poussé sur `main`.
