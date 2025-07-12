import { test, expect, Page } from '@playwright/test';

// Global arrays to store findings
const networkErrors: { url: string; status: number; resourceType: string; pageUrl: string }[] = [];
const consoleErrors: { type: string; message: string; pageUrl: string }[] = [];
const imageIssues: { 
  pageUrl: string; 
  selector: string; 
  src: string; 
  loaded: boolean; 
  naturalWidth?: number; 
  naturalHeight?: number; 
  type: 'CDN' | 'Local' | 'Relative' | 'Unknown';
  issue?: string;
}[] = [];

// Helper to categorize image sources
function categorizeImageSrc(src: string | null): 'CDN' | 'Local' | 'Relative' | 'Unknown' {
  if (!src) return 'Unknown';
  
  // CDN patterns (from the working image in the codebase)
  if (src.includes('images.unsplash.com') || 
      src.includes('cdn.') || 
      src.startsWith('http://') || 
      src.startsWith('https://') ||
      src.startsWith('//')) {
    return 'CDN';
  }
  
  // Relative paths
  if (src.startsWith('/') && !src.startsWith('//')) {
    return 'Local';
  }
  
  // Relative without leading slash
  if (!src.includes('://')) {
    return 'Relative';
  }
  
  return 'Unknown';
}

test.describe('Image Loading Inspection', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();

    // Capture failed network requests
    page.on('response', async response => {
      if (response.status() >= 400) {
        const request = response.request();
        networkErrors.push({
          url: response.url(),
          status: response.status(),
          resourceType: request.resourceType(),
          pageUrl: page.url()
        });
        console.error(`[Network Error] ${response.status()} - ${request.resourceType()}: ${response.url()}`);
      }
    });

    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const error = {
          type: msg.type(),
          message: msg.text(),
          pageUrl: page.url()
        };
        consoleErrors.push(error);
        console.error(`[Console Error] ${msg.text()} on ${page.url()}`);
      }
    });

    // Also log warnings that might be related to images
    page.on('console', msg => {
      if (msg.type() === 'warning' && msg.text().toLowerCase().includes('image')) {
        console.warn(`[Console Warning] ${msg.text()} on ${page.url()}`);
      }
    });
  });

  async function inspectImage(imageElement: any, pageUrl: string, selector: string, description: string) {
    const src = await imageElement.getAttribute('src');
    const alt = await imageElement.getAttribute('alt');
    
    // Get image dimensions to check if loaded
    const dimensions = await imageElement.evaluate((img: HTMLImageElement) => ({
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      displayWidth: img.width,
      displayHeight: img.height,
      complete: img.complete
    }));
    
    const loaded = dimensions.naturalWidth > 0 && dimensions.naturalHeight > 0;
    const type = categorizeImageSrc(src);
    
    // Check for common issues
    let issue: string | undefined;
    if (!src) {
      issue = 'No src attribute';
    } else if (!loaded) {
      issue = 'Failed to load (0x0 dimensions)';
    } else if (src.includes('undefined') || src.includes('null')) {
      issue = 'Invalid path (contains undefined/null)';
    }
    
    const imageInfo = {
      pageUrl,
      selector,
      src: src || 'N/A',
      loaded,
      naturalWidth: dimensions.naturalWidth,
      naturalHeight: dimensions.naturalHeight,
      type,
      issue
    };
    
    imageIssues.push(imageInfo);
    
    // Log findings
    if (!loaded || issue) {
      console.error(`[BROKEN IMAGE] ${description}`);
      console.error(`  Page: ${pageUrl}`);
      console.error(`  Selector: ${selector}`);
      console.error(`  Src: ${src}`);
      console.error(`  Alt: ${alt || 'No alt text'}`);
      console.error(`  Type: ${type}`);
      console.error(`  Issue: ${issue || 'Unknown'}`);
      console.error(`  Dimensions: ${dimensions.naturalWidth}x${dimensions.naturalHeight}`);
      console.error(`  Display: ${dimensions.displayWidth}x${dimensions.displayHeight}`);
      console.error(`  Complete: ${dimensions.complete}`);
    } else {
      console.log(`[OK] ${description}: ${src} (${type}, ${dimensions.naturalWidth}x${dimensions.naturalHeight})`);
    }
  }

  test('Inspect homepage profile image', async () => {
    await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
    
    // The profile image should be in the hero section
    const profileImageSelectors = [
      '.profile-pic img',
      '.hero-section img',
      'img[alt*="profile"]',
      'img[alt*="Harsha"]',
      'section img' // Fallback to any image in a section
    ];
    
    let found = false;
    for (const selector of profileImageSelectors) {
      const images = page.locator(selector);
      const count = await images.count();
      
      if (count > 0) {
        console.log(`Found ${count} image(s) with selector: ${selector}`);
        for (let i = 0; i < count; i++) {
          await inspectImage(
            images.nth(i), 
            page.url(), 
            selector,
            `Homepage profile image (${selector})`
          );
        }
        found = true;
      }
    }
    
    if (!found) {
      console.error('[ERROR] No profile image found on homepage');
      imageIssues.push({
        pageUrl: page.url(),
        selector: 'Various profile selectors',
        src: 'N/A',
        loaded: false,
        type: 'Unknown',
        issue: 'No profile image element found'
      });
    }
  });

  test('Inspect blog post hero images', async () => {
    // First, get list of blog posts from homepage
    await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
    
    // Collect blog post links
    const blogLinks = await page.locator('article a, .blog-post a, a[href^="/blog/"]').all();
    const uniqueUrls = new Set<string>();
    
    for (const link of blogLinks) {
      const href = await link.getAttribute('href');
      if (href && href.startsWith('/blog/') && !href.endsWith('/blog/')) {
        uniqueUrls.add(href);
      }
    }
    
    console.log(`Found ${uniqueUrls.size} blog posts to inspect`);
    
    // Limit to first 5 posts for efficiency
    const postsToCheck = Array.from(uniqueUrls).slice(0, 5);
    
    for (const postPath of postsToCheck) {
      const postUrl = `http://localhost:4321${postPath}`;
      console.log(`\nInspecting blog post: ${postUrl}`);
      
      await page.goto(postUrl, { waitUntil: 'networkidle' });
      
      // Multiple selectors for hero images based on common patterns
      const heroImageSelectors = [
        '.hero-image img',
        '.post-hero img',
        'img.hero',
        'article > img:first-child',
        'main > img:first-child',
        '.blog-post-content img:first-child',
        'img[alt*="hero"]',
        // Generic but might catch hero images
        'article img',
        'main img'
      ];
      
      let found = false;
      for (const selector of heroImageSelectors) {
        const images = page.locator(selector);
        const count = await images.count();
        
        if (count > 0) {
          // For generic selectors, only check the first image
          const checkCount = selector.includes('article img') || selector.includes('main img') ? 1 : count;
          
          for (let i = 0; i < checkCount; i++) {
            const imgElement = images.nth(i);
            
            // Check if this might be a hero image based on size/position
            const isLikelyHero = await imgElement.evaluate((img: HTMLImageElement) => {
              const rect = img.getBoundingClientRect();
              // Hero images are typically large and near the top
              return rect.width > 300 && rect.top < 500;
            });
            
            if (isLikelyHero || !selector.includes('img')) {
              await inspectImage(
                imgElement,
                postUrl,
                selector,
                `Blog hero image on ${postPath}`
              );
              found = true;
              break; // Only need one hero image per post
            }
          }
        }
        
        if (found) break;
      }
      
      if (!found) {
        console.error(`[WARNING] No hero image found on blog post: ${postUrl}`);
      }
    }
  });

  test.afterAll(async () => {
    console.log('\n' + '='.repeat(80));
    console.log('IMAGE INSPECTION SUMMARY REPORT');
    console.log('='.repeat(80));
    
    // Group issues by type
    const brokenImages = imageIssues.filter(img => !img.loaded || img.issue);
    const workingImages = imageIssues.filter(img => img.loaded && !img.issue);
    
    console.log(`\nTotal images inspected: ${imageIssues.length}`);
    console.log(`Working images: ${workingImages.length}`);
    console.log(`Broken images: ${brokenImages.length}`);
    
    if (brokenImages.length > 0) {
      console.log('\n--- BROKEN IMAGES BY TYPE ---');
      
      const brokenByType = {
        CDN: brokenImages.filter(img => img.type === 'CDN'),
        Local: brokenImages.filter(img => img.type === 'Local'),
        Relative: brokenImages.filter(img => img.type === 'Relative'),
        Unknown: brokenImages.filter(img => img.type === 'Unknown')
      };
      
      for (const [type, images] of Object.entries(brokenByType)) {
        if (images.length > 0) {
          console.log(`\n${type} Images (${images.length}):`);
          images.forEach(img => {
            console.log(`  - ${img.pageUrl}`);
            console.log(`    Src: ${img.src}`);
            console.log(`    Issue: ${img.issue || 'Failed to load'}`);
          });
        }
      }
    }
    
    if (workingImages.length > 0) {
      console.log('\n--- WORKING IMAGES ---');
      const workingByType = {
        CDN: workingImages.filter(img => img.type === 'CDN'),
        Local: workingImages.filter(img => img.type === 'Local')
      };
      
      for (const [type, images] of Object.entries(workingByType)) {
        if (images.length > 0) {
          console.log(`\n${type} Images (${images.length}):`);
          images.forEach(img => {
            console.log(`  - ${img.src} (${img.naturalWidth}x${img.naturalHeight})`);
          });
        }
      }
    }
    
    if (networkErrors.length > 0) {
      console.log(`\n--- NETWORK ERRORS (${networkErrors.length}) ---`);
      const imageErrors = networkErrors.filter(err => err.resourceType === 'image');
      const otherErrors = networkErrors.filter(err => err.resourceType !== 'image');
      
      if (imageErrors.length > 0) {
        console.log(`\nImage Request Failures (${imageErrors.length}):`);
        imageErrors.forEach(err => {
          console.log(`  - ${err.status}: ${err.url}`);
          console.log(`    On page: ${err.pageUrl}`);
        });
      }
      
      if (otherErrors.length > 0) {
        console.log(`\nOther Request Failures (${otherErrors.length}):`);
        otherErrors.slice(0, 5).forEach(err => {
          console.log(`  - ${err.status} ${err.resourceType}: ${err.url}`);
        });
        if (otherErrors.length > 5) {
          console.log(`  ... and ${otherErrors.length - 5} more`);
        }
      }
    }
    
    if (consoleErrors.length > 0) {
      console.log(`\n--- CONSOLE ERRORS (${consoleErrors.length}) ---`);
      consoleErrors.slice(0, 10).forEach(err => {
        console.log(`  - ${err.message}`);
        console.log(`    On page: ${err.pageUrl}`);
      });
      if (consoleErrors.length > 10) {
        console.log(`  ... and ${consoleErrors.length - 10} more`);
      }
    }
    
    // Final analysis
    console.log('\n--- ANALYSIS ---');
    if (brokenImages.length > 0) {
      const localBroken = brokenImages.filter(img => img.type === 'Local' || img.type === 'Relative');
      const cdnBroken = brokenImages.filter(img => img.type === 'CDN');
      
      if (localBroken.length > 0 && cdnBroken.length === 0) {
        console.log('✗ Issue: Local/relative path images are broken while CDN images work');
        console.log('  Likely cause: Incorrect path resolution or missing image files');
        
        // Analyze paths
        const paths = localBroken.map(img => img.src);
        if (paths.some(p => p.includes('/public/'))) {
          console.log('  ⚠️  Found "/public/" in paths - this is usually wrong in production');
        }
        if (paths.some(p => p.includes('undefined') || p.includes('null'))) {
          console.log('  ⚠️  Found "undefined" or "null" in paths - variable resolution issue');
        }
      }
    } else {
      console.log('✓ All inspected images loaded successfully');
    }
    
    console.log('\n' + '='.repeat(80));
  });
});