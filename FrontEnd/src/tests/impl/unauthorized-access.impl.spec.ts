import { expect, test } from '@playwright/test';

test.describe('Unauthorized access e2e (impl)', () => {
  // -----------------------------------------------------------------------
  // ⚠️ TC-AUTH-UNAUTH-01-impl: ตรวจการเข้าถึง admin โดยไม่ใช่ admin
  // -----------------------------------------------------------------------
  test('TC-AUTH-UNAUTH-01-impl: non-admin user redirected from admin routes', async ({ page }) => {
    // 1. 📝 Arrange: set non-admin token
    await page.addInitScript(() => { localStorage.setItem('pokemon_token', 'fake-user-token'); localStorage.setItem('pokemon_admin_login', '0'); });

    // 2. 🎬 Act: navigate to an admin route
    await page.goto('/admin/orders');

    // 3. 🔍 Assert: redirected to products page
    await expect(page).toHaveURL(/.*\/products/);
  });
});
