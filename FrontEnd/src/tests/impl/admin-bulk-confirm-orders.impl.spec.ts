import { expect, test } from '@playwright/test';

test.describe('Admin bulk confirm e2e (impl)', () => {
  // -----------------------------------------------------------------------
  // ✅ TC-ORDER-BULK-CONFIRM-01-impl: Admin can bulk confirm pending orders
  // -----------------------------------------------------------------------
  test('TC-ORDER-BULK-CONFIRM-01-impl: admin can bulk confirm pending orders', async ({ page }) => {
    // 1. 📝 Arrange: prepare orders and admin page
    let orders = [ { id: 201, orderCode: 'ORD201', status: 'PENDING', orderDetails: [{ product: { name: 'ekans' }, quantity: 1 }], totalAmount: 10 }, { id: 202, orderCode: 'ORD202', status: 'PENDING', orderDetails: [{ product: { name: 'bulbasaur' }, quantity: 2 }], totalAmount: 20 } ];

    const adminPage = await page.context().newPage();
    await adminPage.addInitScript(() => { localStorage.setItem('pokemon_token', 'admin-token'); localStorage.setItem('pokemon_admin_login', '1'); });
    await adminPage.route('**/api/orders', async (route) => { await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(orders) }); });
    await adminPage.route('**/api/orders/**', async (route) => {
      const method = route.request().method();
      if (method === 'PUT' || method === 'PATCH') {
        const url = route.request().url();
        const idMatch = url.match(/\/api\/orders\/(\d+)/);
        const id = idMatch ? Number(idMatch[1]) : undefined;
        const pd = route.request().postData();
        let body = {} as any;
        try { if (pd) body = JSON.parse(pd); } catch (_) { body = {}; }
        if (id) orders = orders.map((o) => (o.id === id ? { ...o, status: (body.status || 'CONFIRM').toUpperCase() } : o));
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({}) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(orders) });
      }
    });

    // 2. 🎬 Act: visit admin orders, select all and click bulk confirm
    await adminPage.goto('/admin/orders');
    await expect(adminPage.getByRole('heading', { name: 'จัดการการสั่งซื้อ' })).toBeVisible();
    await expect(adminPage.locator('thead input[type="checkbox"]')).toBeVisible();
    await adminPage.locator('thead input[type="checkbox"]').click();
    adminPage.on('dialog', async d => { await d.accept(); });
    await adminPage.getByRole('button', { name: 'ยืนยันการสั่งซื้อ' }).click();

    // 3. 🔍 Assert: first row shows confirmed badge
    await expect(adminPage.locator('tbody tr').first()).toContainText('ยืนยันคำสั่งซื้อ', { timeout: 5000 });
  });
});
