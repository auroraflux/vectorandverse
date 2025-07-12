import { test, expect } from '@playwright/test';

test.describe('Critical Functionality Tests', () => {
  test('Homepage loads with articles', async ({ page }) => {
    const response = await page.goto('http://localhost:4321/');
    expect(response.status()).toBe(200);
    
    // Check title
    await expect(page.locator('h1')).toContainText('kilowhat');
    
    // Check articles are present
    const articles = page.locator('article');
    await expect(articles).toHaveCount(16); // Based on your site
  });

  test('Blog post images have rounded corners and shadows', async ({ page }) => {
    await page.goto('http://localhost:4321/blog/011-imposter');
    
    // Wait for JavaScript to apply classes
    await page.waitForTimeout(1000);
    
    // Check image styling
    const image = page.locator('article img').first();
    await expect(image).toBeVisible();
    
    const classes = await image.getAttribute('class');
    expect(classes).toContain('rounded-lg');
    expect(classes).toContain('shadow-lg');
  });

  test('Videos are properly styled', async ({ page }) => {
    await page.goto('http://localhost:4321/blog/011-imposter');
    
    const video = page.locator('video').first();
    await expect(video).toBeVisible();
    
    const classes = await video.getAttribute('class');
    expect(classes).toContain('rounded-lg');
    expect(classes).toContain('shadow-lg');
  });

  test('Multiple blog posts load without critical errors', async ({ page }) => {
    const posts = [
      '/blog/006-deepseek',
      '/blog/011-imposter',
      '/blog/012-the-beautiful-problem'
    ];
    
    for (const post of posts) {
      console.log(`Testing ${post}...`);
      
      // Only track critical JS errors
      const criticalErrors = [];
      page.on('pageerror', error => {
        const msg = error.message;
        // Ignore known non-critical errors
        if (!msg.includes('404') && 
            !msg.includes('Satoshi-MediumItalic') &&
            !msg.includes('Failed to load resource')) {
          criticalErrors.push(msg);
        }
      });
      
      const response = await page.goto(`http://localhost:4321${post}`);
      expect(response.status()).toBe(200);
      
      // Content should be visible
      await expect(page.locator('article')).toBeVisible();
      
      // No critical errors
      expect(criticalErrors).toHaveLength(0);
    }
  });

  test('Performance: Pages load within acceptable time', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Measure homepage
    const homeStart = Date.now();
    await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
    const homeTime = Date.now() - homeStart;
    
    // Measure blog post
    const blogStart = Date.now();
    await page.goto('http://localhost:4321/blog/011-imposter', { waitUntil: 'domcontentloaded' });
    const blogTime = Date.now() - blogStart;
    
    console.log(`Homepage: ${homeTime}ms`);
    console.log(`Blog Post: ${blogTime}ms`);
    
    // Should load reasonably fast
    expect(homeTime).toBeLessThan(5000);
    expect(blogTime).toBeLessThan(5000);
    
    await context.close();
  });

  test('Mobile: Site is responsive', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 }
    });
    const page = await context.newPage();
    
    await page.goto('http://localhost:4321/');
    
    // Content should be visible on mobile
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('article').first()).toBeVisible();
    
    // Navigate to blog post
    await page.goto('http://localhost:4321/blog/011-imposter');
    await expect(page.locator('article')).toBeVisible();
    
    // Images should still be styled on mobile
    await page.waitForTimeout(1000);
    const image = page.locator('article img').first();
    const classes = await image.getAttribute('class');
    expect(classes).toContain('rounded-lg');
    
    await context.close();
  });
});