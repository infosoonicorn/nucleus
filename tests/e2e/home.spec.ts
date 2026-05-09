import { expect, test } from '@playwright/test';

test.describe('Nucleus public website smoke checks', () => {
  test('loads the homepage and primary sections on desktop', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Nucleus Advisors/);
    await expect(page.getByRole('link', { name: 'Nucleus Advisors home' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Your Hunt For/ })).toBeVisible();
    await expect(page.getByText('We partner entrepreneurs in critical decisions')).toBeVisible();

    await expect(
      page.getByRole('heading', { name: 'Specialised, relationship-led advisory for finance, audit and M&A.' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Steering ambition through advisory, risk and regulatory depth.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Focused advisory across founder-led, funded and operating businesses.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Experienced partners visible from the first website journey.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Receive insights, updates, newsletters and transaction perspectives.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Start with the public website. Keep the backend editor ready.' })).toBeVisible();
    await expect(page.getByText('Gurugram, Noida, Delhi, Bengaluru, Jaipur and Bathinda.')).toBeVisible();
  });

  test('keeps navigation anchors and contact links usable', async ({ page }) => {
    await page.goto('/');

    const primaryNav = page.getByRole('navigation', { name: 'Primary navigation' });

    await primaryNav.getByRole('link', { name: 'Businesses' }).click();
    await expect(page).toHaveURL(/#businesses$/);
    await expect(
      page.getByRole('heading', { name: 'Steering ambition through advisory, risk and regulatory depth.' }),
    ).toBeInViewport();

    await primaryNav.getByRole('link', { name: 'Sectors' }).click();
    await expect(page).toHaveURL(/#sectors$/);
    await expect(page.getByText('Startups and funded companies').first()).toBeVisible();

    await primaryNav.getByRole('link', { name: 'Team' }).click();
    await expect(page).toHaveURL(/#team$/);
    await expect(page.getByText('Vijay Singh Rathore')).toBeVisible();

    await primaryNav.getByRole('link', { name: 'Insights' }).click();
    await expect(page).toHaveURL(/#insights$/);
    await expect(page.getByText('Nucleus budget update 2026')).toBeVisible();

    await primaryNav.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.getByRole('link', { name: 'info@nucleusadvisors.in' })).toHaveAttribute(
      'href',
      'mailto:info@nucleusadvisors.in',
    );
  });
});
