import { expect, test } from '@playwright/test';

test.describe('Products error handling (impl)', () => {
  // -----------------------------------------------------------------------
  // ⚠️ TC-PROD-ERR-01-impl: Products page handles API 500 gracefully
  // -----------------------------------------------------------------------
  test('TC-PROD-ERR-01-impl: products page handles API 500 gracefully', async ({ page }) => {
    // 1. 📝 Arrange: mock products API to return 500 and set auth
    await page.route('**/api/products', async (route) => {
      await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'Internal Server Error' }) });
    });
    await page.addInitScript(() => { localStorage.setItem('pokemon_token', 'fake-token'); localStorage.setItem('pokemon_admin_login', '0'); });

    // 2. 🎬 Act: navigate to products page
    await page.goto('/products');

    // 3. 🔍 Assert: the page mounts but no product cards are rendered
    await expect(page.getByPlaceholder('ค้นหาสินค้าทั้งหมด')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('h3')).toHaveCount(0, { timeout: 5000 });
  });
});
