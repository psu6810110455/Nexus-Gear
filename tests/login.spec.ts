import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('http://localhost:5173/login');
  });

  test('should display login form elements', async ({ page }) => {
    // Check that all form elements are visible
    await expect(page.locator('h1')).toContainText('เข้าสู่ระบบ');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('เข้าสู่ระบบ');
    // Use more specific selector for register link (in the form, not navbar)
    await expect(page.locator('p').getByText('สมัครสมาชิก')).toBeVisible();
  });

  test('should allow user to log in with valid credentials', async ({ page }) => {
    // Fill in email and password - use seeded admin account
    await page.locator('#email').fill('admin@nexus.com');
    await page.locator('#password').fill('123456');

    // Click login button
    await page.click('button[type="submit"]');

    // Wait for navigation to homepage (indicate successful login)
    await page.waitForURL('http://localhost:5173/', { timeout: 10000 });

    // Verify token is stored in localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.locator('#email').fill('invalid@example.com');
    await page.locator('#password').fill('wrongpassword');

    // Set up dialog handler BEFORE clicking (promise-based approach)
    const dialogPromise = page.waitForEvent('dialog');
    
    // Click login button
    await page.click('button[type="submit"]');

    // Wait for and handle the dialog
    const dialog = await dialogPromise;
    expect(dialog.message()).toContain('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    await dialog.dismiss();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('#password');

    // Initially password type should be 'password'
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click the show password button
    await page.locator('button[aria-label="แสดงรหัสผ่าน"]').click();

    // Password input type should change to 'text'
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to hide password
    await page.locator('button[aria-label="ซ่อนรหัสผ่าน"]').click();

    // Password input type should be 'password' again
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should submit form with Enter key', async ({ page }) => {
    // Fill form with seeded admin account
    await page.locator('#email').fill('admin@nexus.com');
    await page.locator('#password').fill('123456');

    // Press Enter on password field
    await page.locator('#password').press('Enter');

    // Wait for navigation
    await page.waitForURL('http://localhost:5173/', { timeout: 10000 });
  });

  test('should have back to home link', async ({ page }) => {
    const backLink = page.getByText('กลับสู่หน้าหลัก');
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/');
  });

  test('should have register link', async ({ page }) => {
    // Use more specific selector for register link in the form (not navbar)
    const registerLink = page.locator('p').getByText('สมัครสมาชิก');
    await expect(registerLink).toBeVisible();
    await expect(registerLink).toHaveAttribute('href', '/register');
  });

  test('should handle empty form submission', async ({ page }) => {
    // Try to submit without filling anything
    await page.click('button[type="submit"]');

    // HTML5 validation should prevent submission (check depends on browser)
    // The page should remain on login
    const emailInput = page.locator('#email');
    const hasValidation = await emailInput.evaluate((el: HTMLInputElement) => !el.checkValidity());
    expect(hasValidation).toBe(true);
  });

  test('should have remember me checkbox', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]');
    await expect(checkbox).toBeVisible();
    
    // Test checkbox toggle
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('should have forgot password link', async ({ page }) => {
    const forgotLink = page.getByText('ลืมรหัสผ่าน?');
    await expect(forgotLink).toBeVisible();
    await expect(forgotLink).toHaveAttribute('href', '/forgot');
  });

  test('should validate email format', async ({ page }) => {
    const emailInput = page.locator('#email');

    // Fill invalid email
    await emailInput.fill('notanemail');

    // Check if validation catches it
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test('should clear form fields individually', async ({ page }) => {
    const emailInput = page.locator('#email');
    const passwordInput = page.locator('#password');

    // Fill fields
    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');

    // Clear email
    await emailInput.clear();
    await expect(emailInput).toHaveValue('');
    
    // Password should still be filled
    await expect(passwordInput).toHaveValue('password123');

    // Clear password
    await passwordInput.clear();
    await expect(passwordInput).toHaveValue('');
  });
});