import { expect, test } from '@playwright/test';

test.describe('Login page', () => {
  test('user can login with valid credentials', async ({ page }) => {
    // 1. ไปหน้า Login
    await page.goto('http://localhost:5173/login');

    // 2. กรอกข้อมูล
    await page.getByRole('textbox').first().fill('minnie');
    await page.locator('input[type="password"]').fill('string');

    // 3. กดปุ่ม Login
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    // 4. 🔥 จุดที่แก้: ตรวจสอบ URL ว่าเปลี่ยนไปหน้า products แล้วจริงๆ
    // ใช้ RegExp (/.../) เพื่อให้ยืดหยุ่น หรือใส่ URL เต็มก็ได้
    await expect(page).toHaveURL(/.*\/products/);

    // 5. (แนะนำเพิ่ม) เช็คว่าเจอ Element ในหน้านั้นจริงๆ เช่น หัวข้อสินค้า
    // เพื่อความชัวร์ว่าหน้าเว็บโหลดเสร็จแล้ว
    await expect(page.locator('h1')).toContainText('สินค้าทั้งหมด');
  });

  test('invalid credentials show error message', async ({ page }) => {
    // 1. ไปหน้า Login
    await page.goto('http://localhost:5173/login');

    // 2. กรอกข้อมูล
    await page.getByRole('textbox').first().fill('who');
    await page.locator('input[type="password"]').fill('wrong');

    // 3. กดปุ่ม Login
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    await expect(page.locator('#app')).toContainText('เข้าสู่ระบบไม่สำเร็จ');
  });

  test('not input username show error message', async ({ page }) => {
    // 1. ไปหน้า Login
    await page.goto('http://localhost:5173/login');

    // 2. กรอกข้อมูล
    await page.getByRole('textbox').first().fill('');
    await page.locator('input[type="password"]').fill('wrong');

    // 3. กดปุ่ม Login
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    await expect(page.locator('#app')).toContainText('เข้าสู่ระบบไม่สำเร็จ');
  });

  test('not input password show error message', async ({ page }) => {
    // 1. ไปหน้า Login
    await page.goto('http://localhost:5173/login');

    // 2. กรอกข้อมูล
    await page.getByRole('textbox').first().fill('who');
    await page.locator('input[type="password"]').fill('');

    // 3. กดปุ่ม Login
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    await expect(page.locator('#app')).toContainText('เข้าสู่ระบบไม่สำเร็จ');
  });
  test('not input username , password  and show error message', async ({
    page,
  }) => {
    // 1. ไปหน้า Login
    await page.goto('http://localhost:5173/login');

    // 2. กรอกข้อมูล
    await page.getByRole('textbox').first().fill('');
    await page.locator('input[type="password"]').fill('');

    // 3. กดปุ่ม Login
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    await expect(page.locator('#app')).toContainText('เข้าสู่ระบบไม่สำเร็จ');
  });

  test('change to login for admin', async ({ page }) => {
    // 1. ไปหน้า Login
    await page.goto('http://localhost:5173/login');
    // 2. กดลิงก์เปลี่ยนไปหน้า Admin
    await page
      .getByRole('link', { name: 'เข้าสู่ระบบสำหรับผู้ดูแล (' })
      .click();
    // 3. ✅ เช็คว่า URL เปลี่ยนเป็นหน้า Admin Login จริงไหม
    await expect(page).toHaveURL('http://localhost:5173/admin/login');
  });

    test('guest can click register button successfully', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.getByRole('link', { name: 'ลงทะเบียน' }).click();
    // 3. ✅ เช็คว่า URL เปลี่ยนเป็นหน้า User Register จริงไหม
    await expect(page).toHaveURL('http://localhost:5173/register');

  });
});
