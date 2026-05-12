import { chromium, devices } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outDir = 'outputs';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const desktopPage = await desktop.newPage();
await desktopPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await desktopPage.waitForTimeout(1500);
const orbital = await desktopPage.$('.home-v3-orbital');
if (orbital) {
  await orbital.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(800);
  await orbital.screenshot({ path: `${outDir}/orbital-desktop.png` });

  // Expand the 3rd node (Risk Advisory) to show interaction.
  await desktopPage.$$eval('.home-v3-orbital-node-button', (els) => {
    if (els[2]) els[2].click();
  });
  await desktopPage.waitForTimeout(900);
  await orbital.screenshot({ path: `${outDir}/orbital-desktop-expanded.png` });
}
await desktop.close();

const mobile = await browser.newContext({ ...devices['Pixel 7'] });
const mobilePage = await mobile.newPage();
await mobilePage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await mobilePage.waitForTimeout(1500);
const orbitalM = await mobilePage.$('.home-v3-orbital');
if (orbitalM) {
  await orbitalM.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(800);
  await orbitalM.screenshot({ path: `${outDir}/orbital-mobile.png` });
}
await mobile.close();

await browser.close();
console.log('Orbital shots saved');
