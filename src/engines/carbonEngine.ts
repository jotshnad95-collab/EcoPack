import { Product, ProjectRequirements, LogisticsSpec, MaterialProperties, CushioningType } from '../types';
import { CUSHIONING_OPTIONS } from '../data/materials';

export interface CarbonCalculationInput {
  product: Product;
  requirements: ProjectRequirements;
  logistics: LogisticsSpec;
  material: MaterialProperties;
  cushioningType: CushioningType;
  cushioningThicknessMm: number;
  outerLengthMm: number;
  outerWidthMm: number;
  outerHeightMm: number;
  wallThicknessMm: number;
}

export interface CarbonResult {
  materialEmissionsKg: number;
  manufacturingEmissionsKg: number;
  transportEmissionsKg: number;
  endOfLifeEmissionsKg: number;
  totalCo2ePerPackageKg: number;
  annualTotalCo2eTonnes: number;
  reductionPercentVsBaseline: number;
  co2AvoidedKgVsBaseline: number;
  annualCo2AvoidedTonnes: number;
  equivalentTreesYear: number;
  equivalentEvKmAvoided: number;
  isEstimate: boolean;
  explanation: {
    materialLcaNote: string;
    transportLcaNote: string;
    endOfLifeNote: string;
  };
}

export function calculatePackageCarbon(
  input: CarbonCalculationInput,
  baselineCarbonKg?: number
): CarbonResult {
  const l_m = input.outerLengthMm / 1000;
  const w_m = input.outerWidthMm / 1000;
  const h_m = input.outerHeightMm / 1000;
  const t_m = input.wallThicknessMm / 1000;

  // Box Material Mass (kg)
  const blankAreaM2 = (2 * l_m + 2 * w_m + 0.04) * (h_m + w_m) * 1.15;
  const densityKgM3 = input.material.densityGcm3 * 1000;
  const materialWeightKg = blankAreaM2 * t_m * densityKgM3;

  // 1. Raw Material Extraction & Processing Emissions
  // Includes credit for recycled content
  const recycledCreditFactor = 1 - (input.material.recycledContentPercent / 100) * 0.45;
  const netMaterialFactor = input.material.carbonFactorKgCo2PerKg * recycledCreditFactor;
  const rawMaterialCo2Kg = materialWeightKg * netMaterialFactor;

  // Cushioning Emissions
  const cushionOption = CUSHIONING_OPTIONS.find(c => c.type === input.cushioningType) || CUSHIONING_OPTIONS[0];
  const outerVolumeLiters = (input.outerLengthMm * input.outerWidthMm * input.outerHeightMm) / 1_000_000;
  const productVolumeLiters = (input.product.length * input.product.width * input.product.height) / 1_000_000;
  const voidVolumeLiters = Math.max(0, outerVolumeLiters - productVolumeLiters);
  const cushionFillFactor = Math.min(0.85, (input.cushioningThicknessMm * 2) / Math.max(input.product.length, 50));
  const effectiveCushionLiters = voidVolumeLiters * cushionFillFactor;
  const cushionCo2Kg = effectiveCushionLiters * cushionOption.carbonKgPerLiter;

  const totalMaterialEmissionsKg = Number((rawMaterialCo2Kg + cushionCo2Kg).toFixed(3));

  // 2. Manufacturing Emissions (shearing, die-cutting, fluting, printing ink drying)
  // ~ 0.12 kWh per package @ 0.52 kg CO2/kWh grid intensity
  const manufacturingEmissionsKg = Number((0.085 * (1 + t_m * 5) * 0.52).toFixed(3));

  // 3. Transportation Emissions
  // Emission Factors (kg CO2e per tonne-km based on DEFRA / GLEC framework)
  const transportEmissionFactors: Record<string, number> = {
    road: 0.096, // Class 8 heavy truck
    rail: 0.028, // Electric/Diesel freight
    air: 0.602,  // Dedicated air cargo freighter
    sea: 0.016   // Container vessel
  };
  const emissionFactor = transportEmissionFactors[input.logistics.transportMode] || 0.096;
  const grossPackageWeightKg = (input.product.weight / 1000) + materialWeightKg + (effectiveCushionLiters * cushionOption.densityGcm3);
  const transportTonnes = grossPackageWeightKg / 1000;
  const transportEmissionsKg = Number((transportTonnes * input.logistics.shippingDistanceKm * emissionFactor).toFixed(3));

  // 4. End-of-Life Emissions
  // Landfill methane vs recycling avoided emissions
  const nonRecycledFraction = (100 - input.material.recyclabilityPercent) / 100;
  const endOfLifeEmissionsKg = Number((materialWeightKg * nonRecycledFraction * 0.42).toFixed(3));

  // Total Cradle-to-Grave Emissions per Package
  const totalCo2ePerPackageKg = Number((
    totalMaterialEmissionsKg +
    manufacturingEmissionsKg +
    transportEmissionsKg +
    endOfLifeEmissionsKg
  ).toFixed(3));

  const annualTotalCo2eTonnes = Number(((totalCo2ePerPackageKg * input.requirements.annualQuantity) / 1000).toFixed(2));

  // Baseline Comparison
  const baselineKg = baselineCarbonKg ?? (totalCo2ePerPackageKg * 1.55); // 55% higher baseline benchmark if none provided
  const co2AvoidedKgVsBaseline = Number(Math.max(0, baselineKg - totalCo2ePerPackageKg).toFixed(3));
  const reductionPercentVsBaseline = Number(((co2AvoidedKgVsBaseline / baselineKg) * 100).toFixed(1));
  const annualCo2AvoidedTonnes = Number(((co2AvoidedKgVsBaseline * input.requirements.annualQuantity) / 1000).toFixed(2));

  // Educational Equivalencies (strictly labelled approximate educational metrics)
  // 1 mature urban tree absorbs ~ 21.77 kg CO2 / year
  const equivalentTreesYear = Math.round((annualCo2AvoidedTonnes * 1000) / 21.77);
  // Average passenger electric vehicle / compact car emits ~ 0.12 kg CO2 / km
  const equivalentEvKmAvoided = Math.round((annualCo2AvoidedTonnes * 1000) / 0.12);

  return {
    materialEmissionsKg: totalMaterialEmissionsKg,
    manufacturingEmissionsKg,
    transportEmissionsKg,
    endOfLifeEmissionsKg,
    totalCo2ePerPackageKg,
    annualTotalCo2eTonnes,
    reductionPercentVsBaseline,
    co2AvoidedKgVsBaseline,
    annualCo2AvoidedTonnes,
    equivalentTreesYear,
    equivalentEvKmAvoided,
    isEstimate: true,
    explanation: {
      materialLcaNote: `${(materialWeightKg * 1000).toFixed(0)}g of ${input.material.name} (${input.material.recycledContentPercent}% recycled content) + ${cushionOption.name}`,
      transportLcaNote: `${(grossPackageWeightKg * 1000).toFixed(0)}g gross weight transported ${input.logistics.shippingDistanceKm} km via ${input.logistics.transportMode.toUpperCase()}`,
      endOfLifeNote: `${input.material.recyclabilityPercent}% recyclable curbside recovery factor (EOL score: ${input.material.endOfLifeScore}/100)`
    }
  };
}
