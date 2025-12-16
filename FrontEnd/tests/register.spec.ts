import { expect, test } from '@playwright/test';

test.describe('Register page', () => {
  test('Guest can register successfully (Without touching Real DB)', async ({
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
  test('TC-REG-02: Should show validation errors for empty fields', async ({ page }) => {
    await page.goto('http://localhost:5173/register');

    // ยังไม่กรอกอะไรเลย แล้วกดปุ่มลงทะเบียนทันที
    await page.getByRole('button', { name: 'ลงทะเบียน' }).click();

    // ✅ คาดหวัง: ต้องเจอข้อความแจ้งเตือน (Validation Message)
    // หมายเหตุ: ปรับแก้ข้อความ 'จำเป็นต้องกรอก' ให้ตรงกับที่เว็บคุณแสดงจริง
    await expect(page.getByText(/กรุณากรอก|จำเป็นต้องกรอก|ห้ามเว้นว่าง/)).toBeVisible();
    
    // เช็คว่ายังอยู่ที่หน้าเดิม (ไม่ถูกส่งไปหน้าอื่น)
    await expect(page).toHaveURL(/.*\/register/);
  });
});
