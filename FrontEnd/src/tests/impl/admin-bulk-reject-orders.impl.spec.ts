import { expect, test } from '@playwright/test';

test.describe('Admin bulk actions e2e (impl)', () => {
  // -----------------------------------------------------------------------
  // ⚠️ TC-ORDER-BULK-REJECT-01-impl: Admin can bulk reject pending orders
  // -----------------------------------------------------------------------
  test('TC-ORDER-BULK-REJECT-01-impl: admin can bulk reject pending orders', async ({ page }) => {
    // 1. 📝 Arrange: prepare orders state and adminPage with routes
    let orders = [
      { id: 101, orderCode: 'ORD101', status: 'PENDING', orderDetails: [{ product: { name: 'ekans' }, quantity: 1 }], totalAmount: 10 },
      { id: 102, orderCode: 'ORD102', status: 'PENDING', orderDetails: [{ product: { name: 'pikachu' }, quantity: 2 }], totalAmount: 20 },
      { id: 103, orderCode: 'ORD103', status: 'PENDING', orderDetails: [{ product: { name: 'sandshrew' }, quantity: 1 }], totalAmount: 5 },
    ];

    const adminPage = await page.context().newPage();
    await adminPage.addInitScript(() => { localStorage.setItem('pokemon_token', 'admin-token'); localStorage.setItem('pokemon_admin_login', '1'); });

    await adminPage.route('**/api/orders', async (route) => { await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(orders) }); });
    await adminPage.route('**/api/orders/**', async (route) => {
      const method = route.request().method();
      if (method === 'PUT' || method === 'PATCH') {
        const url = route.request().url();
        const idMatch = url.match(/\/api\/orders\/(\d+)/);
        const id = idMatch ? Number(idMatch[1]) : undefined;
        let body: any = {};
        try { const pd = route.request().postData(); if (pd) body = JSON.parse(pd); } catch (_) { body = {}; }
        if (id) orders = orders.map((o) => (o.id === id ? { ...o, status: (body.status || 'REJECT').toUpperCase() } : o));
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({}) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(orders) });
      }
    });

    // 2. 🎬 Act: visit admin orders, select all, and click bulk reject
    await adminPage.goto('/admin/orders');
    await expect(adminPage).toHaveURL(/.*\/admin\/orders/);
    await expect(adminPage.getByRole('heading', { name: 'จัดการการสั่งซื้อ' })).toBeVisible({ timeout: 5000 });
    await expect(adminPage.locator('thead input[type="checkbox"]')).toBeVisible({ timeout: 5000 });
    await adminPage.locator('thead input[type="checkbox"]').click();
    adminPage.on('dialog', async (dialog) => { await dialog.accept(); });
    await adminPage.getByRole('button', { name: 'ปฏิเสธการสั่งซื้อ' }).click();

    // 3. 🔍 Assert: first row shows rejected status
    await expect(adminPage.locator('tbody tr').first()).toContainText('ปฏิเสธคำสั่งซื้อ', { timeout: 5000 });
  });
});
