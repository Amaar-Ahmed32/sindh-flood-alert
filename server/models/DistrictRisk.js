const mongoose = require('mongoose');

/**
 * DistrictRisk Mongoose Schema
 * Stores cached weather, hydrological flood discharge, and evaluated risk levels
 * for each of the 30 Sindh districts.
 */
const DistrictRiskSchema = new mongoose.Schema({
  districtId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  districtName: {
    en: { type: String, required: true },
    ur: { type: String, required: true },
    sd: { type: String, required: true }
  },
  division: {
    type: String,
    required: true
  },
  coordinates: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  geographicAttributes: {
    isRiverine: { type: Boolean, default: false },
    isCoastal: { type: Boolean, default: false },
    drainageType: { type: String }
  },
  currentWeather: {
    temp: { type: Number, default: 0 },
    apparentTemp: { type: Number, default: 0 },
    humidity: { type: Number, default: 0 },
    windSpeed: { type: Number, default: 0 },
    weatherCode: { type: Number, default: 0 }
  },
  forecast: {
    maxTemp: { type: Number, default: 0 },
    minTemp: { type: Number, default: 0 },
    precipSum: { type: Number, default: 0 },
    precipProbMax: { type: Number, default: 0 },
    dailyDates: [{ type: String }],
    dailyMaxTemps: [{ type: Number }],
    dailyPrecipSum: [{ type: Number }],
    dailyDischargeMax: [{ type: Number }]
  },
  floodData: {
    riverDischarge: { type: Number, default: 0 },
    riverDischargeMax: { type: Number, default: 0 },
    riverDischargeMean: { type: Number, default: 0 }
  },
  heatRisk: {
    score: { type: Number, default: 0 },
    level: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'EXTREME'], default: 'LOW' },
    reason: { type: String, default: '' },
    advisories: {
      en: { type: String, default: '' },
      ur: { type: String, default: '' },
      sd: { type: String, default: '' }
    }
  },
  floodRisk: {
    score: { type: Number, default: 0 },
    level: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'EXTREME'], default: 'LOW' },
    reason: { type: String, default: '' },
    advisories: {
      en: { type: String, default: '' },
      ur: { type: String, default: '' },
      sd: { type: String, default: '' }
    }
  },
  overallRisk: {
    score: { type: Number, default: 0 },
    level: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'EXTREME'], default: 'LOW' },
    primaryHazard: { type: String, default: 'NORMAL' },
    badgeColor: { type: String, default: '#10b981' }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DistrictRisk', DistrictRiskSchema);
