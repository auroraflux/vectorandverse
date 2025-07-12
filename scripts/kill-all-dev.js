#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('🔍 Claude Code: Cleaning up ALL dev servers...');
console.log('⚠️  This will kill ALL astro dev processes!');

try {
  // Find all astro dev processes
  const psOutput = execSync('ps aux | grep "astro dev" | grep -v grep', { 
    encoding: 'utf8', 
    stdio: 'pipe' 
  });
  
  if (psOutput.trim()) {
    console.log('📋 Found running astro dev processes:');
    console.log(psOutput);
    
    // Extract PIDs and kill them
    const lines = psOutput.trim().split('\n');
    let killedCount = 0;
    
    for (const line of lines) {
      const match = line.match(/^\S+\s+(\d+)/);
      if (match) {
        const pid = match[1];
        try {
          execSync(`kill -9 ${pid}`, { stdio: 'pipe' });
          console.log(`✓ Killed astro dev process ${pid}`);
          killedCount++;
        } catch (error) {
          console.log(`⚠ Process ${pid} already terminated`);
        }
      }
    }
    
    console.log(`🎯 Killed ${killedCount} astro dev processes`);
    
    // Also kill specific ports
    console.log('🔍 Cleaning up known ports...');
    for (const port of [4321, 4322, 4323, 4324, 4325]) {
      try {
        execSync(`node scripts/kill-port.js ${port}`, { stdio: 'inherit' });
      } catch (error) {
        // Ignore errors for ports not in use
      }
    }
    
  } else {
    console.log('✓ No astro dev processes found');
    
    // Still check ports
    console.log('🔍 Checking known ports...');
    for (const port of [4321, 4322]) {
      try {
        execSync(`node scripts/kill-port.js ${port}`, { stdio: 'inherit' });
      } catch (error) {
        // Ignore errors
      }
    }
  }
  
  console.log('🧹 Nuclear cleanup complete!');
  console.log('💡 Use "npm run dev" or "npm run dev:claude" to restart cleanly');
  
} catch (error) {
  if (error.status === 1) {
    console.log('✓ No astro dev processes found');
  } else {
    console.error('Error during cleanup:', error.message);
    process.exit(1);
  }
}