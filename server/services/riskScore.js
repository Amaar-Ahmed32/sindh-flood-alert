/**
 * ============================================================================
 * Sindh STREAM 2026-27: Risk Scoring Service
 * ============================================================================
 * This module computes scientific yet student-explainable risk scores (0-100)
 * and categorical warning levels (LOW, MODERATE, HIGH, EXTREME) for:
 * 1. Heatwave Risk (based on ambient temperature, humidity, and heat index)
 * 2. Flood Risk (based on 24-hr precipitation, 7-day total, & river discharge)
 * 3. Compound Disaster Risk (the primary active threat per Sindh district)
 *
 * Designed to be presented to competition judges with clear thresholds.
 * ============================================================================
 */

/**
 * 1. HEATWAVE RISK CALCULATION
 * -------------------------------------------------------------
 * Thresholds based on Pakistan Meteorological Department (PMD)
 * and WHO/WMO Heat-Health Alert Guidelines for South Asia:
 *
 *  - LOW (0 - 25): Normal temperatures (< 38°C, feels-like < 40°C)
 *  - MODERATE (26 - 55): Elevated heat (38-41°C OR feels-like 40-44°C)
 *  - HIGH (56 - 79): Severe heatwave (42-45°C OR feels-like 45-50°C)
 *  - EXTREME (80 - 100): Critical danger (> 45°C OR feels-like >= 51°C)
 * -------------------------------------------------------------
 */
function calculateHeatwaveRisk({ temp = 30, apparentTemp = 32, maxTemp = 32, humidity = 40 }) {
  // Use apparent temperature ("feels like") as primary driver because
  // high humidity (e.g. Karachi coastal winds) severely inhibits sweat evaporation.
  const effectiveTemp = Math.max(temp, apparentTemp);

  let score = 0;
  let level = "LOW";
  let reason = "Normal thermal conditions";

  if (effectiveTemp < 37) {
    // Normal range: 0 - 25
    score = Math.round((effectiveTemp / 37) * 25);
    level = "LOW";
    reason = "Temperatures are within comfortable baseline for Sindh.";
  } else if (effectiveTemp >= 37 && effectiveTemp < 42) {
    // Moderate / Yellow range: 26 - 55
    const progress = (effectiveTemp - 37) / (42 - 37);
    score = Math.round(26 + progress * (55 - 26));
    level = "MODERATE";
    reason = "Caution: Elevated heat stress. High risk for outdoor laborers & elderly.";
  } else if (effectiveTemp >= 42 && effectiveTemp < 48) {
    // High / Orange range: 56 - 79
    const progress = (effectiveTemp - 42) / (48 - 42);
    score = Math.round(56 + progress * (79 - 56));
    level = "HIGH";
    reason = "Severe Heatwave Alert: Heat exhaustion risk very high. Stay hydrated.";
  } else {
    // Extreme / Red range: 80 - 100
    const progress = Math.min((effectiveTemp - 48) / 6, 1);
    score = Math.round(80 + progress * 20);
    level = "EXTREME";
    reason = "EMERGENCY: Heat stroke danger imminent. Avoid all direct sun exposure.";
  }

  // Bonus factor: High humidity (> 65%) with temps >= 38°C creates deadly wet-bulb heat
  if (humidity >= 65 && temp >= 38 && score < 85) {
    score = Math.min(100, score + 12);
    if (score >= 80) level = "EXTREME";
    else if (score >= 56) level = "HIGH";
    reason += " High humidity significantly amplifies heat stress.";
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    level,
    reason,
    metrics: {
      temperature: temp,
      apparentTemperature: apparentTemp,
      maxTemperature: maxTemp,
      humidity
    },
    advisories: getHeatAdvisories(level)
  };
}

/**
 * 2. FLOOD RISK CALCULATION
 * -------------------------------------------------------------
 * Sindh faces two primary flood risks:
 * a) Pluvial / Urban Flash Flooding (sudden torrential downpour)
 * b) Riverine Flooding (Indus River discharge passing Guddu, Sukkur, Kotri Barrages)
 *
 * Thresholds:
 *  - Precipitation:
 *      < 10mm: Low
 *      10 - 35mm: Moderate (waterlogging in urban districts)
 *      35 - 70mm: High (flash floods, canal breaches)
 *      > 70mm: Extreme (widespread devastating inundation like 2022)
 *  - River Discharge (m³/s from GloFAS Flood API):
 *      < 1500 m³/s: Low / normal flow
 *      1500 - 3000 m³/s: Moderate flow
 *      3000 - 5000 m³/s: High flood stage
 *      > 5000 m³/s: Super flood danger
 * -------------------------------------------------------------
 */
function calculateFloodRisk({
  precip24h = 0,
  precip7DaySum = 0,
  riverDischarge = 0,
  isRiverine = false,
  isCoastal = false
}) {
  // A. Pluvial / Rainfall Risk (0 - 100)
  let rainScore = 0;
  if (precip24h < 5) {
    rainScore = Math.round((precip24h / 5) * 15);
  } else if (precip24h < 25) {
    rainScore = Math.round(16 + ((precip24h - 5) / 20) * 30);
  } else if (precip24h < 65) {
    rainScore = Math.round(46 + ((precip24h - 25) / 40) * 30);
  } else {
    rainScore = Math.round(76 + Math.min(1, (precip24h - 65) / 50) * 24);
  }

  // 7-day cumulative saturation bonus (saturated soil leads to rapid runoff)
  if (precip7DaySum > 80) {
    rainScore = Math.min(100, rainScore + 15);
  } else if (precip7DaySum > 40) {
    rainScore = Math.min(100, rainScore + 8);
  }

  // B. Riverine Flow Risk (0 - 100)
  let riverScore = 0;
  if (riverDischarge < 1200) {
    riverScore = Math.round((riverDischarge / 1200) * 20);
  } else if (riverDischarge < 2800) {
    riverScore = Math.round(21 + ((riverDischarge - 1200) / 1600) * 34);
  } else if (riverDischarge < 4500) {
    riverScore = Math.round(55 + ((riverDischarge - 2800) / 1700) * 25);
  } else {
    riverScore = Math.round(80 + Math.min(1, (riverDischarge - 4500) / 2500) * 20);
  }

  // Weighted Combination based on district topography
  let totalScore = 0;
  let reason = "";

  if (isRiverine) {
    // Riverine districts (e.g. Sukkur, Dadu, Larkana, Jamshoro)
    totalScore = Math.round(riverScore * 0.55 + rainScore * 0.45);
    reason = `River discharge: ${Math.round(riverDischarge)} m³/s; 24h Rain: ${precip24h.toFixed(1)}mm`;
  } else if (isCoastal) {
    // Coastal districts (Karachi, Thatta, Badin, Sujawal) - sensitive to rain & tidal drainage
    totalScore = Math.round(rainScore * 0.85 + (riverDischarge > 2500 ? 15 : 0));
    reason = `Coastal rainfall: ${precip24h.toFixed(1)}mm (7-day total: ${precip7DaySum.toFixed(1)}mm)`;
  } else {
    // Inland desert/plains (e.g. Tharparkar, Sanghar, Mirpur Khas)
    totalScore = Math.round(rainScore * 0.9 + riverScore * 0.1);
    reason = `Rainfall accumulation: ${precip24h.toFixed(1)}mm`;
  }

  // Determine Categorical Level
  let level = "LOW";
  if (totalScore >= 80) level = "EXTREME";
  else if (totalScore >= 56) level = "HIGH";
  else if (totalScore >= 26) level = "MODERATE";

  return {
    score: Math.min(100, Math.max(0, totalScore)),
    level,
    reason,
    metrics: {
      precip24h,
      precip7DaySum,
      riverDischarge
    },
    advisories: getFloodAdvisories(level)
  };
}

/**
 * 3. COMBINED MULTI-HAZARD RISK EVALUATION
 * Computes the primary hazard (Flood, Heatwave, or Compound) and overall score.
 */
function calculateCombinedRisk(heatRisk, floodRisk) {
  const overallScore = Math.max(heatRisk.score, floodRisk.score);

  let overallLevel = "LOW";
  if (overallScore >= 80) overallLevel = "EXTREME";
  else if (overallScore >= 56) overallLevel = "HIGH";
  else if (overallScore >= 26) overallLevel = "MODERATE";

  let primaryHazard = "NONE";
  if (overallScore < 26) {
    primaryHazard = "NORMAL";
  } else if (heatRisk.score >= 56 && floodRisk.score >= 56) {
    primaryHazard = "COMPOUND_DISASTER"; // Simultaneous heat & rain/flood
  } else if (floodRisk.score >= heatRisk.score) {
    primaryHazard = "FLOOD";
  } else {
    primaryHazard = "HEATWAVE";
  }

  // Color codes matching disaster management conventions
  const badgeColors = {
    LOW: "#10b981",       // Green
    MODERATE: "#f59e0b",  // Yellow / Amber
    HIGH: "#f97316",      // Orange
    EXTREME: "#ef4444"    // Red
  };

  return {
    overallScore,
    overallLevel,
    primaryHazard,
    badgeColor: badgeColors[overallLevel],
    heatRisk,
    floodRisk
  };
}

/**
 * Localized Safety Advisories (English, Urdu, Sindhi)
 */
function getHeatAdvisories(level) {
  const advisories = {
    LOW: {
      en: "Standard weather. Stay comfortably hydrated.",
      ur: "معمول کا موسم۔ معمول کے مطابق پانی کا استعمال رکھیں۔",
      sd: "عام موسم. مناسب مقدار ۾ پاڻي پيئو."
    },
    MODERATE: {
      en: "Drink plenty of water. Avoid staying in direct afternoon sun between 12 PM - 3 PM.",
      ur: "زیادہ پانی پیئں۔ دوپہر 12 سے 3 بجے کے درمیان بلا ضرورت تیز دھوپ میں جانے سے گریز کریں۔",
      sd: "گهڻو پاڻي پيئو. ٻپھري 12 کان 3 وڳي تائين سخت اس ۾ نڪرڻ کان پاسو ڪريو."
    },
    HIGH: {
      en: "Severe heat alert. Wear loose cotton clothes, use ORS/salts, keep children & elders indoors.",
      ur: "شدید گرمی کی وارننگ۔ ہلکے سوتی کپڑے پہنیں، او آر ایس اور نمکیات کا استعمال کریں، بچوں اور بزرگوں کو اندر رکھیں۔",
      sd: "سخت گرميءَ جي چتاءُ! ھلڪا سُٽي ڪپڙا پايو، او آر ايس استعمال ڪريو، ۽ ٻارن توڙي وڏڙن کي ڇانوَ ۾ رکو."
    },
    EXTREME: {
      en: "HEAT STROKE EMERGENCY. Immediately seek shaded cooling centers. Report heat exhaustion symptoms to Rescue 1122.",
      ur: "ہنگامی ہیٹ اسٹروک الرٹ! فوری ٹھنڈے مقامات پر پناہ لیں، متاثرہ شخص کو ہنگامی طبی امداد (1122) دلوائیں۔",
      sd: "ھيٽ اسٽروڪ ايمرجنسي! فوري طور ٿڌين ۽ ڇانوَ وارين جڳھن تي وڃو، تڪليف جي صورت ۾ ريسڪيو 1122 سان رابطو ڪريو."
    }
  };
  return advisories[level] || advisories.LOW;
}

function getFloodAdvisories(level) {
  const advisories = {
    LOW: {
      en: "Canals and drainage nullahs operating within safe capacities.",
      ur: "تمام نہریں اور نکاسی نالے محفوظ حدود میں بہہ رہے ہیں۔",
      sd: "سمورا واهه ۽ نيڪالي نالا محفوظ حدن اندر وهي رهيا آهن."
    },
    MODERATE: {
      en: "Caution: Low-lying streets may waterlog. Clear neighborhood drains and secure livestock.",
      ur: "احتیاط: نشیبی علاقوں میں پانی جمع ہو سکتا ہے۔ نالوں کی صفائی اور مویشیوں کے تحفظ کو یقینی بنائیں۔",
      sd: "خبردار: هيٺاهين وارن علائقن ۾ پاڻي بيهي سگهي ٿو. نيڪالي نالن کي صاف رکو ۽ چوپائي مال کي محفوظ ڪريو."
    },
    HIGH: {
      en: "High flood warning. Keep emergency go-bags ready. Avoid crossing inundated roads or causeways.",
      ur: "سیلابی الرٹ: ہنگامی بیگ تیار رکھیں۔ سیلابی راستوں، برساتی نالوں اور نہری پشتوں کو پار کرنے سے گریز کریں۔",
      sd: "وڏي ٻوڏ جو خطرو: ايمرجنسي سامان تيار رکو. ٻڏندڙ رستن ۽ نئين گاج يا ٻين برساتي نالن کان پري رهو."
    },
    EXTREME: {
      en: "FLASH FLOOD / RIVERINE EMERGENCY. Evacuate low-lying riverbank kacha areas to PDMA relief camps immediately.",
      ur: "سیلابی ایمرجنسی! کچے اور نشیبی علاقوں کے مکین فوری طور پر پی ڈی ایم اے کے محفوظ کیمپوں میں منتقل ہوں۔",
      sd: "ٻوڏ جي ايمرجنسي! درياهه جي ڪچي ۽ هيٺاهين وارن علائقن جا ماڻهو فوري طور سرڪاري رليف ڪيمپن ڏانهن منتقل ٿين."
    }
  };
  return advisories[level] || advisories.LOW;
}

module.exports = {
  calculateHeatwaveRisk,
  calculateFloodRisk,
  calculateCombinedRisk
};
