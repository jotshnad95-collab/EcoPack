import { SupplierItem } from '../types';

export const DEMO_SUPPLIERS: SupplierItem[] = [
  {
    id: 'supp-1',
    name: 'EcoFiber Solutions Ltd.',
    location: 'Bhiwandi, Maharashtra',
    country: 'India',
    materials: ['corrugated_c_flute', 'corrugated_b_flute', 'kraft_paper', 'molded_pulp'],
    moq: 5000,
    unitCostRange: { min: 14, max: 24 }, // in INR
    certifications: ['FSC Recycled 100%', 'ISO 14001:2015', 'SEDEX SMETA 4-Pillar'],
    recycledContentMaxPercent: 95,
    manufacturingCapabilities: ['High-speed Corrugated Casemaker', 'Thermoformed Pulp Tooling', 'Water-based Flexo 4C'],
    leadTimeWeeks: 2.5,
    contactEmail: 'sales@ecofibersolutions.demo',
    verified: true
  },
  {
    id: 'supp-2',
    name: 'GreenMould Packaging Corp.',
    location: 'Hosur Industrial Area, Tamil Nadu',
    country: 'India',
    materials: ['molded_pulp', 'recycled_paperboard'],
    moq: 10000,
    unitCostRange: { min: 12, max: 20 },
    certifications: ['FSC Mixed Sources', 'TUV OK Compost Home', 'ISO 9001:2015'],
    recycledContentMaxPercent: 100,
    manufacturingCapabilities: ['Precision Bagasse Dry-Press Molding', 'Custom Inset Tooling CNC', 'Laser Die Cut'],
    leadTimeWeeks: 3.0,
    contactEmail: 'engineering@greenmould.demo',
    verified: true
  },
  {
    id: 'supp-3',
    name: 'Nordic Circular Pack Oy',
    location: 'Helsinki',
    country: 'Finland',
    materials: ['kraft_paper', 'corrugated_b_flute', 'biodegradable_foam'],
    moq: 15000,
    unitCostRange: { min: 22, max: 38 },
    certifications: ['PEFC Certified', 'EU Ecolabel', 'Cradle to Cradle Silver'],
    recycledContentMaxPercent: 85,
    manufacturingCapabilities: ['Microflute Offset Printing', 'Foil Free Metallic Sheen', 'Automated Taping'],
    leadTimeWeeks: 4.5,
    contactEmail: 'inquiries@nordiccircular.demo',
    verified: true
  },
  {
    id: 'supp-4',
    name: 'PureBio Polymers & Packaging',
    location: 'Ahmedabad, Gujarat',
    country: 'India',
    materials: ['pla', 'bioplastic_starch', 'biodegradable_foam'],
    moq: 7500,
    unitCostRange: { min: 18, max: 32 },
    certifications: ['EN 13432 Compostable', 'BPI Certified', 'ISO 14001'],
    recycledContentMaxPercent: 60,
    manufacturingCapabilities: ['Cornstarch Foam Extrusion', 'Bio-pellet Injection Mold', 'Ultrasonic Sealing'],
    leadTimeWeeks: 3.5,
    contactEmail: 'info@purebiopack.demo',
    verified: false
  },
  {
    id: 'supp-5',
    name: 'Coastal Circular Plastics Alliance',
    location: 'Surat, Gujarat',
    country: 'India',
    materials: ['recycled_ocean_plastic', 'recycled_pet', 'hdpe'],
    moq: 12000,
    unitCostRange: { min: 16, max: 28 },
    certifications: ['Ocean Bound Plastic (OBP) Certified', 'GRS (Global Recycled Standard)', 'FDA Food Contact Letter of Non-Objection'],
    recycledContentMaxPercent: 100,
    manufacturingCapabilities: ['PCR Decontamination Washing', 'Optical Sorting Blister Forming', 'Cleanroom Packaging'],
    leadTimeWeeks: 3.0,
    contactEmail: 'commercial@coastalcircular.demo',
    verified: true
  }
];
