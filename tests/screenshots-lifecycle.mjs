import { chromium, devices } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const outDir = 'outputs';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();

// Desktop: walk through the sticky-scroll journey, capture key moments.
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await desktop.newPage();
await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
const section = await page.$('#business-lifecycle');
if (section) {
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await section.screenshot({ path: `${outDir}/lifecycle-desktop-start.png` });

  // The sticky-scroll journey occupies (sectionHeight - viewportHeight) of scroll.
  // Walk across that effective range to capture each stage.
  const sectionGeom = await page.evaluate(() => {
    const el = document.getElementById('business-lifecycle');
    if (!el) return null;
    return {
      top: el.getBoundingClientRect().top + window.scrollY,
      height: el.getBoundingClientRect().height,
      viewport: window.innerHeight,
    };
  });
  if (sectionGeom) {
    const effective = Math.max(0, sectionGeom.height - sectionGeom.viewport);
    const steps = [0.05, 0.25, 0.45, 0.65, 0.85, 0.98];
    for (const step of steps) {
      const target = sectionGeom.top + effective * step;
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), target);
      await page.waitForTimeout(700);
      const tag = String(Math.round(step * 100)).padStart(2, '0');
      await page.screenshot({ path: `${outDir}/lifecycle-desktop-${tag}.png`, fullPage: false });
    }
  }
}
await desktop.close();

// Mobile: should render the stacked fallback (no scroll-driven journey).
const mobile = await browser.newContext({ ...devices['Pixel 7'] });
const m = await mobile.newPage();
await m.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await m.waitForTimeout(1500);
const mSection = await m.$('#business-lifecycle');
if (mSection) {
  await mSection.scrollIntoViewIfNeeded();
  await m.waitForTimeout(700);
  await mSection.screenshot({ path: `${outDir}/lifecycle-mobile.png` });
}
await mobile.close();

await browser.close();
console.log('Lifecycle shots saved');
