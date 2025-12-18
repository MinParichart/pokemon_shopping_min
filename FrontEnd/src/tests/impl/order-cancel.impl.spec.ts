import { expect, test } from '@playwright/test';

test.describe('Orders e2e (impl)', () => {
  test('TC-PROD-06-impl: place an order then cancel it', async ({ page }) => {
    // Mock login and orders endpoints
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'fake-token' }) });
    });

    // Maintain order state in closure
    let order = { id: 555, orderCode: 'ORD555', status: 'PENDING', orderDetails: [{ product: { name: 'ekans' }, quantity: 1 }], totalAmount: 99 };
    await page.route('**/api/orders', async (route) => {
      const method = route.request().method();
      if (method === 'POST') {
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(order) });
      } else if (method === 'PUT' || method === 'PATCH') {
        // cancel
        order = { ...order, status: 'CANCEL' };
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(order) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([order]) });
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

    // Add a product to cart
    const searchBox = page.getByRole('textbox', { name: 'ค้นหาสินค้าทั้งหมด' }).first();
    await searchBox.fill('ekans');
    await expect(page.getByText('ekans')).toBeVisible();
    await expect(page.getByRole('button', { name: 'add_shopping_cart' }).first()).toBeVisible();
    await page.getByRole('button', { name: 'add_shopping_cart' }).first().click();
    await page.getByRole('link', { name: 'shopping_cart' }).click();

    // Place order
    await page.getByRole('button', { name: 'สั่งสินค้า' }).click();
    await page.getByRole('textbox', { name: 'ที่อยู่จัดส่ง' }).fill('Cancel Addr 1');
    await page.getByRole('button', { name: 'ยืนยัน' }).click();

    // Go to My Orders
    await page.getByRole('button', { name: 'person' }).click();
    await page.getByRole('link', { name: 'รายการสั่งซื้อของฉัน' }).click();

    // Open latest order (first data row) and cancel
    const orderRow = page.locator('tbody tr').first();
    await orderRow.click();

    // Accept any browser dialogs
    page.on('dialog', async dialog => { await dialog.accept(); });

    const cancelBtn = page.getByRole('button', { name: 'ยกเลิกคำสั่งซื้อ' }).first();
    await cancelBtn.click();

    // Wait for any visible indicator that the order was cancelled (text or toast)
    await expect(page.getByText(/ยกเลิก|ยกเลิกคำสั่งซื้อ/)).toBeVisible({ timeout: 15000 });
  });
});
