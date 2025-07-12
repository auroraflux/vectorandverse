#!/usr/bin/env node

import { execSync, spawn } from 'child_process';

const port = process.argv[2] || '4321';

console.log(`🚀 Starting safe dev server on port ${port}...`);

try {
  // Kill any existing process on this port
  console.log(`🔍 Checking port ${port}...`);
  execSync(`node scripts/kill-port.js ${port}`, { stdio: 'inherit' });
  
  // Small delay to ensure port is freed
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log(`✅ Port ${port} is ready`);
  console.log(`🏁 Starting astro dev on port ${port}...`);
  
  // Start astro dev
  const astroProcess = spawn('astro', ['dev', '--port', port], {
    stdio: 'inherit',
    shell: true
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down dev server...');
    astroProcess.kill('SIGTERM');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    astroProcess.kill('SIGTERM');
    process.exit(0);
  });
  
  astroProcess.on('exit', (code) => {
    console.log(`\n📡 Dev server exited with code ${code}`);
    process.exit(code || 0);
  });
  
} catch (error) {
  console.error('❌ Error starting dev server:', error.message);
  process.exit(1);
}