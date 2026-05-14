import { expect, test } from '@playwright/test';

test.describe('ServiceInsights component — Task 6', () => {
  test.fixme(
    'hides pending items in production-equivalent rendering',
    async ({ page }) => {
      // Re-enabled in Task 11 when IB page composes <ServiceInsights>.
      await page.goto('/services/investment-banking');
      // Currently all 4 seed items are 'pending', so the right column
      // should show the empty-state message, not the item titles.
      await expect(page.getByText("Regulatory updates we're tracking")).toBeVisible();
    },
  );

  test.fixme(
    'renders planned categories for investment-banking once composed',
    async ({ page }) => {
      await page.goto('/services/investment-banking');
      await expect(page.getByText('Planned knowledge bank')).toBeVisible();
      await expect(page.getByText('Fundraise readiness')).toBeVisible();
      await expect(page.getByText('Investor mapping')).toBeVisible();
    },
  );
});
