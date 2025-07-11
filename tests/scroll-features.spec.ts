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

  test('should show sticky header on scroll', async ({ page }) => {
    await page.goto('/');
    
    // Check sticky header is not visible initially
    const stickyHeader = page.locator('.sticky-header');
    await expect(stickyHeader).toHaveCount(1);
    await expect(stickyHeader).not.toHaveClass(/visible/);
    
    // Get hero section height
    const heroHeight = await page.locator('.hero-section').evaluate(el => el.offsetHeight);
    
    // Scroll past threshold (50% of hero height)
    await page.evaluate((height) => window.scrollBy(0, height * 0.6), heroHeight);
    await page.waitForTimeout(350); // Wait for animation
    
    // Check sticky header is now visible
    await expect(stickyHeader).toHaveClass(/visible/);
    
    // Check hero section is faded
    const heroSection = page.locator('.hero-section');
    await expect(heroSection).toHaveClass(/scrolled/);
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

  test('should handle sticky header cleanup on navigation', async ({ page }) => {
    await page.goto('/');
    
    // Get hero height and scroll to show sticky header
    const heroHeight = await page.locator('.hero-section').evaluate(el => el.offsetHeight);
    await page.evaluate((height) => window.scrollBy(0, height * 0.6), heroHeight);
    await page.waitForTimeout(350);
    
    // Verify sticky header is visible
    const stickyHeader = page.locator('.sticky-header');
    await expect(stickyHeader).toHaveClass(/visible/);
    
    // Navigate to about page
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    // Sticky header should be removed
    await expect(page.locator('.sticky-header')).toHaveCount(0);
    
    // Navigate back
    await page.goBack();
    await page.waitForURL('/');
    
    // Verify sticky header is recreated
    await expect(page.locator('.sticky-header')).toHaveCount(1);
  });
});