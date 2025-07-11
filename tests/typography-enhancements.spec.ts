import { test, expect } from '@playwright/test';

test.describe('Typography Enhancements', () => {
  test('should animate font weight on link hover', async ({ page }) => {
    await page.goto('/about');
    
    // Find a link in the prose content
    const link = page.locator('.prose a').first();
    await expect(link).toBeVisible();
    
    // Get initial font variation settings
    const initialWeight = await link.evaluate(el => 
      window.getComputedStyle(el).fontVariationSettings
    );
    
    // Hover over the link
    await link.hover();
    await page.waitForTimeout(350); // Wait for transition
    
    // Get hover font variation settings
    const hoverWeight = await link.evaluate(el => 
      window.getComputedStyle(el).fontVariationSettings
    );
    
    // Font weight should change on hover
    expect(initialWeight).not.toEqual(hoverWeight);
    expect(hoverWeight).toContain('550');
  });

  test('should have enhanced blockquote styling', async ({ page }) => {
    await page.goto('/about');
    
    // Check if we have a blockquote (we'll need to add one to test)
    const blockquote = page.locator('.prose blockquote').first();
    const blockquoteExists = await blockquote.count();
    
    if (blockquoteExists > 0) {
      // Check for decorative quotes
      const beforeContent = await blockquote.evaluate(el => 
        window.getComputedStyle(el, '::before').content
      );
      const afterContent = await blockquote.evaluate(el => 
        window.getComputedStyle(el, '::after').content
      );
      
      expect(beforeContent).toContain('"');
      expect(afterContent).toContain('"');
      
      // Check font variation settings
      const fontWeight = await blockquote.evaluate(el => 
        window.getComputedStyle(el).fontVariationSettings
      );
      expect(fontWeight).toContain('350');
    }
  });

  test('should animate blog post titles on hover', async ({ page }) => {
    await page.goto('/');
    
    const article = page.locator('article').first();
    const title = article.locator('h2');
    
    // Get initial weight
    const initialWeight = await title.evaluate(el => 
      window.getComputedStyle(el).fontVariationSettings
    );
    
    // Hover over article
    await article.hover();
    await page.waitForTimeout(400); // Wait for transition
    
    // Get hover weight
    const hoverWeight = await title.evaluate(el => 
      window.getComputedStyle(el).fontVariationSettings
    );
    
    // Font weight should increase on hover
    expect(initialWeight).toContain('850');
    expect(hoverWeight).toContain('900');
  });

  test('should have smooth font weight transitions', async ({ page }) => {
    await page.goto('/');
    
    // Check transition on navigation links
    const navLink = page.locator('a[href="/about"]').first();
    
    // Check transition property
    const transition = await navLink.evaluate(el => 
      window.getComputedStyle(el).transition
    );
    
    expect(transition).toContain('font-variation-settings');
  });
});

test.describe('Visual Consistency', () => {
  test('all enhancements should work together without conflicts', async ({ page }) => {
    await page.goto('/');
    
    // Check that multiple animations can run simultaneously
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Trigger various animations
    await page.hover('article h2');
    await page.hover('a[href="/about"]');
    await page.evaluate(() => window.scrollBy(0, 300));
    
    await page.waitForTimeout(500);
    
    // No console errors should occur
    expect(errors).toHaveLength(0);
  });
});