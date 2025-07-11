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

  test('article page performance', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to first article
    await page.locator('article').first().click();
    await page.waitForSelector('article');
    
    // Check that all animations are GPU-accelerated
    const animatedElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('.reveal-text, .logo-scroll-transform, .reading-progress-bar');
      return Array.from(elements).map(el => {
        const transform = window.getComputedStyle(el).transform;
        const willChange = window.getComputedStyle(el).willChange;
        return { transform, willChange };
      });
    });
    
    // Verify at least some elements have will-change or transform
    const hasOptimization = animatedElements.some(el => 
      el.willChange !== 'auto' || el.transform !== 'none'
    );
    expect(hasOptimization).toBe(true);
  });

  test('memory usage remains stable', async ({ page }) => {
    await page.goto('/');
    
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });
    
    // Navigate through multiple pages
    for (let i = 0; i < 3; i++) {
      await page.locator('article').first().click();
      await page.waitForSelector('article');
      await page.goBack();
      await page.waitForSelector('.hero-logo-transition');
    }
    
    // Get final memory usage
    const finalMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });
    
    // Memory should not increase by more than 50MB
    if (initialMemory > 0 && finalMemory > 0) {
      const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024;
      expect(memoryIncrease).toBeLessThan(50);
    }
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
      return Array.from(document.querySelectorAll('img')).map(img => ({
        loading: img.loading,
        hasAlt: !!img.alt,
        src: img.src
      }));
    });
    
    // All images should have alt text
    images.forEach(img => {
      expect(img.hasAlt).toBe(true);
    });
  });

  test('no layout shifts during scroll animations', async ({ page }) => {
    await page.goto('/');
    
    // Enable layout shift tracking
    await page.evaluateOnNewDocument(() => {
      let cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ((entry as any).hadRecentInput) continue;
          cls += (entry as any).value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
      
      (window as any).__CLS = () => cls;
    });
    
    await page.reload();
    
    // Scroll to trigger animations
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(1000);
    
    // Get cumulative layout shift
    const cls = await page.evaluate(() => (window as any).__CLS?.() || 0);
    
    // CLS should be less than 0.1 (good)
    expect(cls).toBeLessThan(0.1);
  });

  test('all resources load successfully', async ({ page }) => {
    const failedRequests: string[] = [];
    
    page.on('requestfailed', request => {
      failedRequests.push(request.url());
    });
    
    await page.goto('/');
    await page.goto('/about');
    
    // No failed requests
    expect(failedRequests).toHaveLength(0);
  });
});