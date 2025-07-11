import { test, expect } from '@playwright/test';
import { navigateToPage, clickAndNavigate } from './astro-test-utils';

test.describe('Phase 3 Features - Basic Tests', () => {
  test('reading progress indicator appears on articles', async ({ page }) => {
    // Navigate to an article
    await page.goto('/blog/first-post');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000); // Give scripts time to load
    
    // Check if progress bar was created
    const hasProgressBar = await page.evaluate(() => {
      return document.querySelector('.reading-progress-bar') !== null;
    });
    
    expect(hasProgressBar).toBe(true);
  });

  test('gradient borders appear on About page', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    
    // Check if gradient styles were added
    const hasGradientStyles = await page.evaluate(() => {
      const styles = Array.from(document.querySelectorAll('style'))
        .map(s => s.textContent || '')
        .join(' ');
      return styles.includes('gradient-border-link');
    });
    
    expect(hasGradientStyles).toBe(true);
  });

  test('no console errors on pages with enhancements', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('404') && 
            !text.includes('Failed to fetch') &&
            !text.includes('audit')) {
          errors.push(text);
        }
      }
    });
    
    // Test home page
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Test about page 
    await page.goto('/about');
    await page.waitForLoadState('domcontentloaded');
    
    // Test article page
    await page.goto('/blog/first-post');
    await page.waitForLoadState('domcontentloaded');
    
    expect(errors).toHaveLength(0);
  });
});