export type RiskLevel = "low" | "medium" | "high";
export type QueueLevel = "calm" | "moderate" | "busy" | "slammed";

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  signatureDish: string;
  emoji: string;
  rating: number;
  deliveryTime: number; // minutes
  distanceKm: number;
  orderVolume: number; // current concurrent orders
  queueLevel: QueueLevel;
  delayRisk: RiskLevel;
  delayPercent: number;
  reliabilityScore: number; // 0-100
  priceFor2: number;
  imageGradient: string; // tailwind gradient classes for card thumb
}

export const restaurants: Restaurant[] = [
  {
    id: "r1",
    name: "Spice Hub",
    cuisine: "North Indian • Biryani",
    signatureDish: "Hyderabadi Dum Biryani",
    emoji: "🍛",
    rating: 4.4,
    deliveryTime: 48,
    distanceKm: 3.2,
    orderVolume: 92,
    queueLevel: "slammed",
    delayRisk: "high",
    delayPercent: 78,
    reliabilityScore: 62,
    priceFor2: 450,
    imageGradient: "from-orange-200 via-amber-200 to-rose-200",
  },
  {
    id: "r2",
    name: "Curry House",
    cuisine: "Indian • Curries",
    signatureDish: "Butter Chicken Thali",
    emoji: "🍗",
    rating: 4.6,
    deliveryTime: 24,
    distanceKm: 1.8,
    orderVolume: 28,
    queueLevel: "calm",
    delayRisk: "low",
    delayPercent: 12,
    reliabilityScore: 94,
    priceFor2: 380,
    imageGradient: "from-amber-200 via-yellow-200 to-orange-200",
  },
  {
    id: "r3",
    name: "Slice & Co.",
    cuisine: "Italian • Pizza",
    signatureDish: "Truffle Mushroom Pizza",
    emoji: "🍕",
    rating: 4.5,
    deliveryTime: 32,
    distanceKm: 2.4,
    orderVolume: 54,
    queueLevel: "moderate",
    delayRisk: "medium",
    delayPercent: 41,
    reliabilityScore: 78,
    priceFor2: 520,
    imageGradient: "from-red-200 via-orange-200 to-amber-200",
  },
  {
    id: "r4",
    name: "Wok Republic",
    cuisine: "Pan-Asian • Noodles",
    signatureDish: "Chilli Garlic Ramen",
    emoji: "🍜",
    rating: 4.3,
    deliveryTime: 28,
    distanceKm: 2.1,
    orderVolume: 36,
    queueLevel: "moderate",
    delayRisk: "low",
    delayPercent: 22,
    reliabilityScore: 88,
    priceFor2: 420,
    imageGradient: "from-rose-200 via-pink-200 to-orange-200",
  },
  {
    id: "r5",
    name: "Green Bowl",
    cuisine: "Healthy • Salads",
    signatureDish: "Mediterranean Power Bowl",
    emoji: "🥗",
    rating: 4.7,
    deliveryTime: 22,
    distanceKm: 1.4,
    orderVolume: 18,
    queueLevel: "calm",
    delayRisk: "low",
    delayPercent: 9,
    reliabilityScore: 96,
    priceFor2: 340,
    imageGradient: "from-emerald-200 via-lime-200 to-amber-200",
  },
  {
    id: "r6",
    name: "Burger Atelier",
    cuisine: "American • Burgers",
    signatureDish: "Smash Cheddar Stack",
    emoji: "🍔",
    rating: 4.2,
    deliveryTime: 38,
    distanceKm: 2.8,
    orderVolume: 71,
    queueLevel: "busy",
    delayRisk: "high",
    delayPercent: 64,
    reliabilityScore: 70,
    priceFor2: 480,
    imageGradient: "from-yellow-200 via-amber-200 to-red-200",
  },
];

export function getRestaurantById(id: string) {
  return restaurants.find((r) => r.id === id);
}
