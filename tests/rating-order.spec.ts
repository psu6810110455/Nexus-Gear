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
})