import { chromium, devices } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outDir = 'outputs';
await mkdir(outDir, { recursive: true });

async function settleAndCapture(page, basename) {
  // Trigger all whileInView reveals by walking through the page.
  await page.evaluate(async () => {
    const total = document.documentElement.scrollHeight;
    const step = Math.round(window.innerHeight * 0.7);
    for (let y = 0; y < total; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 220));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 400));
  });
  await page.screenshot({ path: `${outDir}/${basename}-fold.png`, fullPage: false });
  await page.screenshot({ path: `${outDir}/${basename}-full.png`, fullPage: true });
}

const browser = await chromium.launch();

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const desktopPage = await desktop.newPage();
await desktopPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await desktopPage.waitForTimeout(1500);
await settleAndCapture(desktopPage, 'home-v3-desktop');
await desktop.close();

const mobile = await browser.newContext({ ...devices['Pixel 7'] });
const mobilePage = await mobile.newPage();
await mobilePage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await mobilePage.waitForTimeout(1500);
await settleAndCapture(mobilePage, 'home-v3-mobile');
await mobile.close();

await browser.close();
console.log('Screenshots saved to', outDir);
