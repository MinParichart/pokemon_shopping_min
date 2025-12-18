import { test } from '@playwright/test';

test.describe('Register Page Testing Suite', () => {
  // -----------------------------------------------------------------------
  // 🛠️ SETUP: ตั้งค่าก่อนเริ่ม Test ทุกข้อ
  // -----------------------------------------------------------------------
  test.beforeEach(async ({ page }) => {
    // 🎭 Mock API: จำลองว่า Server ตอบกลับมาว่า Success เสมอ
    // เพื่อป้องกันไม่ให้ Test ยิงข้อมูลขยะลง Database จริง
    await page.route('**/api/**/register', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'User registered successfully',
          userId: 123,
        }),
      });
    });

    // ไปที่หน้า Register
    await page.goto('http://localhost:5173/register');
  });

  // (Reference tests - do not run in CI. Kept as examples.)
});
