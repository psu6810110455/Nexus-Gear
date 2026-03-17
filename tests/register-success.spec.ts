import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // 1. สร้างตัวแปรสุ่มด้วยเวลาปัจจุบัน (Date.now())
  const uniqueId = Date.now();
  const testUsername = `Nexus${uniqueId}`;
  const testEmail = `Nexus${uniqueId}@gmail.com`;
  const testPassword = 'Nexus1234'; // รหัสผ่านใช้ค่าเดิมได้เพราะระบบยอมให้ซ้ำกันได้

  await page.goto('http://localhost:5173/register');

  // --- ส่วนการสมัครสมาชิก ---
  await page.getByRole('textbox', { name: 'username' }).click();
  await page.getByRole('textbox', { name: 'username' }).fill(testUsername); // ใช้ตัวแปรแทนข้อความเดิม
  
  await page.getByRole('textbox', { name: 'อีเมล' }).click();
  await page.getByRole('textbox', { name: 'อีเมล' }).fill(testEmail); // ใช้ตัวแปรแทนข้อความเดิม
  
  await page.getByRole('textbox', { name: 'รหัสผ่าน', exact: true }).click();
  await page.getByRole('textbox', { name: 'รหัสผ่าน', exact: true }).fill(testPassword);
  
  await page.locator('div:nth-child(3) > .auth-input-wrap').click();
  await page.getByRole('button').nth(5).click();
  
  await page.getByRole('textbox', { name: 'ยืนยันรหัสผ่าน' }).click();
  await page.getByRole('textbox', { name: 'ยืนยันรหัสผ่าน' }).fill(testPassword);
  
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();
  await page.getByRole('checkbox', { name: 'acceptTerms termsAndPrivacy' }).check();
  await page.getByRole('button', { name: 'termsAndPrivacy' }).click();
  await page.getByRole('button', { name: 'รับทราบ' }).click();
  
  await page.locator('form').getByRole('button', { name: 'สมัครสมาชิก' }).click();

  // --- ส่วนการเข้าสู่ระบบ ---
  await page.getByRole('textbox', { name: 'อีเมล' }).click();
  await page.getByRole('textbox', { name: 'อีเมล' }).fill(testEmail); // ดึงอีเมลที่เพิ่งสุ่มสมัครไปมาล็อกอิน
  
  // เพิ่ม exact: true ตรงนี้เพื่อป้องกัน Error ช่องรหัสผ่านซ้ำซ้อน
  await page.getByRole('textbox', { name: 'รหัสผ่าน', exact: true }).click();
  await page.getByRole('textbox', { name: 'รหัสผ่าน', exact: true }).fill(testPassword);
  
  await page.getByRole('button', { name: 'แสดงรหัสผ่าน' }).click();
  await page.getByRole('checkbox', { name: 'rememberMe' }).check();
  await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
  await page.getByRole('button', { name: 'เข้าสู่เว็บไซต์ · ENTER' }).click();
});