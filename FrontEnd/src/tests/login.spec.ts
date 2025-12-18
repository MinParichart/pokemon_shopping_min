import { expect, test } from '@playwright/test';

test.describe('User Login Page (Real API)', () => {

  // -----------------------------------------------------------------------
  // 🛠️ SETUP: ทำก่อนเริ่ม Test ทุกข้อ
  // -----------------------------------------------------------------------
  test.beforeEach(async ({ page }) => {
    // ไปที่หน้า User Login ทุกครั้ง
    await page.goto('http://localhost:5173/login');
  });

  // -----------------------------------------------------------------------
  // ✅ TC-USER-01: ผู้ใช้ทั่วไปล็อกอินสำเร็จ (Happy Path)
  // -----------------------------------------------------------------------
  test('TC-USER-01: User can login with valid credentials', async ({ page }) => {
    // 1. 📝 Arrange: เตรียมตัวแปร
    const usernameInput = page.getByRole('textbox').first();
    const passwordInput = page.locator('input[type="password"]');
    const loginBtn = page.getByRole('button', { name: 'เข้าสู่ระบบ' });

    // 2. 🎬 Act: กรอกข้อมูลจริง (ที่มีใน Database)
    await usernameInput.fill('minnie');
    await passwordInput.fill('string');
    await loginBtn.click();

    // 3. 🔍 Assert: ตรวจสอบผลลัพธ์
    // เช็คว่า URL เปลี่ยนไปหน้า products
    await expect(page).toHaveURL(/.*\/products/);

    // เช็คว่าเจอหัวข้อสินค้า (เพื่อยืนยันว่าหน้าโหลดเสร็จจริง)
    await expect(page.locator('h1')).toContainText('สินค้าทั้งหมด');
  });

  // -----------------------------------------------------------------------
  // 🛑 TC-USER-02: ข้อมูลผิด (Invalid Credentials)
  // -----------------------------------------------------------------------
  test('TC-USER-02: Should show error message for invalid credentials', async ({ page }) => {
    // 1. 📝 Arrange
    const usernameInput = page.getByRole('textbox').first();
    const passwordInput = page.locator('input[type="password"]');
    const loginBtn = page.getByRole('button', { name: 'เข้าสู่ระบบ' });

    // 2. 🎬 Act: กรอกข้อมูลมั่วๆ
    await usernameInput.fill('wronguser');
    await passwordInput.fill('wronguser');
    await loginBtn.click();

    // 3. 🔍 Assert: ต้องเจอ Error Message
    await expect(page.locator('#app')).toContainText('เข้าสู่ระบบไม่สำเร็จ');
  });

  // -----------------------------------------------------------------------
  // ⚠️ TC-USER-03: ไม่กรอก Username (Empty Username)
  // -----------------------------------------------------------------------
  test('TC-USER-03: Should show error when username is empty', async ({ page }) => {
    const usernameInput = page.getByRole('textbox').first();
    const passwordInput = page.locator('input[type="password"]');
    const loginBtn = page.getByRole('button', { name: 'เข้าสู่ระบบ' });

    // กรอกแต่รหัสผ่าน (เว้น username ว่าง)
    await usernameInput.fill('');
    await passwordInput.fill('usernameempty');
    await loginBtn.click();

    await expect(page.locator('#app')).toContainText('เข้าสู่ระบบไม่สำเร็จ');
  });

  // -----------------------------------------------------------------------
  // ⚠️ TC-USER-04: ไม่กรอก Password (Empty Password)
  // -----------------------------------------------------------------------
  test('TC-USER-04: Should show error when password is empty', async ({ page }) => {
    const usernameInput = page.getByRole('textbox').first();
    const passwordInput = page.locator('input[type="password"]');
    const loginBtn = page.getByRole('button', { name: 'เข้าสู่ระบบ' });

    // กรอกแต่ username (เว้น password ว่าง)
    await usernameInput.fill('passwordempty');
    await passwordInput.fill('');
    await loginBtn.click();

    await expect(page.locator('#app')).toContainText('เข้าสู่ระบบไม่สำเร็จ');
  });

  // -----------------------------------------------------------------------
  // ⚠️ TC-USER-05: ไม่กรอกอะไรเลย (Empty Both)
  // -----------------------------------------------------------------------
  test('TC-USER-05: Should show error when both fields are empty', async ({ page }) => {
    // กดปุ่มเลยทันที
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    await expect(page.locator('#app')).toContainText('เข้าสู่ระบบไม่สำเร็จ');
  });

  // -----------------------------------------------------------------------
  // 🔗 TC-USER-06: ปุ่มสลับไปหน้า Admin (Navigation)
  // -----------------------------------------------------------------------
  test('TC-USER-06: Should navigate to Admin Login page', async ({ page }) => {
    // กดลิงก์ไปหน้า Admin
    // (ใช้ regex ช่วย match ชื่อ เผื่อข้อความยาวๆ)
    await page.getByRole('link', { name: /เข้าสู่ระบบสำหรับผู้ดูแล/ }).click();

    // เช็ค URL
    await expect(page).toHaveURL('http://localhost:5173/admin/login');
  });

  // -----------------------------------------------------------------------
  // 🔗 TC-USER-07: ปุ่มไปหน้าสมัครสมาชิก (Navigation)
  // -----------------------------------------------------------------------
  test('TC-USER-07: Should navigate to Register page', async ({ page }) => {
    // กดปุ่มลงทะเบียน
    await page.getByRole('link', { name: 'ลงทะเบียน' }).click();

    // เช็ค URL
    await expect(page).toHaveURL('http://localhost:5173/register');
  });

});
