import { test, expect } from '@playwright/test';

test.describe('Simple Lightbox Functionality', () => {
  test('should open lightbox when clicking markdown images', async ({ page }) => {
    // Navigate to the Imposter article
    await page.goto('/blog/011-imposter');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Find the autoregress image button
    const imageButton = page.locator('button.lightbox-trigger').filter({ has: page.locator('img[src="/images/blog/011-imposter/autoregress.png"]') });
    
    // Verify the button exists
    await expect(imageButton).toBeVisible();
    
    // Check data attributes
    const dataSrc = await imageButton.getAttribute('data-src');
    const dataAlt = await imageButton.getAttribute('data-alt');
    expect(dataSrc).toBe('/images/blog/011-imposter/autoregress.png');
    expect(dataAlt).toBe('autoregress');
    
    // Click the image
    await imageButton.click();
    
    // Check if lightbox opened
    const lightbox = page.locator('#global-lightbox');
    await expect(lightbox).toHaveAttribute('aria-hidden', 'false');
    await expect(lightbox).toBeVisible();
    
    // Check if the lightbox image is correct
    const lightboxImg = lightbox.locator('img');
    await expect(lightboxImg).toHaveAttribute('src', '/images/blog/011-imposter/autoregress.png');
    await expect(lightboxImg).toHaveAttribute('alt', 'autoregress');
    
    // Close by clicking overlay
    await lightbox.click({ position: { x: 10, y: 10 } }); // Click in corner to hit overlay
    
    // Verify lightbox closed
    await expect(lightbox).toHaveAttribute('aria-hidden', 'true');
    await expect(lightbox).not.toBeVisible();
  });
  
  test('should close lightbox with ESC key', async ({ page }) => {
    // Navigate to the Imposter article
    await page.goto('/blog/011-imposter');
    
    // Click an image to open lightbox
    const imageButton = page.locator('button.lightbox-trigger').first();
    await imageButton.click();
    
    // Verify lightbox is open
    const lightbox = page.locator('#global-lightbox');
    await expect(lightbox).toHaveAttribute('aria-hidden', 'false');
    
    // Press ESC
    await page.keyboard.press('Escape');
    
    // Verify lightbox closed
    await expect(lightbox).toHaveAttribute('aria-hidden', 'true');
    await expect(lightbox).not.toBeVisible();
  });
  
  test('should not close when clicking the image itself', async ({ page }) => {
    // Navigate to the Imposter article
    await page.goto('/blog/011-imposter');
    
    // Click an image to open lightbox
    const imageButton = page.locator('button.lightbox-trigger').first();
    await imageButton.click();
    
    // Click the lightbox image itself
    const lightbox = page.locator('#global-lightbox');
    const lightboxImg = lightbox.locator('img');
    await lightboxImg.click();
    
    // Verify lightbox is still open
    await expect(lightbox).toHaveAttribute('aria-hidden', 'false');
    await expect(lightbox).toBeVisible();
  });
});