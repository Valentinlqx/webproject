# Design System — AutoVinted (Vinted brand)

> Document de référence pour le design d'AutoVinted, calé sur le langage
> visuel et UX de **vinted.fr**. Utilisé comme spec pour [style.css](style.css).
>
> Ce thème est local à AutoVinted. La page parente
> [/mes-projets.html](../../mes-projets.html) suit son propre design
> (Phantom / Persona 5 — voir [/DESIGN.md](../../DESIGN.md)).

---

## 1. Vue d'ensemble

**Promesse :** *"Upload tes photos, l'IA rédige ton annonce Vinted optimisée."*
Le ton et l'apparence empruntent à Vinted directement — l'app est un add-on
de leur marketplace, donc l'utilisateur doit retrouver ses repères visuels.

**Mots-clés UX :** clarté, friction minimale, image-first, ludique, rassurant.

---

## 2. Palette

### Couleur signature — Vinted Teal

| Rôle | Hex | Token CSS | Usage |
|---|---|---|---|
| Teal primaire | `#09B1BA` | `--color-primary` | CTAs, liens, accents, bubbles user |
| Teal foncé (hover) | `#007782` | `--color-primary-dark` | Hover des CTAs, prix vendeur |
| Teal très clair | `#E0F7F8` | `--color-primary-light` | Backgrounds doux, focus rings, badges |

### Neutres (light)

| Rôle | Hex | Token | Usage |
|---|---|---|---|
| Noir texte | `#0F1419` | `--text` | Titres, prix, texte principal |
| Gris foncé | `#4A4A4A` | `--text-2` | Texte secondaire, métadonnées |
| Gris moyen | `#9B9B9B` | `--text-3` | Texte tertiaire, placeholders |
| Gris clair | `#E5E5E5` | `--border` | Bordures, séparateurs |
| Gris très clair | `#F7F7F7` | `--bg-soft` | Backgrounds de section |
| Blanc | `#FFFFFF` | `--bg`, `--bg-card` | Surface principale, cartes |

### Neutres (dark — variante AutoVinted, absente du Vinted réel)

Vinted.fr n'a pas de dark mode officiel, mais on en garde un pour l'app
locale. La teal reste fidèle, les surfaces s'inversent :

```css
body.dark {
  --bg:        #0D1418;
  --bg-card:   #151D22;
  --text:      #E6EDF1;
  --accent:    #2BC9D2;   /* teal légèrement éclaircie pour le contraste */
}
```

### Sémantique

| Rôle | Hex | Token | Usage |
|---|---|---|---|
| Vert succès | `#0CB477` | `--success` | Validation, "vendu", copy done |
| Rouge alerte | `#D8232F` | `--error` | Erreurs, suppression |
| Orange promo | `#FFA621` | `--warning` | Badges éditoriaux, warnings Vinted policy |

### Règles d'usage

- Le teal ne dépasse jamais **~15 %** de la surface visible — il **ponctue**.
- Le blanc domine **~70-80 %** des surfaces (light).
- Texte principal toujours en noir/gris foncé, **jamais teal sur fond blanc**
  pour du texte long (problème de contraste / fatigue).
- Prix mis en valeur en **teal foncé** `#007782` (token `--color-primary-dark`)
  pour l'effet "valeur" sans peser visuellement.

---

## 3. Typographie

```css
font-family: "Vinted Sans", -apple-system, BlinkMacSystemFont,
             "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Échelle

| Token | Taille | Line-height | Poids | Usage |
|---|---|---|---|---|
| `display` | 40-56 px | 1.1 | 700 | Hero, peu utilisé ici |
| `h1` | 28-32 px | 1.2 | 700 | Hero "✦ AutoVinted" |
| `h2` | 20-24 px | 1.25 | 700 | Titres modal ("Historique", "Paramètres") |
| `h3` | 18-20 px | 1.3 | 600 | Sous-sections |
| `body-l` | 16 px | 1.5 | 400 | Texte courant, descriptions |
| `body-m` | 14 px | 1.5 | 400 | Métadonnées, hints |
| `body-s` | 12 px | 1.4 | 400 | Légendes, mentions |
| `caption` | 11 px | 1.3 | 500 | Badges, étiquettes uppercase |

### Règles

- **Minuscules** par défaut sur les titres marketing (chaleureux).
- Les **chiffres / prix** en graisse 700.
- Tracking légèrement resserré sur les gros titres (`-0.01em`).
- **Pas d'italique** en interface — réservé éventuellement aux citations.

---

## 4. Spacing & layout

Échelle 4-px, tokens CSS :

```css
--space-xxs: 4px;   --space-xs:  8px;   --space-s:   12px;
--space-m:  16px;   --space-l:  24px;   --space-xl:  32px;
--space-xxl: 48px;
```

### Grille

- **Conteneur principal** : max-width 720 px (mobile-first single-column).
- **Desktop ≥ 1180 px** : 3 colonnes (history sidebar | main 720 px | settings sidebar).
- **Gouttières** : 16 px (mobile) / 24 px (desktop).

---

## 5. Radius

```css
--radius-s:    4px;     /* badges, labels */
--radius-sm:   8px;     /* inputs, petits chips */
--radius:     16px;     /* cartes, sections, modals */
--radius-pill: 999px;   /* boutons, segments, toasts */
```

**Convention** : tous les **boutons et inputs interactifs** sont en `--radius-pill`
(forme pilule), comme sur Vinted. Les **surfaces de contenu** (cartes, modals)
gardent un rayon moyen 16 px.

---

## 6. Composants

### 6.1 Boutons

| Variante | Classe CSS | Style |
|---|---|---|
| Primaire | `.btn-primary`, `.chat-send` | Teal plein, blanc texte, pill, hover → teal foncé |
| Secondaire | `.btn-ghost`, `.copy-btn` | Pill outlined teal, texte teal, hover → fond teal-light |
| Icône | `.icon-btn` | Cercle gris doux, hover → teint teal foncé |

États obligatoires :
- `default`, `hover`, `focus-visible` (ring `--accent-light`), `active` (scale 0.98), `disabled` (opacity 0.4).

### 6.2 Card produit / résultat

Structure type :

```
┌─────────────────────┐
│   [Image 3:4]       │   ratio portrait
│                     │
│   [Titre]           │   body-l 700, noir
│   [Description]     │   body-m 400, noir
│   [Détails grid]    │   small caps labels + valeurs
│   [Prix conseillés] │   teal foncé, 700
│   [Conseils]        │   bullet ✦ teal
└─────────────────────┘
```

Pas de bordure visible — séparation par espacement + ombre légère.

### 6.3 Inputs

- Border 1 px `--border`, radius `--radius-sm` (8 px) pour textarea/select,
  `--radius-pill` pour les inputs chat (effet barre de recherche Vinted).
- Focus : `border-color: var(--color-primary)` + `box-shadow: 0 0 0 3px var(--accent-light)`.

### 6.4 Modals & sidebars

- Mobile : sheet bottom 22 px de radius haut, slide-up.
- Desktop ≥ 1180 px : 2 panneaux sticky latéraux (history, settings), radius 16 px.

### 6.5 Bubbles chat

- **AI** : fond `--bg-soft` gris très clair, coin haut-gauche réduit (4 px).
- **User** : fond teal plein, texte blanc, coin haut-droit réduit (4 px).

---

## 7. Iconographie

- Style : caractères Unicode + emojis (📸, ✦, ?, ⚙, ☀️, ✕) — pas d'icon library.
- Les icônes décoratives (✦ avant les conseils) en teal `--color-primary`.

---

## 8. Voix & ton

- **Tutoiement systématique** : "tes photos", "ton annonce", "tu".
- **Phrases courtes**, verbes d'action en tête : "Analyser mes photos",
  "Copier toutes les annonces", "Recommencer".
- **Vocabulaire Vinted** : "annonce", "lot", "Pro" — pas "produit" ou "item".
- Pas d'urgence factice, pas de "!!".

---

## 9. Accessibilité

- Focus visible **JAMAIS retiré** :
  ```css
  *:focus-visible {
    outline: 3px solid var(--accent-light);
    outline-offset: 2px;
  }
  ```
- Touch targets ≥ 40 px (icon buttons : 40×40).
- Reduced motion respecté globalement.
- Contraste vérifié : teal `#007782` sur blanc = AA pour body-text.

---

## 10. Tokens — résumé technique

Voir [style.css](style.css) sections 1-5 pour le `:root` complet et la
variante `body.dark`. Tous les composants en aval consomment ces tokens —
ne pas hardcoder de hex en dehors du `:root`.

---

## 11. À NE PAS faire

- ❌ Texte teal sur fond blanc en prose longue (fatigue)
- ❌ Border-radius autre que les 4 tokens définis
- ❌ Boutons rectangulaires (sauf si toggle/segment) — toujours pilule
- ❌ Mélanger teal et noir comme accents simultanés
- ❌ Italique dans l'UI
- ❌ Ombres lourdes / blurry — Vinted est light-handed

---

*Document généré à partir d'une analyse de vinted.fr. Hex approximatifs à
valider en DevTools pour un usage en production strict.*
