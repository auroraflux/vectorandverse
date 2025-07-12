import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Fast Error Detection', () => {
  
  test('Homepage loads without critical errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const networkErrors: string[] = [];
    
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Capture network failures
    page.on('requestfailed', request => {
      // Only track critical local resources
      if (request.url().includes(page.url().split('/')[2]) && 
          !request.url().includes('favicon') &&
          !request.url().includes('analytics')) {
        networkErrors.push(request.url());
      }
    });
    
    // Load homepage
    await page.goto('/');
    
    // Wait for initial render and JavaScript
    await page.waitForTimeout(1500);
    
    // Check page actually rendered
    const logo = page.getByRole('heading', { name: /kilowhat/i }).first();
    await expect(logo).toBeVisible();
    
    // Filter out non-critical console errors
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') &&
      !error.includes('Failed to load resource') &&
      !error.includes('net::ERR_') &&
      !error.toLowerCase().includes('cors') &&
      !error.includes('analytics') &&
      !error.includes('gtag')
    );
    
    // Fail if critical errors found
    if (criticalErrors.length > 0) {
      console.log('Critical console errors found:', criticalErrors);
    }
    if (networkErrors.length > 0) {
      console.log('Critical network errors found:', networkErrors);
    }
    
    expect(criticalErrors).toHaveLength(0);
    expect(networkErrors).toHaveLength(0);
  });

  test('Blog post loads without critical errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Load a blog post
    await page.goto('/blog/011-imposter');
    await page.waitForTimeout(1500);
    
    // Check article content loaded
    const article = page.locator('article#main-content');
    await expect(article).toBeVisible();
    
    // Filter critical errors
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') &&
      !error.includes('Failed to load resource') &&
      !error.includes('net::ERR_') &&
      !error.toLowerCase().includes('cors')
    );
    
    if (criticalErrors.length > 0) {
      console.log('Blog post critical errors:', criticalErrors);
    }
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('Site navigation works without errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Start at homepage
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Navigate to about
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    await page.waitForTimeout(1000);
    
    // Navigate back to home
    await page.click('.hero-logo-transition');
    await page.waitForURL('/');
    await page.waitForTimeout(1000);
    
    // Filter critical errors
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') &&
      !error.includes('Failed to load resource') &&
      !error.includes('net::ERR_') &&
      !error.toLowerCase().includes('cors')
    );
    
    if (criticalErrors.length > 0) {
      console.log('Navigation critical errors:', criticalErrors);
    }
    
    expect(criticalErrors).toHaveLength(0);
  });
});