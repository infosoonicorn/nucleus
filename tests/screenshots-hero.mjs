import { chromium, devices } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outDir = 'outputs';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();

// Desktop: rest state, then with cursor over the canvas to show tilt + spotlight.
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await desktop.newPage();
await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);

// Rest state - move cursor off-screen
await page.mouse.move(-100, -100);
await page.waitForTimeout(700);
await page.screenshot({ path: `${outDir}/hero-desktop-rest.png`, fullPage: false });

// Cursor hovering over the canvas (right side of hero)
const canvas = await page.$('.home-v3-hero-canvas-wrap');
if (canvas) {
  const box = await canvas.boundingBox();
  if (box) {
    // Place cursor at the upper-right of the canvas to maximize tilt + spotlight visibility
    const targetX = box.x + box.width * 0.7;
    const targetY = box.y + box.height * 0.35;
    await page.mouse.move(targetX, targetY, { steps: 12 });
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${outDir}/hero-desktop-hover-canvas.png`, fullPage: false });
  }
}

// Cursor at the headline area
await page.mouse.move(360, 320, { steps: 12 });
await page.waitForTimeout(900);
await page.screenshot({ path: `${outDir}/hero-desktop-hover-headline.png`, fullPage: false });

await desktop.close();

// Mobile: no mouse, just visual check
const mobile = await browser.newContext({ ...devices['Pixel 7'] });
const m = await mobile.newPage();
await m.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await m.waitForTimeout(1500);
await m.screenshot({ path: `${outDir}/hero-mobile.png`, fullPage: false });
await mobile.close();

await browser.close();
console.log('Hero shots saved');
