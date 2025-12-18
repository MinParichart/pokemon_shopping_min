import { expect, test } from '@playwright/test';

test.describe('Products (implemented e2e)', () => {
  test('TC-PROD-01-impl: display product list after login', async ({ page }) => {
    // Mock login API
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'fake-token' }) });
    });

    // Mock products GET to return a small list
    await page.route('**/api/products', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ id: 1, name: 'pikachuPokémon', price: 81, stock: 5, category: 'toy', imageUrl: '' }]) });
    });

    // Login
    await page.goto('/login');
    await page.getByRole('textbox').first().fill('minnie');
    await page.locator('input[type="password"]').fill('string');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    // Assert arrived at products
    await expect(page).toHaveURL(/.*\/products/);
    await expect(page.locator('h1')).toContainText('สินค้าทั้งหมด');
  });
});
