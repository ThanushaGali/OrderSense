import type { RiskLevel } from "@/data/restaurants";

export interface DelayInputs {
  distanceKm: number;
  orderVolume: number; // current orders in queue
  hour?: number; // 0-23, defaults to current hour
}

export interface DelayResult {
  percent: number;
  level: RiskLevel;
  reason: string;
}

/**
 * Mock delay prediction engine.
 * Combines distance, kitchen load, and time-of-day pressure into a 0-100% delay risk.
 */
export function calculateDelayRisk({ distanceKm, orderVolume, hour }: DelayInputs): DelayResult {
  const h = hour ?? new Date().getHours();

  // Time-of-day multiplier — peaks at lunch (12-14) and dinner (19-22)
  const timePressure =
    (h >= 12 && h <= 14) || (h >= 19 && h <= 22)
      ? 1.35
      : (h >= 11 && h <= 15) || (h >= 18 && h <= 23)
        ? 1.15
        : 0.85;

  const distanceScore = Math.min(distanceKm * 8, 35); // max 35
  const loadScore = Math.min(orderVolume * 0.55, 50); // max 50
  const raw = (distanceScore + loadScore) * timePressure;
  const percent = Math.max(4, Math.min(95, Math.round(raw)));

  const level: RiskLevel = percent >= 60 ? "high" : percent >= 30 ? "medium" : "low";

  const reason =
    level === "high"
      ? "Kitchen is slammed and traffic is heavy right now."
      : level === "medium"
        ? "Moderate kitchen load — expect a small wait."
        : "Kitchen is calm and the route is clear.";

  return { percent, level, reason };
}

export function riskLabel(level: RiskLevel) {
  return level === "high" ? "High risk" : level === "medium" ? "Medium risk" : "Low risk";
}
