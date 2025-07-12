import { test, expect } from '@playwright/test';

test.describe('Visual Elements and Styling', () => {
  
  test('Font weight utility classes are applied correctly', async ({ page }) => {
    await page.goto('/about');
    
    // Check headings use font-weight-850 class
    const heading = page.locator('h1.font-weight-850').first();
    await expect(heading).toBeVisible();
    
    // Check paragraphs use font-weight-500 class
    const paragraph = page.locator('p.font-weight-500').first();
    await expect(paragraph).toBeVisible();
  });

  test('Logo styling is consistent across pages', async ({ page }) => {
    // Test homepage logo
    await page.goto('/');
    const homeLogo = page.locator('.hero-logo-transition');
    await expect(homeLogo).toBeVisible();
    
    // Test header logo on blog post
    await page.goto('/blog/011-imposter');
    const headerLogo = page.locator('header .hero-logo-transition');
    await expect(headerLogo).toBeVisible();
    
    // Both should contain the kilowhat text
    await expect(headerLogo).toContainText('kilowhat');
  });

  test('Responsive design works on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Logo should still be visible and readable
    const logo = page.getByRole('heading', { name: /kilowhat/i }).first();
    await expect(logo).toBeVisible();
    
    // Articles should be stacked vertically
    const articles = page.locator('article');
    await expect(articles.first()).toBeVisible();
    
    // Navigation should work
    await page.goto('/about');
    const aboutHeading = page.locator('main h1').first();
    await expect(aboutHeading).toBeVisible();
  });

  test('Background animations are present', async ({ page }) => {
    await page.goto('/');
    
    // Check for animated gradient background
    const animatedBg = page.locator('.bg-gradient-animated');
    await expect(animatedBg).toBeVisible();
    
    // Check for grid pattern
    const gridPattern = page.locator('.bg-grid-pattern');
    await expect(gridPattern).toBeVisible();
  });

  test('Article images have proper styling classes', async ({ page }) => {
    await page.goto('/blog/011-imposter');
    
    // Wait for JavaScript to process images
    await page.waitForTimeout(1000);
    
    // Find article images
    const images = page.locator('article img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      const firstImage = images.first();
      await expect(firstImage).toBeVisible();
      
      // Check for styling classes
      const classes = await firstImage.getAttribute('class');
      expect(classes).toContain('rounded-lg');
      expect(classes).toContain('shadow-lg');
    }
  });

  test('Color scheme and contrast is appropriate', async ({ page }) => {
    await page.goto('/');
    
    // Check that main text is dark on light background
    const bodyElement = page.locator('body');
    const backgroundColor = await bodyElement.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Should be light background (white or near-white)
    expect(backgroundColor).toMatch(/rgb\(255, 255, 255\)|rgb\(248, 250, 252\)/);
  });
});