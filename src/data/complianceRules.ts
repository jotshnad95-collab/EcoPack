import { ComplianceCheckResult } from '../types';

export const COMPLIANCE_RULES: ComplianceCheckResult[] = [
  {
    id: 'rule-eu-ppwr-empty-space',
    jurisdiction: 'European Union (PPWR)',
    category: 'Packaging Waste',
    status: 'compliant',
    ruleTitle: 'Article 9: Maximum 40% Empty Space Ratio',
    description: 'Under EU PPWR by 2030, e-commerce and group packaging must not exceed 40% void space ratio (cushioning + empty space).',
    actionRequired: 'Ensure internal clearance and cushioning thickness keep void space below 38%.'
  },
  {
    id: 'rule-eu-ppwr-recyclability',
    jurisdiction: 'European Union (PPWR)',
    category: 'Recyclability',
    status: 'compliant',
    ruleTitle: 'Article 6: Design for Recyclability (Grade A/B)',
    description: 'All packaging marketed in the EU must achieve Recyclability Performance Grade A (≥95%) or Grade B (≥80%) by 2030.',
    actionRequired: 'Mono-material paperboard or corrugated box meets Grade A curbside recycling criteria.'
  },
  {
    id: 'rule-eu-pfas-ban',
    jurisdiction: 'European Union (PPWR)',
    category: 'Material Restrictions',
    status: 'compliant',
    ruleTitle: 'Restriction on PFAS / "Forever Chemicals" in Fiber Food Contact',
    description: 'EU regulations ban intentionally added PFAS grease-proofing agents in paper and molded pulp packaging.',
    actionRequired: 'Verify supplier provides PFAS-free barrier coating certification.'
  },
  {
    id: 'rule-us-epr-ca-sb54',
    jurisdiction: 'United States (EPR)',
    category: 'Recyclability',
    status: 'compliant',
    ruleTitle: 'California SB 54 Plastic Pollution Prevention & Packaging EPR',
    description: 'Requires all packaging in California to be 100% recyclable or compostable by 2032 with tiered producer fees for non-recyclables.',
    actionRequired: 'Maintain curbside recyclability certification (How2Recycle label pre-check).'
  },
  {
    id: 'rule-us-toxics-pbt',
    jurisdiction: 'United States (EPR)',
    category: 'Material Restrictions',
    status: 'compliant',
    ruleTitle: 'CONEG Heavy Metals Limitation (TPCH Model)',
    description: 'Combined sum of Lead, Cadmium, Mercury, and Hexavalent Chromium in packaging materials and printing inks must not exceed 100 ppm.',
    actionRequired: 'Specify heavy-metal-free water-based flexographic inks.'
  },
  {
    id: 'rule-in-pwm-epr',
    jurisdiction: 'India (PWM / EPR)',
    category: 'Packaging Waste',
    status: 'compliant',
    ruleTitle: 'Plastic Waste Management Rules (CPCB EPR Portal Registration)',
    description: 'Mandates registered EPR compliance and annual recycling quota for Category I (Rigid), Category II (Flexible), and Category III (Multi-layered) plastics.',
    actionRequired: 'By choosing mono-material corrugated and molded pulp, plastic EPR liability is reduced to zero.'
  },
  {
    id: 'rule-uk-ppt',
    jurisdiction: 'UK (PPT)',
    category: 'Material Restrictions',
    status: 'compliant',
    ruleTitle: 'UK Plastic Packaging Tax (£217.85/tonne)',
    description: 'Applies to plastic packaging manufactured or imported into the UK containing less than 30% recycled plastic content.',
    actionRequired: 'Plastic components must have verified ≥30% post-consumer recycled content or use fiber alternatives.'
  },
  {
    id: 'rule-cosmetics-leachables',
    jurisdiction: 'Global',
    category: 'Food/Cosmetics Contact',
    status: 'warning',
    ruleTitle: 'Direct & Indirect Migration of Mineral Oils (MOSH / MOAH)',
    description: 'Recycled paperboard may contain mineral oil residues that migrate into primary cosmetics or food products unless functional barrier is used.',
    actionRequired: 'Since primary product is in glass bottle with sealed cap, indirect contact risk is low. If directly nested, use virgin liner or barrier pouch.'
  },
  {
    id: 'rule-labelling-mobius',
    jurisdiction: 'Global',
    category: 'Labelling & Markings',
    status: 'compliant',
    ruleTitle: 'ISO 14021 Mobius Loop & Material Identification Codes (PAP 20)',
    description: 'Standardized recycling symbols must specify PAP 20 for corrugated board and PAP 21 for paperboard to assist consumer sorting.',
    actionRequired: 'Include PAP 20 resin code and "Please Recycle Me" logo on bottom closure flap.'
  }
];

export const COMPLIANCE_DISCLAIMER =
  'Regulatory information is decision support only. Verify with the relevant authority or qualified compliance professional before commercial manufacturing.';
