import { expect, test } from '@playwright/test';

test.describe('Auth (implemented e2e)', () => {
  test('TC-AUTH-01-impl: login happy path', async ({ page }) => {
    // Mock login API to return token
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'fake-token' }),
      });
    });

    await page.goto('/login');
    await page.getByRole('textbox').first().fill('minnie');
    await page.locator('input[type="password"]').fill('string');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
    await expect(page).toHaveURL(/.*\/products/);
  });
});
