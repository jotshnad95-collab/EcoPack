export type Currency = 'INR' | 'USD';
export type UnitSystem = 'metric'; // mm, g, kg

export type FragilityLevel = 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
export type SurfaceSensitivity = 'standard' | 'scratch_prone' | 'static_sensitive' | 'moisture_sensitive';
export type ProductShape = 'cuboid' | 'cylinder' | 'bottle' | 'irregular';

export type TransportModeType = 'road' | 'rail' | 'air' | 'sea';

export interface Product {
  id: string;
  name: string;
  category: string;
  length: number; // mm
  width: number;  // mm
  height: number; // mm
  weight: number; // grams
  shape: ProductShape;
  fragility: FragilityLevel;
  fragilityGMax: number; // Maximum allowable G-force before damage (e.g. 30G for glass)
  surfaceSensitivity: SurfaceSensitivity;
  unitValue: number; // Product cost/value for damage risk calculation
}

export interface ProjectRequirements {
  purpose: 'e-commerce' | 'retail' | 'industrial' | 'cold-chain';
  targetCost: number; // target cost in current currency (e.g., 20 INR)
  annualQuantity: number;
  maxDimensions: {
    length: number;
    width: number;
    height: number;
  };
  maxWeight: number; // grams
  sustainabilityTarget: number; // 0-100 target score
  brandingStyle: 'minimalist' | 'kraft_eco' | 'premium_printed' | 'luxury_embossed';
}

export interface LogisticsSpec {
  shippingDistanceKm: number;
  transportMode: TransportModeType;
  annualShipments: number;
  containerType: 'standard_truck_53ft' | 'container_20ft' | 'container_40ft';
}

export interface OptimizationWeights {
  protection: number;    // 0 - 100
  cost: number;          // 0 - 100
  sustainability: number;// 0 - 100
  branding: number;      // 0 - 100
  logistics: number;     // 0 - 100
  materialEfficiency: number; // 0 - 100
}

export type MaterialId =
  | 'corrugated_c_flute'
  | 'corrugated_b_flute'
  | 'kraft_paper'
  | 'recycled_paperboard'
  | 'molded_pulp'
  | 'recycled_pet'
  | 'hdpe'
  | 'pla'
  | 'bioplastic_starch'
  | 'aluminum'
  | 'glass'
  | 'biodegradable_foam'
  | 'recycled_ocean_plastic';

export interface MaterialProperties {
  id: MaterialId;
  name: string;
  category: 'paper_fiber' | 'plastic' | 'bio' | 'metal' | 'glass' | 'cushion';
  densityGcm3: number;        // g/cm³
  costPerKg: number;          // Base cost in USD (converted to INR at live multiplier ~85)
  carbonFactorKgCo2PerKg: number; // kg CO2e per kg material
  tensileStrengthMpa: number; // MPa
  burstStrengthKpa: number;   // kPa / Mullen burst
  ectKnM: number;             // Edge Crush Test kN/m (for corrugated/board)
  recyclabilityPercent: number; // 0-100%
  recycledContentPercent: number; // 0-100%
  moistureResistanceScore: number; // 0-100
  fragilitySuitability: FragilityLevel[];
  endOfLifeScore: number;     // 0-100 (compostability, circular infrastructure)
  description: string;
  colorHex: string;
  roughness: number;
  transparency: number;
}

export type CushioningType =
  | 'none'
  | 'molded_pulp_endcaps'
  | 'honeycomb_kraft'
  | 'corrugated_die_cut'
  | 'biodegradable_air_pillows'
  | 'bio_foam_corners'
  | 'shredded_paper_fill';

export interface PackagingDesign {
  id: string;
  projectId: string;
  name: string;
  tagline: string;
  type: 'corrugated_box' | 'folding_carton' | 'molded_pulp_clamshell' | 'paperboard_mailer' | 'hybrid_box';
  materialId: MaterialId;
  cushioningType: CushioningType;
  cushioningThicknessMm: number; // mm
  internalClearanceMm: number;   // mm snugness clearance
  wallThicknessMm: number;        // mm

  // Outer Dimensions (mm)
  outerLength: number;
  outerWidth: number;
  outerHeight: number;

  // Calculated Physical Properties
  tareWeightGrams: number;
  packageVolumeCm3: number;
  materialAreaM2: number;

  // Cost Engine Breakdown
  costBreakdown: {
    materialCost: number;
    manufacturingCost: number;
    printingCost: number;
    assemblyCost: number;
    cushioningCost: number;
    transportCostShare: number;
    totalCostPerPackage: number;
    annualTotalCost: number;
    savingsPerPackageVsBaseline: number;
    annualSavingsVsBaseline: number;
    savingsPercentVsBaseline: number;
    calculationExplanation?: {
      materialFormula: string;
      cushioningFormula: string;
      manufacturingFormula: string;
      transportFormula: string;
    };
  };

  // Carbon Engine Breakdown
  carbonBreakdown: {
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
  };

  // Protection Engine Breakdown
  protectionBreakdown: {
    overallProtectionScore: number; // 0-100
    impactProtectionScore: number;  // 0-100
    compressionScore: number;       // 0-100
    cushioningScore: number;        // 0-100
    structuralStabilityScore: number; // 0-100
    productFitScore: number;        // 0-100
    gForceExperienced: number;      // Estimated G in standard 1.0m drop
    gForceSafetyMargin: number;     // ratio
    boxCompressionCapacityKg: number; // BCT in kg
    stackingLoadKg: number;          // dynamic load at 2.5m stack
    whyExplanation: string;
  };

  // Logistics & Carbon Breakdown
  logisticsBreakdown: {
    volumetricWeightKg: number;
    boxesPerPallet: number;
    palletsPerTruck: number;
    boxesPerTruck: number;
    truckSpaceUtilizationPercent: number;
    packagingEfficiencyScore: number; // 0-100
  };

  // Scores (0-100)
  scores: {
    costScore: number;
    protectionScore: number;
    sustainabilityScore: number;
    logisticsScore: number;
    materialEfficiencyScore: number;
    brandingScore: number;
    overallWeightedScore: number;
  };

  isRecommended?: boolean;
  isBaseline?: boolean;
  whyThisDesign?: string;
  tradeOffs?: string;
  potentialRisks?: string;
}

export interface ValidationSimulationResult {
  dropTest: {
    dropHeightMeters: number;
    impactSurface: 'concrete' | 'hardwood' | 'packed_earth';
    orientation: 'corner' | 'edge' | 'flat_bottom' | 'flat_face';
    impactVelocityMs: number;
    peakGForce: number;
    allowableGForce: number;
    cushioningDeflectionMm: number;
    riskLevel: 'safe' | 'caution' | 'critical_failure';
    estimatedProtectionPercent: number;
    engineeringObservations: string;
  };
  compressionTest: {
    warehouseStackHeightMeters: number;
    durationDays: number;
    ambientHumidityPercent: number;
    totalDeadWeightKg: number;
    dynamicSafetyFactor: number;
    requiredCapacityKg: number;
    calculatedBctKg: number;
    safetyMarginPercent: number;
    pass: boolean;
    engineeringObservations: string;
  };
  vibrationTest: {
    transportProfile: 'ASTM_D4169_Truck' | 'ISTA_3A_Air' | 'ISO_13355_Rail';
    travelDistanceKm: number;
    estimatedDurationHours: number;
    resonancePeakHz: number;
    fatigueDamageScore: number; // 0-100
    abrasionRisk: 'low' | 'moderate' | 'high';
    pass: boolean;
    engineeringObservations: string;
  };
}

export interface SupplierItem {
  id: string;
  name: string;
  location: string;
  country: string;
  materials: MaterialId[];
  moq: number; // units
  unitCostRange: { min: number; max: number };
  certifications: string[];
  recycledContentMaxPercent: number;
  manufacturingCapabilities: string[];
  leadTimeWeeks: number;
  contactEmail: string;
  verified: boolean;
}

export interface ComplianceCheckResult {
  id: string;
  jurisdiction: 'Global' | 'European Union (PPWR)' | 'United States (EPR)' | 'India (PWM / EPR)' | 'UK (PPT)';
  category: 'Material Restrictions' | 'Recyclability' | 'Labelling & Markings' | 'Food/Cosmetics Contact' | 'Packaging Waste';
  status: 'compliant' | 'warning' | 'non_compliant';
  ruleTitle: string;
  description: string;
  actionRequired: string;
}

export interface BenchmarkData {
  industry: string;
  avgCostPerPackage: number;
  avgCarbonKg: number;
  avgProtectionScore: number;
  avgMaterialEfficiencyPercent: number;
  avgSpaceUtilizationPercent: number;
  topQuartileCost: number;
  topQuartileCarbon: number;
  topQuartileProtection: number;
}
