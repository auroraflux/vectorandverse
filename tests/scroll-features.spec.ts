import { test, expect } from '@playwright/test';

test.describe('Scroll Features', () => {
  test('should apply text reveal animations to article content', async ({ page }) => {
    // Navigate to an article
    await page.goto('/');
    await page.locator('article').first().click();
    
    // Wait for article to load
    await page.waitForSelector('article');
    
    // Check that paragraphs have reveal-text class
    const paragraphs = page.locator('article p');
    const firstParagraph = paragraphs.first();
    
    // Check initial state (not revealed)
    await expect(firstParagraph).toHaveClass(/reveal-text/);
    
    // Scroll down to trigger reveal
    await page.evaluate(() => window.scrollBy(0, 500));
    
    // Wait for animation
    await page.waitForTimeout(500);
    
    // Check that first paragraph is revealed
    await expect(firstParagraph).toHaveClass(/revealed/);
  });

  test('should transform logo on scroll', async ({ page }) => {
    await page.goto('/');
    
    // Check logo has transform class
    const logo = page.locator('.hero-logo-transition');
    await expect(logo).toHaveClass(/logo-scroll-transform/);
    
    // Get initial transform
    const initialTransform = await logo.evaluate(el => 
      window.getComputedStyle(el).transform
    );
    
    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(350); // Wait for animation frame
    
    // Get new transform
    const scrolledTransform = await logo.evaluate(el => 
      window.getComputedStyle(el).transform
    );
    
    // Verify transform has changed
    expect(scrolledTransform).not.toBe(initialTransform);
  });

  test('should reveal multiple text elements with stagger', async ({ page }) => {
    // Navigate to an article
    await page.goto('/');
    await page.locator('article').first().click();
    
    // Wait for article
    await page.waitForSelector('article');
    
    // Check multiple paragraphs have staggered delays
    const paragraphs = page.locator('article p');
    const count = await paragraphs.count();
    
    if (count >= 2) {
      const secondParagraph = paragraphs.nth(1);
      
      // Wait a bit for JavaScript to run
      await page.waitForTimeout(500);
      
      // Check for delay class
      const hasDelay = await secondParagraph.evaluate(el => 
        Array.from(el.classList).some(cls => cls.startsWith('delay-'))
      );
      
      expect(hasDelay).toBe(true);
    }
  });

  test('should handle logo transform cleanup on navigation', async ({ page }) => {
    await page.goto('/');
    
    // Scroll down to transform logo
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(350);
    
    // Navigate to about page
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    // Navigate back
    await page.goBack();
    await page.waitForURL('/');
    
    // Verify logo still has transform capability
    const logo = page.locator('.hero-logo-transition');
    await expect(logo).toHaveClass(/logo-scroll-transform/);
  });
});