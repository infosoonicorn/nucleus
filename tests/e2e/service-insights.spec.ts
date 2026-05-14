import { expect, test } from '@playwright/test';

test.describe('ServiceInsights component — Task 6', () => {
  test(
    'hides pending items in production-equivalent rendering',
    async ({ page }) => {
      // Re-enabled in Task 11 when IB page composes <ServiceInsights>.
      await page.goto('/services/investment-banking');
      // Currently all 4 seed items are 'pending', so the right column
      // should show the empty-state message, not the item titles.
      await expect(page.getByText("Regulatory updates we're tracking")).toBeVisible();
    },
  );

  test(
    'renders planned categories for investment-banking once composed',
    async ({ page }) => {
      await page.goto('/services/investment-banking');
      // Scope to the insights section to avoid matching identically-named
      // headings in FundraiseStages (which also renders 'Fundraise readiness').
      const insightsSection = page.locator('.service-v1-insights');
      await expect(insightsSection.getByText('Planned knowledge bank')).toBeVisible();
      await expect(insightsSection.getByRole('heading', { name: 'Fundraise readiness', exact: true })).toBeVisible();
      await expect(insightsSection.getByRole('heading', { name: 'Investor mapping', exact: true })).toBeVisible();
    },
  );
});
