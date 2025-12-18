import { expect, test } from '@playwright/test';

test.describe('Products (implemented e2e)', () => {
  // -----------------------------------------------------------------------
  // ✅ TC-PROD-01-impl: แสดงรายการสินค้าหลังจากล็อกอิน (Smoke / Happy Path)
  // -----------------------------------------------------------------------
  test('TC-PROD-01-impl: display product list after login', async ({ page }) => {
    // 1. 📝 Arrange: เตรียม mocks และ element handles
    // Mock login API
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'fake-token' }) });
    });

    // Mock products GET to return a small list
    const productsMock = [{ id: 1, name: 'pikachu', price: 81, stock: 5, category: 'toy', imageUrl: '' }];
    await page.route('**/api/products', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(productsMock) });
    });

    const usernameInput = page.getByRole('textbox').first();
    const passwordInput = page.locator('input[type="password"]');
    const loginBtn = page.getByRole('button', { name: 'เข้าสู่ระบบ' });

    // 2. 🎬 Act: ทำการล็อกอินและเข้าหน้า products
    await page.goto('/login');
    await usernameInput.fill('minnie');
    await passwordInput.fill('string');
    await loginBtn.click();

    // 3. 🔍 Assert: ตรวจสอบผลลัพธ์
    // เช็คว่าเราไปที่หน้า /products สำเร็จ
    await expect(page).toHaveURL(/.*\/products/);

    // เช็คหัวข้อหน้า และว่ามีการ์ดสินค้าที่ชื่อ 'pikachu' ปรากฏ
    await expect(page.locator('h1')).toContainText('สินค้าทั้งหมด');
    await expect(page.getByText('pikachu')).toBeVisible();
  });

});
