import { expect, test } from '@playwright/test';

test.describe('Admin single reject e2e (impl)', () => {
  test('TC-ORDER-REJECT-01-impl: admin can reject a single pending order', async ({ page }) => {
    let orders = [
      { id: 301, orderCode: 'ORD301', status: 'PENDING', orderDetails: [{ product: { name: 'ekans' }, quantity: 1 }], totalAmount: 10 }
    ];

    const adminPage = await page.context().newPage();
    await adminPage.addInitScript(() => { localStorage.setItem('pokemon_token', 'admin-token'); localStorage.setItem('pokemon_admin_login', '1'); });

    await adminPage.route('**/api/orders', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(orders) });
    });

    await adminPage.route('**/api/orders/**', async (route) => {
      const method = route.request().method();
      if (method === 'PUT' || method === 'PATCH') {
        const url = route.request().url();
        const idMatch = url.match(/\/api\/orders\/(\d+)/);
        const id = idMatch ? Number(idMatch[1]) : undefined;
        const pd = route.request().postData();
        let body = {} as any;
        try { if (pd) body = JSON.parse(pd); } catch (_) { body = {}; }
        if (id) orders = orders.map((o) => (o.id === id ? { ...o, status: (body.status || 'REJECT').toUpperCase() } : o));
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({}) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(orders) });
      }
    });

    await adminPage.goto('/admin/orders');
    await expect(adminPage.getByRole('heading', { name: 'จัดการการสั่งซื้อ' })).toBeVisible();

    // Click first row to expand and click reject (expand renders a sibling row with buttons)
    const row = adminPage.locator('tbody tr').first();
    await row.click();
    adminPage.on('dialog', async d => { await d.accept(); });

    const expanded = row.locator('xpath=following-sibling::tr[1]');
    await expect(expanded).toBeVisible({ timeout: 10000 });
    await expect(expanded.getByRole('button', { name: 'ปฏิเสธ' })).toBeVisible({ timeout: 10000 });
    await expanded.getByRole('button', { name: 'ปฏิเสธ' }).click();

    await expect(adminPage.locator('tbody tr').first()).toContainText('ปฏิเสธคำสั่งซื้อ', { timeout: 5000 });
  });
});
