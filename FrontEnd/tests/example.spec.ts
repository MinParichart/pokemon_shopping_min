import { test } from '@playwright/test';

test('start localhost', async ({ page }) => {
  // ใส่ URL เต็มๆ ไปเลย ไม่ต้องง้อ config
  await page.goto('http://localhost:5173/'); 
});