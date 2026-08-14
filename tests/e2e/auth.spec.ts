import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
  });

  test('should show login page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Painel Administrativo');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'wrong@test.com');
    await page.fill('input[type="password"]', 'wrong');
    await page.click('button[type="submit"]');

    await expect(page.locator('[role="alert"]')).toContainText('Credenciais inválidas');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'admin@fabulosamodas.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.fill('input[type="email"]', 'admin@fabulosamodas.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin\/dashboard/);

    // Logout
    await page.click('button:has-text("Sair")');
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});