import { test, expect } from '@playwright/test';

test.describe('JavaScript Enhancements - Reading Progress', () => {
  test('should show reading progress indicator on article pages', async ({ page }) => {
    // Navigate to first article
    await page.goto('/');
    await page.locator('article').first().click();
    await page.waitForLoadState('domcontentloaded');
    
    // Check progress bar exists
    const progressBar = page.locator('.reading-progress-bar');
    await expect(progressBar).toBeVisible();
    
    // Check initial width is 0 or very small
    const initialWidth = await progressBar.evaluate(el => 
      parseFloat(el.style.width)
    );
    expect(initialWidth).toBeLessThan(10);
    
    // Scroll down and check progress increases
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(300); // Wait for animation
    
    const midWidth = await progressBar.evaluate(el => 
      parseFloat(el.style.width)
    );
    expect(midWidth).toBeGreaterThan(40);
    expect(midWidth).toBeLessThan(60);
    
    // Scroll to bottom and check progress is 100%
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    
    const finalWidth = await progressBar.evaluate(el => 
      parseFloat(el.style.width)
    );
    expect(finalWidth).toBeGreaterThan(95);
  });

  test('should not show progress indicator on home page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const progressBar = page.locator('.reading-progress-bar');
    await expect(progressBar).not.toBeVisible();
  });

  test('progress bar should have gradient colors', async ({ page }) => {
    await page.goto('/');
    await page.locator('article').first().click();
    await page.waitForLoadState('domcontentloaded');
    
    const progressBar = page.locator('.reading-progress-bar');
    const background = await progressBar.evaluate(el => 
      window.getComputedStyle(el).background
    );
    
    expect(background).toContain('linear-gradient');
    expect(background).toMatch(/rgba\(59,\s*130,\s*246/); // Blue
    expect(background).toMatch(/rgba\(251,\s*146,\s*60/); // Orange
  });
});

test.describe('JavaScript Enhancements - Gradient Borders', () => {
  test('should add gradient borders to links', async ({ page }) => {
    // Gradient borders are currently only on About page
    await page.goto('/about');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500); // Wait for script to apply classes
    
    // Check links have gradient border class
    const hasGradientLinks = await page.evaluate(() => {
      return document.querySelectorAll('.gradient-border-link').length > 0;
    });
    expect(hasGradientLinks).toBe(true);
  });

  test('should not add gradient borders to article cards', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
    
    // Article cards should not have gradient borders
    const articleCard = page.locator('article > a').first();
    await expect(articleCard).not.toHaveClass(/gradient-border-active/);
  });

  test('gradient borders should animate on hover', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
    
    // Check that gradient animation exists in styles
    const hasAnimation = await page.evaluate(() => {
      const styles = document.querySelector('style')?.textContent || '';
      return styles.includes('gradientShift');
    });
    expect(hasAnimation).toBe(true);
  });

});

test.describe('JavaScript Enhancements - Performance', () => {
  test('should not cause layout shifts', async ({ page }) => {
    await page.goto('/');
    
    // Measure CLS before enhancements
    const clsBefore = await page.evaluate(() => {
      return new Promise(resolve => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const cls = entries.reduce((sum, entry) => sum + entry.value, 0);
          resolve(cls);
        }).observe({ entryTypes: ['layout-shift'] });
        
        // Trigger a small interaction
        setTimeout(() => {
          window.scrollBy(0, 100);
        }, 100);
        
        setTimeout(() => resolve(0), 1000);
      });
    });
    
    expect(clsBefore).toBeLessThan(0.1); // Good CLS score
  });

  test('scripts should load without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore common dev server errors
        if (!text.includes('Failed to fetch') && 
            !text.includes('404') && 
            !text.includes('audit')) {
          errors.push(text);
        }
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Navigate to an article to test reading progress
    await page.locator('article').first().click();
    await page.waitForLoadState('domcontentloaded');
    
    expect(errors).toHaveLength(0);
  });
});