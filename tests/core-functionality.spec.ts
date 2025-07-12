import { test, expect } from '@playwright/test';
import { navigateToPage, clickAndNavigate } from './astro-test-utils';

test.describe('Core Site Functionality', () => {
  
  test('Homepage loads correctly with all essential elements', async ({ page }) => {
    await page.goto('/');
    
    // Check page loads successfully
    await expect(page).toHaveTitle(/kilowhat/);
    
    // Check main logo is present
    const logo = page.getByRole('heading', { name: /kilowhat/i }).first();
    await expect(logo).toBeVisible();
    
    // Check articles are present
    const articles = page.locator('article');
    await expect(articles).toHaveCount(16);
    
    // Check about link works
    const aboutLink = page.locator('a[href="/about"]').first();
    await expect(aboutLink).toBeVisible();
  });

  test('Navigation between pages works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to About page
    await page.click('a[href="/about"]');
    await page.waitForURL('**/about');
    
    // Look for the specific about page heading in main content (not header)
    const aboutHeading = page.locator('main h1').first();
    await expect(aboutHeading).toContainText('Zero Surveillance');
    
    // Navigate back to home via logo
    await page.click('.hero-logo-transition');
    await page.waitForURL('**/');
    await expect(page.getByRole('heading', { name: /kilowhat/i }).first()).toBeVisible();
  });

  test('Blog post navigation and content display', async ({ page }) => {
    await page.goto('/');
    
    // Click on first article
    const firstArticle = page.locator('article').first();
    await firstArticle.click();
    
    // Wait for navigation to blog post
    await expect(page).toHaveURL(/\/blog\/.+/);
    
    // Check article content loads
    const articleContent = page.locator('article#main-content');
    await expect(articleContent).toBeVisible();
    
    // Check header is present
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('404 page displays correctly', async ({ page }) => {
    await page.goto('/nonexistent-page');
    
    // Check 404 content
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    await expect(page.getByText('this page doesn\'t exist')).toBeVisible();
    
    // Check "go home" link works
    const homeLink = page.getByRole('link', { name: 'go home' });
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await page.waitForURL('**/');
  });
});