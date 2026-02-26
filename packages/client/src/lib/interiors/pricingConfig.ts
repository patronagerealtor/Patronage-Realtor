export type PackageTier = "silver" | "gold" | "platinum" | "ultra";
export type BHK = "1bhk" | "2bhk" | "3bhk";

export const PRICE_RANGES: Record<
  PackageTier,
  Record<BHK, { min: number; max?: number }>
> = {
  silver: {
    "1bhk": { min: 3, max: 5 },
    "2bhk": { min: 6, max: 8 },
    "3bhk": { min: 8, max: 10 }
  },
  gold: {
    "1bhk": { min: 5, max: 7 },
    "2bhk": { min: 8, max: 11 },
    "3bhk": { min: 10, max: 14 }
  },
  platinum: {
    "1bhk": { min: 7, max: 11 },
    "2bhk": { min: 11, max: 15 },
    "3bhk": { min: 14, max: 20 }
  },
  ultra: {
    "1bhk": { min: 20 },
    "2bhk": { min: 40 },
    "3bhk": { min: 60 }
  }
};

// Typical Pune carpet-area bands (used for interpolation)
export const AREA_BANDS: Record<BHK, { min: number; max: number }> = {
  "1bhk": { min: 380, max: 520 },
  "2bhk": { min: 550, max: 850 },
  "3bhk": { min: 800, max: 1300 }
};

// Used when user skips carpet area
export const STANDARD_AREA: Record<BHK, number> = {
  "1bhk": 450,
  "2bhk": 650,
  "3bhk": 900
};
