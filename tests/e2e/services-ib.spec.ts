import { expect, test } from '@playwright/test';

test.describe('Investment Banking page — bespoke composition', () => {
  test.fixme('renders all six fundraise stages', async ({ page }) => {
    await page.goto('/services/investment-banking');
    const stages = ['Readiness', 'Modelling', 'Storytelling', 'Outreach', 'Diligence', 'Close'];
    for (const stage of stages) {
      await expect(page.getByRole('tab', { name: stage })).toBeVisible();
    }
  });

  test.fixme('mobile renders stages without horizontal scroll', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/services/investment-banking');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewport = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewport + 1);
  });
});
