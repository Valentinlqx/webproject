import { test, expect } from '@playwright/test';
import { PAGES, collectErrors } from './pages.mjs';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('seeded')) {
      sessionStorage.setItem('seeded', '1');
      localStorage.removeItem('lang');
    }
  });
});

test("cliquer une catégorie filtre les cartes et met à jour l'URL", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(PAGES.rg);
  const cards = page.locator('.card');
  const total = await cards.count();
  expect(total).toBeGreaterThan(100);

  const btn = page.locator('.cat-btn[data-cat="3d"]');
  await btn.click();
  await expect(btn).toHaveClass(/active/);
  await expect(btn).toHaveAttribute('aria-pressed', 'true');
  const filtered = await cards.count();
  expect(filtered).toBeGreaterThan(0);
  expect(filtered).toBeLessThan(total);
  expect(new URL(page.url()).hash).toBe('#cats=3d');

  await btn.click();
  await expect(cards).toHaveCount(total);
  expect(new URL(page.url()).hash).toBe('');
  expect(errors).toEqual([]);
});

test('un lien partagé rouvre la même sélection', async ({ page }) => {
  await page.goto(PAGES.rg + '#cats=polices');
  await expect(page.locator('.cat-btn[data-cat="polices"]')).toHaveClass(/active/);
  const tags = await page.locator('.card').evaluateAll(cs => cs.map(c => c.dataset.cats));
  expect(tags.length).toBeGreaterThan(0);
  for (const t of tags) expect(t.split(',')).toContain('polices');
});

test('les cartes ouvrent le site dans un nouvel onglet', async ({ page }) => {
  await page.goto(PAGES.rg);
  const first = page.locator('.card').first();
  await expect(first).toHaveAttribute('target', '_blank');
  await expect(first).toHaveAttribute('rel', /noopener/);
  await expect(first).toHaveAttribute('href', /^https:\/\//);
});

test("le bouton de langue passe en anglais et s'en souvient", async ({ page }) => {
  await page.goto(PAGES.rg);
  await expect(page.locator('h1')).toHaveText('Ressources Gratuites');
  await page.click('#lang-toggle');
  await expect(page.locator('h1')).toHaveText('Free Resources');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.reload();
  await expect(page.locator('h1')).toHaveText('Free Resources');
});

test("le retour mène à l'accueil", async ({ page }) => {
  await page.goto(PAGES.rg);
  await page.click('.back-btn');
  await expect(page.locator('h1')).toHaveText('Valentin L.');
});
