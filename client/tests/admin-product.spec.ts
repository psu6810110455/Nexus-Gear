import { test, expect } from '@playwright/test';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test.describe('Admin Product Management Flow', () => {
  const adminEmail = 'admin@nexus.com';
  const adminPassword = '123456';
  // Use a unique name to avoid collision and make it easy to find
  const productName = `E2E Test Product ${Date.now()}`; 
  const productPrice = '999';
  const productStock = '50';
  const productDesc = 'This is an awesome product created by Playwright E2E test.';

  test('should login, add product with images, edit to star homepage image, and delete the product', async ({ page }) => {
    // 1. Navigate to login directly
    await page.goto('http://localhost:5173/login');
    
    // 2. Login as admin
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    
    // There are two buttons, one is for login and one is Google login. 
    // We select the one of type submit
    await page.click('button[type="submit"]');

    // Wait for navigation back to home after login
    await page.waitForURL('http://localhost:5173/');
    await page.waitForTimeout(1000);

    // 3. Navigate to Admin Tool (ศูนย์บริหารสินค้า)
    await page.goto('http://localhost:5173/admin');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // give it time to load data
    
    // Verify we are on the Admin page
    const heading = page.locator('h1', { hasText: /INVENTORY|คลังสินค้า/i }).first();
    await expect(heading).toBeVisible({ timeout: 10000 });

    // 4. Add a new product
    await page.getByRole('button', { name: /Add Product|เพิ่มสินค้าใหม่/i }).click();

    // Wait for the modal to pop up
    const modal = page.locator('.fixed.inset-0.z-50');
    await expect(modal).toBeVisible();

    // Fill Product Details
    // Using the input classes or precise nth elements instead of placeholder
    const formInputs = page.locator('input[type="text"]');
    await formInputs.first().fill(productName);
    
    // Select the category
    await modal.locator('select').selectOption({ index: 1 });
    
    // Price and Stock are number inputs
    const numberInputs = page.locator('input[type="number"]');
    await numberInputs.nth(0).fill(productPrice); // Price input
    await numberInputs.nth(1).fill(productStock); // Stock input
    await page.fill('textarea', productDesc);

    // Upload 4 images 
    // Create dummy image files for upload
    const dummyImagePath = join(__dirname, 'dummy-image.png');
    if (!fs.existsSync(dummyImagePath)) {
      // Create a 1x1 transparent PNG file
      const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      fs.writeFileSync(dummyImagePath, Buffer.from(base64Png, 'base64'));
    }
    
    // We upload the same dummy image 4 times
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('button', { hasText: 'สร้าง' }).click(); // The '+' upload button
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([dummyImagePath, dummyImagePath, dummyImagePath, dummyImagePath]);

    // Save the product (Search for the matching button inside the modal)
    await modal.getByRole('button', { name: /Save Product|บันทึก/i }).click();

    // Wait for modal to disappear and toast to appear
    await expect(modal).not.toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(3000); // Give time for list to refresh
    
    // 5. Search for the new product
    const searchInput = page.getByPlaceholder(/ค้นหาสินค้า|Search/i).first();
    await searchInput.fill(productName);
    await page.waitForTimeout(2000); // Wait for filtering

    // Find the product row
    const productRow = page.locator('tr', { hasText: productName });
    await expect(productRow).toBeVisible();

    // 6. Edit Product (Set as Homepage Star)
    // Click the Edit button (usually the blue one with an Edit icon)
    await productRow.locator('button[title*="แก้ไข"]').click();
    await expect(modal).toBeVisible();
    
    // Set the star (main image)
    // The star button is inside the uploaded image preview container, 
    // replacing title match with an icon match
    const starButton = modal.locator('button:has(svg.lucide-star)').first();
    await starButton.click();

    // Save the changes
    await modal.getByRole('button', { name: /Save Product|บันทึก/i }).click();
    await expect(modal).not.toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(3000); // Allow time for the toast/refresh

    // 7. Delete the product
    // Refilter just in case
    await searchInput.fill('');
    await searchInput.fill(productName);
    await page.waitForTimeout(1000);

    // Click Delete button (red button with trash icon)
    await productRow.locator('button[title*="ลบ"], button[title*="Delete"]').click();

    // The confirm button is the red one in the modal
    const confirmModal = page.locator('.fixed.inset-0.z-\\[60\\]');
    await expect(confirmModal).toBeVisible();
    await confirmModal.locator('button.bg-\\[\\#FF0000\\]').click({ force: true });

    // Verify it is gone
    await page.waitForTimeout(2000);
    await searchInput.fill(productName);
    await page.waitForTimeout(1000);
    await expect(page.locator('tr', { hasText: productName })).not.toBeVisible();
  });
});
