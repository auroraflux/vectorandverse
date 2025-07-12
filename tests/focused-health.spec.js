import { test, expect } from '@playwright/test';

test.describe('Focused Site Health Tests', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(30000);
  });

  test('Critical pages load successfully', async ({ page }) => {
    const pagesToTest = [
      { url: '/', title: 'kilowhat!?' },
      { url: '/about', title: 'about' },
      { url: '/blog/011-imposter', title: 'Reality Check' },
      { url: '/blog/012-the-beautiful-problem', title: 'your problems suck' }
    ];

    for (const { url, title } of pagesToTest) {
      console.log(`Testing ${url}...`);
      const response = await page.goto(`http://localhost:4321${url}`, {
        waitUntil: 'domcontentloaded'
      });
      
      expect(response.status()).toBe(200);
      await expect(page.locator('h1').first()).toContainText(title);
    }
  });

  test('Images have rounded corners and lightbox', async ({ page }) => {
    await page.goto('http://localhost:4321/blog/011-imposter');
    await page.waitForLoadState('domcontentloaded');
    
    // Check first image has proper styling
    const image = page.locator('article img').first();
    await expect(image).toBeVisible();
    
    // Check for rounded corners class
    const imageClass = await image.getAttribute('class');
    expect(imageClass).toContain('rounded-lg');
    
    // Check lightbox attributes are added
    await page.waitForFunction(() => {
      const img = document.querySelector('article img');
      return img && img.dataset.lightbox === 'true';
    });
    
    const lightboxAttr = await image.getAttribute('data-lightbox');
    expect(lightboxAttr).toBe('true');
  });

  test('Video elements styled correctly', async ({ page }) => {
    await page.goto('http://localhost:4321/blog/011-imposter');
    
    const video = page.locator('video').first();
    await expect(video).toBeVisible();
    
    // Check video has rounded corners
    const className = await video.getAttribute('class');
    expect(className).toContain('rounded-lg');
    expect(className).toContain('shadow-lg');
  });

  test('Multiple blog posts render without errors', async ({ page }) => {
    const posts = [
      '/blog/006-deepseek',
      '/blog/011-imposter', 
      '/blog/012-the-beautiful-problem'
    ];
    
    for (const post of posts) {
      console.log(`Loading ${post}...`);
      
      // Track JavaScript errors
      const jsErrors = [];
      page.on('pageerror', error => {
        jsErrors.push(error.message);
      });
      
      const response = await page.goto(`http://localhost:4321${post}`);
      expect(response.status()).toBe(200);
      
      // Wait for content to be visible
      await expect(page.locator('article').first()).toBeVisible();
      
      // No JS errors (excluding font 404s which are expected)
      const realErrors = jsErrors.filter(err => 
        !err.includes('404') && !err.includes('Satoshi-MediumItalic')
      );
      expect(realErrors).toHaveLength(0);
    }
  });

  test('Lightbox opens and closes properly', async ({ page }) => {
    await page.goto('http://localhost:4321/blog/011-imposter');
    await page.waitForLoadState('networkidle');
    
    // Wait for JavaScript to initialize
    await page.waitForTimeout(1000);
    
    // Click an image
    const image = page.locator('article img').first();
    await image.click();
    
    // Check lightbox is visible
    const lightbox = page.locator('#lightbox').first();
    await expect(lightbox).toBeVisible();
    
    // Close with X button
    await page.locator('.lightbox-close').first().click();
    
    // Lightbox should be hidden
    await expect(lightbox).not.toBeVisible();
  });

  test('Performance: Key pages load quickly', async ({ page }) => {
    const timings = [];
    
    // Homepage
    let start = Date.now();
    await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
    timings.push({ page: 'Home', time: Date.now() - start });
    
    // Blog post with images
    start = Date.now();
    await page.goto('http://localhost:4321/blog/011-imposter', { waitUntil: 'domcontentloaded' });
    timings.push({ page: 'Blog Post', time: Date.now() - start });
    
    // Check all pages loaded reasonably fast
    timings.forEach(({ page, time }) => {
      console.log(`${page}: ${time}ms`);
      expect(time).toBeLessThan(3000); // 3 second threshold
    });
  });

  test('Mobile: Content displays correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('http://localhost:4321/');
    
    // Homepage elements visible
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('article').first()).toBeVisible();
    
    // Navigate to blog post
    await page.goto('http://localhost:4321/blog/011-imposter');
    await expect(page.locator('article').first()).toBeVisible();
    
    // Images should still be styled
    const image = page.locator('article img').first();
    const imageClass = await image.getAttribute('class');
    expect(imageClass).toContain('rounded-lg');
  });

  test('View transitions preserve functionality', async ({ page }) => {
    await page.goto('http://localhost:4321/');
    
    // Click first blog post
    await page.locator('article a').first().click();
    
    // Wait for navigation
    await page.waitForLoadState('domcontentloaded');
    
    // Check we're on a blog post
    await expect(page.locator('article h1').first()).toBeVisible();
    
    // Navigate back to home
    await page.locator('a:has-text("kilowhat!?")').click();
    await page.waitForLoadState('domcontentloaded');
    
    // Should be back at homepage
    await expect(page).toHaveURL('http://localhost:4321/');
  });
});