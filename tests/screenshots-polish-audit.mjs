import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outDir = 'outputs';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);

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
  await page.waitForTimeout(700);
  await el.screenshot({ path: `${outDir}/polish-${name}.png` });
}

await shot('.home-v3-builtfor', 'builtfor');
await shot('.home-v3-teaser', 'teaser-rest');

// Hover careers
const careers = await page.$('.home-v3-teaser-panel-careers');
if (careers) {
  const box = await careers.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5, { steps: 8 });
    await page.waitForTimeout(700);
    const section = await page.$('.home-v3-teaser');
    if (section) {
      await section.screenshot({ path: `${outDir}/polish-teaser-hover-careers.png` });
    }
  }
}

// Hover insights
const insights = await page.$('.home-v3-teaser-panel-insights');
if (insights) {
  const box = await insights.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5, { steps: 8 });
    await page.waitForTimeout(700);
    const section = await page.$('.home-v3-teaser');
    if (section) {
      await section.screenshot({ path: `${outDir}/polish-teaser-hover-insights.png` });
    }
  }
}

// Hover archetypes featured (Manufacturing)
const featured = await page.$('.home-v3-archetype-featured');
if (featured) {
  const box = await featured.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5, { steps: 8 });
    await page.waitForTimeout(900);
    const section = await page.$('.home-v3-builtfor');
    if (section) {
      await section.screenshot({ path: `${outDir}/polish-builtfor-hover.png` });
    }
  }
}

await ctx.close();
await browser.close();
console.log('audit shots saved');
