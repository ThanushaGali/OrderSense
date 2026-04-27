import { create } from "zustand";

export const LOCATIONS = [
  "Hyderabad",
  "Bengaluru",
  "Mumbai",
  "Delhi NCR",
  "Chennai",
  "Pune",
] as const;

export type City = (typeof LOCATIONS)[number];

interface LocationState {
  city: City;
  setCity: (c: City) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  city: "Hyderabad",
  setCity: (city) => set({ city }),
}));
