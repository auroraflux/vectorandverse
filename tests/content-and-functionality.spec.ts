import { test, expect } from '@playwright/test';

test.describe('Content and Interactive Features', () => {
  
  test('Homepage displays all blog posts correctly', async ({ page }) => {
    await page.goto('/');
    
    // Should have 16 articles based on current content
    const articles = page.locator('article');
    await expect(articles).toHaveCount(16);
    
    // Each article should have a title and link
    const firstArticle = articles.first();
    await expect(firstArticle.locator('h2')).toBeVisible();
    await expect(firstArticle.locator('a')).toHaveAttribute('href', /\/blog\/.+/);
  });

  test('Blog post content renders properly', async ({ page }) => {
    await page.goto('/blog/011-imposter');
    
    // Check hero section has the article title (not the nav header)
    const heroTitle = page.locator('header[class*="h-"] h1').first();
    await expect(heroTitle).toContainText('Reality Check');
    
    // Check article content area
    const articleContent = page.locator('article#main-content .prose');
    await expect(articleContent).toBeVisible();
    
    // Check that paragraphs are present
    const paragraphs = articleContent.locator('p');
    await expect(paragraphs.first()).toBeVisible();
  });

  test('About page content displays correctly', async ({ page }) => {
    await page.goto('/about');
    
    // Check main heading in main content area (not header)
    const heading = page.locator('main h1').first();
    await expect(heading).toContainText('Zero Surveillance');
    
    // Check section headings
    await expect(page.getByRole('heading', { name: 'no ads or trackers' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'my tech stack' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'the ai question' })).toBeVisible();
    
    // Check content paragraphs
    const paragraphs = page.locator('main p');
    await expect(paragraphs.first()).toBeVisible();
  });

  test('Homepage tagline rotation functionality', async ({ page }) => {
    await page.goto('/');
    
    // Check tagline container exists
    const taglineContainer = page.locator('#tagline-container');
    await expect(taglineContainer).toBeVisible();
    
    // Wait for JavaScript to initialize taglines
    await page.waitForTimeout(2000);
    
    // Should contain some text (taglines are populated by JavaScript)
    const taglineText = await taglineContainer.textContent();
    expect(taglineText?.length).toBeGreaterThan(0);
  });

  test('Video elements in blog posts are properly configured', async ({ page }) => {
    await page.goto('/blog/011-imposter');
    
    // Find video elements
    const videos = page.locator('video');
    const videoCount = await videos.count();
    
    if (videoCount > 0) {
      const firstVideo = videos.first();
      await expect(firstVideo).toBeVisible();
      
      // Check video attributes
      await expect(firstVideo).toHaveAttribute('autoplay');
      await expect(firstVideo).toHaveAttribute('loop');
      await expect(firstVideo).toHaveAttribute('muted');
      await expect(firstVideo).toHaveAttribute('playsinline');
    }
  });

  test('Header behavior changes between pages', async ({ page }) => {
    // Test header on homepage (should have tagline)
    await page.goto('/');
    const homeHeader = page.locator('header').first();
    await expect(homeHeader).toBeVisible();
    
    // Test header on article page (should have gradient vignette)
    await page.goto('/blog/011-imposter');
    const articleHeader = page.locator('header').first();
    await expect(articleHeader).toBeVisible();
    
    // Article header should have different styling
    const gradient = page.locator('header div[style*="linear-gradient"]').first();
    await expect(gradient).toBeVisible();
  });

  test('Navigation links work correctly from all pages', async ({ page }) => {
    // Start from blog post
    await page.goto('/blog/011-imposter');
    
    // Click About link
    await page.click('a[href="/about"]');
    await page.waitForURL('/about');
    
    // Check for about page heading in main content (not header)
    const aboutHeading = page.locator('main h1').first();
    await expect(aboutHeading).toContainText('Zero Surveillance');
    
    // Click logo to go home
    await page.click('.hero-logo-transition');
    await page.waitForURL('/');
    await expect(page.getByRole('heading', { name: /kilowhat/i }).first()).toBeVisible();
  });

  test('Article dates display correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check that article cards show dates
    const firstArticle = page.locator('article').first();
    const dateElement = firstArticle.locator('div').filter({ hasText: /\d{2}[A-Z]{3}\d{4}/ });
    
    if (await dateElement.count() > 0) {
      await expect(dateElement.first()).toBeVisible();
    }
  });
});