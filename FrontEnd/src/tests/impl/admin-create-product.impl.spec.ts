import { expect, test } from '@playwright/test';

test.describe('Admin products e2e (impl)', () => {
  // -----------------------------------------------------------------------
  // ✅ TC-ADMIN-PROD-01-impl: Admin สร้างสินค้าใหม่
  // -----------------------------------------------------------------------
  test('TC-ADMIN-PROD-01-impl: admin can create a new product', async ({ page }) => {
    // 1. 📝 Arrange: mock admin login and products endpoints
    await page.route('**/api/admin/login', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'admin-token' }) });
    });

    const created = { id: 99999, name: 'test-product-impl', description: 'integration test product', price: 99, stock: 50, category: 'test-category', imageUrl: 'https://example.com/img.png' };
    await page.route('**/api/products', async (route) => {
      const method = route.request().method();
      if (method === 'POST') {
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(created) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([created]) });
      }
    });

    // 2. 🎬 Act: login as admin, fill create form and save
    await page.goto('/admin/login');
    await page.getByRole('textbox').first().fill('admin');
    await page.locator('input[type="password"]').fill('1234');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
    await expect(page).toHaveURL(/.*\/admin\/orders/);

    await page.goto('/admin/products');
    await expect(page.locator('h1')).toContainText('จัดการสินค้า');
    await page.getByRole('button', { name: 'เพิ่มสินค้าใหม่' }).click();

    await page.locator('label:has-text("ชื่อสินค้า") + div input').fill('test-product-impl');
    await page.locator('label:has-text("คำอธิบาย") + div textarea').fill('integration test product');
    await page.locator('label:has-text("ราคา (฿)") + div input').fill('99');
    await page.locator('label:has-text("จำนวนในสต็อก") + div input').fill('50');
    await page.locator('label:has-text("หมวดหมู่") + div input').fill('test-category');
    await page.locator('label:has-text("URL รูปภาพ") + div input').fill('https://example.com/img.png');
    await page.getByRole('button', { name: 'บันทึก' }).click();

    // 3. 🔍 Assert: created product appears in the table
    await expect(page.locator('table')).toContainText('test-product-impl');

  });
});