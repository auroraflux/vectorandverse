import { test, expect } from '@playwright/test';

test.describe('Baseline Tests - Navigation', () => {
  test('should navigate from home to about page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/kilowhat/);
    
    // Click About link (in the fixed position, not sticky header)
    const aboutLink = page.locator('a[href="/about"]').first();
    await expect(aboutLink).toBeVisible();
    await aboutLink.click();
    await page.waitForURL('/about');
    await expect(page.locator('main h1').first()).toContainText('Zero Surveillance');
  });

  test('should navigate from home to article and back', async ({ page }) => {
    await page.goto('/');
    
    // Get first article link
    const firstArticle = page.locator('article').first();
    const articleTitle = await firstArticle.locator('h2').textContent();
    
    // Click article
    await firstArticle.click();
    
    // Verify we're on article page by checking the header title
    await expect(page.locator('header h1.text-5xl').first()).toContainText(articleTitle!);
    
    // Click logo to go back
    await page.locator('.hero-logo-transition').first().click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Baseline Tests - Animations', () => {
  test('should display hero logo with typewriter animation', async ({ page }) => {
    await page.goto('/');
    
    // Check logo exists
    const logo = page.locator('h1.hero-logo-transition');
    await expect(logo).toBeVisible();
    
    // Check typewriter elements
    const typewriterElement = logo.locator('.typewriter-effect');
    await expect(typewriterElement).toBeVisible();
    
    // Check individual characters
    const chars = typewriterElement.locator('.char');
    await expect(chars).toHaveCount(10); // k-i-l-o-w-h-a-t-!-?
  });

  test('should have animated background gradient', async ({ page }) => {
    await page.goto('/');
    
    // Check for animated background
    const animatedBg = page.locator('.bg-gradient-animated');
    await expect(animatedBg).toBeVisible();
    
    // Check CSS animation is applied
    const animationName = await animatedBg.evaluate(el => 
      window.getComputedStyle(el).animationName
    );
    expect(animationName).toBe('gradientMove');
  });

  test('should show rotating taglines', async ({ page }) => {
    await page.goto('/');
    
    // Check tagline container
    const taglineContainer = page.locator('.animate-tagline-rotate').first();
    await expect(taglineContainer).toBeVisible();
    
    // Verify tagline text
    await expect(taglineContainer).toContainText(/snark meets optimism|tech criticism|debugging|optimism|ctrl\+alt\+believe/);
  });
});

test.describe('Baseline Tests - Performance', () => {
  test('should load homepage within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Homepage should load in under 10 seconds (accounting for dev server)
    expect(loadTime).toBeLessThan(10000);
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore Astro dev server audit errors and 404s
        if (!text.includes('audit') && 
            !text.includes('Failed to fetch') && 
            !text.includes('404')) {
          errors.push(text);
        }
      }
    });
    
    await page.goto('/');
    await page.goto('/about');
    
    // Navigate to first article
    await page.goto('/');
    await page.locator('article').first().click();
    
    expect(errors).toHaveLength(0);
  });
});

test.describe('Baseline Tests - Visual Elements', () => {
  test('should have drop shadows on all titles', async ({ page }) => {
    await page.goto('/');
    
    // Check hero logo shadow
    const heroLogo = page.locator('h1.hero-logo-transition');
    const heroShadow = await heroLogo.evaluate(el => 
      window.getComputedStyle(el).textShadow
    );
    expect(heroShadow).toContain('rgba(0, 0, 0');
    
    // Check article title shadows
    const articleTitle = page.locator('article h2').first();
    const articleShadow = await articleTitle.evaluate(el => 
      window.getComputedStyle(el).textShadow
    );
    expect(articleShadow).toContain('rgba(0, 0, 0');
  });

  test('should have proper fonts loaded', async ({ page }) => {
    await page.goto('/');
    
    // Check Satoshi font is loaded
    const fontFamily = await page.locator('body').evaluate(el => 
      window.getComputedStyle(el).fontFamily
    );
    expect(fontFamily).toContain('Satoshi');
  });
});