import { expect, test } from '@playwright/test';

test.describe('Nucleus public website smoke checks', () => {
  test('loads the homepage and primary sections on desktop', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Nucleus Advisors/);
    await expect(page.getByRole('link', { name: 'Nucleus Advisors home' })).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: 'From incorporation to listing readiness.',
        level: 1,
      }),
    ).toBeVisible();
    await expect(page.getByText('Nucleus Advisors helps founders')).toBeVisible();

    await expect(
      page.locator('#business-lifecycle').getByRole('heading', {
        name: 'The moments where outside judgement matters.',
      }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sample deliverables across nine practices.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'The decision moments where Nucleus becomes useful.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Soonicorn Angel Trust-I' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Career paths across real business work.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Knowledge built around services, not noise.' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Start a conversation/ }).first()).toBeVisible();
  });

  test('keeps navigation routes and contact links usable', async ({ page }) => {
    await page.goto('/');

    const primaryNav = page.getByRole('navigation', { name: 'Primary navigation' });

    await primaryNav.getByRole('link', { name: 'Services' }).click();
    await expect(page).toHaveURL(/\/services$/);
    await expect(page.getByRole('heading', { name: 'Full-spectrum advisory from setup to scale.' })).toBeVisible();

    await page.getByRole('link', { name: /Investment Banking/ }).first().click();
    await expect(page).toHaveURL(/\/services\/investment-banking$/);
    // IB page uses displayHeadline 'Prepare. Position. Close.' in the h1.
    await expect(page.getByRole('heading', { name: 'Prepare. Position. Close.', exact: true })).toBeVisible();

    await primaryNav.getByRole('link', { name: 'Careers' }).click();
    await expect(page).toHaveURL(/\/careers$/);
    await expect(page.getByRole('heading', { name: 'CA Articleship Track' })).toBeVisible();

    await primaryNav.getByRole('link', { name: 'Insights' }).click();
    await expect(page).toHaveURL(/\/insights$/);
    await expect(page.getByText('AI-assisted drafting remains future/internal')).toBeVisible();

    await primaryNav.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.locator('a[href="mailto:info@nucleusadvisors.in"]').first()).toBeVisible();
  });
});
