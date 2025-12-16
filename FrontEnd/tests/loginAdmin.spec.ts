import { expect, test } from '@playwright/test';

test.describe('Admin Login page', () => {
  test('admin can login with valid credentials', async ({ page }) => {
    // 1. ไปหน้า Login
    await page.goto('http://localhost:5173/admin/login');

    // 2. กรอกข้อมูล
    await page.getByRole('textbox').first().fill('admin');
    await page.locator('input[type="password"]').fill('1234');

    // 3. กดปุ่ม Login
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    // 4. 🔥 จุดที่แก้: ตรวจสอบ URL ว่าเปลี่ยนไปหน้า products แล้วจริงๆ
    // ใช้ RegExp (/.../) เพื่อให้ยืดหยุ่น หรือใส่ URL เต็มก็ได้
    await expect(page).toHaveURL(/.*\/admin\/orders/);

    // 5. (แนะนำเพิ่ม) เช็คว่าเจอ Element ในหน้านั้นจริงๆ เช่น หัวข้อสินค้า
    // เพื่อความชัวร์ว่าหน้าเว็บโหลดเสร็จแล้ว
    await expect(page.locator('h1')).toContainText('จัดการการสั่งซื้อ');
  });

  test('invalid credentials show error message', async ({ page }) => {
    // 1. ไปหน้า Login
    await page.goto('http://localhost:5173/admin/login');

    // 2. กรอกข้อมูล
    await page.getByRole('textbox').first().fill('notadmin');
    await page.locator('input[type="password"]').fill('not1234');

    // 3. กดปุ่ม Login
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    await expect(page.locator('#app')).toContainText('เข้าสู่ระบบไม่สำเร็จ ข้อมูลไม่ถูกต้อง');
  });

  test('not input username admin show error message', async ({ page }) => {
    // 1. ไปหน้า Login
    await page.goto('http://localhost:5173/admin/login');

    // 2. กรอกข้อมูล
    await page.getByRole('textbox').first().fill('');
    await page.locator('input[type="password"]').fill('not1234');

    // 3. กดปุ่ม Login
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    await expect(page.locator('#app')).toContainText('เข้าสู่ระบบไม่สำเร็จ ข้อมูลไม่ถูกต้อง');
  });

  test('not input password admin show error message', async ({ page }) => {
    // 1. ไปหน้า Login
    await page.goto('http://localhost:5173/admin/login');

    // 2. กรอกข้อมูล
    await page.getByRole('textbox').first().fill('notadmin');
    await page.locator('input[type="password"]').fill('');

    // 3. กดปุ่ม Login
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    await expect(page.locator('#app')).toContainText('เข้าสู่ระบบไม่สำเร็จ ข้อมูลไม่ถูกต้อง');
  });

  test('not input username and password admin show error message', async ({ page }) => {
    // 1. ไปหน้า Login
    await page.goto('http://localhost:5173/admin/login');

    // 2. กรอกข้อมูล
    await page.getByRole('textbox').first().fill('');
    await page.locator('input[type="password"]').fill('');

    // 3. กดปุ่ม Login
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    await expect(page.locator('#app')).toContainText('เข้าสู่ระบบไม่สำเร็จ ข้อมูลไม่ถูกต้อง');
  });

  test('change to login for user', async ({ page }) => {
    // 1. ไปหน้า Login
    await page.goto('http://localhost:5173/admin/login');

    await page.getByRole('link', { name: 'กลับไปหน้า Login ปกติ' }).click();

    // 3. ✅ เช็คว่า URL เปลี่ยนเป็นหน้า Admin Login จริงไหม
    await expect(page).toHaveURL('http://localhost:5173/login');
  });
});
