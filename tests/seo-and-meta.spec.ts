import { test, expect } from '@playwright/test';

test.describe('SEO and Meta Tags', () => {
  
  test('Homepage has correct SEO meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check basic meta tags
    await expect(page).toHaveTitle('kilowhat!? - kilowhat!?');
    
    // Check Open Graph tags
    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute('content', 'website');
    
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', 'kilowhat!? - kilowhat!?');
    
    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute('content', 'A minimal typography-focused blog exploring tech, life, and the absurdities in between.');
    
    const ogSiteName = page.locator('meta[property="og:site_name"]');
    await expect(ogSiteName).toHaveAttribute('content', 'kilowhat!?');
    
    // Check Twitter Card tags
    const twitterCard = page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toHaveAttribute('content', 'summary_large_image');
    
    const twitterTitle = page.locator('meta[name="twitter:title"]');
    await expect(twitterTitle).toHaveAttribute('content', 'kilowhat!? - kilowhat!?');
    
    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://kilowhat.buzz/');
  });

  test('Blog post has correct article SEO meta tags', async ({ page }) => {
    await page.goto('/blog/011-imposter');
    
    // Check Open Graph type is article
    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute('content', 'article');
    
    // Check article has proper title
    await expect(page).toHaveTitle(/Reality Check.*kilowhat/);
    
    // Check canonical URL for blog post
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://kilowhat.buzz/blog/011-imposter');
  });

  test('About page has correct meta tags', async ({ page }) => {
    await page.goto('/about');
    
    await expect(page).toHaveTitle(/About.*kilowhat/);
    
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://kilowhat.buzz/about');
  });
});