import { BenchmarkData } from '../types';

export const GLOBAL_INDUSTRY_BENCHMARKS: Record<string, BenchmarkData> = {
  'Cosmetics & Personal Care': {
    industry: 'Cosmetics & Personal Care',
    avgCostPerPackage: 24.5, // INR
    avgCarbonKg: 0.165,
    avgProtectionScore: 78,
    avgMaterialEfficiencyPercent: 64,
    avgSpaceUtilizationPercent: 68,
    topQuartileCost: 18.2,
    topQuartileCarbon: 0.088,
    topQuartileProtection: 92
  },
  'Consumer Electronics': {
    industry: 'Consumer Electronics',
    avgCostPerPackage: 42.0,
    avgCarbonKg: 0.280,
    avgProtectionScore: 82,
    avgMaterialEfficiencyPercent: 71,
    avgSpaceUtilizationPercent: 74,
    topQuartileCost: 32.5,
    topQuartileCarbon: 0.140,
    topQuartileProtection: 95
  },
  'Home & Kitchen': {
    industry: 'Home & Kitchen (Fragile Ceramic/Glassware)',
    avgCostPerPackage: 31.0,
    avgCarbonKg: 0.210,
    avgProtectionScore: 76,
    avgMaterialEfficiencyPercent: 58,
    avgSpaceUtilizationPercent: 62,
    topQuartileCost: 23.0,
    topQuartileCarbon: 0.115,
    topQuartileProtection: 94
  },
  'Food & Beverage': {
    industry: 'Food & Beverage',
    avgCostPerPackage: 15.5,
    avgCarbonKg: 0.095,
    avgProtectionScore: 70,
    avgMaterialEfficiencyPercent: 82,
    avgSpaceUtilizationPercent: 78,
    topQuartileCost: 11.8,
    topQuartileCarbon: 0.045,
    topQuartileProtection: 86
  }
};
