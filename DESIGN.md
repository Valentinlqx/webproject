# DESIGN.md — Phantom Style System

> Système de design pour la page **Mes Projets** et le sous-dossier `mesprojets/`.
> Inspiré directement de **Persona 5 Royal** (Atlus, art director Masayoshi Suto).
> Palette signature **verte** (alternative au rouge cramoisi original).
> Fond de page principal : **jaune pétant `#FFD60A`**.
>
> ⚠️ Ce thème est local à la page **mes-projets**. Les autres pages du site
> (index, mes-prestations, AutoVinted, RessourcesGratuites…) gardent leur
> propre identité graphique.

---

## 1. Philosophie — 8 principes non-négociables

1. **Unité chromatique radicale** — 3 primaires + 2-3 accents max.
2. **Asymétrie maîtrisée** — tout en biais −2° à −8°, jamais aligné droit.
3. **Collage revendiqué** — éléments qui se chevauchent, débordent.
4. **Mouvement permanent** — 200-400 ms max, jamais plus.
5. **Contraste maximum** — aplats purs, pas de gradients doux.
6. **Coupes nettes** — clip-path triangles/parallélogrammes, jamais de coins arrondis.
7. **Typographie déformée** — italique skew −6° à −10°, graisse max sur titres.
8. **Hiérarchie disciplinée** — chaque info a sa zone.

---

## 2. Palette

```css
:root {
  /* Fond principal */
  --bg-page:           #FFD60A;   /* Jaune pétant — fond de page */

  /* Dominantes sur fond jaune */
  --p-mask:            #0A0A0A;   /* Noir — texte ET fond bouton primary */
  --p-phantom:         #00B852;   /* Vert moyen — accent principal */
  --p-velvet:          #001F0E;   /* Vert très sombre — alternative au noir */

  /* Secondaires */
  --p-note:            #FAFAF5;   /* Blanc cassé — texte sur blocs noirs */
  --p-card:            #FF2E63;   /* Magenta — accent rare CTAs ultra-importants */
  --p-cognitive:       #00E5FF;   /* Cyan — data, stats (très rare) */

  /* Hover / active */
  --p-phantom-hover:   #00FF6B;   /* Vert vif — uniquement en hover/active */
  --p-phantom-dark:    #007D38;   /* Vert très foncé — pressed state */

  /* Typo */
  --font-display:      "Anton", "Archivo Black", sans-serif;
  --font-body:         "Inter", system-ui, sans-serif;
  --font-mono:         "Space Mono", "JetBrains Mono", monospace;

  /* Easings */
  --ease-snap:         cubic-bezier(0.83, 0, 0.17, 1);
  --ease-overshoot:    cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Distribution couleur recommandée

- **60 %** jaune (fond, respiration)
- **25 %** noir (texte, boutons primaires, formes structurelles)
- **10 %** vert (accents fonctionnels, hover, badges actifs)
- **5 %** blanc + magenta (texte sur noir + détails)

---

## 3. Typographie

| Niveau     | Police     | Taille  | Graisse | Letter-spacing | Cas d'usage              |
|------------|------------|---------|---------|----------------|--------------------------|
| XL Display | Anton      | 18-24px | 900     | −0.02em        | Hero CTA, "Start the work" |
| Standard   | Inter      | 13-15px | 900     | 0.15em         | Boutons primaires        |
| Compact    | Inter      | 11-12px | 700     | 0.2em          | Tags, labels, métadata   |
| Mono       | Space Mono | 11px    | 700     | 0.15em         | Boutons techniques       |

### Règles typo boutons

- **TOUJOURS en UPPERCASE** pour les boutons standards et compacts.
- **Letter-spacing obligatoire** : 0.15em minimum sur les CAPS.
- **Italique** uniquement pour les boutons XL Display (skewX(−6deg)).
- **Pictogramme préfixe** systématique : `▶ ★ ◀ ◆ ▼ ⚡ ×`.

---

## 4. Composants boutons

### 4.1 Primary Button — action principale
- Fond `--p-mask` noir, texte `--p-note` blanc
- Padding 12px 28px (mobile 10px 20px)
- Font Inter Black 13px / letter-spacing 0.15em / UPPERCASE
- `transform: rotate(-1deg)`
- `clip-path: polygon(3% 0, 100% 0, 97% 100%, 0 100%)`
- `box-shadow: 4px 4px 0 var(--p-phantom)` (offset solide, pas de blur)
- Hover : `translate(-2px, -2px)` + shadow `6px 6px 0 var(--p-phantom)`
- Active : `translate(2px, 2px)` + shadow `0 0 0 var(--p-phantom)`
- Transition `all 150ms var(--ease-overshoot)`

### 4.2 Secondary Button — action secondaire
- Fond `--p-phantom` vert, texte `--p-mask` noir
- Border `2px solid var(--p-mask)`
- Reste identique au Primary
- Hover : fond devient `--p-phantom-hover`

### 4.3 Ghost Button — action tertiaire / annulation
- Fond transparent, texte noir
- Border `2px solid var(--p-mask)`
- Padding 10px 24px
- Hover : fond devient noir, texte devient blanc, scale 1.02

### 4.4 Icon Button — bouton carré pour icône seule
- 44×44px (touch target WCAG minimum)
- Fond noir, icône verte 18px
- `clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%)`
- Hover : icône passe en `--p-phantom-hover` + rotation −3°

### 4.5 Calling Card Button — CTA Hero / Contact
- Fond noir, texte blanc
- Font Anton 18-24px italique `skewX(-6deg)`, UPPERCASE
- Padding 16px 36px
- DOUBLE shadow : `6px 6px 0 var(--p-phantom), 12px 12px 0 var(--p-card)`
- `transform: rotate(-2deg)`
- Pictogramme `▶` à 1.4em
- Hover : translation −3px,−3px + shadows élargies à 9/9 et 15/15

### 4.6 Tag / Pill Button — chip de filtre
- Fond transparent, texte noir
- Border `1.5px solid var(--p-mask)`
- Padding 4px 12px
- Font Inter Black 11px UPPERCASE letter-spacing 0.2em
- `transform: rotate(-1deg)` (alternance ±1° pour groupes)
- État actif : fond noir, texte vert `--p-phantom`

---

## 5. États obligatoires

Chaque bouton DOIT implémenter : `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`.

### Focus visible (a11y — JAMAIS retiré)

```css
.phantom-button:focus-visible {
  outline: 3px solid var(--p-mask);
  outline-offset: 4px;
}
```

---

## 6. Animations

### Durées standard
- Hover : **150 ms**
- Active : **80 ms**
- Entrée de composant : **300-400 ms** avec overshoot
- Transition de page : **500-700 ms** max

### Accessibilité motion (OBLIGATOIRE)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

---

## 7. Pictogrammes

| Symbole | Sens                  | Usage                         |
|---------|-----------------------|-------------------------------|
| `▶`     | Action / play / next  | Boutons primaires, CTAs       |
| `★`     | Sélection / featured  | Bouton "projet phare"         |
| `◀`     | Retour                | Bouton "Retour"               |
| `◆`     | Catégorie / filtre    | Tags de catégories            |
| `◇`     | Compétence / skill    | Boutons stats / about         |
| `▼`     | Scroll / down         | "Explorer plus bas"           |
| `⚡`     | Rapide / urgent       | "Contact rapide"              |
| `×`     | Fermer / annuler      | Modal close                   |

---

## 8. À NE PAS faire

- ❌ Border-radius > 2px
- ❌ Gradients sur fonds de boutons
- ❌ Boutons centrés sans rotation
- ❌ Police sans letter-spacing en CAPS
- ❌ Plus de 3 boutons primaires visibles simultanément
- ❌ Boutons sans state hover / focus / active
- ❌ Vert pur `#00FF6B` en texte sur fond jaune (contraste insuffisant)
- ❌ Animations qui ignorent `prefers-reduced-motion`

---

## 9. Implémentation dans ce repo

- Feuille de style : [mesprojets/phantom.css](mesprojets/phantom.css)
- Page consommatrice : [mes-projets.html](mes-projets.html)
  - Le `<body>` reçoit la classe `phantom-page` qui isole le scope.
- Les sous-pages [mesprojets/AutoVinted/](mesprojets/AutoVinted/) et
  [mesprojets/RessourcesGratuites/](mesprojets/RessourcesGratuites/) conservent
  leur propre design et **n'importent pas** `phantom.css`.

---

## 10. Sources & références

- **Persona 5 Royal** (Atlus, 2019) — art director Masayoshi Suto, lead motion Masanari Okagawa
- Game UI Database — `gameuidatabase.com/games/persona-5-royal`
- Art of the Title — `artofthetitle.com/title/persona-5/`
- Famitsu Interview Suto (2016) — décisions de DA originales
