import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('un texte en haut, puis les projets', async ({ page }) => {
  await expect(page.locator('h1')).toHaveText('Valentin L.');
  await expect(page.locator('.intro')).toBeVisible();
  await expect(page.locator('section h2')).toHaveText(['Projets web', 'Projets design']);
});

test('les projets web sont les deux outils, et ils existent', async ({ page, request }) => {
  const links = page.locator('section:has(#web) a.tile');
  await expect(links).toHaveCount(2);
  await expect(links.nth(0)).toContainText('AutoVinted');
  await expect(links.nth(1)).toContainText('Ressources Gratuites');
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
