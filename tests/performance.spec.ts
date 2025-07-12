import { test, expect } from '@playwright/test';

test.describe('Performance and Loading', () => {
  
  test('Homepage loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Page should be interactive
    const logo = page.getByRole('heading', { name: /kilowhat/i }).first();
    await expect(logo).toBeVisible();
  });

  test('Blog posts load efficiently', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/blog/011-imposter');
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Article content should be visible
    const article = page.locator('article#main-content');
    await expect(article).toBeVisible();
  });

  test('No critical console errors on key pages', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Test homepage
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Test blog post
    await page.goto('/blog/011-imposter');
    await page.waitForTimeout(2000);
    
    // Test about page
    await page.goto('/about');
    await page.waitForTimeout(2000);
    
    // Filter out non-critical errors (network errors, external resources, etc.)
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') &&
      !error.includes('Failed to load resource') &&
      !error.includes('net::ERR_') &&
      !error.toLowerCase().includes('cors')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('Images load with proper lazy loading', async ({ page }) => {
    await page.goto('/blog/011-imposter');
    
    // Wait for page to settle
    await page.waitForTimeout(1000);
    
    // Check that images have loading="lazy" where appropriate
    const images = page.locator('article img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      const firstImage = images.first();
      const loading = await firstImage.getAttribute('loading');
      
      // Should have lazy loading
      expect(loading).toBe('lazy');
    }
  });

  test('Font files preload correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check for font preload links
    const fontPreloads = page.locator('link[rel="preload"][as="font"]');
    await expect(fontPreloads).toHaveCount(2); // Satoshi-Variable and Satoshi-BlackItalic
    
    // Check specific font preloads
    const variableFont = page.locator('link[href*="Satoshi-Variable.woff2"]');
    await expect(variableFont).toHaveAttribute('rel', 'preload');
    
    const blackItalicFont = page.locator('link[href*="Satoshi-BlackItalic.woff2"]');
    await expect(blackItalicFont).toHaveAttribute('rel', 'preload');
  });

  test('Static assets load successfully', async ({ page }) => {
    const failedRequests: string[] = [];
    
    page.on('requestfailed', request => {
      failedRequests.push(request.url());
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out external resources and non-critical failures
    const criticalFailures = failedRequests.filter(url => 
      url.includes(page.url().split('/')[2]) && // Same domain
      !url.includes('favicon') &&
      !url.includes('analytics') &&
      !url.includes('gtag')
    );
    
    expect(criticalFailures).toHaveLength(0);
  });
});