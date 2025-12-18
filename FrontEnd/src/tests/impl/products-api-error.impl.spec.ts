import { expect, test } from '@playwright/test';

test.describe('Products error handling (impl)', () => {
  test('TC-PROD-ERR-01-impl: products page handles API 500 gracefully', async ({ page }) => {
    // Mock products API to return 500
    await page.route('**/api/products', async (route) => {
      await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'Internal Server Error' }) });
    });

    // Visit products page
    // Ensure logged-in user (products route requires auth)
    await page.addInitScript(() => { localStorage.setItem('pokemon_token', 'fake-token'); localStorage.setItem('pokemon_admin_login', '0'); });
    await page.goto('/products');

    // Wait for search input as a stable signal the page mounted, then assert no product cards
    await expect(page.getByPlaceholder('ค้นหาสินค้าทั้งหมด')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('h3')).toHaveCount(0, { timeout: 5000 });
  });
});
