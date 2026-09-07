import { LogisticsSpec } from '../types';

export interface LogisticsCalculationInput {
  outerLengthMm: number;
  outerWidthMm: number;
  outerHeightMm: number;
  grossWeightKg: number;
  logisticsSpec: LogisticsSpec;
}

export interface LogisticsResult {
  packageVolumeCm3: number;
  packageVolumeLiters: number;
  volumetricWeightKg: number;
  boxesPerPalletLayer: number;
  palletLayers: number;
  boxesPerPallet: number;
  palletsPerTruck: number;
  boxesPerTruck: number;
  truckSpaceUtilizationPercent: number;
  packagingEfficiencyScore: number;
  baselineComparison: {
    baselineBoxesPerTruck: number;
    additionalBoxesPerTruck: number;
    truckloadsSavedPerYear: number;
    annualLogisticsSavingsPercent: number;
  };
}

export function calculateLogistics(
  input: LogisticsCalculationInput,
  baselineOuterVolumeCm3?: number
): LogisticsResult {
  const l = input.outerLengthMm;
  const w = input.outerWidthMm;
  const h = input.outerHeightMm;

  // Package Volume
  const packageVolumeCm3 = Math.round((l * w * h) / 1000);
  const packageVolumeLiters = Number((packageVolumeCm3 / 1000).toFixed(2));

  // IATA Air/Courier Volumetric Weight Divisor 5000 (cm³/kg)
  const volumetricWeightKg = Number(((l * w * h) / 5_000_000).toFixed(2));

  // Pallet Dimensions (Standard EUR pallet 1200 x 800 mm, usable stack height 1800 mm, max load 800 kg)
  const palletL = 1200;
  const palletW = 800;
  const maxPalletHeight = 1800;

  // Optimized rectangular orientation fitting on 1200 x 800 footprint
  const orient1 = Math.floor(palletL / l) * Math.floor(palletW / w);
  const orient2 = Math.floor(palletL / w) * Math.floor(palletW / l);
  const boxesPerPalletLayer = Math.max(1, Math.max(orient1, orient2));

  const palletLayers = Math.max(1, Math.min(12, Math.floor(maxPalletHeight / Math.max(h, 50))));
  const boxesPerPallet = boxesPerPalletLayer * palletLayers;

  // Truck / Container Specifications
  // Standard 53ft Dry Van: 26 standard EUR pallet spaces, ~105 m³ interior volume
  // 20ft ISO Container: 11 pallets, ~33 m³
  // 40ft ISO Container: 24 pallets, ~67 m³
  let palletsPerTruck = 26;
  let truckInternalVolumeM3 = 105;

  if (input.logisticsSpec.containerType === 'container_20ft') {
    palletsPerTruck = 11;
    truckInternalVolumeM3 = 33;
  } else if (input.logisticsSpec.containerType === 'container_40ft') {
    palletsPerTruck = 24;
    truckInternalVolumeM3 = 67;
  }

  const boxesPerTruck = boxesPerPallet * palletsPerTruck;

  // Space Utilization % = (Total Package Volume * Boxes per Truck) / Interior Truck Volume
  const totalCargoVolumeM3 = (packageVolumeLiters * boxesPerTruck) / 1000;
  const truckSpaceUtilizationPercent = Number(
    Math.min(94, Math.max(45, (totalCargoVolumeM3 / truckInternalVolumeM3) * 100)).toFixed(1)
  );

  // Packaging Efficiency Score (0-100)
  // Higher if density and cube utilization are high
  const cubeRatio = (l * w * h) / Math.max(1, Math.pow(Math.max(l, w, h), 3));
  const packagingEfficiencyScore = Math.min(99, Math.max(40, Math.round(
    truckSpaceUtilizationPercent * 0.7 + (cubeRatio * 100 * 0.3)
  )));

  // Baseline Comparison (e.g. Baseline was 1,200 boxes/truck; new is 1,450 boxes/truck)
  const baselineVol = baselineOuterVolumeCm3 ?? (packageVolumeCm3 * 1.25);
  const baselineRatio = packageVolumeCm3 / Math.max(baselineVol, 1);
  const baselineBoxesPerTruck = Math.round(boxesPerTruck * baselineRatio);
  const additionalBoxesPerTruck = Math.max(0, boxesPerTruck - baselineBoxesPerTruck);
  
  // Annual shipments saved
  const annualQuantity = 50000;
  const baselineTruckloads = Math.ceil(annualQuantity / Math.max(baselineBoxesPerTruck, 1));
  const optimizedTruckloads = Math.ceil(annualQuantity / Math.max(boxesPerTruck, 1));
  const truckloadsSavedPerYear = Math.max(0, baselineTruckloads - optimizedTruckloads);
  const annualLogisticsSavingsPercent = Number(
    (((baselineTruckloads - optimizedTruckloads) / Math.max(baselineTruckloads, 1)) * 100).toFixed(1)
  );

  return {
    packageVolumeCm3,
    packageVolumeLiters,
    volumetricWeightKg,
    boxesPerPalletLayer,
    palletLayers,
    boxesPerPallet,
    palletsPerTruck,
    boxesPerTruck,
    truckSpaceUtilizationPercent,
    packagingEfficiencyScore,
    baselineComparison: {
      baselineBoxesPerTruck,
      additionalBoxesPerTruck,
      truckloadsSavedPerYear,
      annualLogisticsSavingsPercent
    }
  };
}
