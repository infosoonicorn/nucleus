import { expect, test } from '@playwright/test';

test.describe('Investment Banking page — bespoke composition', () => {
  test('renders all six fundraise stages', async ({ page }) => {
    await page.goto('/services/investment-banking');
    const stages = ['Readiness', 'Modelling', 'Storytelling', 'Outreach', 'Diligence', 'Close'];
    for (const stage of stages) {
      await expect(page.getByRole('tab', { name: stage })).toBeVisible();
    }
  });

  test('mobile renders stages without horizontal scroll', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/services/investment-banking');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewport = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewport + 1);
  });
});

test.describe('Soonicorn callout — Task 10', () => {
  test(
    'renders with approved copy, working outbound link, and persistent disclaimer',
    async ({ page }) => {
      await page.goto('/services/investment-banking');
      const link = page.getByRole('link', { name: /Visit Soonicorn Ventures/ });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', 'https://soonicornventures.com/');
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
      await expect(page.getByText(/This is not an offer or solicitation/)).toBeVisible();
    },
  );

  test('does not render on non-IB service pages', async ({ page }) => {
    await page.goto('/services/ma-advisory');
    await expect(page.getByText('Soonicorn Ventures')).toHaveCount(0);
  });
});
