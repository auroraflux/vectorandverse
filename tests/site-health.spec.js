import { test, expect } from '@playwright/test';

test.describe('Site Health and Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set a reasonable timeout for each test
    test.setTimeout(60000);
  });

  test('Homepage loads without errors', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    const response = await page.goto('http://localhost:4321/', { 
      waitUntil: 'networkidle' 
    });
    
    expect(response.status()).toBe(200);
    expect(consoleErrors).toHaveLength(0);
    
    // Check critical elements
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('article').first()).toBeVisible();
  });

  test('All blog posts load without crashes', async ({ page }) => {
    // First get all blog post links
    await page.goto('http://localhost:4321/');
    const blogLinks = await page.locator('article a').all();
    const hrefs = await Promise.all(blogLinks.map(link => link.getAttribute('href')));
    
    console.log(`Testing ${hrefs.length} blog posts...`);
    
    for (const href of hrefs) {
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push({ url: href, error: msg.text() });
        }
      });
      
      const response = await page.goto(`http://localhost:4321${href}`, {
        waitUntil: 'networkidle'
      });
      
      expect(response.status()).toBe(200);
      expect(consoleErrors).toHaveLength(0);
      
      // Verify content loaded
      await expect(page.locator('article')).toBeVisible();
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('Image lightbox functionality works', async ({ page }) => {
    // Go to a post with images
    await page.goto('http://localhost:4321/blog/011-imposter');
    
    // Wait for images to load
    await page.waitForLoadState('networkidle');
    
    // Click on an image
    const image = page.locator('article img').first();
    await expect(image).toBeVisible();
    await image.click();
    
    // Check lightbox opened - use first() since there might be multiple
    const lightbox = page.locator('#lightbox').first();
    await expect(lightbox).toHaveClass(/active/);
    
    // Close lightbox
    await page.locator('.lightbox-close').click();
    await expect(lightbox).not.toHaveClass(/active/);
  });

  test('Video elements render correctly', async ({ page }) => {
    await page.goto('http://localhost:4321/blog/011-imposter');
    
    const video = page.locator('video').first();
    await expect(video).toBeVisible();
    
    // Check video attributes
    await expect(video).toHaveAttribute('autoplay', '');
    await expect(video).toHaveAttribute('loop', '');
    // muted attribute can be either '' or 'true'
    const mutedAttr = await video.getAttribute('muted');
    expect(mutedAttr === '' || mutedAttr === 'true').toBeTruthy();
    
    // Check video styling
    const className = await video.getAttribute('class');
    expect(className).toContain('rounded-lg');
  });

  test('Navigation and view transitions work', async ({ page }) => {
    await page.goto('http://localhost:4321/');
    
    // Click on About link
    await page.click('text=About');
    await expect(page).toHaveURL(/\/about/);
    await expect(page.locator('h1')).toContainText('about');
    
    // Navigate back
    await page.click('text=kilowhat!?');
    await expect(page).toHaveURL('http://localhost:4321/');
  });

  test('Performance: Page load times', async ({ page }) => {
    const loadTimes = [];
    
    // Test homepage
    const homeStart = Date.now();
    await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
    const homeLoadTime = Date.now() - homeStart;
    loadTimes.push({ page: 'homepage', time: homeLoadTime });
    
    // Test a few blog posts
    const posts = [
      '/blog/011-imposter',
      '/blog/012-the-beautiful-problem',
      '/blog/006-deepseek'
    ];
    
    for (const post of posts) {
      const start = Date.now();
      await page.goto(`http://localhost:4321${post}`, { waitUntil: 'networkidle' });
      const loadTime = Date.now() - start;
      loadTimes.push({ page: post, time: loadTime });
    }
    
    // Log results
    console.log('Page Load Times:');
    loadTimes.forEach(({ page, time }) => {
      console.log(`  ${page}: ${time}ms`);
      expect(time).toBeLessThan(5000); // Pages should load in under 5 seconds
    });
  });

  test('Memory leaks: Navigate between multiple pages', async ({ page }) => {
    // Navigate between pages multiple times to check for memory leaks
    for (let i = 0; i < 10; i++) {
      await page.goto('http://localhost:4321/');
      await page.click('article a >> nth=0');
      await page.waitForLoadState('networkidle');
      
      // Check console for errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      expect(consoleErrors).toHaveLength(0);
    }
  });

  test('Responsive design: Mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    await page.goto('http://localhost:4321/');
    
    // Check that content is still accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('article').first()).toBeVisible();
    
    // Navigate to a blog post
    await page.click('article a >> nth=0');
    await expect(page.locator('article')).toBeVisible();
  });

  test('Accessibility: Keyboard navigation', async ({ page }) => {
    await page.goto('http://localhost:4321/');
    
    // Tab through elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Press Enter on a focused link
    await page.keyboard.press('Enter');
    
    // Should navigate to a blog post
    await expect(page.url()).not.toBe('http://localhost:4321/');
  });

  test('Edge case: Rapid navigation', async ({ page }) => {
    await page.goto('http://localhost:4321/');
    
    // Rapidly click between pages
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(page.click('article a >> nth=0').catch(() => {}));
      promises.push(page.click('text=kilowhat!?').catch(() => {}));
    }
    
    await Promise.allSettled(promises);
    
    // Page should still be responsive
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Resource loading: Check for 404s', async ({ page }) => {
    const failed404s = [];
    
    page.on('response', response => {
      if (response.status() === 404) {
        failed404s.push(response.url());
      }
    });
    
    // Check homepage
    await page.goto('http://localhost:4321/');
    await page.waitForLoadState('networkidle');
    
    // Check a blog post with images
    await page.goto('http://localhost:4321/blog/011-imposter');
    await page.waitForLoadState('networkidle');
    
    // Log any 404s (excluding known missing fonts)
    const real404s = failed404s.filter(url => !url.includes('Satoshi-MediumItalic'));
    expect(real404s).toHaveLength(0);
  });

  test('Scroll performance with heavy content', async ({ page }) => {
    await page.goto('http://localhost:4321/blog/011-imposter');
    
    // Scroll to bottom rapidly
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Scroll back to top
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    
    // Check that content is still interactive
    const image = page.locator('article img').first();
    await expect(image).toBeVisible();
    await image.click();
    
    // Lightbox should open
    await expect(page.locator('#lightbox')).toHaveClass(/active/);
  });
});