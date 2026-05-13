import { chromium, devices } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outDir = 'outputs';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await desktop.newPage();
await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);

const section = await page.$('.home-v3-builtfor');
if (section) {
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await section.screenshot({ path: `${outDir}/builtfor-desktop-rest.png` });

  // Hover the featured Manufacturing card
  const featured = await page.$('.home-v3-archetype-featured');
  if (featured) {
    const box = await featured.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.4, { steps: 12 });
      await page.waitForTimeout(900);
      await section.screenshot({ path: `${outDir}/builtfor-desktop-hover-featured.png` });
    }
  }

  // Hover a supporting card (Services — second card)
  const cards = await page.$$('.home-v3-archetype:not(.home-v3-archetype-featured)');
  if (cards[0]) {
    const box = await cards[0].boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5, { steps: 12 });
      await page.waitForTimeout(900);
      await section.screenshot({ path: `${outDir}/builtfor-desktop-hover-supporting.png` });
    }
  }
}

await desktop.close();

const mobile = await browser.newContext({ ...devices['Pixel 7'] });
const m = await mobile.newPage();
await m.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await m.waitForTimeout(1500);
const mSection = await m.$('.home-v3-builtfor');
if (mSection) {
  await mSection.scrollIntoViewIfNeeded();
  await m.waitForTimeout(900);
  await mSection.screenshot({ path: `${outDir}/builtfor-mobile.png` });
}
await mobile.close();

await browser.close();
console.log('Built-For shots saved');
