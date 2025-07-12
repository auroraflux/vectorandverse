import { test, expect } from '@playwright/test';

test.describe('Picture Element Fallback Test', () => {
  test('Picture elements should fallback to img src when source fails', async ({ page }) => {
    await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
    
    // Test the profile picture element
    const profilePicture = page.locator('picture').filter({ has: page.locator('img[alt*="Harsha"]') });
    
    // Get the source and img elements
    const sourceElement = profilePicture.locator('source');
    const imgElement = profilePicture.locator('img');
    
    // Check attributes
    const sourceSrcset = await sourceElement.getAttribute('srcset');
    const imgSrc = await imgElement.getAttribute('src');
    
    console.log('Profile Picture:');
    console.log('  Source srcset:', sourceSrcset);
    console.log('  Img src:', imgSrc);
    
    // Check if the image actually loaded
    const imgLoaded = await imgElement.evaluate((img: HTMLImageElement) => {
      return {
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        currentSrc: img.currentSrc,
        src: img.src
      };
    });
    
    console.log('  Image loading state:', imgLoaded);
    
    // The issue: currentSrc should fall back to the img src when source fails
    // But sometimes browsers don't handle this correctly
    
    // Test blog post hero images
    const blogPictures = await page.locator('article picture').all();
    console.log('\nBlog Post Hero Images:');
    
    for (let i = 0; i < Math.min(3, blogPictures.length); i++) {
      const picture = blogPictures[i];
      const source = picture.locator('source');
      const img = picture.locator('img');
      
      const sourceSrcset = await source.getAttribute('srcset');
      const imgSrc = await img.getAttribute('src');
      
      console.log(`\n  Blog ${i + 1}:`);
      console.log('    Source srcset:', sourceSrcset);
      console.log('    Img src:', imgSrc);
      
      const loadState = await img.evaluate((img: HTMLImageElement) => {
        return {
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          currentSrc: img.currentSrc
        };
      });
      
      console.log('    Loading state:', loadState);
    }
    
    // Additional test: Check if removing source makes images work
    console.log('\n--- Testing Source Removal Fix ---');
    
    // Remove all source elements to force img fallback
    await page.evaluate(() => {
      document.querySelectorAll('picture source').forEach(source => source.remove());
    });
    
    // Wait a bit for images to reload
    await page.waitForTimeout(1000);
    
    // Check if images load after source removal
    const profileImgAfterFix = await imgElement.evaluate((img: HTMLImageElement) => {
      return {
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        currentSrc: img.currentSrc
      };
    });
    
    console.log('\nProfile image after removing source:', profileImgAfterFix);
    
    // Verify fix worked
    expect(profileImgAfterFix.naturalWidth).toBeGreaterThan(0);
    expect(profileImgAfterFix.naturalHeight).toBeGreaterThan(0);
  });
});