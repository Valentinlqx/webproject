# DESIGN.md — Phantom Style System

> Système de design pour portfolio web freelance.
> Inspiré directement de **Persona 5 Royal** (Atlus, art director Masayoshi Suto).
> Palette signature **verte** (alternative au rouge cramoisi original).
> Fond de page principal : **jaune pétant**.

---

## 1. Philosophie

Le style repose sur **8 principes structurels** qui ne sont jamais négociables :

1. **Unité chromatique radicale** — palette ultra-restreinte (3 couleurs primaires + 2-3 accents).
2. **Asymétrie maîtrisée** — tous les éléments légèrement en biais (-2° à -8°), jamais alignés droit.
3. **Collage revendiqué** — les éléments sont "collés" sur la scène, ils se chevauchent, débordent.
4. **Mouvement permanent** — animations courtes mais omniprésentes (200-400ms, jamais plus).
5. **Contraste maximum** — aplats purs, jamais de gradients doux, jamais de gris colorés.
6. **Coupes nettes** — clip-path triangles/parallélogrammes, jamais de coins arrondis.
7. **Typographie déformée** — italique skew(-6° à -10°), graisse maximale sur les titres.
8. **Hiérarchie disciplinée** — derrière le chaos apparent, chaque info a sa zone.

---

## 2. Palette adaptée au fond jaune

### 2.1 Couleurs principales

```css
:root {
  /* === FOND PRINCIPAL === */
  --bg-page: #FFD60A;          /* Jaune pétant — fond de page */

  /* === COULEURS DOMINANTES sur fond jaune === */
  --p-mask: #0A0A0A;           /* Noir — couleur de texte principale, dominante */
  --p-phantom: #00B852;        /* Vert moyen — accent principal (le vert vif #00FF6B 
                                  perd trop de contraste sur jaune, on descend en intensité) */
  --p-velvet: #001F0E;         /* Vert très sombre — alternative au noir pur 
                                  pour les blocs avec un sous-ton vert */

  /* === COULEURS SECONDAIRES === */
  --p-note: #FAFAF5;           /* Blanc cassé — texte sur blocs noirs */
  --p-card: #FF2E63;           /* Magenta — accent rare pour CTAs ultra-importants */
  --p-cognitive: #00E5FF;      /* Cyan — data, stats, infos chiffrées (très rare) */

  /* === VARIANTES VERT POUR HOVER / ACTIVE === */
  --p-phantom-hover: #00FF6B;  /* Le vert plus vif est utilisé en hover/active uniquement */
  --p-phantom-dark: #007D38;   /* Vert encore plus foncé pour pressed state */
}
```

### 2.2 Règles d'usage sur fond jaune

| Élément | Couleur recommandée | Pourquoi |
|---------|---------------------|----------|
| Texte body | `--p-mask` (noir) | Contraste WCAG AAA sur jaune |
| Titres display | `--p-mask` (noir) | Lecture immédiate |
| Boutons primaires — fond | `--p-mask` (noir) | Action principale ressort sur le jaune |
| Boutons primaires — texte | `--p-note` (blanc) | Lisible sur noir |
| Boutons secondaires — fond | `--p-phantom` (vert) | Accent qui ne casse pas le jaune |
| Boutons secondaires — texte | `--p-mask` (noir) | Contraste OK vert moyen / noir |
| Bordures décoratives | `--p-mask` (noir) | Renforce le style "collé" |
| Détails / accents | `--p-card` magenta | Stamps, badges urgents UNIQUEMENT |

### 2.3 Distribution recommandée

- **60% jaune** (fond, respiration)
- **25% noir** (texte, boutons primaires, formes structurelles)
- **10% vert** (accents fonctionnels, hover, badges actifs)
- **5% blanc + magenta** (texte sur noir + détails)

---

## 3. Typographie

```css
:root {
  --font-display: "Anton", "Archivo Black", sans-serif;     /* Titres XL + boutons display */
  --font-body: "Inter", system-ui, sans-serif;              /* Corps de texte */
  --font-mono: "Space Mono", "JetBrains Mono", monospace;   /* Data, codes, stats */
}
```

### 3.1 Hiérarchie de boutons

| Niveau | Police | Taille | Graisse | Letter-spacing | Cas d'usage |
|--------|--------|--------|---------|----------------|-------------|
| XL Display | Anton | 18-24px | 900 | -0.02em | Hero CTA, "Start the work" |
| Standard | Inter | 13-15px | 900 | 0.15em | Boutons primaires partout |
| Compact | Inter | 11-12px | 700 | 0.2em | Tags, labels, métadata |
| Mono | Space Mono | 11px | 700 | 0.15em | Boutons techniques, codes |

### 3.2 Règles typo boutons

- **TOUJOURS en UPPERCASE** pour les boutons standards et compacts.
- **Letter-spacing obligatoire** : 0.15em minimum sur les CAPS, jamais moins.
- **Italique** uniquement pour les boutons XL Display (skewX(-6deg) en CSS).
- **Pictogramme préfixe** systématique : `▶`, `★`, `◆`, `✦`, `▼`, `⚡`.

---

## 4. Composants boutons

### 4.1 Anatomie d'un bouton Phantom

```
┌─────────────────────────────┐
│ ▶ NOM DU BOUTON            │  ← Pictogramme + label CAPS letter-spaced
└─────────────────────────────┘
   ↑                       ↑
   rotation -1° à -2°       coupe diagonale subtile (clip-path)
   ombre portée optionnelle ou bordure noire 1.5-2px
```

### 4.2 Spécifications par variante

#### **Primary Button** — action principale

- **Fond** : `--p-mask` (#0A0A0A noir)
- **Texte** : `--p-note` (#FAFAF5 blanc)
- **Padding** : 12px 28px (mobile : 10px 20px)
- **Font** : Inter Black 13px / letter-spacing 0.15em / UPPERCASE
- **Border** : aucune
- **Transform** : `rotate(-1deg)`
- **Clip-path** : `polygon(3% 0, 100% 0, 97% 100%, 0 100%)` (parallélogramme léger)
- **Shadow** : `4px 4px 0 var(--p-phantom)` (offset solide vert, pas de blur)
- **Hover** : `transform: translate(-2px, -2px) rotate(-1deg)` + shadow devient `6px 6px 0 var(--p-phantom)`
- **Active** : `transform: translate(2px, 2px) rotate(-1deg)` + shadow `0 0 0 var(--p-phantom)`
- **Transition** : `all 150ms cubic-bezier(0.34, 1.56, 0.64, 1)`

#### **Secondary Button** — action secondaire

- **Fond** : `--p-phantom` (#00B852 vert)
- **Texte** : `--p-mask` (#0A0A0A noir)
- **Border** : `2px solid var(--p-mask)`
- **Reste** : identique à primary
- **Hover** : fond devient `--p-phantom-hover` (#00FF6B)

#### **Ghost Button** — action tertiaire / annulation

- **Fond** : transparent
- **Texte** : `--p-mask` noir
- **Border** : `2px solid var(--p-mask)` (épaisse, marquée)
- **Padding** : 10px 24px
- **Transform** : `rotate(-1deg)`
- **Hover** : fond devient `var(--p-mask)` noir, texte devient blanc, transform `rotate(-1deg) scale(1.02)`

#### **Icon Button** — bouton carré pour icône seule

- **Taille** : 44x44px (touch target minimum)
- **Fond** : `--p-mask` noir
- **Icône** : `--p-phantom` vert, 18px
- **Border** : aucune
- **Clip-path** : `polygon(10% 0, 100% 0, 90% 100%, 0 100%)`
- **Hover** : icône passe en `--p-phantom-hover` + rotation -3°

#### **Calling Card Button** — bouton spécial CTA majeur (Hero / Contact)

- **Fond** : `--p-mask` noir
- **Texte** : `--p-note` blanc
- **Font** : Anton 18-24px italique skewX(-6deg), CAPS, letter-spacing 0.05em
- **Padding** : 16px 36px
- **Shadow** : `6px 6px 0 var(--p-phantom)`, `12px 12px 0 var(--p-card)` (double offset, vert + magenta)
- **Transform** : `rotate(-2deg)`
- **Pictogramme** : `▶` plus gros (1.4em) avant le texte
- **Hover** : translation -3px,-3px + les shadows s'élargissent à 9/9 et 15/15

#### **Tag / Pill Button** — chip de filtre / tag

- **Fond** : `transparent`
- **Texte** : `--p-mask` noir
- **Border** : `1.5px solid var(--p-mask)`
- **Padding** : 4px 12px
- **Font** : Inter Black 11px / letter-spacing 0.2em / UPPERCASE
- **Transform** : `rotate(-1deg)` (alternance ±1° pour groupes)
- **État actif** : fond devient `--p-mask` noir, texte devient `--p-phantom` vert

### 4.3 États à TOUJOURS implémenter

1. **default** — état au repos
2. **hover** — survol curseur
3. **focus** — navigation clavier (outline visible OBLIGATOIRE pour a11y)
4. **active / pressed** — pendant le clic
5. **disabled** — désactivé (opacity: 0.4, cursor: not-allowed, shadow retirée)
6. **loading** — pour les actions async (icône qui tourne ou pulse)

### 4.4 Focus states (accessibilité)

```css
.phantom-button:focus-visible {
  outline: 3px solid var(--p-mask);
  outline-offset: 4px;
}
```

Ne JAMAIS retirer le focus visible. C'est obligatoire WCAG.

---

## 5. Animations

```css
:root {
  --ease-snap: cubic-bezier(0.83, 0, 0.17, 1);          /* Transitions rapides */
  --ease-overshoot: cubic-bezier(0.34, 1.56, 0.64, 1);  /* Entrées avec rebond */
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);      /* Sorties douces */
}
```

### 5.1 Durées standard

- **Hover** : 150ms
- **Active / pressed** : 80ms (très rapide)
- **Entrée de composant** : 300-400ms avec overshoot
- **Transition de page** : 500-700ms maximum

### 5.2 Accessibilité motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

**OBLIGATOIRE** — à inclure dans tous les composants animés.

---

## 6. Pictogrammes utilisés

| Symbole | Sens | Usage |
|---------|------|-------|
| `▶` | Action / play / next | Boutons primaires, CTAs |
| `★` | Sélection / featured | Boutons "voir le projet phare" |
| `◆` | Catégorie / filtre | Tags de catégories |
| `✦` | Compétence / skill | Boutons stats / about |
| `▼` | Scroll / down | Bouton "explorer plus bas" |
| `⚡` | Rapide / urgent | Boutons "contact rapide" |
| `×` | Fermer / annuler | Bouton modal close |

---

## 7. Exemples concrets

### 7.1 CTA Hero (page d'accueil)

```html
<button class="phantom-cta-hero">
  <span class="picto">▶</span>
  <span class="label">START THE WORK</span>
</button>
```

→ Calling Card Button, fond noir, texte blanc, double shadow vert + magenta, rotation -2°.

### 7.2 Bouton "Voir le projet" sur une card

```html
<button class="phantom-button-primary">
  ★ VOIR LE PROJET
</button>
```

→ Primary Button, fond noir, texte blanc, shadow verte, rotation -1°.

### 7.3 Filtre de catégorie

```html
<button class="phantom-tag" data-active="true">
  ◆ MOTION DESIGN
</button>
```

→ Tag Button en état actif (fond noir + texte vert).

### 7.4 Bouton "envoyer" du formulaire de contact

```html
<button class="phantom-cta-hero" type="submit">
  <span class="picto">▶</span>
  <span class="label">STEAL HIS HEART</span>
</button>
```

→ Calling Card Button — métaphore "envoyer la calling card" des Phantom Thieves.

---

## 8. À NE PAS faire

- ❌ Boutons aux coins arrondis (`border-radius` au-delà de 2px)
- ❌ Gradients sur les fonds de boutons
- ❌ Boutons centrés sans rotation
- ❌ Police générique sans letter-spacing
- ❌ Plus de 3 boutons primaires visibles simultanément sur un même écran
- ❌ Boutons sans state hover/focus/active
- ❌ Vert pur (#00FF6B) en texte sur fond jaune (contraste insuffisant)
- ❌ Animations qui ignorent `prefers-reduced-motion`

---

## 9. Sources & références

- **Persona 5 Royal** (Atlus, 2019) — art director Masayoshi Suto, lead motion Masanari Okagawa
- **Game UI Database** (gameuidatabase.com/games/persona-5-royal) — captures UI exhaustives
- **Art of the Title** (artofthetitle.com/title/persona-5/) — analyse motion
- Famitsu Interview Suto (2016) — décisions de DA originales
