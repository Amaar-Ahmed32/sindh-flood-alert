const express = require('express');
const router = express.Router();
const DistrictCache = require('../services/districtCache');

/**
 * GET /api/districts
 * Returns all cached districts with their current weather, flood risk, and heat risk.
 */
router.get('/', async (req, res) => {
  try {
    const districts = await DistrictCache.getAll();
    const lastSync = DistrictCache.getLastSyncTime();

    // Summary counts for quick dashboard badges
    const summary = {
      total: districts.length,
      extreme: districts.filter(d => d.overallRisk?.level === 'EXTREME').length,
      high: districts.filter(d => d.overallRisk?.level === 'HIGH').length,
      moderate: districts.filter(d => d.overallRisk?.level === 'MODERATE').length,
      low: districts.filter(d => d.overallRisk?.level === 'LOW').length,
      heatAlerts: districts.filter(d => d.heatRisk?.level === 'HIGH' || d.heatRisk?.level === 'EXTREME').length,
      floodAlerts: districts.filter(d => d.floodRisk?.level === 'HIGH' || d.floodRisk?.level === 'EXTREME').length
    };

    res.json({
      success: true,
      summary,
      lastSync,
      activeScenario: DistrictCache.getActiveScenario(),
      count: districts.length,
      data: districts
    });
  } catch (err) {
    console.error('[API /api/districts error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/districts/summary
 * Returns top alerts and highlights across Sindh
 */
router.get('/summary/highlights', async (req, res) => {
  try {
    const districts = await DistrictCache.getAll();
    if (districts.length === 0) {
      return res.json({ success: true, message: "No data synced yet" });
    }

    // Identify peak heatwave district
    const hottest = [...districts].sort((a, b) => b.currentWeather.temp - a.currentWeather.temp)[0];

    // Identify peak flood risk district
    const highestFlood = [...districts].sort((a, b) => b.floodRisk.score - a.floodRisk.score)[0];

    // Identify peak discharge district (Indus river)
    const highestDischarge = [...districts].sort((a, b) => (b.floodData?.riverDischargeMax || 0) - (a.floodData?.riverDischargeMax || 0))[0];

    res.json({
      success: true,
      hottestDistrict: {
        id: hottest.districtId,
        name: hottest.districtName,
        temp: hottest.currentWeather.temp,
        apparentTemp: hottest.currentWeather.apparentTemp,
        level: hottest.heatRisk.level
      },
      highestFloodRisk: {
        id: highestFlood.districtId,
        name: highestFlood.districtName,
        score: highestFlood.floodRisk.score,
        precip24h: highestFlood.floodRisk.metrics.precip24h,
        level: highestFlood.floodRisk.level
      },
      highestDischarge: {
        id: highestDischarge.districtId,
        name: highestDischarge.districtName,
        riverDischarge: highestDischarge.floodData?.riverDischargeMax || 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/districts/:id
 * Returns deep analysis for a specific district
 */
router.get('/:id', async (req, res) => {
  try {
    const district = await DistrictCache.getById(req.params.id);
    if (!district) {
      return res.status(404).json({ success: false, error: `District '${req.params.id}' not found` });
    }
    res.json({ success: true, data: district });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/districts/sync
 * Manually trigger fresh sync from Open-Meteo APIs (useful during live judging demo)
 */
router.post('/sync', async (req, res) => {
  try {
    console.log('[API] Manual sync requested by client.');
    // Trigger sync
    const result = await DistrictCache.syncAllDistricts();
    res.json({
      success: true,
      message: 'Districts synchronized with Open-Meteo APIs',
      result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/districts/scenario/:scenarioId
 * Switches between live data and competition judge demonstration scenarios:
 * 'live', 'flood_2022', 'heatwave_summer', 'cyclone_coastal'
 */
router.post('/scenario/:scenarioId', async (req, res) => {
  try {
    const { scenarioId } = req.params;
    console.log(`[API] Scenario switch requested: ${scenarioId}`);
    const result = await DistrictCache.syncAllDistricts(scenarioId);
    res.json({
      success: true,
      scenario: scenarioId,
      message: `Scenario '${scenarioId}' activated successfully`,
      result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
