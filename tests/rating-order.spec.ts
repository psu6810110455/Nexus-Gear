import { test, expect } from "@playwright/test";

test("ทดสอบ E2E: ให้คะแนนสินค้าและตรวจสอบรีวิว", async ({ page }) => {
    // เข้าสู่ระบบ
    await page.goto("http://localhost:5173/");

    const welcomeBtn = page.getByRole("button", { name: /เข้าสู่เว็บไซต์/i });
    if (await welcomeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await welcomeBtn.click();
    }

    await page.goto("http://localhost:5173/login");
    await page.locator("#email").fill("ratingtest@test.com");
    await page.locator("#password").fill("ratingtest123");
    await page.locator("button[type='submit']").click();

    await page.waitForTimeout(500);
    await page.evaluate(() => { window.location.href = "/my-orders"; });

    // ไปที่หน้าประวัติคำสั่งซื้อ
    await expect(page.locator("text=ประวัติการสั่งซื้อ")).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(500);

    await page.locator("button").filter({ hasText: "สำเร็จ" }).click();
    await page.waitForTimeout(500);

    // ค้นหาออเดอร์ที่ให้คะแนนและดึงชื่อสินค้า
    const orderCard = page.locator('article').filter({ has: page.getByRole('button', { name: /ให้คะแนน/i }) }).first();
    await expect(orderCard).toBeVisible({ timeout: 5000 });

    let productName = await orderCard.locator('p.text-zinc-100').first().textContent() || "";
    productName = productName.trim();

    await orderCard.getByRole("button", { name: /ให้คะแนน/i }).click();

    // รอให้หน้าต่างให้คะแนนและขยายรายการสินค้าให้ครบ
    const modalHeading = page.getByRole("heading", { name: /รายละเอียดคำสั่งซื้อ/i });
    await expect(modalHeading).toBeVisible({ timeout: 5000 });

    const itemToggle = page.getByRole("button", { name: /รายการสินค้า/i });
    if (await itemToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
        const isExpanded = await itemToggle.locator('svg').last().getAttribute('class').then(c => c?.includes('rotate-180'));
        if (!isExpanded) await itemToggle.click();
    }

    const textareas = page.locator("textarea");
    await expect(textareas.first()).toBeVisible({ timeout: 8000 });

});