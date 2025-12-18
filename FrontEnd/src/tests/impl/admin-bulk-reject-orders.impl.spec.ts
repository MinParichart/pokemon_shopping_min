import { expect, test } from '@playwright/test';

test.describe('Admin bulk actions e2e (impl)', () => {
  test('TC-ORDER-BULK-REJECT-01-impl: admin can bulk reject pending orders', async ({ page }) => {
    // Keep orders state
    let orders = [
      { id: 101, orderCode: 'ORD101', status: 'PENDING', orderDetails: [{ product: { name: 'ekans' }, quantity: 1 }], totalAmount: 10 },
      { id: 102, orderCode: 'ORD102', status: 'PENDING', orderDetails: [{ product: { name: 'pikachu' }, quantity: 2 }], totalAmount: 20 },
      { id: 103, orderCode: 'ORD103', status: 'PENDING', orderDetails: [{ product: { name: 'sandshrew' }, quantity: 1 }], totalAmount: 5 },
    ];

    // NOTE: adminPage will be a separate page; we will register routes on adminPage below

    // Use admin page with admin auth via localStorage
    const adminPage = await page.context().newPage();
    await adminPage.addInitScript(() => {
      localStorage.setItem('pokemon_token', 'admin-token');
      localStorage.setItem('pokemon_admin_login', '1');
    });

    // Register orders routes on adminPage (GET and PATCH) so the admin UI receives data
    await adminPage.route('**/api/orders', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(orders) });
    });
    await adminPage.route('**/api/orders/**', async (route) => {
      const method = route.request().method();
      if (method === 'PUT' || method === 'PATCH') {
        const url = route.request().url();
        const idMatch = url.match(/\/api\/orders\/(\d+)/);
        const id = idMatch ? Number(idMatch[1]) : undefined;
        let body: any = {};
        try {
          const pd = route.request().postData();
          if (pd) body = JSON.parse(pd);
        } catch (_) { body = {}; }
        if (id) {
          orders = orders.map((o) => (o.id === id ? { ...o, status: (body.status || 'REJECT').toUpperCase() } : o));
        }
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({}) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(orders) });
      }
    });

    await adminPage.goto('/admin/orders');
    await expect(adminPage).toHaveURL(/.*\/admin\/orders/);

    // Wait for page heading and table to render, then select all pending orders via header checkbox
    await expect(adminPage.getByRole('heading', { name: 'จัดการการสั่งซื้อ' })).toBeVisible({ timeout: 5000 });
    await expect(adminPage.locator('thead input[type="checkbox"]')).toBeVisible({ timeout: 5000 });
    await adminPage.locator('thead input[type="checkbox"]').click();

    // Intercept confirm dialog and accept
    adminPage.on('dialog', async (dialog) => { await dialog.accept(); });

    // Click reject bulk action
    await adminPage.getByRole('button', { name: 'ปฏิเสธการสั่งซื้อ' }).click();

    // After bulk update, orders should have status REJECT -> label 'ปฏิเสธคำสั่งซื้อ'
    await expect(adminPage.locator('tbody tr').first()).toContainText('ปฏิเสธคำสั่งซื้อ', { timeout: 5000 });
  });
});
