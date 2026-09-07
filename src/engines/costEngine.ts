import { Product, ProjectRequirements, LogisticsSpec, MaterialProperties, CushioningType } from '../types';
import { MATERIALS_DATABASE, CUSHIONING_OPTIONS } from '../data/materials';

export interface CostCalculationInput {
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

export interface CostResult {
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
  calculationExplanation: {
    materialFormula: string;
    cushioningFormula: string;
    manufacturingFormula: string;
    transportFormula: string;
  };
}

export function calculatePackageCost(
  input: CostCalculationInput,
  baselineCost?: number,
  currency: 'INR' | 'USD' = 'INR'
): CostResult {
  const currencyMultiplier = currency === 'INR' ? 85 : 1; // 1 USD = 85 INR standard conversion

  // 1. Box Blank Surface Area (m²) with 15% die-cutting scrap factor
  const l_m = input.outerLengthMm / 1000;
  const w_m = input.outerWidthMm / 1000;
  const h_m = input.outerHeightMm / 1000;
  const t_m = input.wallThicknessMm / 1000;

  // FEFCO 0201 regular slotted carton blank area: (2L + 2W + joint) * (H + W)
  const blankAreaM2 = (2 * l_m + 2 * w_m + 0.04) * (h_m + w_m);
  const blankAreaWithScrap = blankAreaM2 * 1.15;

  // Box Material Mass (kg)
  const densityKgM3 = input.material.densityGcm3 * 1000; // g/cm³ to kg/m³
  const boardVolumeM3 = blankAreaWithScrap * t_m;
  const materialWeightKg = boardVolumeM3 * densityKgM3;

  // Raw Material Cost (USD)
  const rawMaterialCostUSD = materialWeightKg * input.material.costPerKg;

  // 2. Manufacturing, Tooling & Die-cutting (amortized over annual run)
  const toolingAmortizationUSD = 450 / Math.max(input.requirements.annualQuantity, 5000);
  const machineConversionUSD = 0.035 + (t_m * 10); // heavier board takes more machine stroke energy
  const manufacturingCostUSD = toolingAmortizationUSD + machineConversionUSD;

  // 3. Printing (based on branding style)
  let printingCostUSD = 0.02; // basic 1-color barcode
  if (input.requirements.brandingStyle === 'kraft_eco') {
    printingCostUSD = 0.035; // 2-color water-based soy ink
  } else if (input.requirements.brandingStyle === 'premium_printed') {
    printingCostUSD = 0.085; // 4-color process + aqueous coating
  } else if (input.requirements.brandingStyle === 'luxury_embossed') {
    printingCostUSD = 0.16; // foil stamping / embossing
  }

  // 4. Assembly & Labor (folding carton vs rigid setup)
  const assemblyCostUSD = 0.025; // automated folder-gluer

  // 5. Cushioning Insert Cost
  const cushionOption = CUSHIONING_OPTIONS.find(c => c.type === input.cushioningType) || CUSHIONING_OPTIONS[0];
  
  // Cushioning volume (liters) = outer box cavity - product volume
  const outerVolumeLiters = (input.outerLengthMm * input.outerWidthMm * input.outerHeightMm) / 1_000_000;
  const productVolumeLiters = (input.product.length * input.product.width * input.product.height) / 1_000_000;
  const voidVolumeLiters = Math.max(0, outerVolumeLiters - productVolumeLiters);
  
  // Cushioning fill ratio based on thickness
  const cushionFillFactor = Math.min(0.85, (input.cushioningThicknessMm * 2) / Math.max(input.product.length, 50));
  const effectiveCushionVolumeLiters = voidVolumeLiters * cushionFillFactor;
  const cushioningCostUSD = effectiveCushionVolumeLiters * cushionOption.costPerLiterUSD;

  // 6. Transport Cost Share allocated per package
  // Typical freight rate: Road $0.06/ton-km, Rail $0.03, Air $0.90, Sea $0.015
  const modeRatePerTonKm: Record<string, number> = {
    road: 0.08,
    rail: 0.035,
    air: 0.95,
    sea: 0.02
  };
  const ratePerTonKm = modeRatePerTonKm[input.logistics.transportMode] || 0.08;
  const totalPackageWeightKg = (input.product.weight / 1000) + materialWeightKg + (effectiveCushionVolumeLiters * cushionOption.densityGcm3);
  const transportCostShareUSD = (totalPackageWeightKg / 1000) * input.logistics.shippingDistanceKm * ratePerTonKm;

  // Total Unit Cost (USD)
  const totalCostUSD = rawMaterialCostUSD + manufacturingCostUSD + printingCostUSD + assemblyCostUSD + cushioningCostUSD + transportCostShareUSD;
  
  // Converted to target currency
  const totalCost = Number((totalCostUSD * currencyMultiplier).toFixed(2));
  const materialCost = Number((rawMaterialCostUSD * currencyMultiplier).toFixed(2));
  const manufacturingCost = Number((manufacturingCostUSD * currencyMultiplier).toFixed(2));
  const printingCost = Number((printingCostUSD * currencyMultiplier).toFixed(2));
  const assemblyCost = Number((assemblyCostUSD * currencyMultiplier).toFixed(2));
  const cushioningCost = Number((cushioningCostUSD * currencyMultiplier).toFixed(2));
  const transportCostShare = Number((transportCostShareUSD * currencyMultiplier).toFixed(2));

  const annualTotalCost = Math.round(totalCost * input.requirements.annualQuantity);

  // Baseline Comparison
  const baseCost = baselineCost ?? (totalCost * 1.35); // default 35% higher baseline if not provided
  const savingsPerPackage = Number((baseCost - totalCost).toFixed(2));
  const annualSavings = Math.round(savingsPerPackage * input.requirements.annualQuantity);
  const savingsPercent = Number(((savingsPerPackage / baseCost) * 100).toFixed(1));

  return {
    materialCost,
    manufacturingCost,
    printingCost,
    assemblyCost,
    cushioningCost,
    transportCostShare,
    totalCostPerPackage: totalCost,
    annualTotalCost,
    savingsPerPackageVsBaseline: savingsPerPackage,
    annualSavingsVsBaseline: annualSavings,
    savingsPercentVsBaseline: savingsPercent,
    calculationExplanation: {
      materialFormula: `Blank Area (${blankAreaM2.toFixed(3)} m² × 1.15 scrap) × ${input.wallThicknessMm} mm × ${input.material.densityGcm3} g/cm³ = ${Math.round(materialWeightKg * 1000)} g @ ${currency === 'INR' ? '₹' + Math.round(input.material.costPerKg * currencyMultiplier) : '$' + input.material.costPerKg}/kg`,
      cushioningFormula: `Effective Void Volume ${effectiveCushionVolumeLiters.toFixed(2)} L × ${cushionOption.name}`,
      manufacturingFormula: `Tooling amortization (₹450 / ${input.requirements.annualQuantity.toLocaleString()} units) + Rotary Die Conversion`,
      transportFormula: `Gross Weight ${(totalPackageWeightKg * 1000).toFixed(0)} g × ${input.logistics.shippingDistanceKm} km via ${input.logistics.transportMode.toUpperCase()}`
    }
  };
}
