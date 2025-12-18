import { expect, test } from '@playwright/test';

test.describe('Products e2e (impl)', () => {
  test('TC-PROD-ADD-01-impl: add product to cart and place order', async ({ page }) => {
    // Mock login and orders API
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'fake-token' }) });
    });
    // Maintain order state for GET after POST
    let createdOrder: any = null;
    await page.route('**/api/orders', async (route) => {
      const method = route.request().method();
      if (method === 'POST') {
        createdOrder = { id: Date.now(), orderCode: 'ORD001', status: 'PENDING', orderDetails: [{ product: { name: 'ekans' }, quantity: 1 }], totalAmount: 99 };
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(createdOrder) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(createdOrder ? [createdOrder] : []) });
      }
    });

    // Mock products API so product list renders deterministically
    await page.route('**/api/products**', async (route) => {
      const products = [
        { id: 1, name: 'ekans', description: 'a pokémon', price: 99, stock: 10, category: 'poison', imageUrl: '' }
      ];
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(products) });
    });

    // Login as user
    await page.goto('/login');
    await page.getByRole('textbox').first().fill('minnie');
    await page.locator('input[type="password"]').fill('string');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
    await expect(page).toHaveURL(/.*\/products/);

    // Search for product 'ekans'
    const searchBox = page.getByRole('textbox', { name: 'ค้นหาสินค้าทั้งหมด' }).first();
    await searchBox.fill('ekans');
    // Wait for product to appear and add button to be visible
    await expect(page.getByText('ekans')).toBeVisible();
    await expect(page.getByRole('button', { name: 'add_shopping_cart' }).first()).toBeVisible();
    await page.getByRole('button', { name: 'add_shopping_cart' }).first().click();

    // Open cart and assert item present
    await page.getByRole('link', { name: 'shopping_cart' }).click();
    await expect(page.locator('table')).toContainText('ekans');

    // Increase quantity, then decrease
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '−' }).click();

    // Place order
    await page.getByRole('button', { name: 'สั่งสินค้า' }).click();
    await page.getByRole('textbox', { name: 'ที่อยู่จัดส่ง' }).fill('Test Address 123');
    await page.getByRole('button', { name: 'ยืนยัน' }).click();

    // Go to My Orders and check latest order contains ekans
    await page.getByRole('button', { name: 'person' }).click();
    await page.getByRole('link', { name: 'รายการสั่งซื้อของฉัน' }).click();

    // Wait for orders to load and assert presence (skip header row)
    await expect(page.locator('tbody tr').first()).toBeVisible();
    // Expand the latest order row to see order details and assert product appears
    await page.locator('tbody tr').first().click();
    await expect(page.getByText('ekans')).toBeVisible();
  });
});
