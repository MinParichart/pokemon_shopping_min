import { expect, test } from '@playwright/test';

test.describe('Admin Login Page (Real API)', () => {

  // -----------------------------------------------------------------------
  // 🛠️ SETUP: ทำก่อนเริ่ม Test ทุกข้อ
  // -----------------------------------------------------------------------
  test.beforeEach(async ({ page }) => {
    // ไปที่หน้า Admin Login ทุกครั้งก่อนเริ่มเทส
    await page.goto('http://localhost:5173/admin/login');
  });

  // -----------------------------------------------------------------------
  // ✅ TC-ADMIN-01: แอดมินล็อกอินสำเร็จ (Success Case)
  // -----------------------------------------------------------------------
  test('TC-ADMIN-01: Admin can login with valid credentials', async ({ page }) => {
    // 1. 📝 Arrange: เตรียมตัวแปร
    const usernameInput = page.getByRole('textbox').first();
    const passwordInput = page.locator('input[type="password"]');
    const loginBtn = page.getByRole('button', { name: 'เข้าสู่ระบบ' });

    // 2. 🎬 Act: กรอกข้อมูลจริงที่มีใน Database
    await usernameInput.fill('admin'); 
    await passwordInput.fill('1234');
    await loginBtn.click();

    // 3. 🔍 Assert: ตรวจสอบผลลัพธ์
    // เช็คว่า URL เปลี่ยนไปหน้า Orders (หรือหน้าแรกของ Admin)
    await expect(page).toHaveURL(/.*\/admin\/orders/);
    
    // เช็คว่าเจอหัวข้อในหน้า Admin จริงๆ (เพื่อความชัวร์ว่าหน้าโหลดเสร็จ)
    await expect(page.locator('h1')).toContainText('จัดการการสั่งซื้อ');
  });

  // -----------------------------------------------------------------------
  // 🛑 TC-ADMIN-02: ล็อกอินไม่สำเร็จ - ข้อมูลผิด (Invalid Credentials)
  // -----------------------------------------------------------------------
  test('TC-ADMIN-02: Should show error when credentials are invalid', async ({ page }) => {
    // 1. 📝 Arrange
    const usernameInput = page.getByRole('textbox').first();
    const passwordInput = page.locator('input[type="password"]');
    const loginBtn = page.getByRole('button', { name: 'เข้าสู่ระบบ' });

    // 2. 🎬 Act: กรอกข้อมูลมั่วๆ
    await usernameInput.fill('notadmin');
    await passwordInput.fill('wrongpass');
    await loginBtn.click();

    // 3. 🔍 Assert: ต้องเจอ Error Message จาก Server จริง
    await expect(page.locator('#app')).toContainText('เข้าสู่ระบบไม่สำเร็จ ข้อมูลไม่ถูกต้อง');
  });

  // -----------------------------------------------------------------------
  // ⚠️ TC-ADMIN-03: ไม่กรอก Username (Empty Username)
  // -----------------------------------------------------------------------
  test('TC-ADMIN-03: Should show error when username is empty', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    const loginBtn = page.getByRole('button', { name: 'เข้าสู่ระบบ' });

    // กรอกแต่รหัสผ่าน
    await passwordInput.fill('1234');
    await loginBtn.click();

    await expect(page.locator('#app')).toContainText('เข้าสู่ระบบไม่สำเร็จ ข้อมูลไม่ถูกต้อง');
  });

  // -----------------------------------------------------------------------
  // ⚠️ TC-ADMIN-04: ไม่กรอก Password (Empty Password)
  // -----------------------------------------------------------------------
  test('TC-ADMIN-04: Should show error when password is empty', async ({ page }) => {
    const usernameInput = page.getByRole('textbox').first();
    const loginBtn = page.getByRole('button', { name: 'เข้าสู่ระบบ' });

    // กรอกแต่ชื่อ
    await usernameInput.fill('admin');
    await loginBtn.click();

    await expect(page.locator('#app')).toContainText('เข้าสู่ระบบไม่สำเร็จ ข้อมูลไม่ถูกต้อง');
  });

  // -----------------------------------------------------------------------
  // ⚠️ TC-ADMIN-05: ไม่กรอกอะไรเลย (Empty Both)
  // -----------------------------------------------------------------------
  test('TC-ADMIN-05: Should show error when both fields are empty', async ({ page }) => {
    // กดปุ่มเลยทันที
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    await expect(page.locator('#app')).toContainText('เข้าสู่ระบบไม่สำเร็จ ข้อมูลไม่ถูกต้อง');
  });

  // -----------------------------------------------------------------------
  // 🔗 TC-ADMIN-06: ปุ่มสลับไปหน้า User Login (Navigation)
  // -----------------------------------------------------------------------
  test('TC-ADMIN-06: Should navigate to User Login page', async ({ page }) => {
    // กดลิงก์
    await page.getByRole('link', { name: 'กลับไปหน้า Login ปกติ' }).click();

    // เช็ค URL ว่าเปลี่ยนไปหน้า Login User ไหม
    await expect(page).toHaveURL(/.*\/login/);
  });

});
