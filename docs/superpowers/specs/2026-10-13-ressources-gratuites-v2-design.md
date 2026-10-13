# Ressources Gratuites v2 — design

Date : 2026-10-13. Choix de Valentin (questions posées le jour même).

## Objectif

Une liste de ressources **vraiment gratuites**, chacune avec un signal de licence clair, mieux rangée, et plus fournie.

## Règles d'entrée

- 100 % gratuit : rien derrière un paiement (pas de freemium : Freepik, Flaticon, Envato… sortent).
- Un compte gratuit est accepté, signalé par « compte requis ».
- Les ressources « usage perso uniquement » restent, avec leur badge ; un filtre les masque.
- Plus de catégories IA (Outils IA, Skills IA) : la page reste centrée sur la création.
- Un site mort, devenu payant ou freemium (confirmé par une source sûre) est retiré directement.

## Licences

Contenu (ce qu'on télécharge) : 5 badges.

| id | Badge | Licences typiques |
|---|---|---|
| `cc0` | Libre total | CC0, domaine public |
| `pro` | Usage pro OK | Unsplash/Pexels/Pixabay License, OFL, MIT pour des icônes… : commercial, sans crédit |
| `credit` | Crédit obligatoire | CC BY, CC BY-SA |
| `perso` | Perso uniquement | CC BY-NC, « free for personal use » |
| `mixte` | Selon le fichier | Sites qui mélangent (OpenGameArt, Freesound…) |

Outils et logiciels : 2 badges, `opensource` (Open source) et `outil` (Outil gratuit). Ce qu'on crée avec reste à soi.

Chaque ressource porte aussi `licenseName`, le nom exact (« Unsplash License », « CC0 », « SIL OFL 1.1 », « GPL-3.0 »), affiché en petit sous le badge : pas de survol, pour que ça marche au doigt.

## Rangement

7 familles, chacune avec ses sous-catégories. Une ressource peut avoir plusieurs sous-catégories, y compris dans des familles différentes.

- **Visuels** : Photos, Illustrations, Icônes, Détourés (PNG), Textures & motifs, Brushes, Mockups, Couleurs
- **Typo** : Polices, Outils typo
- **Son** : Effets sonores, Musique
- **Vidéo & Motion** : Vidéos, Templates & VFX
- **3D & Jeux** : 3D & HDRI, Assets de jeu
- **Logiciels & Web** : Logiciels, Utilitaires en ligne, Web & CSS
- **Apprendre** : Tutos & docs, Inspiration

« Open Source » n'est plus une catégorie : c'est un badge.

## Page

- Familles en onglets (Tout + 7). Une famille choisie affiche ses sous-catégories (plusieurs à la fois = l'une ou l'autre).
- Filtres licence (plusieurs à la fois = l'un ou l'autre) et « sans compte ».
- Recherche : nom, description, sous-catégories, licence ; sans tenir compte des accents ni des majuscules.
- Compteurs à jour sur chaque bouton.
- L'URL garde tout (`#f=visuels&c=photos&l=cc0,pro&q=papier&nc=1`) ; les anciens liens `#cats=…` sont traduits.
- Mini-guide des badges (repliable).
- Bas de page : date de vérification des licences, rappel de toujours relire la licence sur le site, crédits (OpenMoji CC BY-SA 4.0, polices sous OFL).
- Descriptions en français et en anglais.
- Style Balatro gardé et poussé : badges en sceaux/étiquettes, familles en cartes.

## Code

- Icônes OpenMoji copiées dans le site (`icons/`), plus aucun appel au CDN.
- `localStorage` protégé (navigation privée).
- `rg-core.js` : filtres, recherche, compteurs, URL ; testé sous Node.
- Tests de données : licence connue, `licenseName`, descriptions FR et EN, sous-catégories existantes, URLs https uniques, icône présente.
