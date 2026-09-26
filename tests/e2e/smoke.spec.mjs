import { test, expect } from '@playwright/test';
import { PAGES, WIDTHS, collectErrors } from './pages.mjs';

for (const [name, url] of Object.entries(PAGES)) {
  for (const width of WIDTHS) {
    test(`${name} @${width}px : pas d'erreur, pas de défilement horizontal`, async ({ page }) => {
      await page.addInitScript(() => localStorage.setItem('av-tutorial-seen', '1'));
      await page.setViewportSize({ width, height: 900 });
      const errors = collectErrors(page);
      await page.goto(url);
      await page.waitForLoadState('load');
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
      expect(errors).toEqual([]);
    });
  }
}
