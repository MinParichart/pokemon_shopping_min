import { expect, test } from '@playwright/test';

test.describe('Auth (implemented e2e)', () => {
  // -----------------------------------------------------------------------
  // ✅ TC-AUTH-01-impl: เข้าสู่ระบบสำเร็จ (Login happy path)
  // -----------------------------------------------------------------------
  test('TC-AUTH-01-impl: login happy path', async ({ page }) => {
    // 1. 📝 Arrange: mock API and UI handles
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'fake-token' }) });
    });

    const usernameInput = page.getByRole('textbox').first();
    const passwordInput = page.locator('input[type="password"]');
    const loginBtn = page.getByRole('button', { name: 'เข้าสู่ระบบ' });

    // 2. 🎬 Act: perform login
    await page.goto('/login');
    await usernameInput.fill('minnie');
    await passwordInput.fill('string');
    await loginBtn.click();

    // 3. 🔍 Assert: redirected to products
    await expect(page).toHaveURL(/.*\/products/);
  });
});
