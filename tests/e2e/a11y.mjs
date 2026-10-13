import AxeBuilder from '@axe-core/playwright';

// Règles WCAG 2.2 niveau A et AA (le niveau choisi pour le site).
// On attend la fin des animations d'apparition : à mi-fondu, le texte est à moitié transparent.
export async function axeViolations(page) {
  await page.evaluate(() => Promise.all(document.getAnimations()
    .filter(a => Number.isFinite(a.effect?.getComputedTiming().endTime))
    .map(a => a.finished.catch(() => {}))));
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  return violations.map(v => `${v.id} : ${v.nodes.map(n => n.target.join(' ')).join(' | ')}`);
}
