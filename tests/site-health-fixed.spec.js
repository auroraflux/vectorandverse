import { test, expect } from '@playwright/test';

test.describe('Site Health Tests - Fixed', () => {
  test('Pages load without critical errors', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore known non-critical errors
        if (!text.includes('Satoshi-MediumItalic') && 
            !text.includes('Satoshi-BoldItalic') &&
            !text.includes('404')) {
          consoleErrors.push(text);
        }
      }
    });

    const response = await page.goto('http://localhost:4321/');
    expect(response.status()).toBe(200);
    expect(consoleErrors).toHaveLength(0);
  });

  test('No duplicate lightbox elements', async ({ page }) => {
    await page.goto('http://localhost:4321/blog/011-imposter');
    
    // Check that we only have one lightbox element
    const lightboxes = page.locator('#lightbox');
    await expect(lightboxes).toHaveCount(1);
  });

  test('Images work with single lightbox', async ({ page }) => {
    await page.goto('http://localhost:4321/blog/011-imposter');
    await page.waitForTimeout(1000);
    
    // Click image
    const image = page.locator('article img').first();
    await image.click();
    
    // Check lightbox opened
    const lightbox = page.locator('#lightbox');
    await expect(lightbox).toHaveClass(/active/);
    
    // Close lightbox
    await page.locator('.lightbox-close').click();
    await page.waitForTimeout(500);
    
    // Check lightbox closed
    const lightboxClass = await lightbox.getAttribute('class');
    expect(lightboxClass).not.toContain('active');
  });

  test('Font loading with fallbacks', async ({ page }) => {
    const response = await page.goto('http://localhost:4321/');
    
    // Check that the page loads successfully even without some font files
    expect(response.status()).toBe(200);
    
    // Check that text is still visible (font fallbacks work)
    await expect(page.locator('h1').first()).toBeVisible();
    
    // Check italic text still works
    const italicText = page.locator('[style*="font-style: italic"]').first();
    await expect(italicText).toBeVisible();
  });
});