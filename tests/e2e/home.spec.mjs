import { test, expect } from '@playwright/test';
import { WIDTHS } from './pages.mjs';
import { axeViolations } from './a11y.mjs';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('le nom en haut, puis les projets', async ({ page }) => {
  await expect(page.locator('h1')).toHaveText('Vlqx');
  await expect(page.locator('.intro')).toHaveCount(0);
  // Rangées triées par nombre de projets, la plus fournie en haut.
  await expect(page.locator('section h2')).toHaveText([/^Projets design/, 'Projets vidéo', 'Projets web', /^Jeux vidéo/, 'Projets commerciaux']);
  const counts = await page.locator('main > section').evaluateAll(ss => ss.map(s => s.querySelectorAll('.tile').length));
  expect(counts).toEqual([...counts].sort((a, b) => b - a));
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
  // À 320 px, les deux projets web ne tiennent plus : la rangée défile.
  await page.setViewportSize({ width: 320, height: 900 });
  const web = page.locator('section:has(#web)');
  const row = web.locator('.grid');
  const prev = web.getByRole('button', { name: 'Projets précédents' });
  const next = web.getByRole('button', { name: 'Projets suivants' });
  await expect(prev).toBeDisabled();
  await next.click();
  await expect.poll(() => row.evaluate(r => r.scrollLeft)).toBeGreaterThan(0);
  await expect(prev).toBeEnabled();
  await row.evaluate(r => { r.style.scrollBehavior = 'auto'; r.scrollLeft = r.scrollWidth; });
  await expect(next).toBeDisabled();
  // Quand tout tient à l'écran, pas de flèches inutiles : seule la longue rangée design en garde.
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.locator('.arrows')).toHaveCount(5);
  await expect(page.locator('section:has(#web) .arrows')).toBeHidden();
  await expect(page.locator('section:has(#video) .arrows')).toBeHidden();
  await expect(page.locator('section:has(#design) .arrows')).toBeVisible();
});

test("projets design : Pop Doudou ouvre sa page, Croqueta, Let's cook, Zephyr, Trinity et Mondrepuis arrivent", async ({ page }) => {
  const tiles = page.locator('section:has(#design) .tile');
  await expect(tiles).toHaveCount(6);
  await expect(tiles.nth(1)).toContainText('Croqueta');
  await expect(tiles.nth(2)).toContainText("Let's cook");
  await expect(tiles.nth(3)).toContainText('Zephyr');
  await expect(tiles.nth(4)).toContainText('Trinity');
  await expect(tiles.nth(5)).toContainText('Mondrepuis');
  await tiles.first().click();
  await expect(page).toHaveURL(/projects\/PopDoudou\/popdoudou\.html$/);
  await expect(page.locator('h1')).toHaveText('Pop Doudou');
});

test("le projet commercial mène à la boutique Etsy, dans un nouvel onglet", async ({ page }) => {
  const tile = page.locator('section:has(#commercial) a.tile');
  await expect(tile).toHaveCount(1);
  await expect(tile).toHaveAttribute('href', 'https://www.etsy.com/shop/StudioVelinCuration');
  await expect(tile).toHaveAttribute('target', '_blank');
  await expect(tile).toHaveAttribute('rel', /noopener/);
});

test("le jeu vidéo Nipnop mène à sa page itch.io, dans un nouvel onglet", async ({ page }) => {
  const tile = page.locator('section:has(#games) a.tile');
  await expect(tile).toHaveCount(1);
  await expect(tile).toContainText('Nipnop');
  await expect(tile).toHaveAttribute('href', 'https://vlqx.itch.io/nip-nop');
  await expect(tile).toHaveAttribute('target', '_blank');
  await expect(tile).toHaveAttribute('rel', /noopener/);
});

test("le titre Jeux vidéo mène à la page itch.io, dans un nouvel onglet", async ({ page }) => {
  const link = page.locator('h2#games a');
  await expect(link).toHaveAttribute('href', 'https://vlqx.itch.io');
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAccessibleName('Jeux vidéo (nouvel onglet)');
});

test('chaque vidéo ouvre sa page', async ({ page }) => {
  const tiles = page.locator('section:has(#video) .tile');
  await expect(tiles).toHaveCount(2);
  await expect(tiles.nth(1)).toContainText('La révolution');
  await expect(tiles.nth(1)).toHaveAttribute('href', 'projects/Videos/la-revolution.html');
  await tiles.first().click();
  await expect(page).toHaveURL(/projects\/Videos\/une-part-de-mystere\.html$/);
});

test('le titre Projets design mène à Behance, dans un nouvel onglet', async ({ page }) => {
  const link = page.locator('h2#design a');
  await expect(link).toHaveAttribute('href', 'https://www.behance.net/valentinlqxx');
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAccessibleName('Projets design (nouvel onglet)');
});

test('les réseaux sont sous le nom, et chacun ouvre un nouvel onglet', async ({ page }) => {
  const links = page.locator('nav.social a');
  await expect(links).toHaveText([/^Behance/, /^Cosmos/, /^Flickr/, /^Medium/]);
  expect(await links.evaluateAll(as => as.map(a => a.href))).toEqual([
    'https://www.behance.net/valentinlqxx',
    'https://www.cosmos.so/vlqxx',
    'https://www.flickr.com/photos/vlqxx',
    'https://medium.com/@xqlv',
  ]);
  for (const a of await links.all()) {
    await expect(a).toHaveAttribute('target', '_blank');
    await expect(a).toHaveAttribute('rel', /noopener/);
  }
  const h1 = await page.locator('h1').boundingBox();
  const nav = await page.locator('nav.social').boundingBox();
  expect(nav.y).toBeGreaterThanOrEqual(h1.y + h1.height);
});

test('le titre Vlqx en lettres découpées change au hasard, puis s\'arrête', async ({ page }) => {
  const title = page.locator('h1.ransom');
  await expect(title).toHaveText('Vlqx');
  await expect(title.locator('span')).toHaveCount(4);
  const styles = () => title.locator('span').evaluateAll(ls => ls.map(l => l.dataset.s).join());
  const first = await styles();
  await expect.poll(styles, { timeout: 2000 }).not.toBe(first);
  await page.waitForTimeout(2800);
  const settled = await styles();
  await page.waitForTimeout(600);
  expect(await styles()).toBe(settled);
});

test("si l'appareil demande moins de mouvement, le titre ne bouge pas", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const styles = () => page.locator('h1.ransom span').evaluateAll(ls => ls.map(l => l.dataset.s).join());
  const first = await styles();
  await page.waitForTimeout(800);
  expect(await styles()).toBe(first);
});

test('pas de contact par mail, ni de réseaux autres que ceux choisis', async ({ page }) => {
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  const hrefs = await page.locator('a').evaluateAll(as => as.map(a => a.getAttribute('href')));
  const social = /instagram|linkedin|twitter|x\.com|facebook|tiktok|github|dribbble/i;
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
  await expect(page.locator('h3.tile-name')).toHaveCount(12);
  await expect(page.locator('a.tile').first()).toHaveAccessibleName(/Pop Doudou/);
});
