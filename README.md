# 🌊 Sindh STREAM 2026-27: Flood & Heatwave Early Warning System

A full-stack MERN platform designed for disaster risk reduction across all 30 districts of Sindh, Pakistan. Built for the **Sindh STREAM 2026-27 Competition**.

---

## 🎯 Project Goal
Sindh is ground zero for extreme climate vulnerability in South Asia:
- **Catastrophic Floods:** Riverine flooding along the Indus River basin (Sukkur, Kotri, Guddu barrages) and monsoon flash floods / urban inundation (Karachi, Badin, Dadu).
- **Deadly Heatwaves:** Severe summer temperatures and dangerous wet-bulb heat indexes exceeding 50°C (Jacobabad, Larkana, Nawabshah, Sukkur).

This system provides **hyperlocal, real-time early warnings**, computes scientific risk indexes (0–100), and delivers **actionable safety advisories** in **English, Urdu, and Sindhi** with full Right-to-Left (RTL) typography.

---

 Architecture & Technology Stack

| Tier | Technology | Description |
|---|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS | High-performance, responsive disaster dashboard |
| **Mapping** | Leaflet & React-Leaflet | Color-coded spatial risk markers across Sindh |
| **Languages** | `react-i18next` & `i18next` | Instant English, Urdu (اردو), and Sindhi (سنڌي) with RTL |
| **Backend** | Node.js, Express | RESTful telemetry & scoring API |
| **Database** | MongoDB & Mongoose | Cached hydrological & meteorological documents |
| **Scheduler** | `node-cron` | Periodic background cache synchronization |
| **Data Sources**| Open-Meteo Weather & Flood APIs | Live global ECMWF & GloFAS hydrology models (No API key required) |

---

 📊 Scientific Risk Scoring Logic (`server/services/riskScore.js`)

The core scoring engine is located in `server/services/riskScore.js` and uses transparent, student-explainable thresholds.

 1. Heatwave Risk Calculation (`calculateHeatwaveRisk`)
Driven primarily by the **Heat Index (Apparent Temperature)**, which combines temperature and relative humidity (critical for coastal humidity in Karachi and dry heat in Jacobabad):

| Effective Heat Index (°C) | Risk Level | Score Range | Status & Guidance |
|---|---|---|---|
| `< 37°C` | **LOW** | 0 – 25 | Baseline normal conditions |
| `37°C – 41.9°C` | **MODERATE** | 26 – 55 | Caution: High risk for outdoor laborers & elderly |
| `42°C – 47.9°C` | **HIGH** | 56 – 79 | Severe heatwave: Stay hydrated, wear loose cotton |
| `>= 48°C` | **EXTREME** | 80 – 100 | Heat stroke emergency: Avoid all direct sun, call 1122 |

*High Humidity Multiplier:* If relative humidity exceeds 65% alongside temperatures ≥ 38°C, an additional wet-bulb penalty (+12 points) is applied.

---

 2. Flood Risk Calculation (`calculateFloodRisk`)
Accounts for both pluvial (rainfall) and riverine (Indus discharge) flooding:

- **24-Hour Precipitation Thresholds:**
  - `< 5 mm`: Low (0–15)
  - `5 – 25 mm`: Moderate waterlogging (16–45)
  - `25 – 65 mm`: High inundation & canal overflow (46–75)
  - `> 65 mm`: Devastating flash flood (76–100)
  - *7-day cumulative bonus:* If 7-day rainfall exceeds 80 mm, +15 points for saturated soil runoff.

- **Indus River Discharge Thresholds (from GloFAS Flood API):**
  - `< 1,200 m³/s`: Safe river capacity (0–20)
  - `1,200 – 2,800 m³/s`: Medium discharge (21–54)
  - `2,800 – 4,500 m³/s`: High flood stage (55–79)
  - `> 4,500 m³/s`: Super flood alert at Guddu/Sukkur/Kotri barrages (80–100)

- **Geographic Topography Weighting:**
  - **Riverine districts** (e.g., Sukkur, Larkana, Dadu, Jamshoro): 55% river discharge, 45% rainfall.
  - **Coastal districts** (e.g., Karachi, Thatta, Badin, Sujawal): 85% rainfall & tidal drain risk.
  - **Inland plain/desert districts** (e.g., Tharparkar, Sanghar): 90% localized rainfall.

---

### 3. Combined Multi-Hazard Score (`calculateCombinedRisk`)
- **Overall Score** = `Math.max(heatRisk.score, floodRisk.score)`
- **Primary Hazard:** Categorized as `HEATWAVE`, `FLOOD`, `COMPOUND_DISASTER` (both high), or `NORMAL`.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- Optional: MongoDB running locally on port 27017 or a free MongoDB Atlas connection string. *(The server features a built-in in-memory fallback so it runs out-of-the-box even without a MongoDB instance!)*

### Installation & Quick Start

1. **Clone or enter the project directory:**
   ```bash
   cd "sindh-stream-warning"
   ```

2. **Configure Environment Variables:**
   ```bash
   cd server
   cp .env.example .env
   cd ..
   ```

3. **Start Both Server & Client:**
   ```bash
   npm run dev
   ```
   - **Frontend Dashboard:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:5050/api/districts](http://localhost:5050/api/districts)
   - **Health Check:** [http://localhost:5050/api/health](http://localhost:5050/api/health)

4. **Run Risk Scoring Unit Tests:**
   ```bash
   npm run test
   ```

---

 Multilingual & RTL Implementation
- Built using `react-i18next` with JSON dictionaries for:
  - English (`en.json`) - LTR
  - Urdu (`ur.json`) - RTL with `Noto Nastaliq Urdu` typography
  - Sindhi (`sd.json`) - RTL with `Noto Sans Arabic` typography
- Dynamic `dir="rtl"` attribute injection on `<html>` when switching languages.
- Full district names, divisions, danger badges, and advisories translated natively.

---

 Integrated Sindh Emergency Helplines
- **PDMA Sindh 24/7 Control Room:** `1736`
- **Rescue 1122 Sindh:** `1122`
- **Edhi Ambulance:** `115`
- **Chhipa Emergency:** `1020`
- **Pakistan Meteorological Department (PMD):** `021-99261404`

---

 Presentation Guide for Competition Judges

When presenting to judges:
1. **The Problem:** Explain how Sindh suffered devastating floods in 2022 and recurrent 50°C heatwaves in Jacobabad and Nawabshah.
2. **The Innovation:** Open-Meteo integration eliminates API keys and delivers both meteorological forecast AND river discharge hydrography.
3. **The Multilingual Impact:** Switch live between English, Urdu, and Sindhi to demonstrate community accessibility.
4. **The Codebase:** Open `server/services/riskScore.js` to walk through the clear thresholds and explain why heat index (apparent temp) and soil saturation multipliers matter.
5. **Live Demo:** Click "Refresh Live Data" to trigger a fresh background pull and demonstrate instant real-time telemetry caching.
