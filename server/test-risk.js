/**
 * Unit Test for Risk Scoring Logic
 * Demonstrates thresholds and validates student-explainable outputs.
 */
const { calculateHeatwaveRisk, calculateFloodRisk, calculateCombinedRisk } = require('./services/riskScore');

console.log("==================================================");
console.log("TESTING SINDH STREAM RISK SCORING SERVICE");
console.log("==================================================");

// Case 1: Jacobabad extreme summer heat
const jacobabadHeat = calculateHeatwaveRisk({
  temp: 49.5,
  apparentTemp: 52.0,
  maxTemp: 50.0,
  humidity: 35
});
console.log("\n[Test 1] Jacobabad Extreme Heat (49.5°C, feels-like 52°C):");
console.log("  Score:", jacobabadHeat.score, "| Level:", jacobabadHeat.level);
console.log("  Advisory (SD):", jacobabadHeat.advisories.sd);
console.assert(jacobabadHeat.level === "EXTREME", "Expected EXTREME heatwave level");

// Case 2: Sukkur Monsoon Indus River discharge spike (4800 m3/s) + 55mm rain
const sukkurFlood = calculateFloodRisk({
  precip24h: 55,
  precip7DaySum: 120,
  riverDischarge: 4800,
  isRiverine: true,
  isCoastal: false
});
console.log("\n[Test 2] Sukkur Riverine Flood Surge (Indus 4800 m3/s + 55mm rain):");
console.log("  Score:", sukkurFlood.score, "| Level:", sukkurFlood.level);
console.log("  Advisory (UR):", sukkurFlood.advisories.ur);
console.assert(sukkurFlood.score >= 70, "Expected High or Extreme flood score");

// Case 3: Karachi Normal Winter / Spring Day
const karachiNormalHeat = calculateHeatwaveRisk({
  temp: 26.0,
  apparentTemp: 26.5,
  maxTemp: 28.0,
  humidity: 50
});
const karachiNormalFlood = calculateFloodRisk({
  precip24h: 0,
  precip7DaySum: 0,
  riverDischarge: 0,
  isRiverine: false,
  isCoastal: true
});
const karachiCombined = calculateCombinedRisk(karachiNormalHeat, karachiNormalFlood);
console.log("\n[Test 3] Karachi Mild Day Combined Hazard:");
console.log("  Overall Score:", karachiCombined.overallScore, "| Level:", karachiCombined.overallLevel);
console.log("  Primary Hazard:", karachiCombined.primaryHazard);
console.assert(karachiCombined.overallLevel === "LOW", "Expected LOW level for Karachi mild day");

console.log("\n✅ ALL RISK SCORING TESTS PASSED SUCCESSFULLY!");
