import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outDir = 'outputs';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

// Walk so reveals fire.
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

async function shot(selector, name) {
  const el = await page.$(selector);
  if (!el) {
    console.log('missing', selector);
    return;
  }
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await el.screenshot({ path: `${outDir}/section-${name}.png` });
}

await shot('.home-v3-proof', 'proof');
await shot('.home-v3-lifecycle', 'lifecycle');
await shot('.home-v3-services', 'services');
await shot('.home-v3-moments', 'moments');
await shot('.home-v3-depth', 'depth');
await shot('.home-v3-industries', 'industries');
await shot('.home-v3-teaser', 'teaser');
await shot('.home-v3-closing', 'closing');

await ctx.close();
await browser.close();
console.log('Section shots saved');
