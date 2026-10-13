import AxeBuilder from '@axe-core/playwright';

// Règles WCAG 2.2 niveau A et AA (le niveau choisi pour le site).
export async function axeViolations(page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  return violations.map(v => `${v.id} : ${v.nodes.map(n => n.target.join(' ')).join(' | ')}`);
}
