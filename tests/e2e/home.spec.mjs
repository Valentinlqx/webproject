import { test, expect } from '@playwright/test';
import { WIDTHS } from './pages.mjs';
import { axeViolations } from './a11y.mjs';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('le nom en haut, puis les projets', async ({ page }) => {
  await expect(page.locator('h1')).toHaveText('Valentin L.');
  await expect(page.locator('.intro')).toHaveCount(0);
  await expect(page.locator('section h2')).toHaveText(['Projets web', 'Projets design']);
});

test('les projets web sont les deux outils, et ils existent', async ({ page, request }) => {
  const links = page.locator('section:has(#web) a.tile');
  await expect(links).toHaveCount(2);
  await expect(links.nth(0)).toContainText('AutoVinted');
  await expect(links.nth(1)).toContainText('Gratis');
  for (const href of await links.evaluateAll(as => as.map(a => a.href))) {
    expect((await request.get(href)).status(), href).toBe(200);
  }
});

test('chaque projet a son image', async ({ page }) => {
  const tiles = page.locator('.tile');
  expect(await tiles.count()).toBeGreaterThan(2);
  await expect(page.locator('.tile .thumb')).toHaveCount(await tiles.count());
  const box = await page.locator('.thumb').first().boundingBox();
  expect(box.height / box.width).toBeCloseTo(4 / 3, 1);
});

test('chaque catégorie tient sur une seule rangée qui défile', async ({ page }) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const row of await page.locator('.grid').all()) {
      const tops = await row.locator('.tile').evaluateAll(ts => ts.map(t => Math.round(t.getBoundingClientRect().top)));
      expect(new Set(tops).size, `${width}px`).toBe(1);
    }
  }
});

test('sur ordinateur, les flèches font défiler la rangée et se désactivent au bout', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 900 });
  const design = page.locator('section:has(#design)');
  const row = design.locator('.grid');
  const prev = design.getByRole('button', { name: 'Projets précédents' });
  const next = design.getByRole('button', { name: 'Projets suivants' });
  await expect(prev).toBeDisabled();
  await next.click();
  await expect.poll(() => row.evaluate(r => r.scrollLeft)).toBeGreaterThan(0);
  await expect(prev).toBeEnabled();
  await row.evaluate(r => { r.style.scrollBehavior = 'auto'; r.scrollLeft = r.scrollWidth; });
  await expect(next).toBeDisabled();
  // Deux projets web tiennent à l'écran : pas de flèches inutiles.
  await expect(page.locator('section:has(#web) .arrows')).toBeHidden();
});

test('pas de contact ni de réseaux sociaux', async ({ page }) => {
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  const hrefs = await page.locator('a').evaluateAll(as => as.map(a => a.getAttribute('href')));
  const social = /instagram|linkedin|behance|twitter|x\.com|facebook|tiktok|github|dribbble/i;
  expect(hrefs.filter(h => social.test(h))).toEqual([]);
  expect(hrefs.filter(h => /ambience-forge/i.test(h))).toEqual([]);
});

test('les liens sont assez grands pour le tactile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  const heights = await page.locator('main a').evaluateAll(as => as.map(a => a.getBoundingClientRect().height));
  for (const h of heights) expect(h).toBeGreaterThanOrEqual(44);
});

for (const colorScheme of ['light', 'dark']) {
  for (const width of WIDTHS) {
    test(`aucune erreur d'accessibilité AA @${width}px ${colorScheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      expect(await axeViolations(page)).toEqual([]);
    });
  }
}

test('avec une très grande police, rien ne déborde', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});

test("le bouton de langue passe en anglais et vaut pour tout le site", async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h2#web')).toHaveText('Projets web');
  await page.click('#lang');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h2#web')).toHaveText('Web projects');
  await expect(page.locator('#lang')).toHaveText('Français');
  await page.goto('/projects/RessourcesGratuites/ressourcesgratuites.html');
  await expect(page.locator('h1')).toHaveText('Gratis');
});

test('les noms de projets sont des titres, et le mot « Image » est caché aux lecteurs d\'écran', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h3.tile-name')).toHaveCount(7);
  await expect(page.locator('a.tile').first()).toHaveAccessibleName(/^AutoVinted/);
});
