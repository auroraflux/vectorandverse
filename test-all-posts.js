#!/usr/bin/env node

import { chromium } from 'playwright';

const posts = [
  '001s25-ultra',
  '002-joyless',
  '003-grind-is-gamble', 
  '004-lucid-audio-ama',
  '005-llm-pt1',
  '006-deepseek',
  '007-mac-mini-hope-and-cope',
  '008-llm-context-pt1',
  '009-llm-context-pt2',
  '010-llm-context-pt3',
  '011-imposter'
];

async function testAllPosts() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('Testing all blog posts...\n');
  
  for (const slug of posts) {
    try {
      console.log(`Testing: ${slug}`);
      await page.goto(`http://localhost:4321/blog/${slug}`, { 
        waitUntil: 'domcontentloaded',
        timeout: 10000 
      });
      
      // Check if page loaded without error
      const title = await page.title();
      if (title.includes('404') || title.includes('Error') || title === 'MDXError') {
        console.log(`  ❌ Error: ${title}`);
      } else {
        console.log(`  ✅ Success: ${title}`);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.log(`  ❌ Failed to load: ${error.message}`);
    }
  }
  
  await browser.close();
  console.log('\nTest complete!');
}

testAllPosts().catch(console.error);