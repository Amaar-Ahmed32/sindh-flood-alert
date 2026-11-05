/**
 * Sindh STREAM 2026-27: Frontend API Client
 * Connects to Express backend endpoints.
 */

const API_BASE = '/api/districts';

export async function fetchDistricts() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch districts`);
    return await res.json();
  } catch (err) {
    console.error('[API fetchDistricts]:', err);
    throw err;
  }
}

export async function fetchDistrictById(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch district details`);
    return await res.json();
  } catch (err) {
    console.error(`[API fetchDistrictById ${id}]:`, err);
    throw err;
  }
}

export async function fetchHighlights() {
  try {
    const res = await fetch(`${API_BASE}/summary/highlights`);
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch highlights`);
    return await res.json();
  } catch (err) {
    console.error('[API fetchHighlights]:', err);
    throw err;
  }
}

export async function triggerLiveSync() {
  try {
    const res = await fetch(`${API_BASE}/sync`, { method: 'POST' });
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to trigger live sync`);
    return await res.json();
  } catch (err) {
    console.error('[API triggerLiveSync]:', err);
    throw err;
  }
}

export async function switchScenario(scenarioId) {
  try {
    const res = await fetch(`${API_BASE}/scenario/${scenarioId}`, { method: 'POST' });
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to switch scenario`);
    return await res.json();
  } catch (err) {
    console.error(`[API switchScenario ${scenarioId}]:`, err);
    throw err;
  }
}
