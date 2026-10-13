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

const hashOf = page => new URL(page.url()).hash;

test("choisir une famille filtre les cartes, montre ses sous-catégories et met à jour l'URL", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(PAGES.rg);
  const cards = page.locator('.card');
  const total = await cards.count();
  expect(total).toBeGreaterThan(100);
  await expect(page.locator('#subcats')).toBeHidden();

  const family = page.locator('.family[data-family="son"]');
  await family.click();
  await expect(family).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#subcats .cat-btn')).toHaveCount(2);
  const filtered = await cards.count();
  expect(filtered).toBeGreaterThan(0);
  expect(filtered).toBeLessThan(total);
  expect(hashOf(page)).toBe('#f=son');

  await page.locator('.cat-btn[data-cat="musique"]').click();
  expect(hashOf(page)).toBe('#f=son&c=musique');
  for (const cats of await cards.evaluateAll(cs => cs.map(c => c.dataset.cats))) {
    expect(cats.split(',')).toContain('musique');
  }

  await family.click();
  await expect(cards).toHaveCount(total);
  expect(hashOf(page)).toBe('');
  expect(errors).toEqual([]);
});

test('au clavier, choisir un filtre garde la place', async ({ page }) => {
  await page.goto(PAGES.rg);
  const family = page.locator('.family[data-family="visuels"]');
  await family.focus();
  await page.keyboard.press('Enter');
  await expect(family).toHaveAttribute('aria-pressed', 'true');
  await expect(family).toBeFocused();
  const sub = page.locator('.cat-btn[data-cat="icones"]');
  await sub.focus();
  await page.keyboard.press('Space');
  await expect(sub).toHaveAttribute('aria-pressed', 'true');
  await expect(sub).toBeFocused();
});

test('un lien partagé rouvre la même sélection', async ({ page }) => {
  await page.goto(PAGES.rg + '#f=typo&c=polices');
  await expect(page.locator('.family[data-family="typo"]')).toHaveClass(/active/);
  await expect(page.locator('.cat-btn[data-cat="polices"]')).toHaveClass(/active/);
  const tags = await page.locator('.card').evaluateAll(cs => cs.map(c => c.dataset.cats));
  expect(tags.length).toBeGreaterThan(0);
  for (const t of tags) expect(t.split(',')).toContain('polices');
});

test('les anciens liens #cats=… marchent encore', async ({ page }) => {
  await page.goto(PAGES.rg + '#cats=polices');
  await expect(page.locator('.family[data-family="typo"]')).toHaveClass(/active/);
  await expect(page.locator('.cat-btn[data-cat="polices"]')).toHaveClass(/active/);
});

test('le filtre de licence ne garde que ces licences', async ({ page }) => {
  await page.goto(PAGES.rg);
  await page.locator('.license-btn[data-license="cc0"]').click();
  expect(hashOf(page)).toBe('#l=cc0');
  const licenses = await page.locator('.card').evaluateAll(cs => cs.map(c => c.dataset.license));
  expect(licenses.length).toBeGreaterThan(0);
  expect(new Set(licenses)).toEqual(new Set(['cc0']));
});

test('« Sans compte » retire ce qui demande une inscription', async ({ page }) => {
  await page.goto(PAGES.rg);
  const withAccount = page.locator('.card:has(.account-tag)');
  expect(await withAccount.count()).toBeGreaterThan(0);
  await page.locator('#no-account').click();
  await expect(page.locator('#no-account')).toHaveAttribute('aria-pressed', 'true');
  await expect(withAccount).toHaveCount(0);
  expect(hashOf(page)).toBe('#nc=1');
});

test('la recherche filtre sans tenir compte des accents, et « Tout effacer » remet tout', async ({ page }) => {
  await page.goto(PAGES.rg);
  const cards = page.locator('.card');
  const total = await cards.count();
  await page.fill('#search', 'icones');
  const found = await cards.count();
  expect(found).toBeGreaterThan(0);
  expect(found).toBeLessThan(total);
  await expect(page.locator('#count')).toContainText(String(found));
  expect(hashOf(page)).toBe('#q=icones');

  await page.fill('#search', 'zzzzzz');
  await expect(page.locator('#empty')).toBeVisible();
  await page.locator('#empty .reset').click();
  await expect(cards).toHaveCount(total);
  await expect(page.locator('#search')).toHaveValue('');
});

test('chaque carte montre sa licence', async ({ page }) => {
  await page.goto(PAGES.rg);
  const cards = page.locator('.card');
  const count = await cards.count();
  await expect(page.locator('.card .badge')).toHaveCount(count);
  await expect(page.locator('.card .license-name')).toHaveCount(count);
});

test('le mini-guide explique chaque badge', async ({ page }) => {
  await page.goto(PAGES.rg);
  await page.locator('#guide summary').click();
  await expect(page.locator('#guide-list dt')).toHaveCount(7);
  await expect(page.locator('#guide-list dd').first()).toBeVisible();
});

test('les cartes ouvrent le site dans un nouvel onglet', async ({ page }) => {
  await page.goto(PAGES.rg);
  const first = page.locator('.card').first();
  await expect(first).toHaveAttribute('target', '_blank');
  await expect(first).toHaveAttribute('rel', /noopener/);
  await expect(first).toHaveAttribute('href', /^https:\/\//);
});

test("le bouton de langue traduit aussi les descriptions, et s'en souvient", async ({ page }) => {
  await page.goto(PAGES.rg);
  await expect(page.locator('h1')).toHaveText('Ressources Gratuites');
  const descFr = await page.locator('.card-desc').first().textContent();
  await page.click('#lang-toggle');
  await expect(page.locator('h1')).toHaveText('Free Resources');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(await page.locator('.card-desc').first().textContent()).not.toBe(descFr);
  await page.reload();
  await expect(page.locator('h1')).toHaveText('Free Resources');
});

test.describe('navigateur anglais', () => {
  test.use({ locale: 'en-US' });
  test('sans choix enregistré, la page suit la langue du navigateur', async ({ page }) => {
    await page.goto(PAGES.rg);
    await expect(page.locator('h1')).toHaveText('Free Resources');
  });
});

test('les icônes viennent du site, pas d\'un autre serveur', async ({ page }) => {
  const outside = [];
  page.on('request', r => { if (!r.url().startsWith('http://localhost')) outside.push(r.url()); });
  await page.goto(PAGES.rg);
  await page.waitForLoadState('networkidle');
  expect(outside).toEqual([]);
  const broken = await page.locator('.card-emoji, .family-icon').evaluateAll(imgs =>
    imgs.filter(i => i.tagName === 'IMG' && i.complete && i.naturalWidth === 0).length);
  expect(broken).toBe(0);
});

test('la page marche même si le navigateur refuse localStorage', async ({ page }) => {
  const errors = collectErrors(page);
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('refusé'); } });
  });
  await page.goto(PAGES.rg);
  expect(await page.locator('.card').count()).toBeGreaterThan(100);
  await page.click('#lang-toggle');
  await expect(page.locator('h1')).toHaveText('Free Resources');
  expect(errors).toEqual([]);
});

test('le bouton pause arrête le fond, et le choix est retenu', async ({ page }) => {
  await page.goto(PAGES.rg);
  const playState = () => page.evaluate(() => getComputedStyle(document.body, '::before').animationPlayState);
  expect(await playState()).toBe('running');
  await page.click('#motion-toggle');
  await expect(page.locator('#motion-toggle')).toHaveAttribute('aria-pressed', 'true');
  expect(await playState()).toBe('paused');
  await page.reload();
  expect(await playState()).toBe('paused');
});

test("si l'appareil demande moins de mouvement, rien ne bouge et le bouton pause disparaît", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(PAGES.rg);
  await expect(page.locator('#motion-toggle')).toBeHidden();
  expect(await page.evaluate(() => getComputedStyle(document.body, '::before').animationName)).toBe('none');
});

test("le retour mène à l'accueil", async ({ page }) => {
  await page.goto(PAGES.rg);
  await page.click('.back-btn');
  await expect(page.locator('h1')).toHaveText('Valentin L.');
});
