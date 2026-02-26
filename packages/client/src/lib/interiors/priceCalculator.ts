// priceCalculator.ts

import {
    PRICE_RANGES,
    AREA_BANDS,
    STANDARD_AREA,
    PackageTier,
    BHK
  } from "./pricingConfig";
  
  export interface CalcInput {
    bhk: BHK;
    packageTier: PackageTier;
    carpetArea?: number;
    renovation: boolean; // means: not a brand-new flat
    customization: "low" | "medium" | "high";
  }
  
  // ---------- Helpers ----------
  
  // Clamp value between min & max
  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }
  
  // Convert carpet area → percentile (0–1)
  function areaPercentile(bhk: BHK, area: number) {
    const band = AREA_BANDS[bhk];
    const safeArea = clamp(area, band.min, band.max);
    return (safeArea - band.min) / (band.max - band.min);
  }
  
  // Non-linear curve for premium tiers
  function tierCurve(p: number, tier: PackageTier) {
    if (tier === "elite") return Math.pow(p, 1.15);
    if (tier === "bespoke") return Math.pow(p, 1.25);
    return p; // silver & gold stay linear
  }
  
  // Interpolate inside package price range
  const EFFECTIVE_RANGE_FACTOR = 0.7;
  
  function interpolate(min: number, max: number | undefined, p: number) {
    if (!max) return min;
    const effectiveMax = min + (max - min) * EFFECTIVE_RANGE_FACTOR;
    return min + p * (effectiveMax - min);
  }
  
  // ---------- Main Calculator ----------
  
  export function calculatePrice({
    bhk,
    packageTier,
    carpetArea,
    renovation,
    customization
  }: CalcInput) {
    const range = PRICE_RANGES[packageTier][bhk];
  
    // Step 1: decide carpet area
    const area = carpetArea ?? STANDARD_AREA[bhk];
  
    // Step 2: area → percentile
    let p = areaPercentile(bhk, area);
  
    // Step 3: premium non-linearity
    p = tierCurve(p, packageTier);
  
    // Step 4: base price from package range
    let base = interpolate(range.min, range.max, p);
  
    // Step 5: renovation uplift (execution complexity)
    // Meaning: dismantling, rework, rerouting, labour overhead
    if (renovation) {
      base *= 1.25; // +18% (balanced & realistic)
    }
  
    // Step 6: customization uplift (scope & material complexity)
    if (customization === "low") {
      base *= 0.95;
    }
    if (customization === "high") {
      base *= 1.20;
    }
  
    // Step 7: clamp to brochure limits (critical safety)
    if (range.max) {
      base = clamp(base, range.min, range.max);
    }
  
    // Step 8: return a RANGE, not fake precision
    return {
      min: Math.round(base * 0.95 * 10) / 10,
      max: range.max
        ? Math.round(base * 1.05 * 10) / 10
        : undefined
    };
  }
