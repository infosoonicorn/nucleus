import { expect, test } from '@playwright/test';

test.describe('Lead magnet stub route — Task 3', () => {
  test('POST returns friendly confirmation JSON', async ({ request }) => {
    const response = await request.post('/api/lead-magnet-stub', {
      data: { email: 'someone@example.com', kind: 'lead-magnet', serviceSlug: 'investment-banking' },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.message).toContain("We'll be in touch");
  });

  test('POST rejects when email field is missing', async ({ request }) => {
    const response = await request.post('/api/lead-magnet-stub', { data: { kind: 'lead-magnet' } });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.ok).toBe(false);
  });
});
