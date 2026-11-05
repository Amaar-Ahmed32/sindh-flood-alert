const cron = require('node-cron');
const DistrictCache = require('./districtCache');

/**
 * Sets up scheduled background jobs using node-cron.
 * Caches fresh forecast and flood risk metrics for all Sindh districts.
 */
function initCronJobs() {
  // Default: Run every 30 minutes (configurable via SYNC_CRON_SCHEDULE in .env)
  const schedule = process.env.SYNC_CRON_SCHEDULE || '*/30 * * * *';

  console.log(`[Cron] Initializing sync job with schedule: "${schedule}"`);

  const job = cron.schedule(schedule, async () => {
    console.log(`[Cron] 🕒 Triggering scheduled weather and flood risk update: ${new Date().toISOString()}`);
    try {
      await DistrictCache.syncAllDistricts();
    } catch (err) {
      console.error('[Cron] ❌ Scheduled sync error:', err.message);
    }
  });

  return job;
}

module.exports = { initCronJobs };
