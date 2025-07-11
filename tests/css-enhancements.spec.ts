import { test, expect } from '@playwright/test';

test.describe('CSS Enhancements - Link Animations', () => {
  test('should have animated underlines on About link', async ({ page }) => {
    await page.goto('/');
    
    const aboutLink = page.locator('a[href="/about"]').first();
    
    // Check that underline is initially hidden
    const initialWidth = await aboutLink.evaluate(el => 
      window.getComputedStyle(el, '::after').width
    );
    expect(initialWidth).toBe('0px');
    
    // Hover and check underline expands
    await aboutLink.hover();
    await page.waitForTimeout(400); // Wait for animation
    
    const hoverWidth = await aboutLink.evaluate(el => 
      window.getComputedStyle(el, '::after').width
    );
    expect(parseFloat(hoverWidth)).toBeGreaterThan(0);
  });

  test('should not have underlines on logo and article cards', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check article cards have no-underline class
    const articleCard = page.locator('article a').first();
    await expect(articleCard).toBeVisible();
    const cardClasses = await articleCard.getAttribute('class');
    expect(cardClasses).toContain('no-underline');
  });
});

test.describe('CSS Enhancements - Typewriter Cursor', () => {
  test('should show typewriter cursor on rotating taglines', async ({ page }) => {
    await page.goto('/');
    
    // Wait for typewriter script to load
    await page.waitForTimeout(500);
    
    // Check taglines have typewriter-tagline span
    const tagline = page.locator('.typewriter-tagline').first();
    await expect(tagline).toBeVisible();
    
    // Check cursor element exists
    const cursor = page.locator('.typewriter-cursor-element').first();
    await expect(cursor).toBeVisible();
    expect(await cursor.textContent()).toBe('│');
  });

  test('should show static typewriter cursor on About page', async ({ page }) => {
    await page.goto('/about');
    
    // Check final tagline has static typewriter class
    const finalTagline = page.locator('.static-typewriter').first();
    await expect(finalTagline).toBeVisible();
    
    // Check cursor is visible
    const cursorContent = await finalTagline.evaluate(el => 
      window.getComputedStyle(el, '::after').content
    );
    expect(cursorContent).toContain('│');
  });
});

test.describe('CSS Enhancements - Visual Regression', () => {
  test('should maintain visual consistency with CSS enhancements', async ({ page }) => {
    await page.goto('/');
    
    // Verify no layout shifts from new CSS
    const heroHeight = await page.locator('.hero-logo-transition').first().evaluate(el => 
      el.getBoundingClientRect().height
    );
    expect(heroHeight).toBeGreaterThan(50); // Reasonable height
    
    // Verify gradient colors are applied to link underlines
    const aboutLink = page.locator('a[href="/about"]').first();
    const gradient = await aboutLink.evaluate(el => 
      window.getComputedStyle(el, '::after').background
    );
    expect(gradient).toContain('gradient');
  });
});