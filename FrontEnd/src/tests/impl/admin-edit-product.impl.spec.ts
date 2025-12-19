import { expect, test } from '@playwright/test';

test.describe('Admin edit product e2e (impl)', () => {
  // -----------------------------------------------------------------------
  // ✅ TC-ADMIN-PROD-EDIT-01-impl: Admin แก้ไขสินค้าที่มีอยู่แล้ว
  // -----------------------------------------------------------------------
  test('TC-ADMIN-PROD-EDIT-01-impl: admin can edit an existing product', async ({ page }) => {
    // 1. 📝 Arrange: create unique product names for the test
    const originalName = `edit-me-${Date.now()}`;
    const newName = `${originalName}-UPDATED`;

    // 2. 🎬 Act: login as admin, create product, open edit modal, and update
    await page.goto('/admin/login');
    await page.getByRole('textbox').first().fill('admin');
    await page.locator('input[type="password"]').fill('1234');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
    await expect(page).toHaveURL(/.*\/admin\/orders/);

    await page.goto('/admin/products');
    await page.getByRole('button', { name: 'เพิ่มสินค้าใหม่' }).click();
    await page.locator('label:has-text("ชื่อสินค้า") + div input').fill(originalName);
    await page.locator('label:has-text("คำอธิบาย") + div textarea').fill('to be edited');
    await page.locator('label:has-text("ราคา (฿)") + div input').fill('10');
    await page.locator('label:has-text("จำนวนในสต็อก") + div input').fill('5');
    await page.locator('label:has-text("หมวดหมู่") + div input').fill('test');
    await page.locator('label:has-text("URL รูปภาพ") + div input').fill('https://example.com/edit.png');
    await page.getByRole('button', { name: 'บันทึก' }).click();

    const row = page.locator('tr').filter({ hasText: originalName }).first();
    await expect(row).toBeVisible();
    await row.getByTitle('แก้ไข').click();

    await page.locator('label:has-text("ชื่อสินค้า") + div input').fill(newName);
    await page.locator('label:has-text("ราคา (฿)") + div input').fill('20');
    await page.getByRole('button', { name: 'บันทึก' }).click();

    // 3. 🔍 Assert: updated product appears with new values
    await expect(page.locator('table')).toContainText(newName);
    await expect(page.locator('table')).toContainText('฿20');
  });
});
