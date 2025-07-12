/**
 * Astro Testing Utilities and Best Practices
 * 
 * IMPORTANT: Astro uses View Transitions for navigation between pages.
 * This means:
 * 1. DOMContentLoaded only fires on initial page load, not on navigation
 * 2. Use 'astro:page-load' event for scripts that need to run on every page
 * 3. When testing, navigation doesn't cause full page reloads
 * 
 * Best Practices for Astro Components:
 * - Always use 'astro:page-load' instead of 'DOMContentLoaded' for navigation-aware scripts
 * - Clean up previous instances before creating new elements
 * - Test both initial load and navigation scenarios
 * 
 * Example of proper event handling:
 * ```javascript
 * // Bad - only works on initial load
 * document.addEventListener('DOMContentLoaded', initFunction);
 * 
 * // Good - works with View Transitions
 * document.addEventListener('astro:page-load', initFunction);
 * // Also run on initial load
 * initFunction();
 * ```
 */

import type { Page } from '@playwright/test';

/**
 * Wait for Astro page transition to complete
 */
export async function waitForAstroTransition(page: Page) {
  // Wait for View Transition to complete
  await page.waitForFunction(() => {
    return !document.documentElement.classList.contains('astro-page-transitioning');
  });
  
  // Additional wait for any animations
  await page.waitForTimeout(300);
}

/**
 * Navigate to a page and wait for Astro to finish loading
 */
export async function navigateToPage(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState('domcontentloaded');
  await waitForAstroTransition(page);
}

/**
 * Click a link and wait for Astro page transition
 */
export async function clickAndNavigate(page: Page, selector: string) {
  await page.click(selector);
  await waitForAstroTransition(page);
}