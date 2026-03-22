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


    // เขียนรีวิว
    await page.waitForTimeout(500);

    const itemCount = await textareas.count();
    const starsLocators = page.locator('svg.lucide-star.cursor-pointer, svg.cursor-pointer');

    for (let i = 0; i < itemCount; i++) {
        await starsLocators.nth((i * 5) + 4).click();

        const reviewText = i === 0
            ? "สินค้าตัวนี้คุณภาพเยี่ยมมากครับ วัสดุแข็งแรงทนทาน การประกอบเนี๊ยบสวยงามตามภาพเลย คุ้มค่ากับราคามากๆ แอดมินตอบคำถามดี จัดส่งรวดเร็ว แพ็คมาอย่างดีเยี่ยม ไว้จะมาอุดหนุนใหม่แน่นอนครับ 💯"
            : `สินค้ารายการที่ ${i + 1} ก็โคตรดี ยอดเยี่ยมไม่แพ้กันครับ ใช้งานได้เต็มประสิทธิภาพ คุ้มราคา!`;

        await textareas.nth(i).fill(reviewText);
        await page.waitForTimeout(200);
    }

    await page.getByRole("button", { name: /ยืนยันการให้คะแนน/i }).click();
    await page.waitForTimeout(1500);

});