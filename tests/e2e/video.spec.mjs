import { test, expect } from '@playwright/test';
import { PAGES, WIDTHS } from './pages.mjs';
import { axeViolations } from './a11y.mjs';

test.beforeEach(async ({ page }) => {
  await page.goto(PAGES.mystere);
});

test("rien ne part vers YouTube avant le clic, puis le lecteur s'affiche", async ({ page }) => {
  const youtube = [];
  page.on('request', r => { if (/youtube/.test(r.url())) youtube.push(r.url()); });
  await page.goto(PAGES.mystere);
  await expect(page.locator('h1')).toHaveText('Une part de mystère');
  expect(youtube).toEqual([]);

  await page.route(/youtube-nocookie\.com/, route => route.fulfill({ contentType: 'text/html', body: '<p>lecteur</p>' }));
  await page.getByRole('link', { name: 'Lancer la vidéo' }).click();
  const frame = page.locator('.player iframe');
  await expect(frame).toHaveAttribute('src', /^https:\/\/www\.youtube-nocookie\.com\/embed\/G2sTGavlOmU\?/);
  await expect(frame).toHaveAttribute('title', 'Une part de mystère');
  await expect(page).toHaveURL(/une-part-de-mystere\.html$/);
});

test("La révolution a sa page, avec sa vidéo YouTube", async ({ page }) => {
  await page.goto(PAGES.revolution);
  await expect(page.locator('h1')).toHaveText('La révolution');
  await expect(page.locator('a.player')).toHaveAttribute('data-video', 'sgC5nfqz58A');
});

test("l'affiche d'Une part de mystère se charge, avec sa description", async ({ page }) => {
  const img = page.locator('.poster img');
  await img.scrollIntoViewIfNeeded();
  await expect.poll(() => img.evaluate(i => i.complete && i.naturalWidth)).toBe(1200);
  expect((await img.getAttribute('alt')).length).toBeGreaterThan(20);
});

test("l'affiche de La révolution se charge, et sa description suit la langue", async ({ page }) => {
  await page.goto(PAGES.revolution);
  const img = page.locator('.poster img');
  await img.scrollIntoViewIfNeeded();
  await expect.poll(() => img.evaluate(i => i.complete && i.naturalWidth)).toBe(1200);
  await expect(img).toHaveAttribute('alt', /télécommande/);
  await page.click('#lang');
  await expect(img).toHaveAttribute('alt', /remote control/);
});

test('sans JavaScript, le lien ouvre la vidéo sur YouTube', async ({ page }) => {
  await expect(page.locator('a.player')).toHaveAttribute('href', 'https://www.youtube.com/watch?v=G2sTGavlOmU');
});

test("on revient à l'accueil par le haut et par le bas", async ({ page }) => {
  for (const link of [page.locator('.back'), page.locator('.end a')]) {
    await page.goto(PAGES.mystere);
    await link.click();
    await expect(page.locator('h1')).toHaveText('Vlqx');
  }
});

test('le bouton de langue passe la page en anglais', async ({ page }) => {
  await page.click('#lang');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('a.player')).toContainText('Play the video');
});

for (const [name, url] of [['mystere', PAGES.mystere], ['revolution', PAGES.revolution]]) for (const width of WIDTHS) {
  test(`${name} : aucune erreur d'accessibilité AA @${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url);
    expect(await axeViolations(page)).toEqual([]);
  });
}
