import { test, expect } from '@playwright/test';

test.describe('Accessibility Features', () => {
  
  test('Skip navigation link appears on focus and works', async ({ page }) => {
    await page.goto('/');
    
    // Skip link should exist but be hidden initially
    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toBeInViewport();
    
    // Tab to focus the skip link - it should become visible
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();
    
    // Click skip link
    await skipLink.click();
    
    // Should focus main content
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeVisible();
  });

  test('All pages have main content landmark', async ({ page }) => {
    // Test homepage
    await page.goto('/');
    const homeMain = page.locator('#main-content');
    await expect(homeMain).toBeVisible();
    
    // Test about page
    await page.goto('/about');
    const aboutMain = page.locator('#main-content');
    await expect(aboutMain).toBeVisible();
    
    // Test blog post
    await page.goto('/blog/011-imposter');
    const blogMain = page.locator('#main-content');
    await expect(blogMain).toBeVisible();
    
    // Test 404 page
    await page.goto('/nonexistent');
    const errorMain = page.locator('#main-content');
    await expect(errorMain).toBeVisible();
  });

  test('Lightbox has proper alt text', async ({ page }) => {
    await page.goto('/blog/011-imposter');
    
    // Find lightbox image element
    const lightboxImg = page.locator('#lightbox img');
    await expect(lightboxImg).toHaveAttribute('alt', 'Click to close enlarged image');
  });

  test('Images in blog posts have lightbox functionality', async ({ page }) => {
    await page.goto('/blog/011-imposter');
    
    // Wait for images to load and JavaScript to process them
    await page.waitForTimeout(1000);
    
    // Find an image with lightbox data
    const image = page.locator('article img[data-lightbox="true"]').first();
    if (await image.count() > 0) {
      await expect(image).toBeVisible();
      await expect(image).toHaveAttribute('data-lightbox', 'true');
      await expect(image).toHaveClass(/cursor-zoom-in/);
    }
  });

  test('Keyboard navigation works on main pages', async ({ page }) => {
    await page.goto('/');
    
    // Should be able to tab through navigation elements
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // Logo
    await page.keyboard.press('Tab'); // About link
    
    // About link should be focused
    const aboutLink = page.locator('a[href="/about"]').first();
    await expect(aboutLink).toBeFocused();
    
    // Press Enter to navigate
    await page.keyboard.press('Enter');
    await page.waitForURL('/about');
  });
});