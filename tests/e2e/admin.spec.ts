import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'admin@fabulosamodas.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
  });

  test.describe('Dashboard', () => {
    test('should display dashboard with stats', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Dashboard');
      
      // Check stat cards
      await expect(page.locator('text=Total de Produtos')).toBeVisible();
      await expect(page.locator('text=Categorias')).toBeVisible();
      await expect(page.locator('text=Visualizações')).toBeVisible();
      await expect(page.locator('text=Leads WhatsApp')).toBeVisible();
    });

    test('should show recent products table', async ({ page }) => {
      await expect(page.locator('text=Produtos Recentes')).toBeVisible();
      await expect(page.locator('table')).toBeVisible();
    });

    test('should navigate to products page', async ({ page }) => {
      await page.click('a:has-text("Ver todos")');
      await expect(page).toHaveURL(/\/admin\/products/);
    });
  });

  test.describe('Products Management', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/admin/products');
      await page.waitForSelector('table');
    });

    test('should list products with pagination', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Produtos');
      await expect(page.locator('table')).toBeVisible();
      await expect(page.locator('input[placeholder="Buscar produtos..."]')).toBeVisible();
    });

    test('should search products', async ({ page }) => {
      await page.fill('input[placeholder="Buscar produtos..."]', 'Lacoste');
      await page.keyboard.press('Enter');
      await expect(page.locator('table')).toBeVisible();
    });

    test('should open create product modal', async ({ page }) => {
      await page.click('a:has-text("Novo Produto")');
      await expect(page.locator('h1')).toContainText('Novo Produto');
    });

    test('should create new product', async ({ page }) => {
      await page.click('a:has-text("Novo Produto")');
      
      await page.fill('input[name="name"]', 'Produto Teste E2E');
      await page.fill('input[name="price"]', '99.90');
      await page.fill('input[name="image"]', '/manvitrine/lacostetshirt.avif');
      await page.selectOption('select[name="categoryId"]', { label: 'Masculino' });
      await page.fill('textarea[name="details"]', 'Detalhes do produto teste');
      
      await page.click('button:has-text("Criar")');
      
      // Should redirect back to products list
      await expect(page).toHaveURL(/\/admin\/products/);
    });
  });

  test.describe('Categories Management', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/admin/categories');
      await page.waitForSelector('table');
    });

    test('should list categories', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Categorias');
      await expect(page.locator('table')).toBeVisible();
    });

    test('should create new category', async ({ page }) => {
      await page.click('button:has-text("Nova Categoria")');
      
      await page.fill('input[name="name"]', 'e2e-test');
      await page.fill('input[name="label"]', 'E2E Test');
      await page.click('button:has-text("Criar")');
      
      await expect(page.locator('text=E2E Test')).toBeVisible();
    });
  });

  test.describe('Analytics', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/admin/analytics');
      await page.waitForSelector('h1:has-text("Analytics")');
    });

    test('should display analytics dashboard', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Analytics');
      
      // Check stat cards
      await expect(page.locator('text=Visualizações')).toBeVisible();
      await expect(page.locator('text=Cliques em Comprar')).toBeVisible();
      await expect(page.locator('text=Redirecionamentos WhatsApp')).toBeVisible();
      await expect(page.locator('text=Taxa de Conversão')).toBeVisible();
    });

    test('should filter by date range', async ({ page }) => {
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      await page.fill('input[type="date"]:nth-of-type(1)', weekAgo);
      await page.fill('input[type="date"]:nth-of-type(2)', today);
      
      // Should reload analytics
      await expect(page.locator('text=Visualizações')).toBeVisible();
    });
  });
});