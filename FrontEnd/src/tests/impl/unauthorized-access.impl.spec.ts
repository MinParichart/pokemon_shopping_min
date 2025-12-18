import { expect, test } from '@playwright/test';

test.describe('Unauthorized access e2e (impl)', () => {
  test('TC-AUTH-UNAUTH-01-impl: non-admin user redirected from admin routes', async ({ page }) => {
    // Set non-admin token and flag
    await page.addInitScript(() => { localStorage.setItem('pokemon_token', 'fake-user-token'); localStorage.setItem('pokemon_admin_login', '0'); });

    // Try to access admin orders
    await page.goto('/admin/orders');

    // Should be redirected to user products
    await expect(page).toHaveURL(/.*\/products/);
  });
});
