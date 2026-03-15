import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test('Flow: ล็อกอิน → ซื้อสินค้า → โอนเงิน → ดูรายละเอียดคำสั่งซื้อ', async ({ page }) => {

  page.on('dialog', dialog => dialog.accept());

  // ─────────────────────────────────────────────────────────
  // 1. เปิดเว็บ + ปิด Welcome Modal
  // ─────────────────────────────────────────────────────────
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2000);

  const welcomeBtn = page.getByRole('button', { name: /เข้าสู่เว็บไซต์/i });
  if (await welcomeBtn.isVisible()) {
    await welcomeBtn.click();
    await page.waitForTimeout(1500);
  }

  // ─────────────────────────────────────────────────────────
  // 2. ล็อกอิน
  // ─────────────────────────────────────────────────────────
  await page.getByRole('link', { name: /เข้าสู่ระบบ/i }).first().click();
  await page.waitForTimeout(2000);

  await page.locator('input[type="email"]').fill('maxZA@gmail.com');
  await page.waitForTimeout(500);
  await page.locator('input[type="password"]').fill('123456');
  await page.waitForTimeout(500);

  await page.locator('button[type="submit"]').click();
  await page.waitForURL('http://localhost:5173/', { timeout: 15000 });
  await page.waitForTimeout(2000);

  // ─────────────────────────────────────────────────────────
  // 3. กดปุ่ม "ซื้อเลย" หน้าแรก
  // ─────────────────────────────────────────────────────────
  await page.getByRole('button', { name: /ซื้อเลย/i }).first().click();
  await page.waitForTimeout(2000);

  // ─────────────────────────────────────────────────────────
  // 4. ใส่ตะกร้า
  // ─────────────────────────────────────────────────────────
  await page.getByRole('button', { name: /ใส่ตะกร้า|เพิ่มลงตะกร้า/i }).click();
  await page.waitForTimeout(2000);

  // ─────────────────────────────────────────────────────────
  // 5. ตะกร้า → ติ๊กสินค้า → ชำระเงิน
  // ─────────────────────────────────────────────────────────
  await page.goto('http://localhost:5173/cart');
  await page.waitForTimeout(2000);

  await page.getByRole('region', { name: /รายการสินค้า/i })
    .locator('button').first().click();
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: /ชำระเงิน/i }).click();
  await page.waitForTimeout(2000);

  // ─────────────────────────────────────────────────────────
  // 6. Step 1 — ที่อยู่ → ดำเนินการ
  // ─────────────────────────────────────────────────────────
  await page.getByRole('button', { name: /ดำเนินการชำระเงิน/i }).click();
  await page.waitForTimeout(2000);

  // ─────────────────────────────────────────────────────────
  // 7. Step 2 — เลือกโอนเงิน → ขั้นตอนต่อไป
  // ─────────────────────────────────────────────────────────
  await page.getByText(/โอนเงินผ่านธนาคาร/i).click();
  await page.waitForTimeout(1500);

  await page.getByRole('button', { name: /ขั้นตอนต่อไป/i }).click();
  await page.waitForTimeout(2000);

  // ─────────────────────────────────────────────────────────
  // 8. Step 3 — อัปโหลดสลิปจำลอง
  // ─────────────────────────────────────────────────────────
  const slipPath = path.join(process.cwd(), 'tests', 'mock-slip.jpg');
  if (!fs.existsSync(slipPath)) {
    const minimalJpeg = Buffer.from(
      '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8U' +
      'HRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAABAAEDASIA' +
      'AhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/' +
      'xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQ' +
      'MRAD8AJQAB/9k=',
      'base64'
    );
    fs.writeFileSync(slipPath, minimalJpeg);
  }

  await page.locator('input[type="file"]').setInputFiles(slipPath);
  await page.waitForTimeout(2000);

  // ─────────────────────────────────────────────────────────
  // 9. ยืนยันการสั่งซื้อ
  // ─────────────────────────────────────────────────────────
  const confirmBtn = page.getByRole('button', { name: /ยืนยันการสั่งซื้อ/i });
  await confirmBtn.waitFor({ timeout: 10000 });
  await confirmBtn.click();
  await page.waitForTimeout(3000);

  // ─────────────────────────────────────────────────────────
  // 10. ✅ Assert หน้าสั่งซื้อสำเร็จ
  // ─────────────────────────────────────────────────────────
  await expect(
    page.getByRole('heading', { name: /สั่งซื้อสำเร็จ/i })
  ).toBeVisible({ timeout: 15000 });
  await page.waitForTimeout(2000);

  // ─────────────────────────────────────────────────────────
  // 11. กด "ดูรายละเอียดคำสั่งซื้อ" → ประวัติ
  // ─────────────────────────────────────────────────────────
  await page.getByRole('button', { name: /ดูรายละเอียดคำสั่งซื้อ/i }).click();
  await expect(
    page.getByRole('heading', { name: /ประวัติการสั่งซื้อ/i })
  ).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(2000);

  // ─────────────────────────────────────────────────────────
  // 12. กดดูรายละเอียด Order ล่าสุด (อันแรกสุด)
  // ─────────────────────────────────────────────────────────
  await page.getByRole('button', { name: /รายละเอียด/i }).first().click();
  await page.waitForTimeout(2000);

  // ─────────────────────────────────────────────────────────
  // 13. ✅ Assert หน้ารายละเอียดคำสั่งซื้อ
  // ─────────────────────────────────────────────────────────
  await expect(
    page.getByRole('heading', { name: /รายละเอียดคำสั่งซื้อ/i })
  ).toBeVisible({ timeout: 10000 });

  await page.waitForTimeout(3000);
});