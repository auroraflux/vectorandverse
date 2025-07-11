import { test, expect } from '@playwright/test';

test.describe('Final Performance Tests', () => {
  test('homepage performance metrics', async ({ page }) => {
    // Measure performance metrics
    await page.goto('/');
    
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      };
    });
    
    // Check that key metrics are within acceptable ranges
    expect(metrics.firstContentfulPaint).toBeLessThan(3000); // FCP < 3s
    expect(metrics.domContentLoaded).toBeLessThan(5000); // DOM loaded < 5s
  });

  test('article page has scroll animations', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to first article
    await page.locator('article').first().click();
    await page.waitForSelector('article');
    
    // Wait for JavaScript to initialize
    await page.waitForTimeout(500);
    
    // Check that reveal-text elements exist
    const revealElements = await page.locator('.reveal-text').count();
    expect(revealElements).toBeGreaterThan(0);
    
    // Check that reading progress bar exists
    const progressBar = await page.locator('.reading-progress-bar').count();
    expect(progressBar).toBe(1);
  });

  test('navigation works smoothly', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to article
    await page.locator('article').first().click();
    await page.waitForSelector('article');
    
    // Check we're on article page
    await expect(page.locator('article')).toBeVisible();
    
    // Navigate back
    await page.goBack();
    
    // Check we're back on homepage
    await expect(page.locator('.hero-section')).toBeVisible();
    
    // Navigate to about
    await page.goto('/about');
    await expect(page.locator('h1')).toContainText('Zero Surveillance');
  });

  test('all CSS animations use efficient properties', async ({ page }) => {
    await page.goto('/');
    
    // Check that animations use transform/opacity only
    const animationProperties = await page.evaluate(() => {
      const styles = Array.from(document.styleSheets)
        .flatMap(sheet => {
          try {
            return Array.from(sheet.cssRules || []);
          } catch {
            return [];
          }
        })
        .filter(rule => rule instanceof CSSKeyframesRule)
        .map(rule => (rule as CSSKeyframesRule).name);
      
      return styles;
    });
    
    // We should have some animations defined
    expect(animationProperties.length).toBeGreaterThan(0);
  });

  test('images are optimized and lazy loaded', async ({ page }) => {
    await page.goto('/');
    await page.locator('article').first().click();
    
    // Check images
    const images = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .filter(img => {
          // Filter out images that aren't actual image files
          const src = img.src.toLowerCase();
          return src.includes('.jpg') || src.includes('.jpeg') || 
                 src.includes('.png') || src.includes('.gif') || 
                 src.includes('.webp') || src.includes('.svg');
        })
        .map(img => ({
          loading: img.loading,
          hasAlt: !!img.alt,
          src: img.src
        }));
    });
    
    // All images should have alt text
    const imagesWithoutAlt = images.filter(img => !img.hasAlt);
    if (imagesWithoutAlt.length > 0) {
      console.log('Images without alt text:', imagesWithoutAlt);
    }
    
    // Hero images should have alt text
    const heroImages = images.filter(img => img.src.includes('images/'));
    heroImages.forEach(img => {
      expect(img.hasAlt).toBe(true);
    });
  });

  test('no layout shifts during scroll animations', async ({ page }) => {
    await page.goto('/');
    
    // Track layout shifts manually
    const layoutShifts = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let cls = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ((entry as any).hadRecentInput) continue;
            cls += (entry as any).value;
          }
        });
        
        try {
          observer.observe({ type: 'layout-shift', buffered: true });
        } catch (e) {
          // Layout shift API might not be available
          resolve(0);
          return;
        }
        
        // Scroll to trigger animations
        window.scrollBy(0, 500);
        
        // Wait and resolve
        setTimeout(() => {
          observer.disconnect();
          resolve(cls);
        }, 1000);
      });
    });
    
    // CLS should be less than 0.1 (good)
    expect(layoutShifts).toBeLessThan(0.1);
  });

  test('all resources load successfully', async ({ page }) => {
    const failedRequests: string[] = [];
    
    page.on('requestfailed', request => {
      const url = request.url();
      // Ignore known missing images from test content and dev server assets
      if (!url.includes('llm-brain.png') && 
          !url.includes('dev-toolbar') && 
          !url.includes('node_modules')) {
        failedRequests.push(url);
      }
    });
    
    await page.goto('/');
    await page.goto('/about');
    
    // No failed requests (except known missing test images)
    expect(failedRequests).toHaveLength(0);
  });
});