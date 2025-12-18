import { expect, test } from '@playwright/test';

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

  // -----------------------------------------------------------------------
  // ✅ TC-REG-01: ทดสอบการลงทะเบียนสำเร็จ (Happy Path)
  // -----------------------------------------------------------------------
  test('TC-REG-01: Guest can register successfully (Mocked API)', async ({
    page,
  }) => {
    // 1. 📝 Arrange: เตรียมข้อมูล (ระบุ Element ต่างๆ ให้ชัดเจน)
    const usernameInput = page.getByRole('textbox').first();
    const fullnameInput = page.getByRole('textbox').nth(1);
    const phoneInput = page.getByRole('textbox').nth(2);
    const passwordInput = page.locator('input[type="password"]').first(); // หรือ nth(3)
    const confirmPassInput = page.locator('input[type="password"]').last(); // หรือ nth(4)
    const submitBtn = page.getByRole('button', { name: 'ลงทะเบียน' });

    // 2. 🎬 Act: กรอกข้อมูลให้ครบถ้วน
    await usernameInput.fill('minnietest');
    await fullnameInput.fill('Minnie Test');
    await phoneInput.fill('0812345678');
    await passwordInput.fill('password123');
    await confirmPassInput.fill('password123');

    // กดปุ่มลงทะเบียน
    await submitBtn.click();

    // 3. 🔍 Assert: ตรวจสอบผลลัพธ์
    await expect(page.locator('#app')).toContainText(
      'ลงทะเบียนสำเร็จ กรุณาเข้าสู่ระบบ'
    );
  });

  // -----------------------------------------------------------------------
  // 🛑 TC-REG-02: ตรวจสอบกรณีไม่กรอกข้อมูล (Empty Fields Validation)
  // -----------------------------------------------------------------------
  test('TC-REG-02: Should show validation errors for empty fields', async ({
    page,
  }) => {
    // 1. 🎬 Act: กดปุ่มทันทีโดยไม่กรอกข้อมูล
    await page.getByRole('button', { name: 'ลงทะเบียน' }).click();

    // 2. 🔍 Assert: ตรวจสอบข้อความแจ้งเตือน (Global Error)
    const globalError = page.getByText(
      'กรุณากรอกข้อมูลให้ครบทุกช่องที่มีเครื่องหมายแจ้งเตือน'
    );
    await expect(globalError).toBeVisible(); // เช็คว่าข้อความขึ้นจริง

    // 3. 🔍 Assert: ตรวจสอบข้อความแจ้งเตือนราย field
    const form = page.locator('form');
    await expect(form).toContainText('กรุณากรอก Username');
    await expect(form).toContainText('กรุณากรอกชื่อ - นามสกุล');
    await expect(form).toContainText('กรุณากรอกเบอร์โทรศัพท์');
    await expect(form).toContainText('กรุณากรอกรหัสผ่าน');
    await expect(form).toContainText('กรุณายืนยันรหัสผ่าน');

    // ตรวจสอบว่ายังอยู่ที่หน้าเดิม (ไม่ได้ถูก redirect)
    await expect(page).toHaveURL(/.*\/register/);
  });

  // -----------------------------------------------------------------------
  // 📞 TC-REG-03: ตรวจสอบรูปแบบเบอร์โทรศัพท์ (Format Validation)
  // -----------------------------------------------------------------------
  test('TC-REG-03: Should validate phone number format (Numeric only & 10 digits)', async ({
    page,
  }) => {
    // 1. 📝 Arrange: กรอกข้อมูลส่วนอื่นให้ถูกต้อง
    await page.getByRole('textbox').first().fill('testuser_phone');
    await page.getByRole('textbox').nth(1).fill('Test Name');
    await page.locator('input[type="password"]').first().fill('123456');
    await page.locator('input[type="password"]').last().fill('123456');

    const phoneInput = page.getByRole('textbox').nth(2);
    const submitBtn = page.getByRole('button', { name: 'ลงทะเบียน' });

    // 2. 🎬 Act (Case 1): กรอกตัวอักษรแทนตัวเลข
    await phoneInput.fill('abcdef');
    await submitBtn.click();

    // 3. 🔍 Assert (Case 1)
    await expect(page.locator('form')).toContainText(
      'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก'
    );
    await expect(
      page.getByText('กรุณากรอกข้อมูลให้ครบทุกช่องที่มีเครื่องหมายแจ้งเตือน')
    ).toBeVisible();

    // 4. 🎬 Act (Case 2): กรอกตัวเลขสั้นเกินไป
    await phoneInput.fill('123');
    await submitBtn.click();

    // 5. 🔍 Assert (Case 2)
    await expect(page.locator('form')).toContainText(
      'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก'
    );
  });

  // -----------------------------------------------------------------------
  // 🔄 TC-REG-04: ตรวจสอบการแก้ไขเบอร์โทรให้ถูกต้อง (Recovery Scenario)
  // -----------------------------------------------------------------------
  test('TC-REG-04: Should accept valid phone number after invalid attempts', async ({
    page,
  }) => {
    // 1. 📝 Arrange: เตรียมตัวแปร
    const phoneInput = page.getByRole('textbox').nth(2);
    const submitBtn = page.getByRole('button', { name: 'ลงทะเบียน' });

    // กรอกข้อมูลส่วนอื่นให้ครบ
    await page.getByRole('textbox').first().fill('testphone_recover');
    await page.getByRole('textbox').nth(1).fill('Test Recovery');
    await page.locator('input[type="password"]').first().fill('123456');
    await page.locator('input[type="password"]').last().fill('123456');

    // 2. 🎬 Act: ลองกรอกผิดก่อน (Invalid Input)
    await phoneInput.fill('bad_phone_number');
    await submitBtn.click();

    // เช็คว่า Error ขึ้น
    await expect(page.locator('form')).toContainText(
      'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก'
    );

    // 3. 🎬 Act: แก้ไขให้ถูกต้อง (Valid Input)
    await phoneInput.fill('0812345678'); // กรอกเลข 10 หลัก
    await submitBtn.click();

    // 4. 🔍 Assert: ต้องผ่านฉลุย (เพราะเรา Mock Success ไว้ที่ beforeEach แล้ว)
    await expect(page.locator('#app')).toContainText(
      'ลงทะเบียนสำเร็จ กรุณาเข้าสู่ระบบ'
    );
  });

  // -----------------------------------------------------------------------
  // ✅ TC-REG-05: เช็ค Logic รหัสผ่านไม่ตรงกัน (Password Mismatch)
  // -----------------------------------------------------------------------
  test('TC-REG-05: Should show error when passwords do not match', async ({
    page,
  }) => {
    // 1. Arrange: กรอกข้อมูลส่วนอื่นให้ถูก
    await page.getByRole('textbox').first().fill('test_mismatch');
    await page.getByRole('textbox').nth(1).fill('Test Mismatch');
    await page.getByRole('textbox').nth(2).fill('0812345678');

    // 2. Act: กรอกรหัสผ่าน 2 ช่อง "ไม่เหมือนกัน"
    await page.locator('input[type="password"]').first().fill('password123');
    await page.locator('input[type="password"]').last().fill('password999'); // ไม่ตรง

    await page.getByRole('button', { name: 'ลงทะเบียน' }).click();

    // 3. Assert: ต้องเจอข้อความเตือน (อิงจาก Vue: errors.confirmPassword)
    // หมายเหตุ: ข้อความต้องตรงกับ rules ใน Vue ที่ใช้ sameAs
    await expect(page.locator('form')).toContainText(
      'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน'
    );
  });

  // -----------------------------------------------------------------------
  // ✅ TC-REG-06: จำลอง Server ตอบกลับว่า "ชื่อซ้ำ" (Mock API Error 400)
  // -----------------------------------------------------------------------
test('TC-REG-06: Should handle "Username already exists" (Mock HTTP 400)', async ({ page }) => {
  // -------------------------------------------------------
  // 1. 🎭 SETUP TRAP (วางกับดัก)
  // -------------------------------------------------------
  // ความหมาย: "เฮ้ย Playwright! ถ้ามีใครยิงไปที่ .../api/.../register
  // ห้ามส่งไป Server จริงนะ! ให้ตอบกลับไปเลยว่า Error 400 (Bad Request)"
  await page.route('**/api/**/register', async (route) => {
    await route.fulfill({
      status: 400, // จำลองว่า Server โกรธ (Bad Request)
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Username taken' }),
    });
  });

  // -------------------------------------------------------
  // 2. 📝 ACT (ทำให้เกิดเหตุการณ์)
  // -------------------------------------------------------
  await page.goto('/register'); // ไปหน้าเว็บ

  // ⚠️ สำคัญมาก: ต้องกรอกให้ครบทุกช่อง!
  // เพื่อให้ผ่าน validateForm() ใน Vue ไม่งั้นมันจะไม่ยิง API มาเข้ากับดักเรา
  await page.getByRole('textbox').first().fill('duplicate_user'); 
  await page.getByRole('textbox').nth(1).fill('Test Name');
  await page.getByRole('textbox').nth(2).fill('0812345678');
  await page.locator('input[type="password"]').first().fill('123456');
  await page.locator('input[type="password"]').last().fill('123456');

  // 🔥 ต้องกดปุ่ม! เพื่อให้ Vue สั่งยิง axios.post
  await page.getByRole('button', { name: 'ลงทะเบียน' }).click();

  // -------------------------------------------------------
  // 3. 🔍 ASSERT (ตรวจสอบผล)
  // -------------------------------------------------------
  // เมื่อ Vue ได้รับ 400 จากกับดัก -> Vue จะเข้า block catch -> แล้วแสดงข้อความนี้
  await expect(
    page.getByText('ข้อมูลไม่ถูกต้อง หรือ ชื่อผู้ใช้งานซ้ำ')
  ).toBeVisible();
});

  // -----------------------------------------------------------------------
  // ✅ TC-REG-07: ฟีเจอร์ "แสดงรหัสผ่าน" (UI Functionality)
  // -----------------------------------------------------------------------
test('TC-REG-08: Should toggle password visibility for BOTH fields', async ({ page }) => {
    // -----------------------------------------------------------------------
    // 🎯 ใช้ "ลำดับ (Index)" เจาะจงตัวเลย (ชัวร์ที่สุด แก้ปัญหา Parent Trap)
    // -----------------------------------------------------------------------
    // Input ช่องที่ 4 (Index 3) คือ Password
    const passwordInput = page.locator('input').nth(3);

    // Input ช่องที่ 5 (Index 4) คือ ยืนยัน Password
    const confirmInput = page.locator('input').nth(4);
    
    // Checkbox จับด้วย Label ได้ปกติ (เพราะใน HTML มี for-id คู่กัน)
    const toggleCheckbox = page.getByLabel('แสดงรหัสผ่าน');

    // -----------------------------------------------------------------------
    // Logic การทดสอบ
    // -----------------------------------------------------------------------

    // 1. เริ่มต้น: ต้องเป็น password (มองไม่เห็น)
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(confirmInput).toHaveAttribute('type', 'password');


    await page.getByRole('textbox').nth(3).fill('123456789');
    await page.getByRole('textbox').nth(4).fill('123456789');

    // 2. กดติ๊กถูก
    await toggleCheckbox.check();

    // 3. ต้องเปลี่ยนเป็น text (มองเห็น)
    // หมายเหตุ: Locator แบบ nth() จะยังทำงานได้ดีแม้ type เปลี่ยนไป
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await expect(confirmInput).toHaveAttribute('type', 'text');

    // 4. กดปิด
    await toggleCheckbox.uncheck();

    // 5. กลับมาเป็น password
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(confirmInput).toHaveAttribute('type', 'password');
  });
});
