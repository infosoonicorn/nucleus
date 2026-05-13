import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outDir = 'outputs';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });

const section = await page.$('.home-v3-closing');
if (section) {
  await section.scrollIntoViewIfNeeded();

  // Take a sequence of frames spaced across the rotator + shine cycle.
  const frames = 5;
  for (let i = 0; i < frames; i++) {
    await page.waitForTimeout(900);
    await section.screenshot({ path: `${outDir}/closing-rotator-frame-${i}.png` });
  }

  // Hover the CTA to capture the hover state.
  const cta = await page.$('.home-v3-closing-cta');
  if (cta) {
    const box = await cta.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 8 });
      await page.waitForTimeout(800);
      await section.screenshot({ path: `${outDir}/closing-cta-hover.png` });
    }
  }
}

await ctx.close();
await browser.close();
console.log('closing shots saved');
