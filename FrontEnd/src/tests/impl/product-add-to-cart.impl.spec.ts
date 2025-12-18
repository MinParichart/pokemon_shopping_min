import { expect, test } from '@playwright/test';

test.describe('Products e2e (impl)', () => {
  // -----------------------------------------------------------------------
  // ✅ TC-PROD-ADD-01-impl: เพิ่มสินค้าในตะกร้าแล้วสั่งซื้อสำเร็จ (Add to cart + Place order)
  // -----------------------------------------------------------------------
  test('TC-PROD-ADD-01-impl: add product to cart and place order', async ({ page }) => {
    // 1. 📝 Arrange: mock APIs and prepare handles
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'fake-token' }) });
    });

    let createdOrder: any = null;
    await page.route('**/api/orders', async (route) => {
      const method = route.request().method();
      if (method === 'POST') {
        createdOrder = { id: Date.now(), orderCode: 'ORD001', status: 'PENDING', orderDetails: [{ product: { name: 'ekans' }, quantity: 1 }], totalAmount: 99 };
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(createdOrder) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(createdOrder ? [createdOrder] : []) });
      }
    });

    const products = [{ id: 1, name: 'ekans', description: 'a pokémon', price: 99, stock: 10, category: 'poison', imageUrl: '' }];
    await page.route('**/api/products**', async (route) => { await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(products) }); });

    const usernameInput = page.getByRole('textbox').first();
    const passwordInput = page.locator('input[type="password"]');
    const loginBtn = page.getByRole('button', { name: 'เข้าสู่ระบบ' });
    const searchBox = page.getByRole('textbox', { name: 'ค้นหาสินค้าทั้งหมด' }).first();

    // 2. 🎬 Act: login, add product, place order
    await page.goto('/login');
    await usernameInput.fill('minnie');
    await passwordInput.fill('string');
    await loginBtn.click();
    await expect(page).toHaveURL(/.*\/products/);

    await searchBox.fill('ekans');
    await expect(page.getByText('ekans')).toBeVisible();
    await expect(page.getByRole('button', { name: 'add_shopping_cart' }).first()).toBeVisible();
    await page.getByRole('button', { name: 'add_shopping_cart' }).first().click();

    await page.getByRole('link', { name: 'shopping_cart' }).click();
    await page.getByRole('button', { name: 'สั่งสินค้า' }).click();
    await page.getByRole('textbox', { name: 'ที่อยู่จัดส่ง' }).fill('Test Address 123');
    await page.getByRole('button', { name: 'ยืนยัน' }).click();

    // 3. 🔍 Assert: order appears in My Orders with product
    await page.getByRole('button', { name: 'person' }).click();
    await page.getByRole('link', { name: 'รายการสั่งซื้อของฉัน' }).click();
    await expect(page.locator('tbody tr').first()).toBeVisible();
    await page.locator('tbody tr').first().click();
    await expect(page.getByText('ekans')).toBeVisible();
  });
});
