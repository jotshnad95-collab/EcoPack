import { Product, ProjectRequirements, LogisticsSpec, OptimizationWeights } from '../types';

export interface ProjectPreset {
  id: string;
  name: string;
  product: Product;
  requirements: ProjectRequirements;
  logistics: LogisticsSpec;
  weights: OptimizationWeights;
}

export const DEMO_PROJECT_PRESETS: ProjectPreset[] = [
  {
    id: 'proj-fragile-cosmetics',
    name: 'Fragile Glass Cosmetic Bottle',
    product: {
      id: 'prod-glass-cosmetic',
      name: 'Luxury Botanical Facial Serum Bottle',
      category: 'Cosmetics & Personal Care',
      length: 80,
      width: 80,
      height: 180,
      weight: 450, // grams
      shape: 'bottle',
      fragility: 'high',
      fragilityGMax: 35, // 35 G shock limit
      surfaceSensitivity: 'scratch_prone',
      unitValue: 1200 // INR
    },
    requirements: {
      purpose: 'e-commerce',
      targetCost: 20, // ₹20/package
      annualQuantity: 65000,
      maxDimensions: {
        length: 150,
        width: 150,
        height: 250
      },
      maxWeight: 750,
      sustainabilityTarget: 90,
      brandingStyle: 'kraft_eco'
    },
    logistics: {
      shippingDistanceKm: 500,
      transportMode: 'road',
      annualShipments: 45,
      containerType: 'standard_truck_53ft'
    },
    weights: {
      protection: 30,
      cost: 20,
      sustainability: 25,
      branding: 10,
      logistics: 15,
      materialEfficiency: 15
    }
  },
  {
    id: 'proj-electronics',
    name: 'E-commerce Electronics Box',
    product: {
      id: 'prod-audio-dac',
      name: 'Audiophile USB-C DAC & Amp',
      category: 'Consumer Electronics',
      length: 160,
      width: 100,
      height: 40,
      weight: 320,
      shape: 'cuboid',
      fragility: 'moderate',
      fragilityGMax: 50,
      surfaceSensitivity: 'static_sensitive',
      unitValue: 3500
    },
    requirements: {
      purpose: 'e-commerce',
      targetCost: 35,
      annualQuantity: 40000,
      maxDimensions: {
        length: 220,
        width: 150,
        height: 80
      },
      maxWeight: 550,
      sustainabilityTarget: 85,
      brandingStyle: 'premium_printed'
    },
    logistics: {
      shippingDistanceKm: 1200,
      transportMode: 'road',
      annualShipments: 30,
      containerType: 'standard_truck_53ft'
    },
    weights: {
      protection: 25,
      cost: 25,
      sustainability: 20,
      branding: 15,
      logistics: 15,
      materialEfficiency: 10
    }
  },
  {
    id: 'proj-ceramic',
    name: 'Fragile Ceramic Package',
    product: {
      id: 'prod-ceramic-mug',
      name: 'Artisanal Ceramic Glazed Mug',
      category: 'Home & Kitchen',
      length: 120,
      width: 120,
      height: 150,
      weight: 580,
      shape: 'cylinder',
      fragility: 'very_high',
      fragilityGMax: 25,
      surfaceSensitivity: 'standard',
      unitValue: 850
    },
    requirements: {
      purpose: 'e-commerce',
      targetCost: 28,
      annualQuantity: 25000,
      maxDimensions: {
        length: 180,
        width: 180,
        height: 220
      },
      maxWeight: 850,
      sustainabilityTarget: 80,
      brandingStyle: 'kraft_eco'
    },
    logistics: {
      shippingDistanceKm: 800,
      transportMode: 'rail',
      annualShipments: 20,
      containerType: 'container_20ft'
    },
    weights: {
      protection: 40,
      cost: 20,
      sustainability: 20,
      branding: 5,
      logistics: 15,
      materialEfficiency: 10
    }
  },
  {
    id: 'proj-food',
    name: 'Food Delivery Package',
    product: {
      id: 'prod-organic-salad',
      name: 'Organic Gourmet Meal Kit Bowl',
      category: 'Food & Beverage',
      length: 200,
      width: 150,
      height: 80,
      weight: 420,
      shape: 'cuboid',
      fragility: 'low',
      fragilityGMax: 80,
      surfaceSensitivity: 'moisture_sensitive',
      unitValue: 350
    },
    requirements: {
      purpose: 'retail',
      targetCost: 14,
      annualQuantity: 120000,
      maxDimensions: {
        length: 240,
        width: 180,
        height: 110
      },
      maxWeight: 520,
      sustainabilityTarget: 95,
      brandingStyle: 'minimalist'
    },
    logistics: {
      shippingDistanceKm: 25,
      transportMode: 'road',
      annualShipments: 300,
      containerType: 'standard_truck_53ft'
    },
    weights: {
      protection: 15,
      cost: 35,
      sustainability: 30,
      branding: 5,
      logistics: 20,
      materialEfficiency: 15
    }
  }
];
