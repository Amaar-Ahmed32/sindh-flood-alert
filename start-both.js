/**
 * Sindh STREAM 2026-27: Development Runner
 * Starts both Express Server (port 5050) and Vite Client (port 5173) simultaneously.
 */

const { spawn } = require('child_process');
const path = require('path');

console.log("==================================================================");
console.log("🌊 Sindh STREAM 2026-27: Flood & Heatwave Early Warning Platform");
console.log("==================================================================");

// 1. Launch Backend Server
console.log("[Launcher] Starting Express backend on http://localhost:5050 ...");
const serverProcess = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

// 2. Launch Frontend Client
console.log("[Launcher] Starting Vite frontend on http://localhost:5173 ...");
const clientProcess = spawn('npx', ['vite'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

// Handle graceful termination
function shutdown() {
  console.log("\n[Launcher] Shutting down services...");
  try { serverProcess.kill(); } catch {}
  try { clientProcess.kill(); } catch {}
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
