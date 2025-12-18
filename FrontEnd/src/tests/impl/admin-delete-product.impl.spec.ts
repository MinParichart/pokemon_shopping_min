import { expect, test } from '@playwright/test';

test.describe('Admin delete product e2e (impl)', () => {
  test('TC-ADMIN-PROD-DELETE-01-impl: admin can delete a product', async ({ page }) => {
    // Admin login
    await page.goto('/admin/login');
    await page.getByRole('textbox').first().fill('admin');
    await page.locator('input[type="password"]').fill('1234');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
    await expect(page).toHaveURL(/.*\/admin\/orders/);

    // Navigate to products management
    await page.goto('/admin/products');
    await expect(page.locator('h1')).toContainText('จัดการสินค้า');

    // Create a product to delete
    const name = `delete-me-${Date.now()}`;
    await page.getByRole('button', { name: 'เพิ่มสินค้าใหม่' }).click();
    await page.locator('label:has-text("ชื่อสินค้า") + div input').fill(name);
    await page.locator('label:has-text("คำอธิบาย") + div textarea').fill('to be deleted');
    await page.locator('label:has-text("ราคา (฿)") + div input').fill('5');
    await page.locator('label:has-text("จำนวนในสต็อก") + div input').fill('5');
    await page.locator('label:has-text("หมวดหมู่") + div input').fill('test');
    await page.locator('label:has-text("URL รูปภาพ") + div input').fill('https://example.com/del.png');
    await page.getByRole('button', { name: 'บันทึก' }).click();

    // Ensure it appears
    const row = page.locator('tr').filter({ hasText: name }).first();
    await expect(row).toBeVisible({ timeout: 10000 });

    // Prepare to accept confirm dialog
    page.on('dialog', async dialog => { await dialog.accept(); });

    // Click delete
    await row.getByTitle('ลบ').click();

    // Assert it no longer appears
    await expect(page.locator('table')).not.toContainText(name, { timeout: 10000 });
  });
});
