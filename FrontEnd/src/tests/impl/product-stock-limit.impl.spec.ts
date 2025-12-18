import { expect, test } from '@playwright/test';

test.describe('Stock limit e2e (impl)', () => {
  // -----------------------------------------------------------------------
  // ⚠️ TC-PROD-05-impl: Prevent adding more than available stock
  // -----------------------------------------------------------------------
  test('TC-PROD-05-impl: prevent adding more than available stock', async ({ page }) => {
    // 1. 📝 Arrange: mock admin login and products endpoints and prepare product store
    await page.route('**/api/admin/login', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'admin-token' }) });
    });

    let createdProduct: any = null;
    await page.route('**/api/products', async (route) => {
      const method = route.request().method();
      if (method === 'POST') {
        const body = await route.request().postDataJSON();
        createdProduct = { id: Date.now(), ...body };
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(createdProduct) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(createdProduct ? [createdProduct] : []) });
      }
    });

    const productName = `stock-test-${Date.now()}`;

    // 2. 🎬 Act: Admin creates a low-stock product
    await page.goto('/admin/login');
    await page.getByRole('textbox').first().fill('admin');
    await page.locator('input[type="password"]').fill('1234');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
    await expect(page).toHaveURL(/.*\/admin\/orders/);

    await page.goto('/admin/products');
    await page.getByRole('button', { name: 'เพิ่มสินค้าใหม่' }).click();
    await page.locator('label:has-text("ชื่อสินค้า") + div input').fill(productName);
    await page.locator('label:has-text("คำอธิบาย") + div textarea').fill('stock limit test');
    await page.locator('label:has-text("ราคา (฿)") + div input').fill('9');
    await page.locator('label:has-text("จำนวนในสต็อก") + div input').fill('2');
    await page.locator('label:has-text("หมวดหมู่") + div input').fill('test');
    await page.locator('label:has-text("URL รูปภาพ") + div input').fill('https://example.com/img.png');
    await page.getByRole('button', { name: 'บันทึก' }).click();

    await expect(page.getByText(productName)).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'ออกจากระบบ' }).click();

    // User logs in and attempts to exceed stock
    await page.goto('/login');
    await page.getByRole('textbox').first().fill('minnie');
    await page.locator('input[type="password"]').fill('string');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
    await expect(page).toHaveURL(/.*\/products/);

    await page.getByRole('textbox', { name: 'ค้นหาสินค้าทั้งหมด' }).fill(productName);
    await expect(page.getByText(productName)).toBeVisible();
    const addBtn = page.getByRole('button', { name: 'add_shopping_cart' }).first();
    await expect(addBtn).toBeVisible();
    await addBtn.click();
    await addBtn.click();
    // third attempt should show a toast or block
    await addBtn.click();

    // 3. 🔍 Assert: user sees a stock-limit toast/message
    await expect(page.locator('p').filter({ hasText: /หมด|ครบจำนวน|หมดหรือครบจำนวน/ }).first()).toBeVisible({ timeout: 5000 });
  });
});
