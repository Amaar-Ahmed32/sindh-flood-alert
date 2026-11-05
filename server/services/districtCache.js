const DistrictRisk = require('../models/DistrictRisk');
const { SINDH_DISTRICTS } = require('../data/districts');
const MeteoService = require('./meteoService');
const { dbState } = require('../config/db');

// Pre-seed in-memory cache with valid baseline data so API never returns empty while initial sync runs
function generateBaselineSeeds() {
  const { calculateHeatwaveRisk, calculateFloodRisk, calculateCombinedRisk } = require('./riskScore');
  return SINDH_DISTRICTS.map((district) => {
    const temp = district.division === 'Larkana' ? 36.5 : district.division === 'Karachi' ? 31.0 : 33.0;
    const apparentTemp = district.isCoastal ? temp + 4.0 : temp + 2.0;
    const precip24h = 0;
    const riverDischarge = district.isRiverine ? 2400 : 0;
    
    const heatRisk = calculateHeatwaveRisk({ temp, apparentTemp, maxTemp: temp + 2, humidity: district.isCoastal ? 65 : 45 });
    const floodRisk = calculateFloodRisk({ precip24h, precip7DaySum: 0, riverDischarge, isRiverine: district.isRiverine, isCoastal: district.isCoastal });
    const combined = calculateCombinedRisk(heatRisk, floodRisk);

    const today = new Date();
    const dailyDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      return d.toISOString().split('T')[0];
    });

    return {
      districtId: district.id,
      districtName: district.name,
      division: district.division,
      coordinates: { lat: district.lat, lon: district.lon },
      geographicAttributes: {
        isRiverine: district.isRiverine,
        isCoastal: district.isCoastal,
        drainageType: district.drainageType
      },
      currentWeather: {
        temp,
        apparentTemp,
        humidity: district.isCoastal ? 65 : 45,
        windSpeed: 11,
        weatherCode: 0
      },
      forecast: {
        maxTemp: temp + 2,
        minTemp: temp - 8,
        precipSum: 0,
        precipProbMax: 5,
        dailyDates,
        dailyMaxTemps: [temp, temp + 1, temp + 1, temp, temp - 1, temp, temp + 1],
        dailyPrecipSum: [0, 0, 0, 0, 0, 0, 0],
        dailyDischargeMax: [riverDischarge, riverDischarge, riverDischarge, riverDischarge, riverDischarge, riverDischarge, riverDischarge]
      },
      floodData: {
        riverDischarge,
        riverDischargeMax: riverDischarge,
        riverDischargeMean: riverDischarge
      },
      heatRisk,
      floodRisk,
      overallRisk: {
        score: combined.overallScore,
        level: combined.overallLevel,
        primaryHazard: combined.primaryHazard,
        badgeColor: combined.badgeColor
      },
      lastUpdated: new Date()
    };
  });
}

// In-memory cache holding all current district evaluations
let memoryCache = generateBaselineSeeds();
let isSyncing = false;
let lastSyncTimestamp = new Date();
let activeScenario = 'live';

class DistrictCache {
  /**
   * Fetches fresh weather + flood data for all Sindh districts
   * and caches the results in MongoDB and memory.
   * Supports 'live', 'flood_2022', 'heatwave_summer', 'cyclone_coastal'.
   */
  static async syncAllDistricts(scenario = 'live') {
    if (isSyncing) {
      console.log("[Sync] Sync already in progress, skipping concurrent run.");
      return { status: "in_progress", count: memoryCache.length, scenario: activeScenario };
    }

    isSyncing = true;
    activeScenario = scenario;
    console.log(`[Sync] Starting sync for ${SINDH_DISTRICTS.length} Sindh districts (Scenario: ${scenario})...`);
    const results = [];

    if (scenario !== 'live') {
      // Instant scenario evaluation for judging demonstrations
      for (const district of SINDH_DISTRICTS) {
        const evaluatedData = await MeteoService.evaluateDistrictData(district, scenario);
        results.push(evaluatedData);
      }
    } else {
      // Live Open-Meteo Query in batches of 5 to respect rate limits
      const batchSize = 5;
      for (let i = 0; i < SINDH_DISTRICTS.length; i += batchSize) {
        const batch = SINDH_DISTRICTS.slice(i, i + batchSize);
        const batchPromises = batch.map(async (district) => {
          try {
            const evaluatedData = await MeteoService.evaluateDistrictData(district, 'live');

            if (dbState.isConnected) {
              try {
                await DistrictRisk.findOneAndUpdate(
                  { districtId: district.id },
                  evaluatedData,
                  { upsert: true, new: true, setDefaultsOnInsert: true }
                );
              } catch (dbErr) {
                console.warn(`[DB Cache Warning for ${district.id}]:`, dbErr.message);
              }
            }

            return evaluatedData;
          } catch (err) {
            console.error(`[Sync Error on ${district.id}]:`, err.message);
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults.filter(Boolean));

        if (i + batchSize < SINDH_DISTRICTS.length) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }
    }

    if (results.length > 0) {
      memoryCache = results;
      lastSyncTimestamp = new Date();
      console.log(`[Sync] ✅ Successfully updated ${results.length} districts in cache for scenario: ${scenario}!`);
    }

    isSyncing = false;
    return {
      status: "completed",
      count: results.length,
      scenario: activeScenario,
      timestamp: lastSyncTimestamp
    };
  }

  static getActiveScenario() {
    return activeScenario;
  }

  /**
   * Returns all districts from MongoDB (or memoryCache)
   */
  static async getAll() {
    if (dbState.isConnected) {
      try {
        const fromDb = await DistrictRisk.find({}).sort({ 'overallRisk.score': -1 });
        if (fromDb && fromDb.length > 0) {
          return fromDb;
        }
      } catch (err) {
        console.warn("[Cache Read Warning]:", err.message);
      }
    }

    // Return in-memory cache sorted by risk descending
    return [...memoryCache].sort((a, b) => b.overallRisk.score - a.overallRisk.score);
  }

  /**
   * Returns a single district by its ID
   */
  static async getById(districtId) {
    if (dbState.isConnected) {
      try {
        const doc = await DistrictRisk.findOne({ districtId });
        if (doc) return doc;
      } catch (err) {
        console.warn(`[Cache Find Warning ${districtId}]:`, err.message);
      }
    }

    return memoryCache.find(d => d.districtId === districtId) || null;
  }

  static getLastSyncTime() {
    return lastSyncTimestamp;
  }
}

module.exports = DistrictCache;
