#!/usr/bin/env node

import { execSync } from 'child_process';

const port = process.argv[2];

if (!port) {
  console.error('Usage: node kill-port.js <port>');
  process.exit(1);
}

try {
  // Find process using the port
  const lsofOutput = execSync(`lsof -ti :${port}`, { encoding: 'utf8', stdio: 'pipe' });
  
  if (lsofOutput.trim()) {
    const pids = lsofOutput.trim().split('\n');
    
    for (const pid of pids) {
      try {
        execSync(`kill -9 ${pid}`, { stdio: 'pipe' });
        console.log(`✓ Killed process ${pid} using port ${port}`);
      } catch (error) {
        // Process might already be dead
        console.log(`⚠ Process ${pid} already terminated`);
      }
    }
  } else {
    console.log(`✓ Port ${port} is free`);
  }
} catch (error) {
  // lsof returns exit code 1 when no processes found
  if (error.status === 1) {
    console.log(`✓ Port ${port} is free`);
  } else {
    console.error(`Error checking port ${port}:`, error.message);
    process.exit(1);
  }
}