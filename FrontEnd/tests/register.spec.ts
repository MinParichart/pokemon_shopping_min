import { expect, test } from '@playwright/test';

test.describe('Register page', () => {
  test('TC-REG-01: Guest can register successfully (Without touching Real DB)', async ({
    page,
  }) => {
    // 1. 🎭 สร้าง "ด่านสกัด" API (Mocking)
    // บอก Playwright ว่า: "ถ้ามีการยิงไปที่ /api/auth/register ให้ตอบ OK กลับมาเลย ไม่ต้องส่งไปหลังบ้านจริง"
    await page.route('**/api/auth/register', async (route) => {
      // จำลองการตอบกลับจาก Server
      await route.fulfill({
        status: 200, // หรือ 201 Created
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'User registered successfully',
          userId: 123,
        }),
      });
    });

    // 2. เริ่มขั้นตอนปกติ (Frontend ไม่รู้ตัวว่าคุยกับของปลอม)
    await page.goto('http://localhost:5173/register');

    // 3. กรอกข้อมูล (กรอกซ้ำได้เลย! เพราะมันไม่เช็ค DB)
    // 3. กรอกข้อมูล (กรอก "ซ้ำ" ได้เลย เพราะมันไปไม่ถึง Database)
    await page.getByRole('textbox').first().fill('minnietest'); // ใช้ชื่อเดิมได้ตลอดชาติ
    await page.getByRole('textbox').nth(1).fill('minnietest');
    await page.getByRole('textbox').nth(2).fill('0812345678');
    await page.getByRole('textbox').nth(3).fill('minnietest');
    await page.getByRole('textbox').nth(4).fill('minnietest');

    // 4. พอกดปุ่มนี้ Playwright จะทำงานตามข้อ 1 ที่ดักไว้
    await page.getByRole('button', { name: 'ลงทะเบียน' }).click();

    // 5. เช็คว่าหน้าเว็บแสดงผลถูกต้อง
    await expect(page.locator('#app')).toContainText(
      'ลงทะเบียนสำเร็จ กรุณาเข้าสู่ระบบ'
    );
  });

  // 🛑 TC-REG-02: ตรวจสอบกรณีไม่กรอกข้อมูล (Empty Fields)
  // -----------------------------------------------------------------------
  test('TC-REG-02: Should show validation errors for empty fields', async ({
    page,
  }) => {
    // 1. ไปหน้าเว็บ
    await page.goto('http://localhost:5173/register');

    // 2. ยังไม่กรอกอะไรเลย แล้วกดปุ่มลงทะเบียนทันที
    await page.getByRole('button', { name: 'ลงทะเบียน' }).click();

    // 3. 🔥 ตรวจสอบว่า "ข้อความเตือนรวม" โผล่ขึ้นมาไหม
    // Playwright จะกวาดสายตาหาข้อความนี้บนหน้าจอ
    await page
      .getByText('กรุณากรอกข้อมูลให้ครบทุกช่องที่มีเครื่องหมายแจ้งเตือน')
      .click();

    // 4. (แถม) ตรวจสอบว่า Error ย่อยๆ ขึ้นครบไหม

    await expect(page.locator('form')).toContainText('กรุณากรอก Username');
    await expect(page.locator('form')).toContainText('กรุณากรอกชื่อ - นามสกุล');
    await expect(page.locator('form')).toContainText('กรุณากรอกเบอร์โทรศัพท์');
    await expect(page.locator('form')).toContainText('กรุณากรอก Password');
    await expect(page.locator('form')).toContainText('กรุณายืนยัน Password');

    // 5. เช็คว่ายังอยู่ที่หน้าเดิม
    await expect(page).toHaveURL(/.*\/register/);
  });

  // TC-REG-03: ตรวจสอบรูปแบบเบอร์โทรศัพท์ (Phone Validation)
  test('TC-REG-03: Should validate phone number format (Numeric only)', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173/register');

    // 1. กรอกข้อมูลส่วนอื่นให้ถูกต้อง (เพื่อโฟกัสแค่เบอร์โทร)
    await page.getByRole('textbox').first().fill('testregister_phone');
    await page.getByRole('textbox').nth(1).fill('Test');
    // 2. ลองกรอกตัวหนังสือ "abc" ลงในเบอร์โทร
    await page.getByRole('textbox').nth(2).fill('abcdef');
    await page.locator('input[type="password"]').first().fill('123456');
    await page.locator('input[type="password"]').last().fill('123456');

    // 3. กดปุ่ม
    await page.getByRole('button', { name: 'ลงทะเบียน' }).click();
    await expect(page.locator('form')).toContainText(
      'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก'
    );
        await page
      .getByText('กรุณากรอกข้อมูลให้ครบทุกช่องที่มีเครื่องหมายแจ้งเตือน')
      .click();
  });

  test('TC-REG-04: Should validate phone number format and handle submission', async ({ page }) => {
  // -------------------------------------------------------
  // 1. SETUP MOCK: ดักจับ Request ไม่ให้ลง Database จริง
  // -------------------------------------------------------
  // เครื่องหมาย ** คือ wildcard (อะไรก็ได้ข้างหน้า) ตามด้วย path ของ API
  await page.route('**/api/register', async (route) => {
    // เมื่อมีการยิง API นี้ ให้ตอบกลับว่า "สำเร็จ" ทันที โดยไม่ส่งไป Server จริง
    const json = { message: 'Registration success', userId: 'mock-id-123' };
    await route.fulfill({ status: 200, json }); 
  });

  await page.goto('/register');
  
  // เตรียมตัวแปร Element เพื่อความสะอาดของโค้ด
  const phoneInput = page.getByRole('textbox').nth(2); // หรือใช้ .locator('input[name="phone"]') จะแม่นกว่า
  const submitBtn = page.getByRole('button', { name: 'ลงทะเบียน' });

  // กรอกข้อมูลส่วนอื่นให้ครบถ้วนก่อน
  await page.getByRole('textbox').first().fill('testphone'); 
  await page.getByRole('textbox').nth(1).fill('Test Phone');
  await page.locator('input[type="password"]').first().fill('123456');
  await page.locator('input[type="password"]').last().fill('123456');

  // -------------------------------------------------------
  // 2. TEST VALIDATION (เคสที่ผิด - ปกติ Frontend จะกันไว้ ไม่ยิง API)
  // -------------------------------------------------------
  
  // ❌ Case 1: กรอกตัวอักษร (ABC)
  await phoneInput.fill('abcdefghij');
  await submitBtn.click();
      await expect(page.locator('form')).toContainText(
      'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก'
    );

  // ❌ Case 2: กรอกสั้นเกินไป
  await phoneInput.fill('123');
  await submitBtn.click();
  await expect(page.getByText(/เบอร์โทร|ไม่ถูกต้อง/)).toBeVisible();

  // -------------------------------------------------------
  // 3. TEST SUCCESS (เคสที่ถูก - อันนี้แหละที่จะยิง API)
  // -------------------------------------------------------
  
  // ✅ Case 3: กรอกเบอร์ถูกต้อง (10 หลัก)
  await phoneInput.fill('0812345678');
  await submitBtn.click();

  // ตรวจสอบว่าระบบทำงานต่อได้ (เช่น เด้งไปหน้า Login หรือขึ้นข้อความสำเร็จ)
  // ข้อมูลนี้จะไม่ลง DB เพราะติด page.route ที่เราดักไว้ข้างบน
  await expect(page.getByText('Registration success')).toBeVisible(); 
  // หรือ
  // await expect(page).toHaveURL('/login');
});
});
