import { test, expect } from '@playwright/test';
import { PAGES, WIDTHS } from './pages.mjs';
import { axeViolations } from './a11y.mjs';

test.beforeEach(async ({ page }) => {
  await page.goto(PAGES.popdoudou);
});

test('toutes les pages du brand book se chargent, chacune avec sa description', async ({ page }) => {
  const imgs = page.locator('.pages img');
  await expect(imgs).toHaveCount(7);
  for (const img of await imgs.all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate(i => i.complete && i.naturalWidth)).toBe(1920);
    expect((await img.getAttribute('alt')).length).toBeGreaterThan(20);
  }
});

test('la police du projet est bien chargée', async ({ page }) => {
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('800 64px "Bricolage Display"'))).toBe(true);
});

test("on revient à l'accueil par le haut et par le bas", async ({ page }) => {
  for (const link of [page.locator('.back'), page.locator('.end a')]) {
    await page.goto(PAGES.popdoudou);
    await link.click();
    await expect(page.locator('h1')).toHaveText('Vlqx');
  }
});

test("la langue choisie vaut aussi ici, et le bouton la change", async ({ page }) => {
  await expect(page.locator('.tagline')).toHaveText('Doux dedans, pop dehors.');
  await page.click('#lang');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.tagline')).toHaveText('Soft inside, pop outside.');
  await expect(page.locator('.pages img').first()).toHaveAttribute('alt', /^The brief/);
  await page.goto('/');
  await expect(page.locator('h2#design')).toHaveText('Design projects');
});

for (const width of WIDTHS) {
  test(`aucune erreur d'accessibilité AA @${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(PAGES.popdoudou);
    expect(await axeViolations(page)).toEqual([]);
  });
}

test('avec une très grande police, rien ne déborde', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});
