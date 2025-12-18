import { expect, test } from '@playwright/test';

test.describe('Order status transition e2e (impl)', () => {
  test('TC-ORDER-STATUS-01-impl: user places order; admin confirms it', async ({ page }) => {
    // Mock user login and orders endpoints
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'fake-token' }) });
    });

    // Keep order state
    let order = { id: 777, orderCode: 'ORD777', status: 'PENDING', orderDetails: [{ product: { name: 'ekans' }, quantity: 1 }], totalAmount: 99 };
    await page.route('**/api/orders', async (route) => {
      const method = route.request().method();
      if (method === 'POST') {
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(order) });
      } else if (method === 'PUT' || method === 'PATCH') {
        // admin update status
        order = { ...order, status: 'CONFIRM' };
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

      // Mock admin login so admin flow is deterministic
      await page.route('**/api/admin/login', async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'admin-token' }) });
      });

    // User places an order
    await page.goto('/login');
    await page.getByRole('textbox').first().fill('minnie');
    await page.locator('input[type="password"]').fill('string');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
    await expect(page).toHaveURL(/.*\/products/);

    await page.getByRole('textbox', { name: 'ค้นหาสินค้าทั้งหมด' }).fill('ekans');
    await expect(page.getByText('ekans')).toBeVisible();
    await expect(page.getByRole('button', { name: 'add_shopping_cart' }).first()).toBeVisible();
    await page.getByRole('button', { name: 'add_shopping_cart' }).first().click();
    await page.getByRole('link', { name: 'shopping_cart' }).click();
    await page.getByRole('button', { name: 'สั่งสินค้า' }).click();
    await page.getByRole('textbox', { name: 'ที่อยู่จัดส่ง' }).fill('Confirm Addr');
    await page.getByRole('button', { name: 'ยืนยัน' }).click();

    // Go to My Orders and grab the order code from latest data row
    await page.getByRole('button', { name: 'person' }).click();
    await page.getByRole('link', { name: 'รายการสั่งซื้อของฉัน' }).click();
    const orderRow = page.locator('tbody tr').first();
    await expect(orderRow).toBeVisible({ timeout: 10000 });
    const orderCode = (await orderRow.locator('td').first().textContent())?.trim();
    await expect(orderCode).toBeTruthy();

    // Admin confirms the order in a separate page (so admin user isn't blocked by current logged-in user)
    const adminPage = await page.context().newPage();

    // Register admin routes on the new page using the same closure 'order'
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

    // Set admin auth directly for the adminPage and navigate to orders
    await adminPage.addInitScript(() => {
      localStorage.setItem('pokemon_token', 'admin-token');
      localStorage.setItem('pokemon_admin_login', '1');
    });
    await adminPage.goto('/admin/orders');
    await expect(adminPage).toHaveURL(/.*\/admin\/orders/);

    // Find the order row by code and expand
    const adminRow = adminPage.locator('tr').filter({ hasText: orderCode }).first();
    await adminRow.click();

    // Accept confirm dialogs
    adminPage.on('dialog', async dialog => { await dialog.accept(); });

    // Click confirm
    await adminPage.getByRole('button', { name: 'ยืนยัน' }).first().click();

    // Assert status updated to confirmed (Thai label)
    await expect(adminRow).toContainText('ยืนยันคำสั่งซื้อ', { timeout: 10000 });
  });
});
