import { expect, test } from '@playwright/test';

test.describe('Order status transition e2e (impl)', () => {
  // -----------------------------------------------------------------------
  // ✅ TC-ORDER-STATUS-01-impl: User สั่งซื้อสินค้า; Admin ยืนยันคำสั่งซื้อ
  // -----------------------------------------------------------------------
  test('TC-ORDER-STATUS-01-impl: user places order; admin confirms it', async ({ page }) => {
    // 1. 📝 Arrange: Mock auth/products/orders and prepare a mutable order object
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'fake-token' }) });
    });

    let order = { id: 777, orderCode: 'ORD777', status: 'PENDING', orderDetails: [{ product: { name: 'ekans' }, quantity: 1 }], totalAmount: 99 };
    await page.route('**/api/orders', async (route) => {
      const method = route.request().method();
      if (method === 'POST') {
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(order) });
      } else if (method === 'PUT' || method === 'PATCH') {
        order = { ...order, status: 'CONFIRM' };
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(order) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([order]) });
      }
    });

    await page.route('**/api/products**', async (route) => {
      const products = [{ id: 1, name: 'ekans', description: 'a pokémon', price: 99, stock: 10, category: 'poison', imageUrl: '' }];
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(products) });
    });

    await page.route('**/api/admin/login', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'admin-token' }) });
    });

    // 2. 🎬 Act: User places an order
    await page.goto('/login');
    await page.getByRole('textbox').first().fill('minnie');
    await page.locator('input[type="password"]').fill('string');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
    await expect(page).toHaveURL(/.*\/products/);

    await page.getByRole('textbox', { name: 'ค้นหาสินค้าทั้งหมด' }).fill('ekans');
    await expect(page.getByText('ekans')).toBeVisible();
    await page.getByRole('button', { name: 'add_shopping_cart' }).first().click();
    await page.getByRole('link', { name: 'shopping_cart' }).click();
    await page.getByRole('button', { name: 'สั่งสินค้า' }).click();
    await page.getByRole('textbox', { name: 'ที่อยู่จัดส่ง' }).fill('Confirm Addr');
    await page.getByRole('button', { name: 'ยืนยัน' }).click();

    await page.getByRole('button', { name: 'person' }).click();
    await page.getByRole('link', { name: 'รายการสั่งซื้อของฉัน' }).click();
    const orderRow = page.locator('tbody tr').first();
    await expect(orderRow).toBeVisible({ timeout: 10000 });
    const orderCode = (await orderRow.locator('td').first().textContent())?.trim();
    await expect(orderCode).toBeTruthy();

    // 3. 🎬 Act (admin): In a separate page, admin confirms the order
    const adminPage = await page.context().newPage();
    await adminPage.route('**/api/admin/login', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'admin-token' }) });
    });
    await adminPage.route('**/api/orders', async (route) => {
      const method = route.request().method();
      if (method === 'PUT' || method === 'PATCH') {
        order = { ...order, status: 'CONFIRM' };
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(order) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([order]) });
      }
    });
    await adminPage.addInitScript(() => { localStorage.setItem('pokemon_token', 'admin-token'); localStorage.setItem('pokemon_admin_login', '1'); });
    await adminPage.goto('/admin/orders');
    await expect(adminPage).toHaveURL(/.*\/admin\/orders/);

    const adminRow = adminPage.locator('tr').filter({ hasText: orderCode }).first();
    await adminRow.click();
    adminPage.on('dialog', async dialog => { await dialog.accept(); });
    await adminPage.getByRole('button', { name: 'ยืนยัน' }).first().click();

    // 4. 🔍 Assert: order row shows confirmed status (Thai label)
    await expect(adminRow).toContainText('ยืนยันคำสั่งซื้อ', { timeout: 10000 });
  });
});
