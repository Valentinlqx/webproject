import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('présente Valentin avec un emplacement pour la photo', async ({ page }) => {
  await expect(page.locator('h1')).toHaveText('Valentin L.');
  await expect(page.locator('.portrait')).toBeVisible();
  await expect(page.locator('main')).toContainText('Graphiste indépendant');
});

test('liste exactement les deux projets, et ils existent', async ({ page, request }) => {
  const links = page.locator('.projects a');
  await expect(links).toHaveCount(2);
  await expect(links.nth(0)).toContainText('Ressources Gratuites');
  await expect(links.nth(1)).toContainText('AutoVinted');
  for (const href of await links.evaluateAll(as => as.map(a => a.href))) {
    expect((await request.get(href)).status(), href).toBe(200);
  }
});

test('contact par e-mail uniquement', async ({ page }) => {
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(1);
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
