export const baseUrl = "/"; // used by Navigation/Footer

// Local dev API (FastAPI)
export const API_BASE = "http://127.0.0.1:8000";

// Debug planning endpoint (used while data collection is paused)
export const DEBUG_PLAN_ENDPOINT = `${API_BASE}/__debug__/plan`;

// (Optional) Real planning endpoint for later
export const PLAN_ENDPOINT = `${API_BASE}/plan`;
