// Utility: classify a queue level (0-100) into a delay risk bucket.
export function calculateDelayRisk(queueLevel) {
  if (queueLevel > 70) return "High";
  if (queueLevel > 40) return "Medium";
  return "Low";
}

// Convert queue percentage into a human label.
export function queueStatusLabel(queuePercent) {
  if (queuePercent >= 61) return "Busy";
  if (queuePercent >= 31) return "Moderate";
  return "Low";
}

// Risk for a given hour of the day (0-23).
export function hourRisk(hour) {
  if (hour >= 12 && hour <= 14) return "High";
  if (hour >= 18 && hour <= 20) return "Medium";
  if (hour >= 19 && hour <= 22) return "Medium";
  return "Low";
}

// Find the next "Low" risk hour starting from now.
// Returns { hour, label, risk } e.g. { hour: 16, label: "4:00 PM", risk: "Low" }
export function bestTimeToOrder(now = new Date()) {
  const startHour = now.getHours();
  for (let i = 0; i < 24; i++) {
    const h = (startHour + i) % 24;
    if (hourRisk(h) === "Low") {
      return { hour: h, label: formatHour(h), risk: "Low", inMinutes: i === 0 ? 0 : i * 60 };
    }
  }
  return { hour: startHour, label: formatHour(startHour), risk: "Low", inMinutes: 0 };
}

export function formatHour(h) {
  const suffix = h >= 12 ? "PM" : "AM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:00 ${suffix}`;
}

// Delivery confidence score (0-100) — opposite of delay percent, weighted by reliability.
export function deliveryConfidence(restaurant) {
  const base = 100 - restaurant.delayPercent;
  const weighted = Math.round(base * 0.6 + restaurant.reliabilityScore * 0.4);
  return Math.max(5, Math.min(99, weighted));
}

// Explain why delay is high for a given restaurant + hour.
export function delayExplanation(restaurant, hour = new Date().getHours()) {
  const reasons = [];
  if (restaurant.delayPercent >= 60) reasons.push("High kitchen load");
  if (restaurant.distanceKm >= 2.5) reasons.push("Heavy traffic on route");
  if (hourRisk(hour) === "High") reasons.push("Peak lunch time");
  else if (hourRisk(hour) === "Medium") reasons.push("Peak dinner time");
  if (reasons.length === 0) reasons.push("Kitchen running smoothly");
  return reasons;
}
