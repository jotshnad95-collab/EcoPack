import { PackagingDesign, Product, MaterialProperties } from '../types';
import { CUSHIONING_OPTIONS } from '../data/materials';

export interface DropTestInput {
  dropHeightMeters: number;
  orientation: 'corner' | 'edge' | 'flat_bottom' | 'flat_face';
  surface: 'concrete' | 'hardwood' | 'packed_earth';
}

export interface CompressionTestInput {
  warehouseStackHeightMeters: number;
  durationDays: number;
  ambientHumidityPercent: number;
}

export interface VibrationTestInput {
  transportProfile: 'ASTM_D4169_Truck' | 'ISTA_3A_Air' | 'ISO_13355_Rail';
  travelDistanceKm: number;
}

export function runVirtualDropTest(
  design: PackagingDesign,
  product: Product,
  material: MaterialProperties,
  options: DropTestInput
) {
  const g_accel = 9.81;
  const h_m = options.dropHeightMeters;
  const impactVelocityMs = Number(Math.sqrt(2 * g_accel * h_m).toFixed(2));

  // Surface stiffness multiplier
  const surfaceMultiplier = options.surface === 'concrete' ? 1.0 : options.surface === 'hardwood' ? 0.92 : 0.80;

  // Orientation stress multiplier: Corner drops concentrate impact on single vertex (highest risk)
  const orientationMultipliers: Record<string, number> = {
    corner: 1.45,
    edge: 1.25,
    flat_bottom: 1.0,
    flat_face: 0.95
  };
  const orientMult = orientationMultipliers[options.orientation] || 1.0;

  const cushionOption = CUSHIONING_OPTIONS.find(c => c.type === design.cushioningType) || CUSHIONING_OPTIONS[0];
  const bufferMm = Math.max(design.cushioningThicknessMm, 2);
  const eta = cushionOption.dampingEfficiencyEta;

  // Dynamic Cushion Deflection under impact (mm)
  const kineticEnergyJoules = 0.5 * (product.weight / 1000) * Math.pow(impactVelocityMs, 2);
  const maxDeflectionMm = Number(Math.min(bufferMm * 0.85, (bufferMm * 0.45) + (kineticEnergyJoules * 1.8)).toFixed(1));

  // Peak G-Force experienced by internal product
  const baseG = (Math.pow(impactVelocityMs, 2) / (2 * (maxDeflectionMm / 1000) * g_accel)) * (1 / Math.max(eta, 0.2));
  const peakGForce = Number((baseG * surfaceMultiplier * orientMult * 0.55).toFixed(1));

  const allowableG = product.fragilityGMax || 35;
  const gRatio = peakGForce / allowableG;

  let riskLevel: 'safe' | 'caution' | 'critical_failure' = 'safe';
  let estimatedProtectionPercent = 95;

  if (gRatio <= 0.85) {
    riskLevel = 'safe';
    estimatedProtectionPercent = 96;
  } else if (gRatio <= 1.10) {
    riskLevel = 'caution';
    estimatedProtectionPercent = 78;
  } else {
    riskLevel = 'critical_failure';
    estimatedProtectionPercent = Math.max(10, Math.round(100 - (gRatio - 1) * 75));
  }

  const engineeringObservations =
    riskLevel === 'safe'
      ? `Impact energy (${kineticEnergyJoules.toFixed(1)} J) absorbed efficiently by ${bufferMm}mm ${cushionOption.name}. Cushion deflected ${maxDeflectionMm}mm without bottoming out. Peak deceleration (${peakGForce}G) is well below the allowable limit (${allowableG}G).`
      : riskLevel === 'caution'
      ? `Marginal impact boundary. Cushion deflected ${maxDeflectionMm}mm (${((maxDeflectionMm / bufferMm) * 100).toFixed(0)}% of buffer depth). Peak deceleration of ${peakGForce}G closely borders the damage limit of ${allowableG}G.`
      : `High damage failure predicted! Peak deceleration of ${peakGForce}G severely exceeds the product fragility limit (${allowableG}G). Cushion bottomed out at ${maxDeflectionMm}mm. Increase cushion thickness or select higher damping material.`;

  return {
    dropHeightMeters: options.dropHeightMeters,
    impactSurface: options.surface,
    orientation: options.orientation,
    impactVelocityMs,
    peakGForce,
    allowableGForce: allowableG,
    cushioningDeflectionMm: maxDeflectionMm,
    riskLevel,
    estimatedProtectionPercent,
    engineeringObservations,
    disclaimer: 'Virtual simulation is an engineering estimate and does not replace physical testing or certification.'
  };
}

export function runVirtualCompressionTest(
  design: PackagingDesign,
  product: Product,
  material: MaterialProperties,
  options: CompressionTestInput
) {
  // Warehouse stack height tiers
  const boxHeightM = design.outerHeight / 1000;
  const tiers = Math.max(1, Math.floor(options.warehouseStackHeightMeters / boxHeightM));
  
  const packageGrossKg = (product.weight + design.tareWeightGrams) / 1000;
  const deadWeightBottomBoxKg = Number(((tiers - 1) * packageGrossKg).toFixed(1));

  // Environmental degradation factors on Box Compression Strength:
  // 1. Humidity factor (ASTM D4169 / TAPPI T804): Corrugated strength drops ~8% for every 10% RH above 50%
  const excessRh = Math.max(0, options.ambientHumidityPercent - 50);
  const humidityDegradationFactor = Math.max(0.45, 1 - (excessRh * 0.008));

  // 2. Storage duration / creep factor: Continuous load causes creep fatigue
  // 30 days = 0.70 strength retention, 90 days = 0.58 retention
  const creepFactor = Math.max(0.50, 1 - (Math.log10(Math.max(options.durationDays, 1)) * 0.18));

  // 3. Handling & Pallet Overhang factor
  const palletFactor = 0.85;

  const combinedEnvironmentalFactor = humidityDegradationFactor * creepFactor * palletFactor;
  const dynamicSafetyFactor = Number((1 / combinedEnvironmentalFactor).toFixed(2));

  const requiredCapacityKg = Number((deadWeightBottomBoxKg * dynamicSafetyFactor).toFixed(1));
  const calculatedBctKg = design.protectionBreakdown.boxCompressionCapacityKg;

  const safetyMarginPercent = Number(
    (((calculatedBctKg - requiredCapacityKg) / Math.max(requiredCapacityKg, 1)) * 100).toFixed(1)
  );
  const pass = calculatedBctKg >= requiredCapacityKg;

  const engineeringObservations = pass
    ? `Box structural compression capacity (${calculatedBctKg} kg BCT) safely supports ${tiers} tiers (${deadWeightBottomBoxKg} kg deadload) with a ${safetyMarginPercent}% reserve margin under ${options.ambientHumidityPercent}% RH over ${options.durationDays} days.`
    : `Stacking failure alert! Effective BCT capacity (${calculatedBctKg} kg) is insufficient for ${tiers} stacked layers under ${options.ambientHumidityPercent}% RH over ${options.durationDays} days (required: ${requiredCapacityKg} kg). Deficit of ${Math.abs(safetyMarginPercent)}%. Recommend upgrading board grade or adding corner support posts.`;

  return {
    warehouseStackHeightMeters: options.warehouseStackHeightMeters,
    durationDays: options.durationDays,
    ambientHumidityPercent: options.ambientHumidityPercent,
    totalDeadWeightKg: deadWeightBottomBoxKg,
    dynamicSafetyFactor,
    requiredCapacityKg,
    calculatedBctKg,
    safetyMarginPercent,
    pass,
    engineeringObservations,
    disclaimer: 'Virtual simulation is an engineering estimate and does not replace physical testing or certification.'
  };
}

export function runVirtualVibrationTest(
  design: PackagingDesign,
  product: Product,
  material: MaterialProperties,
  options: VibrationTestInput
) {
  // Speed assumptions for transit duration
  const speedKmh: Record<string, number> = {
    ASTM_D4169_Truck: 65,
    ISTA_3A_Air: 550,
    ISO_13355_Rail: 50
  };
  const avgSpeed = speedKmh[options.transportProfile] || 65;
  const estimatedDurationHours = Number((options.travelDistanceKm / avgSpeed).toFixed(1));

  // Natural Resonance Frequency of package-product spring mass system: fn = (1 / 2pi) * sqrt(k / m)
  const cushionOption = CUSHIONING_OPTIONS.find(c => c.type === design.cushioningType) || CUSHIONING_OPTIONS[0];
  const stiffness = 12000 * Math.max(0.3, cushionOption.dampingEfficiencyEta); // N/m
  const massKg = Math.max(product.weight / 1000, 0.05);
  const resonancePeakHz = Number(((1 / (2 * Math.PI)) * Math.sqrt(stiffness / massKg)).toFixed(1));

  // Transport power spectral density resonance hazard ranges:
  // Truck: major energy at 3 - 18 Hz (suspension & tire bounce)
  // Rail: 2 - 10 Hz
  // Air: 20 - 200 Hz
  let inResonanceZone = false;
  if (options.transportProfile === 'ASTM_D4169_Truck' && resonancePeakHz >= 3 && resonancePeakHz <= 18) {
    inResonanceZone = true;
  } else if (options.transportProfile === 'ISO_13355_Rail' && resonancePeakHz >= 2 && resonancePeakHz <= 10) {
    inResonanceZone = true;
  }

  // Fatigue score (0-100, 100 is undamaged)
  const distanceWearFactor = Math.min(30, (options.travelDistanceKm / 1000) * 4);
  const resonanceWearPenalty = inResonanceZone ? 25 : 5;
  const fatigueDamageScore = Math.max(25, Math.round(100 - distanceWearFactor - resonanceWearPenalty));

  const abrasionRisk: 'low' | 'moderate' | 'high' =
    product.surfaceSensitivity === 'scratch_prone' && design.internalClearanceMm > 4
      ? 'high'
      : inResonanceZone
      ? 'moderate'
      : 'low';

  const pass = fatigueDamageScore >= 65 && abrasionRisk !== 'high';

  const engineeringObservations = pass
    ? `Resonance frequency (${resonancePeakHz} Hz) exhibits adequate separation from road excitation bands. Vibration damping index is healthy (${fatigueDamageScore}/100) over ${options.travelDistanceKm} km with low scuffing risk.`
    : `Vibration risk identified! Natural frequency (${resonancePeakHz} Hz) couples with vehicle harmonic bands. Surface sensitivity rating '${product.surfaceSensitivity}' under ${estimatedDurationHours} hours of transit creates elevated abrasion risk. Consider non-abrasive tissue wrap or tighter clearance.`;

  return {
    transportProfile: options.transportProfile,
    travelDistanceKm: options.travelDistanceKm,
    estimatedDurationHours,
    resonancePeakHz,
    fatigueDamageScore,
    abrasionRisk,
    pass,
    engineeringObservations,
    disclaimer: 'Virtual simulation is an engineering estimate and does not replace physical testing or certification.'
  };
}
