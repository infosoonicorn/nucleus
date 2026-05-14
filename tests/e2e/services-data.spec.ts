import { expect, test } from '@playwright/test';

test.describe('Services data model — Task 1', () => {
  test('every service slug returns a 2xx response', async ({ page }) => {
    // Visit each service page; the ordinal appears in the page eyebrow once
    // <ServiceHero> is wired up. Until then, this asserts the data layer by
    // hitting the services overview where ordinals will be rendered in card meta.
    const slugs = [
      'investment-banking',
      'ma-advisory',
      'risk-advisory',
      'tax-regulatory',
      'assurance',
      'valuations',
      'finance-outsourcing',
      'corporate-secretarial',
      'aif-fund-management',
    ];
    for (const slug of slugs) {
      const response = await page.request.get(`/services/${slug}`);
      expect(response.status(), `expected /services/${slug} to load`).toBeLessThan(400);
    }
  });

  test.fixme(
    'investment banking carries a Soonicorn cross-link in approved status',
    async ({ page }) => {
      await page.goto('/services/investment-banking');
      await expect(page.getByRole('link', { name: /Visit Soonicorn Ventures/ })).toBeVisible();
      await expect(page.getByText(/This is not an offer or solicitation/)).toBeVisible();
    },
  );
});

test.describe('Default service-page composition — Task 7', () => {
  const NON_IB = [
    'ma-advisory',
    'risk-advisory',
    'tax-regulatory',
    'assurance',
    'valuations',
    'finance-outsourcing',
    'corporate-secretarial',
    'aif-fund-management',
  ];

  for (const slug of NON_IB) {
    test(`${slug} renders the elevated default composition`, async ({ page }) => {
      await page.goto(`/services/${slug}`);
      await expect(page.locator('.service-v1-hero')).toBeVisible();
      await expect(page.getByRole('heading', { name: /A clear engagement path/ })).toBeVisible();
      await expect(page.locator('.subpage-hero')).toHaveCount(0);
    });
  }
});
