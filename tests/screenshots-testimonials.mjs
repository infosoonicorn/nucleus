import { chromium, devices } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outDir = 'outputs';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await desktop.newPage();
await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
const section = await page.$('.home-v3-testimonials');
if (section) {
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await section.screenshot({ path: `${outDir}/testimonials-desktop.png` });
}
await desktop.close();

const mobile = await browser.newContext({ ...devices['Pixel 7'] });
const m = await mobile.newPage();
await m.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await m.waitForTimeout(1500);
const sectionM = await m.$('.home-v3-testimonials');
if (sectionM) {
  await sectionM.scrollIntoViewIfNeeded();
  await m.waitForTimeout(900);
  await sectionM.screenshot({ path: `${outDir}/testimonials-mobile.png` });
}
await mobile.close();

await browser.close();
console.log('Testimonial shots saved');
