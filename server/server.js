/**
 * ============================================================================
 * Sindh STREAM 2026-27: Flood & Heatwave Early Warning System (Backend Server)
 * ============================================================================
 * Express + Mongoose backend serving:
 * - Real-time disaster risk scoring per Sindh district
 * - Integration with Open-Meteo Weather Forecast & GloFAS Flood APIs
 * - Scheduled background caching with node-cron
 * - Multilingual advisory delivery (English, Urdu, Sindhi)
 * ============================================================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const districtRoutes = require('./routes/districtRoutes');
const { initCronJobs } = require('./services/cronJob');
const DistrictCache = require('./services/districtCache');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl) or any localhost port
    if (!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Allow all dev origins cleanly
  },
  credentials: true
}));
app.use(express.json());

// Request logging for students to observe API interactions in console
app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`);
  next();
});

// API Routes
app.use('/api/districts', districtRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'Sindh STREAM 2026-27 Flood & Heatwave Warning System',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; padding: 2rem; max-width: 600px; margin: auto; text-align: center;">
      <h1 style="color: #0284c7;">🌊 Sindh STREAM 2026-27</h1>
      <h2>Flood & Heatwave Early Warning API Server</h2>
      <p>Backend is operational. Access endpoints:</p>
      <ul style="list-style: none; padding: 0;">
        <li style="margin: 0.5rem 0;"><a href="/api/health" style="color: #0284c7;">/api/health</a> - Server status</li>
        <li style="margin: 0.5rem 0;"><a href="/api/districts" style="color: #0284c7;">/api/districts</a> - District risk scores</li>
        <li style="margin: 0.5rem 0;"><a href="/api/districts/summary/highlights" style="color: #0284c7;">/api/districts/summary/highlights</a> - Top disaster alerts</li>
      </ul>
    </div>
  `);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err);
  res.status(500).json({ success: false, error: 'Internal Server Error', details: err.message });
});

// Start the server
async function startServer() {
  // 1. Connect to MongoDB (or enable resilient in-memory fallback)
  await connectDB();

  // 2. Start Express listener
  const server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🌊 Sindh STREAM 2026-27 Server Running on Port ${PORT}`);
    console.log(`🚀 API Base URL: http://localhost:${PORT}/api/districts`);
    console.log(`=======================================================`);

    // 3. Initialize background sync cron jobs
    initCronJobs();

    // 4. Initial async sync on startup so cache is populated
    console.log('[Startup] Initiating startup data sync for Sindh districts...');
    DistrictCache.syncAllDistricts().catch(err => {
      console.warn('[Startup Sync Warning]:', err.message);
    });
  });

  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
