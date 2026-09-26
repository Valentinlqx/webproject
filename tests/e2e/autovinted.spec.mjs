import { test, expect } from '@playwright/test';
import path from 'node:path';
import { PAGES, collectErrors } from './pages.mjs';

const PHOTO = path.resolve('projects/AutoVinted/demo/clarks-1.jpg');

function claudeReply(payload) {
  return {
    status: 200,
    headers: { 'access-control-allow-origin': '*', 'content-type': 'application/json' },
    body: JSON.stringify({
      stop_reason: 'end_turn',
      content: [{ type: 'thinking', thinking: '' }, { type: 'text', text: JSON.stringify(payload) }],
    }),
  };
}

async function open(page, storage = {}) {
  await page.addInitScript(entries => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    localStorage.setItem('av-tutorial-seen', '1');
    for (const [k, v] of Object.entries(entries)) localStorage.setItem(k, v);
  }, storage);
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(PAGES.autovinted);
}

test('un seul champ : le fournisseur est reconnu en tapant la clé', async ({ page }) => {
  await open(page);
  await page.click('#settings-toggle');
  const key = page.locator('#api-key');
  const status = page.locator('#key-status');

  await key.fill('sk-ant-api03-test');
  await expect(status).toContainText('Claude');
  await expect(page.locator('#model-select option').first()).toHaveAttribute('value', 'claude-opus-5');

  await key.fill('AIzaSyTest');
  await expect(status).toContainText('Gemini');

  await key.fill('gsk_test');
  await expect(status).toContainText('Groq');

  await key.fill('nimportequoi');
  await expect(status).toContainText('non reconnue');
});

test('enregistrer garde la clé et le modèle choisi', async ({ page }) => {
  await open(page);
  await page.click('#settings-toggle');
  await page.fill('#api-key', '  sk-proj-abc  ');
  await page.click('#model-picker summary');
  await page.selectOption('#model-select', 'gpt-6-luna');
  await page.click('#settings-save');
  const saved = await page.evaluate(() => [localStorage.getItem('av-key'), localStorage.getItem('av-model')]);
  expect(saved).toEqual(['sk-proj-abc', 'gpt-6-luna']);
});

test('une clé non reconnue ne s\'enregistre pas', async ({ page }) => {
  await open(page);
  await page.click('#settings-toggle');
  await page.fill('#api-key', 'nimportequoi');
  await page.click('#settings-save');
  await expect(page.locator('#settings-modal')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('av-key'))).toBeNull();
});

test('une clé de l\'ancienne version est reprise', async ({ page }) => {
  await open(page, { 'av-provider': 'openai', 'av-key-openai': 'sk-legacy' });
  expect(await page.evaluate(() => localStorage.getItem('av-key'))).toBe('sk-legacy');
  await page.click('#settings-toggle');
  await expect(page.locator('#api-key')).toHaveValue('sk-legacy');
  await expect(page.locator('#key-status')).toContainText('ChatGPT');
});

test('sans clé, analyser ouvre les paramètres', async ({ page }) => {
  await open(page);
  await page.setInputFiles('#file-input', PHOTO);
  await page.click('#analyze-btn');
  await expect(page.locator('#settings-modal')).toBeVisible();
  await expect(page.locator('#api-key')).toBeFocused();
});

test('parcours complet avec Claude (API simulée)', async ({ page }) => {
  const errors = collectErrors(page);
  await open(page, { 'av-key': 'sk-ant-test' });
  let sent;
  await page.route('https://api.anthropic.com/v1/messages', route => {
    sent = route.request().postDataJSON();
    route.fulfill(claudeReply({
      action: 'generate',
      message: '',
      listing: { title: "Veste en jean Levi's", description: 'Belle veste.', warnings: [] },
    }));
  });

  await page.setInputFiles('#file-input', PHOTO);
  await expect(page.locator('.preview')).toHaveCount(1);
  await expect(page.locator('#estimate')).toContainText('€');
  await page.click('#analyze-btn');

  await expect(page.locator('#r-title')).toHaveText("Veste en jean Levi's");
  expect(sent.model).toBe('claude-opus-5');
  expect(sent.messages[0].content.some(p => p.type === 'image')).toBe(true);
  expect(errors).toEqual([]);
});

test('une erreur de l\'API s\'affiche et on peut réessayer', async ({ page }) => {
  await open(page, { 'av-key': 'sk-ant-test' });
  await page.route('https://api.anthropic.com/v1/messages', route => route.fulfill({
    status: 401,
    headers: { 'access-control-allow-origin': '*', 'content-type': 'application/json' },
    body: JSON.stringify({ error: { message: 'invalid x-api-key' } }),
  }));
  await page.setInputFiles('#file-input', PHOTO);
  await page.click('#analyze-btn');
  await expect(page.locator('#toast')).toContainText('Clé API refusée');
  await expect(page.locator('#analyze-btn')).toBeEnabled();
});

test('en lot, « copier toutes les annonces » copie les vrais titres', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await open(page, { 'av-key': 'sk-ant-test' });
  await page.route('https://api.anthropic.com/v1/messages', route => route.fulfill(claudeReply({
    listings: [
      { photo_indices: [0], title: 'Mocassins Clarks', description: 'Cuir bordeaux.', warnings: ['à vérifier'] },
      { photo_indices: [1], title: 'Livre Folio', description: 'Bon état.', warnings: [] },
    ],
  })));

  await page.click('.mode-btn[data-mode="bulk"]');
  await page.setInputFiles('#file-input', [PHOTO, path.resolve('projects/AutoVinted/demo/clarks-2.jpg')]);
  await page.click('#analyze-btn');
  await expect(page.locator('.bulk-item')).toHaveCount(2);
  await page.click('#bulk-copy-all-btn');

  // Sous Windows, le presse-papiers renvoie des fins de ligne \r\n.
  const copied = (await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n');
  expect(copied).toContain('Mocassins Clarks\n\nCuir bordeaux.');
  expect(copied).toContain('Livre Folio');
  expect(copied).not.toContain('#1');
  expect(copied).not.toContain('⚠');
});

test('un historique corrompu ne casse pas la page', async ({ page }) => {
  const errors = collectErrors(page);
  await open(page, { 'av-history': '{pas du json' });
  await expect(page.locator('#analyze-btn')).toBeVisible();
  expect(errors).toEqual([]);
});
