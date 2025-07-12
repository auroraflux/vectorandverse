import { test, chromium } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';

test.describe('Performance Analysis', () => {
  test('Collect performance metrics and generate report', async () => {
    // Use chromium specifically for CDP features
    const browser = await chromium.launch();
    const analysisData = {
      timestamp: new Date().toISOString(),
      pages: {}
    };

    const pagesToTest = [
      { name: 'Homepage', url: 'http://localhost:4321/' },
      { name: 'Blog Post (with images)', url: 'http://localhost:4321/blog/011-imposter' },
      { name: 'Blog Post (text heavy)', url: 'http://localhost:4321/blog/012-the-beautiful-problem' },
      { name: 'About Page', url: 'http://localhost:4321/about' }
    ];

    for (const pageInfo of pagesToTest) {
      console.log(`\nAnalyzing ${pageInfo.name}...`);
      
      const context = await browser.newContext();
      const page = await context.newPage();
      
      // Collect network activity
      const resources = [];
      const resourceTimings = new Map();
      
      page.on('request', request => {
        resourceTimings.set(request.url(), { startTime: Date.now() });
      });
      
      page.on('response', response => {
        const url = response.url();
        const request = response.request();
        const timing = resourceTimings.get(url);
        
        resources.push({
          url,
          method: request.method(),
          status: response.status(),
          resourceType: request.resourceType(),
          size: response.headers()['content-length'] || 0,
          duration: timing ? Date.now() - timing.startTime : 0
        });
      });

      // Navigate and measure
      const startTime = Date.now();
      await page.goto(pageInfo.url, { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;

      // Get performance metrics using JavaScript
      const performanceData = await page.evaluate(() => {
        const timing = performance.timing;
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        // Get LCP
        let lcpValue = 0;
        const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
        if (lcpEntries.length > 0) {
          lcpValue = lcpEntries[lcpEntries.length - 1].startTime;
        }
        
        return {
          // Navigation Timing
          timing: {
            dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
            tcpConnect: timing.connectEnd - timing.connectStart,
            request: timing.responseStart - timing.requestStart,
            response: timing.responseEnd - timing.responseStart,
            domProcessing: timing.domComplete - timing.domLoading,
            domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
            loadComplete: timing.loadEventEnd - timing.navigationStart,
          },
          
          // Resource Timing
          resources: performance.getEntriesByType('resource').map(r => ({
            name: r.name,
            type: r.initiatorType,
            duration: Math.round(r.duration),
            size: r.transferSize || 0,
            protocol: r.nextHopProtocol || 'unknown'
          })),
          
          // Core Web Vitals
          webVitals: {
            fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
            lcp: lcpValue,
            cls: 0 // Would need observer for accurate CLS
          },
          
          // Memory (if available)
          memory: performance.memory ? {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
          } : null
        };
      });

      // Analyze resources by type
      const resourceAnalysis = resources.reduce((acc, resource) => {
        const type = resource.resourceType;
        if (!acc[type]) {
          acc[type] = { count: 0, totalSize: 0, totalTime: 0, urls: [] };
        }
        acc[type].count++;
        acc[type].totalSize += parseInt(resource.size) || 0;
        acc[type].totalTime += resource.duration;
        acc[type].urls.push(resource.url);
        return acc;
      }, {});

      // Check for optimization opportunities
      const optimizationChecks = await page.evaluate(() => {
        const checks = {
          renderBlocking: {
            stylesheets: [],
            scripts: []
          },
          images: {
            total: 0,
            lazyLoaded: 0,
            oversized: [],
            missingAlt: []
          },
          fonts: {
            total: 0,
            preloaded: 0
          }
        };
        
        // Check render-blocking resources
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
          if (!link.media || link.media === 'all') {
            checks.renderBlocking.stylesheets.push(link.href);
          }
        });
        
        document.querySelectorAll('script:not([async]):not([defer])').forEach(script => {
          if (script.src) {
            checks.renderBlocking.scripts.push(script.src);
          }
        });
        
        // Check images
        const images = document.querySelectorAll('img');
        checks.images.total = images.length;
        
        images.forEach(img => {
          if (img.loading === 'lazy') checks.images.lazyLoaded++;
          if (!img.alt) checks.images.missingAlt.push(img.src);
          
          // Check if image is oversized
          if (img.naturalWidth > img.clientWidth * 2 || img.naturalHeight > img.clientHeight * 2) {
            checks.images.oversized.push({
              src: img.src,
              natural: `${img.naturalWidth}x${img.naturalHeight}`,
              displayed: `${img.clientWidth}x${img.clientHeight}`
            });
          }
        });
        
        // Check fonts
        const fontLinks = document.querySelectorAll('link[rel="preload"][as="font"], link[rel="prefetch"][as="font"]');
        checks.fonts.preloaded = fontLinks.length;
        
        // Count total fonts from @font-face rules
        const styleSheets = Array.from(document.styleSheets);
        styleSheets.forEach(sheet => {
          try {
            const rules = Array.from(sheet.cssRules || []);
            rules.forEach(rule => {
              if (rule.type === CSSRule.FONT_FACE_RULE) {
                checks.fonts.total++;
              }
            });
          } catch (e) {
            // Cross-origin stylesheets
          }
        });
        
        return checks;
      });

      // Check JavaScript bundle size
      const jsBundleAnalysis = performanceData.resources
        .filter(r => r.type === 'script')
        .reduce((acc, script) => {
          acc.totalSize += script.size;
          acc.count++;
          return acc;
        }, { totalSize: 0, count: 0 });

      // Store page data
      analysisData.pages[pageInfo.name] = {
        url: pageInfo.url,
        loadTime,
        metrics: performanceData,
        resources: resourceAnalysis,
        optimizationChecks,
        jsBundleAnalysis
      };

      await context.close();
    }

    await browser.close();

    // Generate report
    const report = generatePerformanceReport(analysisData);
    
    // Save raw data
    await fs.writeFile(
      path.join(process.cwd(), 'performance-data.json'),
      JSON.stringify(analysisData, null, 2)
    );
    
    // Save report
    await fs.writeFile(
      path.join(process.cwd(), 'performance-report.md'),
      report
    );
    
    console.log('\n✅ Performance analysis complete!');
    console.log('📊 Report saved to performance-report.md');
    console.log('📈 Raw data saved to performance-data.json');
  });
});

function generatePerformanceReport(data) {
  let report = `# Performance Analysis Report
Generated: ${data.timestamp}

## Executive Summary

`;

  // Calculate averages
  const loadTimes = Object.values(data.pages).map(p => p.loadTime);
  const avgLoadTime = loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length;
  
  report += `- **Average Load Time**: ${Math.round(avgLoadTime)}ms
- **Pages Analyzed**: ${Object.keys(data.pages).length}

## Detailed Analysis

`;

  for (const [pageName, pageData] of Object.entries(data.pages)) {
    const metrics = pageData.metrics;
    const timing = metrics.timing;
    const webVitals = metrics.webVitals;
    
    report += `### ${pageName}
- **URL**: ${pageData.url}
- **Total Load Time**: ${pageData.loadTime}ms

#### Performance Metrics:
- **First Contentful Paint (FCP)**: ${Math.round(webVitals.fcp)}ms ${webVitals.fcp < 1800 ? '✅' : '⚠️'}
- **Largest Contentful Paint (LCP)**: ${Math.round(webVitals.lcp)}ms ${webVitals.lcp < 2500 ? '✅' : '⚠️'}
- **DOM Content Loaded**: ${timing.domContentLoaded}ms
- **Complete Load**: ${timing.loadComplete}ms

#### Network Performance:
- **DNS Lookup**: ${timing.dnsLookup}ms
- **TCP Connection**: ${timing.tcpConnect}ms
- **Server Response**: ${timing.response}ms

#### Resource Breakdown:
`;

    for (const [type, info] of Object.entries(pageData.resources)) {
      const sizeInKB = (info.totalSize / 1024).toFixed(1);
      report += `- **${type}**: ${info.count} files, ${sizeInKB}KB total, avg ${Math.round(info.totalTime / info.count)}ms\n`;
    }

    const checks = pageData.optimizationChecks;
    report += `
#### Optimization Opportunities:

**Render-Blocking Resources:**
- Blocking Stylesheets: ${checks.renderBlocking.stylesheets.length} ${checks.renderBlocking.stylesheets.length > 0 ? '⚠️' : '✅'}
- Blocking Scripts: ${checks.renderBlocking.scripts.length} ${checks.renderBlocking.scripts.length > 0 ? '⚠️' : '✅'}

**Images:**
- Total Images: ${checks.images.total}
- Lazy Loaded: ${checks.images.lazyLoaded}/${checks.images.total} ${checks.images.lazyLoaded < checks.images.total ? '⚠️ Consider lazy loading' : '✅'}
- Oversized Images: ${checks.images.oversized.length} ${checks.images.oversized.length > 0 ? '⚠️' : '✅'}
- Missing Alt Text: ${checks.images.missingAlt.length} ${checks.images.missingAlt.length > 0 ? '⚠️' : '✅'}

**JavaScript Bundle:**
- Total Size: ${(pageData.jsBundleAnalysis.totalSize / 1024).toFixed(1)}KB
- Number of Scripts: ${pageData.jsBundleAnalysis.count}

`;

    if (checks.images.oversized.length > 0) {
      report += `\n**Oversized Image Details:**\n`;
      checks.images.oversized.forEach(img => {
        report += `- ${img.src}\n  Natural: ${img.natural}, Displayed: ${img.displayed}\n`;
      });
    }

    if (metrics.memory) {
      const memUsed = (metrics.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
      const memTotal = (metrics.memory.totalJSHeapSize / 1024 / 1024).toFixed(1);
      report += `\n**Memory Usage:**
- JavaScript Heap: ${memUsed}MB / ${memTotal}MB
`;
    }

    report += '\n---\n\n';
  }

  // Add recommendations
  report += `## Recommendations

### High Priority Optimizations

1. **Image Optimization**
   - Implement lazy loading for all below-the-fold images
   - Resize oversized images to match display dimensions
   - Consider modern formats (WebP/AVIF) with fallbacks
   - Add missing alt text for accessibility

2. **Resource Loading**
   - Add preconnect hints for external domains
   - Consider inlining critical CSS
   - Defer non-critical JavaScript

3. **Font Loading**
   - Use font-display: swap for web fonts
   - Preload critical font files
   - Consider variable fonts to reduce file count

### Medium Priority Optimizations

1. **Caching Strategy**
   - Implement long-term caching for static assets
   - Use cache busting for updates
   - Consider service worker for offline support

2. **Bundle Optimization**
   - Analyze JavaScript bundle for unused code
   - Implement code splitting if bundles grow
   - Tree shake dependencies

3. **Performance Monitoring**
   - Set up Real User Monitoring (RUM)
   - Track Core Web Vitals over time
   - Monitor performance regressions in CI/CD

### Additional Considerations

- **Perceived Performance**: Add loading skeletons for dynamic content
- **Progressive Enhancement**: Ensure core functionality works without JavaScript
- **Network Resilience**: Handle slow/flaky connections gracefully
`;

  return report;
}