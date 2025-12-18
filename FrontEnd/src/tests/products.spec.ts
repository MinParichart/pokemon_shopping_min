import { expect, test } from '@playwright/test';
import { LoginResponse } from '../models/auth.model';

test.describe('User Products List Page (Real Data)', () => {

  // -----------------------------------------------------------------------
  // 🛠️ SETUP: Login จริง เพื่อให้ได้ Token จริง
  // -----------------------------------------------------------------------
  test.beforeEach(async ({ page }) => {
    // 1. ไปหน้า Login
    await page.goto('http://localhost:5173/login');

    // 2. กรอก User ที่มีอยู่จริงใน DB (ต้องมั่นใจว่า User นี้ Login ผ่าน)
    await page.getByRole('textbox').first().fill('minnie');
    await page.locator('input[type="password"]').fill('string');

    // 3. กดปุ่ม Login
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

    // 4. รอจนกว่าจะ Login สำเร็จและเปลี่ยนหน้า (เช่น เช็ค URL หรือ หัวข้อ)
    // ตรงนี้สำคัญ! ถ้ารีบไปเช็คสินค้าเลย เดี๋ยว Tokenมาไม่ทัน
    await expect(page).toHaveURL(/.*\/products/);
  });

  // -----------------------------------------------------------------------
  // ✅ TC-PROD-01: แสดงรายการสินค้าถูกต้อง
  // -----------------------------------------------------------------------
  test('TC-PROD-01: Should display product list correctly', async ({ page }) => {
    // รอให้สินค้าโหลดมาโชว์
    // (เช็คจากชื่อสินค้าชิ้นแรกใน Mock Data)
    await expect(page.locator('h1')).toContainText('สินค้าทั้งหมด');



    await expect(page.getByText('pikachuPokémon ฿81')).toBeVisible();
    await expect(page.getByRole('button', { name: 'add_shopping_cart' }).first()).toBeVisible();

    // 1. หา Card โดยเจาะจง Class แทน div โล้นๆ
    // ลองใช้ class ที่น่าจะมีแค่ที่ตัวการ์ด เช่น .bg-white หรือ .shadow-lg
    // หรือถ้าไม่มี class ให้ใช้ xpath หา div ที่เป็นลูกโดยตรง
    const caterpieCard = page.locator('div.bg-white') // 👈 ลองเปลี่ยน div เป็น div.bg-white
      .filter({ hasText: 'caterpie' })
      .first();

    // 2. หาปุ่มข้างใน (ถ้ายัง error ให้เติม .first() ตรงนี้ด้วย)
    const outOfStockBtn = caterpieCard.getByRole('button', { name: 'สินค้าหมด' }).first();

    // 3. Assert
    await expect(outOfStockBtn).toBeVisible();
    await expect(outOfStockBtn).toBeDisabled();
  });

  // -----------------------------------------------------------------------
  // 🔍 TC-PROD-02: ค้นหาสินค้า (Search Filter)
  // -----------------------------------------------------------------------
  test('TC-PROD-02: Should filter products by search text', async ({ page }) => {
    // 1. หาช่องค้นหา (แก้ placeholder ให้ตรง)
    const searchInput = page.getByPlaceholder(/ค้นหา/);
    // หรือ page.getByRole('textbox', { name: 'search' })

    // 2. พิมพ์คำว่า "เสื้อ"
    await searchInput.fill('pikachu');
    // 3. ผลลัพธ์ต้องเหลือแค่ "เสื้อยืดโปเกมอน"
    await expect(page.getByText('pikachuPokémon ฿81')).toBeVisible();

    // 2. พิมพ์คำว่า "เสื้อ"
    await page.getByRole('textbox', { name: 'ค้นหาสินค้าทั้งหมด' }).fill('ba');
    await expect(page.getByText('bulbasaurPokemon ฿56')).toBeVisible();

  });

  // -----------------------------------------------------------------------
  // 🚫 TC-PROD-03: สินค้าหมดต้องกดซื้อไม่ได้ (Out of Stock)
  // -----------------------------------------------------------------------
  test('TC-PROD-03: Should disable "Add to Cart" button for out-of-stock items', async ({ page }) => {

    // 2. พิมพ์คำว่า "เสื้อ"
    await page.getByRole('textbox', { name: 'ค้นหาสินค้าทั้งหมด' }).fill('caterpie');
    // 3. ผลลัพธ์ต้องเหลือแค่ "เสื้อยืดโปเกมอน"

    const caterpieCard = page.locator('div.bg-white') // 👈 ลองเปลี่ยน div เป็น div.bg-white
      .filter({ hasText: 'caterpie' })
      .first();

    // 2. หาปุ่มข้างใน (ถ้ายัง error ให้เติม .first() ตรงนี้ด้วย)
    const outOfStockBtn = caterpieCard.getByRole('button', { name: 'สินค้าหมด' }).first();

    // 3. Assert
    await expect(outOfStockBtn).toBeVisible();
    await expect(outOfStockBtn).toBeDisabled();

  });

  // -----------------------------------------------------------------------
  // 🛒 TC-PROD-04: กดเพิ่มลงตะกร้าได้ (Add to Cart)
  // -----------------------------------------------------------------------
  test('TC-PROD-04: Should add item to cart successfully', async ({ page }) => {

    await expect(page.locator('h1')).toContainText('สินค้าทั้งหมด');
    await expect(page.getByRole('textbox', { name: 'ค้นหาสินค้าทั้งหมด' })).toBeVisible();
    await page.getByRole('textbox', { name: 'ค้นหาสินค้าทั้งหมด' }).click();
    await page.getByRole('textbox', { name: 'ค้นหาสินค้าทั้งหมด' }).fill('ekans');
    await page.getByRole('button', { name: 'add_shopping_cart' }).click();
    await page.getByRole('button', { name: 'add_shopping_cart' }).click();
    await page.getByRole('button', { name: 'add_shopping_cart' }).click();
    await page.getByRole('link', { name: 'shopping_cart' }).click();
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '−' }).click();
    await page.getByRole('button', { name: 'สั่งสินค้า' }).click();
    await page.getByRole('textbox', { name: 'ที่อยู่จัดส่ง' }).fill('CMU');
    await page.getByRole('button', { name: 'ยืนยัน' }).click();
    await page.getByRole('button', { name: 'person' }).click();
    await page.getByRole('link', { name: 'รายการสั่งซื้อของฉัน' }).click();
    await page.locator('tr:nth-child(25) > .px-6.py-4.text-center.text-slate-400 > .material-symbols-outlined').click();
    await page.getByRole('button', { name: 'person' }).click();
    await page.getByRole('button', { name: 'ออกจากระบบ' }).click();
  });
  // -----------------------------------------------------------------------
  // ⚠️ TC-PROD-05: เพิ่มสินค้าเกินสต็อกที่มี (Stock Limit Check)
  // -----------------------------------------------------------------------
  test('TC-PROD-05: Should prevent adding quantity more than available stock', async ({ page }) => {
    // 1. ค้นหาสินค้าที่มีสต็อกน้อยๆ (สมมติว่าเป็น 'ekans' ที่มี 10 ชิ้น)
    await page.getByRole('textbox', { name: 'ค้นหาสินค้าทั้งหมด' }).fill('raticate');

    // 2. เพิ่มลงตะกร้า 1 ชิ้น

    await page.getByRole('button', { name: 'add_shopping_cart' }).first().click();
    await page.getByRole('button', { name: 'add_shopping_cart' }).first().click();
    await expect(page.getByText('สินค้า "raticate" หมดหรือครบจำนวนแล้วx')).toBeVisible();
    await page.getByRole('link', { name: 'shopping_cart' }).click();
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '+' }).click();


  });

  // -----------------------------------------------------------------------
  // ❌ TC-PROD-06: สั่งซื้อแล้วกดยกเลิก (Cancel Order)
  // -----------------------------------------------------------------------
test('TC-PROD-06: Should be able to cancel a pending order', async ({ page }) => {
    // ----------------------------------------------------------------
    // 1. 🛡️ ตั้งป้อมรับ Dialog ทุกตัวที่จะเกิดขึ้นใน Test นี้ (วางไว้บนสุดเลย)
    // ----------------------------------------------------------------
    page.on('dialog', async dialog => {
        console.log(`🔔 Dialog Alert: "${dialog.message()}"`); // ปริ้นท์ดูว่าเจออะไรบ้าง
        await dialog.accept(); // กด OK สู้กลับทุกดอก (ทั้ง Confirm และ Alert)
    });

    // ... (ส่วน Login และเข้าหน้า Order เหมือนเดิม) ...
    await expect(page).toHaveURL(/.*\/products/);
    await page.getByRole('button', { name: 'person' }).click();
    await page.getByRole('link', { name: 'รายการสั่งซื้อของฉัน' }).click();

    // ... (เลือกออเดอร์ 000024) ...
    const orderRow = page.locator('tr').filter({ hasText: '000024' }).first();
    await orderRow.click(); 

    // ----------------------------------------------------------------
    // 2. ⏳ เตรียมรอข้อมูลอัปเดต (Wait for Response)
    // ----------------------------------------------------------------
    // รอให้มีการดึงข้อมูลออเดอร์ใหม่ (GET /orders) เกิดขึ้นหลังกดยกเลิก
    const refreshPromise = page.waitForResponse(res => 
        res.url().includes('/orders') && res.status() === 200
    );

    // ----------------------------------------------------------------
    // 3. 🎯 กดปุ่มยกเลิก
    // ----------------------------------------------------------------
    // หาปุ่มที่โผล่มา (ใช้ .first() เผื่อเจอหลายอันแต่มันคืออันเดียวกัน)
    const cancelBtn = page.getByRole('button', { name: 'ยกเลิกคำสั่งซื้อ' }).first();
    await cancelBtn.click();

    // ----------------------------------------------------------------
    // 4. ✅ รอจนทุกอย่างจบ
    // ----------------------------------------------------------------
    // รอ API โหลดเสร็จ (แปลว่า Alert น่าจะผ่านไปแล้ว และตารางรีเฟรชแล้ว)
    await refreshPromise;

    // เช็คผลลัพธ์ (ภาษาไทยตามหน้าจอ)
    // หมายเหตุ: ใช้ .first() เพราะหลังจาก reload ตัวแปร orderRow เดิมอาจจะหลุด
    const updatedRow = page.locator('tr').filter({ hasText: '000024' }).first();
    await expect(updatedRow).toContainText('ยกเลิก', { timeout: 10000 });
});});
