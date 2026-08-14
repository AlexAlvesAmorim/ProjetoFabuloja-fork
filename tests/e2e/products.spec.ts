import { test, expect } from '@playwright/test';

test.describe('Products - Public Catalog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for products to load
    await page.waitForSelector('#produtos', { timeout: 10000 });
  });

  test('should display products catalog', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Coleção Fabulosa');
    
    // Check tabs
    await expect(page.locator('button:has-text("Moda Masculina")')).toBeVisible();
    await expect(page.locator('button:has-text("Moda Feminina")')).toBeVisible();
    
    // Check products grid
    await expect(page.locator('[id^="secao-"]')).toBeVisible();
  });

  test('should switch between Masculina and Feminina tabs', async ({ page }) => {
    // Should start with Masculina active
    await expect(page.locator('button:has-text("Moda Masculina")')).toHaveClass(/bg-cyan-600/);
    
    // Click Feminina
    await page.click('button:has-text("Moda Feminina")');
    await expect(page.locator('button:has-text("Moda Feminina")')).toHaveClass(/bg-cyan-600/);
    
    // URL should update
    await expect(test.page).toHaveURL(/aba=feminina/);
  });

  test('should open product modal on click', async ({ page }) => {
    // Click first product
    await page.locator('[id^="secao-"] >> .group').first().click();
    
    // Modal should open
    await expect(page.locator('[role="dialog"], .fixed.inset-0')).toBeVisible();
    await expect(page.locator('text=VER DETALHES')).toBeVisible();
  });

  test('should track product view event', async ({ page }) => {
    // Listen for network request
    const requestPromise = page.waitForResponse(
      response => response.url().includes('/api/lead-events') && response.request().method() === 'POST'
    );
    
    // Click product
    await page.locator('[id^="secao-"] >> .group').first().click();
    
    // Wait for event to be tracked
    const response = await requestPromise;
    expect(response.status()).toBe(201);
  });

  test('should track buy click event', async ({ page }) => {
    const requestPromise = page.waitForResponse(
      response => response.url().includes('/api/lead-events') && 
                  response.request().method() === 'POST' &&
                  JSON.parse(response.request().postData() || '{}').eventType === 'BUY_CLICK'
    );
    
    await page.locator('[id^="secao-"] >> .group').first().click();
    await page.click('button:has-text("Quero comprar")');
    
    const response = await page.waitForResponse(
      response => response.url().includes('/api/lead-events') && response.status() === 201
    );
    expect(response.status()).toBe(201);
  });

  test('should redirect to WhatsApp on WhatsApp button click', async ({ page }) => {
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.locator('[id^="secao-"] >> .group').first().click().then(() => 
        page.click('button:has-text("Comprar pelo WhatsApp")')
      ),
    ]);
    
    // Should open WhatsApp
    expect(popup.url()).toContain('wa.me');
    expect(popup.url()).toContain('5521976807111');
  });
});