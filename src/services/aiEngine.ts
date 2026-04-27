import { restaurants, type Restaurant } from "@/data/restaurants";
import { calculateDelayRisk } from "./prediction";
import { bestTimeToOrder, delayExplanation } from "@/utils/calculateDelayRisk";

export interface AIReply {
  text: string;
  recommendations: Restaurant[];
  flagged?: Restaurant; // the restaurant the user asked about, if any
}

const FAST_KEYWORDS = ["fast", "quick", "fastest", "soon", "hurry", "rush"];
const HEALTHY_KEYWORDS = ["healthy", "salad", "diet", "light"];
const CUISINE_MAP: Record<string, string[]> = {
  biryani: ["biryani", "indian"],
  pizza: ["pizza", "italian"],
  burger: ["burger", "american"],
  noodles: ["noodle", "ramen", "asian", "chinese"],
  salad: ["salad", "healthy", "bowl"],
};

function findByName(query: string): Restaurant | undefined {
  const q = query.toLowerCase();
  return restaurants.find((r) => q.includes(r.name.toLowerCase()));
}

function findByCuisine(query: string): Restaurant[] {
  const q = query.toLowerCase();
  return restaurants.filter((r) => {
    const hay = (r.cuisine + " " + r.signatureDish).toLowerCase();
    return Object.values(CUISINE_MAP).some((aliases) =>
      aliases.some((a) => q.includes(a) && hay.includes(a)),
    );
  });
}

/**
 * Mock AI engine — deterministic but feels intelligent.
 * Returns a chat reply plus structured recommendations for the side panel.
 */
export function generateAIReply(userMessage: string): AIReply {
  const q = userMessage.toLowerCase().trim();

  // 1) User asked about a specific restaurant
  const flagged = findByName(q);
  if (flagged) {
    const risk = calculateDelayRisk({
      distanceKm: flagged.distanceKm,
      orderVolume: flagged.orderVolume,
    });
    const best = bestTimeToOrder();
    if (risk.level === "high") {
      const alts = restaurants
        .filter((r) => r.id !== flagged.id && r.delayRisk === "low")
        .sort((a, b) => a.deliveryTime - b.deliveryTime)
        .slice(0, 2);
      const reasons = delayExplanation(flagged);
      return {
        flagged,
        recommendations: [flagged, ...alts],
        text: `**${flagged.name}** is slammed right now — estimated delay risk is **${risk.percent}%** (~${flagged.deliveryTime} min wait).\n\nWhy: ${reasons.map((r) => `• ${r}`).join("  ")}\n\nBest time to order: **${best.label}** — ${best.risk} risk.\n\nIf you're hungry now, try **${alts[0]?.name}** instead — about **${flagged.deliveryTime - (alts[0]?.deliveryTime ?? 0)} mins faster** and rated ${alts[0]?.rating}★.`,
      };
    }
    return {
      flagged,
      recommendations: [flagged],
      text: `Good pick — **${flagged.name}** is running smoothly. Estimated delay risk: **${risk.percent}%**, ETA **${flagged.deliveryTime} mins**. Reliability score: **${flagged.reliabilityScore}/100**.\n\nBest time to order: **${best.label}** — ${best.risk} risk. Go for it.`,
    };
  }

  // 2) Cuisine-based query
  const cuisineMatches = findByCuisine(q);
  if (cuisineMatches.length) {
    const sorted = [...cuisineMatches].sort((a, b) => a.deliveryTime - b.deliveryTime);
    const best = sorted[0];
    return {
      recommendations: sorted.slice(0, 3),
      text: `Found **${cuisineMatches.length} matches**. **${best.name}** is your fastest bet — **${best.deliveryTime} mins**, delay risk only **${best.delayPercent}%**, and rated **${best.rating}★**. Their ${best.signatureDish} is the move ${best.emoji}.`,
    };
  }

  // 3) "Fastest" intent
  if (FAST_KEYWORDS.some((k) => q.includes(k))) {
    const fastest = [...restaurants]
      .filter((r) => r.delayRisk !== "high")
      .sort((a, b) => a.deliveryTime - b.deliveryTime)
      .slice(0, 3);
    return {
      recommendations: fastest,
      text: `Here are the **3 fastest kitchens** open right now. **${fastest[0].name}** wins at **${fastest[0].deliveryTime} mins** with a reliability score of **${fastest[0].reliabilityScore}/100**.`,
    };
  }

  // 4) Healthy intent
  if (HEALTHY_KEYWORDS.some((k) => q.includes(k))) {
    const healthy = restaurants.filter((r) => /healthy|salad/i.test(r.cuisine));
    return {
      recommendations: healthy,
      text: `**${healthy[0]?.name}** has the freshest options — try the ${healthy[0]?.signatureDish}. ETA **${healthy[0]?.deliveryTime} mins**, delay risk just **${healthy[0]?.delayPercent}%**.`,
    };
  }

  // 5) Default — show top reliable picks
  const top = [...restaurants]
    .sort((a, b) => b.reliabilityScore - a.reliabilityScore)
    .slice(0, 3);
  return {
    recommendations: top,
    text: `I've got you. Based on live demand, here are **3 reliable picks** right now. Tell me a cuisine, or ask about a specific restaurant and I'll predict the wait.`,
  };
}
