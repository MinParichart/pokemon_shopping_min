import { expect, test } from '@playwright/test';

test.describe('Orders e2e (impl)', () => {
  // -----------------------------------------------------------------------
  // ⚠️ TC-PROD-06-impl: Place an order then cancel it
  // -----------------------------------------------------------------------
  test('TC-PROD-06-impl: place an order then cancel it', async ({ page }) => {
    // 1. 📝 Arrange: mock auth/products/orders and keep mutable order state
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'fake-token' }) });
    });

    let order = { id: 555, orderCode: 'ORD555', status: 'PENDING', orderDetails: [{ product: { name: 'ekans' }, quantity: 1 }], totalAmount: 99 };
    await page.route('**/api/orders', async (route) => {
      const method = route.request().method();
      if (method === 'POST') {
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(order) });
      } else if (method === 'PUT' || method === 'PATCH') {
        order = { ...order, status: 'CANCEL' };
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(order) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([order]) });
      }
    });

    await page.route('**/api/products**', async (route) => {
      const products = [{ id: 1, name: 'ekans', description: 'a pokémon', price: 99, stock: 10, category: 'poison', imageUrl: '' }];
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(products) });
    });

    // 2. 🎬 Act: Login, add a product, and place an order
    await page.goto('/login');
    await page.getByRole('textbox').first().fill('minnie');
    await page.locator('input[type="password"]').fill('string');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
    await expect(page).toHaveURL(/.*\/products/);

    await page.getByRole('textbox', { name: 'ค้นหาสินค้าทั้งหมด' }).first().fill('ekans');
    await expect(page.getByText('ekans')).toBeVisible();
    await page.getByRole('button', { name: 'add_shopping_cart' }).first().click();
    await page.getByRole('link', { name: 'shopping_cart' }).click();
    await page.getByRole('button', { name: 'สั่งสินค้า' }).click();
    await page.getByRole('textbox', { name: 'ที่อยู่จัดส่ง' }).fill('Cancel Addr 1');
    await page.getByRole('button', { name: 'ยืนยัน' }).click();

    await page.getByRole('button', { name: 'person' }).click();
    await page.getByRole('link', { name: 'รายการสั่งซื้อของฉัน' }).click();
    const orderRow = page.locator('tbody tr').first();
    await orderRow.click();

    // 3. 🎬 Act: Cancel the order (accept dialogs) and click cancel
    page.on('dialog', async dialog => { await dialog.accept(); });
    const cancelBtn = page.getByRole('button', { name: 'ยกเลิกคำสั่งซื้อ' }).first();
    await cancelBtn.click();

    // 4. 🔍 Assert: show cancel indicator or message
    await expect(page.getByText(/ยกเลิก|ยกเลิกคำสั่งซื้อ/)).toBeVisible({ timeout: 15000 });
  });
});
