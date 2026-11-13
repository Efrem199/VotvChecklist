// Real-browser layout regression checks. Set CHROMIUM_PATH to a local Chrome/Chromium binary.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright-core';

const i = n => { const b = Buffer.alloc(4); b.writeInt32LE(n); return b; };
const str = text => Buffer.concat([i(Buffer.byteLength(text) + 1), Buffer.from(text), Buffer.from([0])]);
const property = (name, type, value, extra = Buffer.alloc(0)) => Buffer.concat([str(name), str(type), i(value.length), i(0), extra, Buffer.from([0]), value]);
const saveFixture = Buffer.concat([Buffer.from('GVAS'), i(2), i(522), Buffer.from([4,0,27,0,0,0,0,0,0,0]), str('++UE4+Release-4.27'), i(3), i(0), str('/Game/main/saveSlot.saveSlot_C'), property('Version', 'StrProperty', str('0.9.0')), property('Points', 'IntProperty', i(123)), property('advancementsNames', 'ArrayProperty', Buffer.concat([i(1), str('burger')]), str('NameProperty')), property('advancementsCompleted', 'ArrayProperty', Buffer.concat([i(1), Buffer.from([0])]), str('BoolProperty')), str('None'), i(0)]);

const binary = process.env.CHROMIUM_PATH ?? ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(existsSync);
if (!binary) throw new Error('Set CHROMIUM_PATH to a Chrome or Chromium executable.');
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '4189', '--strictPort'], { stdio: ['ignore', 'pipe', 'pipe'] });
let browser;
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Vite did not start')), 30000);
    server.stdout.on('data', data => { if (String(data).includes('Local:')) { clearTimeout(timer); resolve(); } });
    server.once('exit', code => { clearTimeout(timer); reject(new Error(`Vite exited: ${code}`)); });
  });
  browser = await chromium.launch({ executablePath: binary, headless: true, args: ['--no-sandbox', ...(process.env.CHROMIUM_SINGLE_PROCESS ? ['--no-zygote', '--single-process', '--disable-gpu'] : [])] });
  const page = await browser.newPage({ viewport: { width: 320, height: 850 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.route('https://voicesofthevoid.wiki.gg/**', route => route.abort());
  const checkWidth = async context => {
    const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    assert.ok(dimensions.content <= dimensions.viewport + 1, `${context}: horizontal overflow ${JSON.stringify(dimensions)}`);
  };
  for (const language of ['ru', 'en']) for (const width of [320, 375, 414, 640, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 850 });
    for (const route of ['journal', 'achievements', 'fun', 'save-editor']) {
      await page.goto(`http://127.0.0.1:4189/#/${route}`, { waitUntil: 'networkidle' });
      await page.locator('select[aria-label="Язык"], select[aria-label="Language"]').selectOption(language);
      const context = `${language} ${width}px ${route}`;
      await checkWidth(context);
      if (width <= 640) {
        const search = await page.locator('#site-search').boundingBox();
        assert.ok(search && search.width >= width - 70, `${context}: search input is too narrow`);
        const languageLabel = await page.locator('.site-language').evaluate(element => {
          const text = [...element.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
          const range = document.createRange(); range.selectNodeContents(text);
          return range.getClientRects().length;
        });
        assert.equal(languageLabel, 1, `${context}: language label wraps`);
      }
      if (route === 'journal') {
        const header = page.locator('#cat-dishes > header');
        const title = await header.locator('button[aria-expanded]').first().boundingBox();
        const stats = await header.locator(':scope > div').first().boundingBox();
        assert.ok(title && stats, `${context}: category header missing`);
        if (width <= 640) assert.ok(stats.y >= title.y + title.height - 1, `${context}: category title overlaps statistics`);
        await header.locator('button[aria-expanded]').last().click();
        if (width === 320) {
          const taskName = page.locator('#cat-dishes input[aria-label]').first();
          await taskName.fill('VeryLongCustomColumnName'.repeat(6));
          await checkWidth(`${context} long custom column`);
          await page.locator('#cat-dishes').getByRole('button', { name: language === 'ru' ? /по умолчанию/i : /restore defaults/i }).click();
        }
        await page.locator('#loc-dish-b button[aria-expanded]').first().click();
        await checkWidth(`${context} expanded category and location`);
      }
      if (route === 'achievements') {
        await page.locator('summary').first().click();
        await checkWidth(`${context} expanded guide`);
      }
      if (route === 'save-editor') {
        await page.locator('input[type=file]').setInputFiles({ name: `s_${'longfilename'.repeat(10)}.sav`, mimeType: 'application/octet-stream', buffer: saveFixture });
        await page.locator('input[type=number]').first().waitFor();
        await checkWidth(`${context} loaded save`);
      }
      await page.locator('#site-search').fill('server');
      await checkWidth(`${context} search results`);
    }
  }
  console.log('Mobile layout: 2 languages × 7 viewport widths × 4 pages (including desktop regressions), including expanded controls and search results.');
} finally {
  if (browser) await browser.close();
  server.kill();
}
