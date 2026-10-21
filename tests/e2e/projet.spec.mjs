import { test, expect } from '@playwright/test';
import { PAGES, WIDTHS } from './pages.mjs';
import { axeViolations } from './a11y.mjs';

test("l'accueil mène à Une part de mystère, et la page ramène à l'accueil", async ({ page }) => {
  await page.goto('/');
  await page.locator('section:has(#video) a.tile').first().click();
  await expect(page.locator('h1')).toHaveText('Une part de mystère');
  await page.locator('.end a').click();
  await expect(page.locator('h1')).toHaveText('Vlqx');
});

test("une seule langue visible à la fois, et le bouton la change partout", async ({ page }) => {
  await page.goto(PAGES.mystere);
  const fr = page.locator('.lede[data-lang="fr"]');
  const en = page.locator('.lede[data-lang="en"]');
  await expect(fr).toBeVisible();
  await expect(en).toBeHidden();
  await expect(page).toHaveTitle(/Court-métrage/);

  await page.click('#lang');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(en).toBeVisible();
  await expect(fr).toBeHidden();
  await expect(page).toHaveTitle(/Short film/);
  await expect(page.locator('.back')).toHaveAttribute('aria-label', 'Back to home');
  await expect(page.locator('#lang')).toHaveText('Français');

  await page.goto('/');
  await expect(page.locator('h2#video')).toHaveText('Video projects');
});

test("l'affiche change de description avec la langue", async ({ page }) => {
  await page.goto(PAGES.mystere);
  const img = page.locator('.poster img');
  await expect(img).toHaveAttribute('alt', /^Affiche du film/);
  await page.click('#lang');
  await expect(img).toHaveAttribute('alt', /^Film poster/);
});

test('sans JavaScript, la page reste lisible en français', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(PAGES.mystere);
  await expect(page.locator('.lede[data-lang="fr"]')).toBeVisible();
  await expect(page.locator('.lede[data-lang="en"]')).toBeHidden();
  await context.close();
});

for (const name of ['modele']) {
  for (const width of WIDTHS) {
    test(`${name} : aucune erreur d'accessibilité AA @${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(PAGES[name]);
      expect(await axeViolations(page)).toEqual([]);
    });
  }
}
