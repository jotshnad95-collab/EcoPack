import { Product, MaterialProperties, CushioningType } from '../types';
import { CUSHIONING_OPTIONS } from '../data/materials';

export interface ProtectionCalculationInput {
  product: Product;
  material: MaterialProperties;
  cushioningType: CushioningType;
  cushioningThicknessMm: number;
  internalClearanceMm: number;
  wallThicknessMm: number;
  outerLengthMm: number;
  outerWidthMm: number;
  outerHeightMm: number;
}

export interface ProtectionResult {
  overallProtectionScore: number;  // 0 - 100
  impactProtectionScore: number;   // 0 - 100
  compressionScore: number;        // 0 - 100
  cushioningScore: number;         // 0 - 100
  structuralStabilityScore: number;// 0 - 100
  productFitScore: number;         // 0 - 100
  gForceExperienced: number;       // peak G-force at 1m drop
  gForceSafetyMargin: number;      // ratio G_allowable / G_experienced
  boxCompressionCapacityKg: number;// BCT capacity in kg
  stackingLoadKg: number;           // Estimated dynamic load on bottom box in 2.5m stack
  whyExplanation: string;
}

export function calculatePackageProtection(input: ProtectionCalculationInput): ProtectionResult {
  const cushionOption = CUSHIONING_OPTIONS.find(c => c.type === input.cushioningType) || CUSHIONING_OPTIONS[0];

  // 1. Drop Shock Deceleration (1.0m ASTM standard parcel drop)
  const dropHeightMm = 1000;
  const effectiveBufferMm = Math.max(input.cushioningThicknessMm, 1);
  const dampingEfficiency = cushionOption.dampingEfficiencyEta; // 0.2 to 0.85
  
  // Peak Deceleration G = (2 * h) / (deflection * 3.5)
  // Ideal cushion deceleration approximation: G_peak ≈ (dropHeight / (effectiveBuffer * dampingEfficiency)) * 0.75
  const gForceExperienced = Number(
    Math.max(12, Math.min(180, (dropHeightMm / (effectiveBufferMm * dampingEfficiency)) * 0.65)).toFixed(1)
  );

  // Fragility thresholds: Max allowable G before product damage occurs
  // Glass bottle: ~30-40 G; Electronics: ~40-60 G; Heavy mechanical: ~80-120 G
  const allowableG = input.product.fragilityGMax || 35;
  const gForceSafetyMargin = Number((allowableG / gForceExperienced).toFixed(2));

  // Impact Protection Score: 100 if safety margin >= 1.3; lower if below 1.0
  let impactProtectionScore = 0;
  if (gForceSafetyMargin >= 1.5) {
    impactProtectionScore = 96;
  } else if (gForceSafetyMargin >= 1.2) {
    impactProtectionScore = 88;
  } else if (gForceSafetyMargin >= 1.0) {
    impactProtectionScore = 75;
  } else if (gForceSafetyMargin >= 0.8) {
    impactProtectionScore = 55;
  } else {
    impactProtectionScore = Math.max(15, Math.round(gForceSafetyMargin * 60));
  }

  // 2. Box Compression Test (McKee's Formula for BCT)
  // BCT (N) = 5.876 * ECT * sqrt(t * Z)
  // where ECT is in kN/m, t is thickness in mm, Z is box perimeter in mm
  const perimeterMm = 2 * (input.outerLengthMm + input.outerWidthMm);
  const ectKnM = input.material.ectKnM; // kN/m
  const tMm = input.wallThicknessMm;

  const bctNewtons = 5.876 * ectKnM * Math.sqrt(Math.max(1, tMm * perimeterMm));
  const boxCompressionCapacityKg = Math.round(bctNewtons / 9.81);

  // Stacking load calculation:
  // Assume a standard warehouse pallet stack height of 2.2 meters
  // Number of tiers = 2200 / outerHeightMm
  const boxHeightMm = Math.max(input.outerHeightMm, 50);
  const stackLayers = Math.max(1, Math.floor(2200 / boxHeightMm));
  const grossBoxWeightKg = (input.product.weight + 80) / 1000;
  
  // Total deadweight on bottom box = (layers - 1) * grossBoxWeightKg
  // Dynamic safety factor for transport & humidity = 3.5 (standard packaging engineering ASTM D4169)
  const deadWeightKg = (stackLayers - 1) * grossBoxWeightKg;
  const requiredStackingCapacityKg = deadWeightKg * 3.5;

  let compressionScore = 85;
  if (boxCompressionCapacityKg >= requiredStackingCapacityKg * 2.0) {
    compressionScore = 98;
  } else if (boxCompressionCapacityKg >= requiredStackingCapacityKg * 1.3) {
    compressionScore = 88;
  } else if (boxCompressionCapacityKg >= requiredStackingCapacityKg) {
    compressionScore = 72;
  } else {
    compressionScore = Math.max(20, Math.round((boxCompressionCapacityKg / requiredStackingCapacityKg) * 65));
  }

  // 3. Cushioning Suitability Score
  const isFragilityMatched = input.material.fragilitySuitability.includes(input.product.fragility);
  let cushioningScore = isFragilityMatched ? 85 : 60;
  if (input.cushioningType !== 'none') {
    cushioningScore = Math.min(98, cushioningScore + 12);
  } else if (input.product.fragility === 'high' || input.product.fragility === 'very_high') {
    cushioningScore = 30; // severe hazard without cushion
  }

  // 4. Structural Stability Score (Box geometry aspect ratio & moisture resistance)
  const heightToWidthRatio = input.outerHeightMm / Math.max(input.outerWidthMm, 1);
  let structuralStabilityScore = 88;
  if (heightToWidthRatio > 2.5) {
    // Tall slender box prone to toppling/buckling
    structuralStabilityScore -= 15;
  }
  // Adjust for moisture resistance
  structuralStabilityScore = Math.round(
    structuralStabilityScore * 0.75 + (input.material.moistureResistanceScore * 0.25)
  );

  // 5. Product Fit Score
  // Ideal clearance is 3mm to 6mm. Too tight (<2mm) increases shock transfer; too loose (>10mm) causes internal rattling
  let productFitScore = 90;
  if (input.internalClearanceMm >= 3 && input.internalClearanceMm <= 6) {
    productFitScore = 98;
  } else if (input.internalClearanceMm < 2) {
    productFitScore = 65; // too snug, contact shock risk
  } else if (input.internalClearanceMm > 12) {
    productFitScore = 55; // excessive void causing internal rattling
  } else {
    productFitScore = 82;
  }

  // Composite Weighted Protection Score / 100
  const overallProtectionScore = Math.min(99, Math.max(10, Math.round(
    impactProtectionScore * 0.35 +
    compressionScore * 0.25 +
    cushioningScore * 0.20 +
    structuralStabilityScore * 0.10 +
    productFitScore * 0.10
  )));

  // "Why?" explanation grounded in physics
  let whyExplanation = '';
  if (overallProtectionScore >= 88) {
    whyExplanation = `Robust protection architecture. ${input.cushioningThicknessMm}mm ${cushionOption.name} limits 1.0m impact deceleration to ${gForceExperienced}G (safe below product threshold of ${allowableG}G). McKee BCT capacity (${boxCompressionCapacityKg} kg) offers ${((boxCompressionCapacityKg / Math.max(requiredStackingCapacityKg, 1))).toFixed(1)}x safety factor over bottom-box stacking loads.`;
  } else if (overallProtectionScore >= 70) {
    whyExplanation = `Moderate protection profile. Peak drop deceleration (${gForceExperienced}G) approaches the allowable limit (${allowableG}G). BCT compression (${boxCompressionCapacityKg} kg) is sufficient for up to ${stackLayers} tiers under normal ambient humidity.`;
  } else {
    whyExplanation = `High damage vulnerability! Cushioning thickness (${input.cushioningThicknessMm}mm) allows ${gForceExperienced}G shock to transfer to the product, exceeding its fragility threshold (${allowableG}G). Recommend increasing buffer thickness to ≥15mm or switching to molded fiber endcaps.`;
  }

  return {
    overallProtectionScore,
    impactProtectionScore,
    compressionScore,
    cushioningScore,
    structuralStabilityScore,
    productFitScore,
    gForceExperienced,
    gForceSafetyMargin,
    boxCompressionCapacityKg,
    stackingLoadKg: Math.round(requiredStackingCapacityKg),
    whyExplanation
  };
}
