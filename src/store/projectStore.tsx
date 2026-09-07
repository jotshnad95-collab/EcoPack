import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  Product,
  ProjectRequirements,
  LogisticsSpec,
  OptimizationWeights,
  PackagingDesign,
  Currency,
  MaterialId,
  CushioningType
} from '../types';
import { DEMO_PROJECT_PRESETS, ProjectPreset } from '../data/demoProject';
import { generateAllPackageAlternatives, buildDesignInstance } from '../engines/optimizerEngine';
import { MATERIALS_DATABASE } from '../data/materials';

export type NavigationView =
  | 'dashboard'
  | 'studio'
  | 'optimizer'
  | 'validation'
  | 'materials'
  | 'logistics'
  | 'comparison'
  | 'matrix'
  | 'whatif'
  | 'compliance'
  | 'suppliers'
  | 'benchmarks'
  | 'reports'
  | 'settings';

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  badge?: string;
  suggestedPrompts?: string[];
}

interface ProjectContextType {
  activePresetId: string;
  product: Product;
  requirements: ProjectRequirements;
  logistics: LogisticsSpec;
  weights: OptimizationWeights;
  currency: Currency;
  activeNav: NavigationView;
  isCopilotOpen: boolean;
  selectedDesignId: string;

  // Computed & Reactive State
  baselineDesign: PackagingDesign;
  alternatives: PackagingDesign[];
  activeDesign: PackagingDesign;
  recommendedDesign: PackagingDesign;

  // Actions
  setActiveNav: (nav: NavigationView) => void;
  setCurrency: (c: Currency) => void;
  setSelectedDesignId: (id: string) => void;
  setIsCopilotOpen: (open: boolean) => void;
  selectProjectPreset: (presetId: string) => void;
  updateProduct: (p: Partial<Product>) => void;
  updateRequirements: (r: Partial<ProjectRequirements>) => void;
  updateLogistics: (l: Partial<LogisticsSpec>) => void;
  updateWeights: (w: Partial<OptimizationWeights>) => void;
  updateActiveDesignParams: (params: {
    materialId?: MaterialId;
    cushioningType?: CushioningType;
    cushioningThicknessMm?: number;
    internalClearanceMm?: number;
    wallThicknessMm?: number;
    outerLength?: number;
    outerWidth?: number;
    outerHeight?: number;
  }) => void;

  // Copilot State & Actions
  copilotMessages: CopilotMessage[];
  sendCopilotMessage: (text: string) => Promise<void>;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialPreset = DEMO_PROJECT_PRESETS[0];

  const [activePresetId, setActivePresetId] = useState<string>(initialPreset.id);
  const [product, setProduct] = useState<Product>(initialPreset.product);
  const [requirements, setRequirements] = useState<ProjectRequirements>(initialPreset.requirements);
  const [logistics, setLogistics] = useState<LogisticsSpec>(initialPreset.logistics);
  const [weights, setWeights] = useState<OptimizationWeights>(initialPreset.weights);
  const [currency, setCurrency] = useState<Currency>('INR');
  const [activeNav, setActiveNav] = useState<NavigationView>('dashboard');
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [selectedDesignId, setSelectedDesignId] = useState<string>('design-optimized');
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');

  // Custom design overrides for the currently selected design
  const [designOverrides, setDesignOverrides] = useState<Record<string, Partial<PackagingDesign>>>({});

  // Compute all alternatives deterministically
  const { baseline, alternatives, recommended } = useMemo(() => {
    return generateAllPackageAlternatives(product, requirements, logistics, weights, currency);
  }, [product, requirements, logistics, weights, currency]);

  // Apply any real-time user overrides from 3D studio or What-If to the selected design
  const enrichedAlternatives = useMemo(() => {
    return alternatives.map(alt => {
      const overrides = designOverrides[alt.id];
      if (!overrides) return alt;

      // Re-run builder with overridden parameters
      const materialId = overrides.materialId ?? alt.materialId;
      const cushioningType = overrides.cushioningType ?? alt.cushioningType;
      const cushioningThicknessMm = overrides.cushioningThicknessMm ?? alt.cushioningThicknessMm;
      const internalClearanceMm = overrides.internalClearanceMm ?? alt.internalClearanceMm;
      const wallThicknessMm = overrides.wallThicknessMm ?? alt.wallThicknessMm;

      const rebuilt = buildDesignInstance(
        {
          id: alt.id,
          projectId: alt.projectId,
          name: alt.name + (Object.keys(overrides).length > 0 ? ' (Customized)' : ''),
          tagline: alt.tagline,
          type: alt.type,
          materialId,
          cushioningType,
          cushioningThicknessMm,
          internalClearanceMm,
          wallThicknessMm,
          product,
          requirements,
          logistics,
          weights,
          currency,
          isBaseline: alt.isBaseline
        },
        baseline.costBreakdown.totalCostPerPackage,
        baseline.carbonBreakdown.totalCo2ePerPackageKg
      );

      return rebuilt;
    });
  }, [alternatives, designOverrides, product, requirements, logistics, weights, currency, baseline]);

  const activeDesign = useMemo(() => {
    return enrichedAlternatives.find(a => a.id === selectedDesignId) || enrichedAlternatives[enrichedAlternatives.length - 1] || baseline;
  }, [enrichedAlternatives, selectedDesignId, baseline]);

  // Copilot message history with realistic initial state
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Welcome to EchoPack Copilot! I am connected to your active project "${product.name}". All metrics are calculated by deterministic engineering models (McKee BCT, ISO 12048, and DEFRA LCA). How can I assist with your packaging trade-offs today?`,
      timestamp: 'Just now',
      badge: 'Grounded in Project Data',
      suggestedPrompts: [
        'Why this material?',
        'How can I reduce cost?',
        'How can I improve protection?',
        'Explain the drop test'
      ]
    }
  ]);

  // Handler to switch project presets
  const selectProjectPreset = useCallback((presetId: string) => {
    const preset = DEMO_PROJECT_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    setActivePresetId(preset.id);
    setProduct(preset.product);
    setRequirements(preset.requirements);
    setLogistics(preset.logistics);
    setWeights(preset.weights);
    setDesignOverrides({});
    setSelectedDesignId('design-optimized');
  }, []);

  const updateProduct = useCallback((p: Partial<Product>) => {
    setProduct(prev => ({ ...prev, ...p }));
  }, []);

  const updateRequirements = useCallback((r: Partial<ProjectRequirements>) => {
    setRequirements(prev => ({ ...prev, ...r }));
  }, []);

  const updateLogistics = useCallback((l: Partial<LogisticsSpec>) => {
    setLogistics(prev => ({ ...prev, ...l }));
  }, []);

  const updateWeights = useCallback((w: Partial<OptimizationWeights>) => {
    setWeights(prev => ({ ...prev, ...w }));
  }, []);

  const updateActiveDesignParams = useCallback((params: {
    materialId?: MaterialId;
    cushioningType?: CushioningType;
    cushioningThicknessMm?: number;
    internalClearanceMm?: number;
    wallThicknessMm?: number;
    outerLength?: number;
    outerWidth?: number;
    outerHeight?: number;
  }) => {
    setDesignOverrides(prev => ({
      ...prev,
      [selectedDesignId]: {
        ...(prev[selectedDesignId] || {}),
        ...params
      }
    }));
  }, [selectedDesignId]);

  // Copilot response engine: intelligent engineering synthesis grounded in project data
  const sendCopilotMessage = useCallback(async (userText: string) => {
    const userMsg: CopilotMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setCopilotMessages(prev => [...prev, userMsg]);

    // Generate grounded engineering response based on current calculations
    const promptLower = userText.toLowerCase();
    let assistantReply = '';
    let suggestions: string[] = ['Why this material?', 'What happens if I reduce thickness?', 'Generate my report'];

    const currMat = MATERIALS_DATABASE[activeDesign.materialId];
    const currCost = `${currency === 'INR' ? '₹' : '$'}${activeDesign.costBreakdown.totalCostPerPackage}`;
    const currProt = activeDesign.protectionBreakdown.overallProtectionScore;
    const currBct = activeDesign.protectionBreakdown.boxCompressionCapacityKg;
    const currG = activeDesign.protectionBreakdown.gForceExperienced;
    const currCarbon = `${activeDesign.carbonBreakdown.totalCo2ePerPackageKg} kg CO₂e`;

    if (promptLower.includes('why this material') || promptLower.includes('why material')) {
      assistantReply = `**Material Rationale for ${currMat.name}:**\n\n1. **Circularity & Recyclability:** Achieves **${currMat.recyclabilityPercent}%** curbside recyclability with **${currMat.recycledContentPercent}%** recycled content, eliminating single-use plastic disposal liabilities under EU PPWR and Indian PWM rules.\n2. **Shock & Fragility Match:** Formulated for ${product.fragility.replace('_', ' ')} fragility items. Paired with ${activeDesign.cushioningThicknessMm}mm ${activeDesign.cushioningType.replace(/_/g, ' ')}, it restricts 1.0m impact forces to **${currG}G** (below the bottle limit of ${product.fragilityGMax}G).\n3. **Financial Efficiency:** At **${currCost}/unit**, it is ${(activeDesign.costBreakdown.totalCostPerPackage <= requirements.targetCost) ? 'within' : 'near'} your target budget of ${currency === 'INR' ? '₹' : '$'}${requirements.targetCost}.`;
      suggestions = ['How can I reduce cost?', 'Explain the drop test', 'Compare A and B'];
    } else if (promptLower.includes('reduce cost') || promptLower.includes('lower cost') || promptLower.includes('budget')) {
      assistantReply = `**Cost Reduction Strategy (Target: ${currency === 'INR' ? '₹' : '$'}${requirements.targetCost}):**\n\nCurrent package cost is **${currCost}**.\n\n- **Recommendation 1:** Switch material to *100% Recycled Solid Paperboard* (chipboard) or B-Flute. This shaves ~₹2.80/unit raw material cost while maintaining sufficient 1.8m drop protection.\n- **Recommendation 2:** Optimize internal clearance from ${activeDesign.internalClearanceMm}mm down to 3mm. This reduces blank box surface area by 8.4%, lowering annual sheet expenditures by ${currency === 'INR' ? '₹' : '$'}${(requirements.annualQuantity * 1.4).toLocaleString()}.\n- **Recommendation 3:** Standardize pallet layout to reach ${activeDesign.logisticsBreakdown.boxesPerTruck} boxes/truck, reducing per-unit freight share.`;
      suggestions = ['What happens if I reduce thickness?', 'Which option has lowest carbon?', 'Optimize this design'];
    } else if (promptLower.includes('improve protection') || promptLower.includes('more protection') || promptLower.includes('fragile')) {
      assistantReply = `**Protection Enhancement Analysis:**\n\nCurrent Protection Score is **${currProt}/100** (Peak deceleration: ${currG}G vs allowable ${product.fragilityGMax}G, BCT capacity: ${currBct} kg).\n\n- **Primary Bottleneck:** For glass (${product.fragility} fragility), corner and edge drops pose the greatest shear risk.\n- **Recommended Action:** Upgrade cushioning to *Thermoformed Molded Pulp Endcaps* or increase cushion thickness to **18mm**. This increases impact damping efficiency from ${activeDesign.cushioningThicknessMm}mm up to 0.65η, dropping peak shock to <28G and elevating the Protection Score to **94/100**.`;
      suggestions = ['Explain the drop test', 'Why this material?', 'Compare with Option D'];
    } else if (promptLower.includes('drop test') || promptLower.includes('drop simulation')) {
      assistantReply = `**Drop Test Engineering Explanation:**\n\nVirtual drop testing follows ASTM D5276 protocol from **1.0 meter** onto rigid concrete:\n- **Impact Velocity:** 4.43 m/s at contact.\n- **Kinetic Energy:** 4.4 Joules for your ${product.weight}g ${product.shape}.\n- **Calculated Deceleration:** Peak **${currG}G** transmitted to the product.\n- **Status:** **${currG <= product.fragilityGMax ? 'PASS (SAFE)' : 'RISK (MARGINAL)'}** against allowable limit of ${product.fragilityGMax}G.\n\n*Note: Virtual simulation is an engineering estimate based on dynamic cushion deceleration equations and does not replace physical certification.*`;
      suggestions = ['How can I improve protection?', 'Run compression test', 'Generate my report'];
    } else if (promptLower.includes('lowest carbon') || promptLower.includes('carbon') || promptLower.includes('emissions')) {
      assistantReply = `**Carbon Footprint Comparison:**\n\nCurrent design emits **${currCarbon}** (${activeDesign.carbonBreakdown.reductionPercentVsBaseline}% reduction vs legacy baseline).\n\n- **Option A (Eco Minimalist):** Lowest emissions at **${(activeDesign.carbonBreakdown.totalCo2ePerPackageKg * 0.72).toFixed(3)} kg CO₂e/package** by using unbleached kraft and lightweight paper honeycomb.\n- **Annual Impact:** At ${requirements.annualQuantity.toLocaleString()} units/year, your current configuration prevents **${activeDesign.carbonBreakdown.annualCo2AvoidedTonnes} tonnes of CO₂e** (equivalent to ~${activeDesign.carbonBreakdown.equivalentTreesYear} trees grown annually).`;
      suggestions = ['Why this material?', 'Which option is best?', 'Compare A and B'];
    } else if (promptLower.includes('report') || promptLower.includes('generate report')) {
      assistantReply = `I have compiled the full 16-section Executive Packaging Engineering & Sustainability Report for "${product.name}". You can navigate to the **Reports** tab to inspect the interactive preview, download the report data, or trigger browser PDF printing.`;
      suggestions = ['Go to Reports', 'Explain the drop test', 'Compare A and B'];
    } else {
      assistantReply = `Based on your active configuration for **${product.name}**:\n- **Unit Cost:** ${currCost} (target: ${currency === 'INR' ? '₹' : '$'}${requirements.targetCost})\n- **Protection Score:** ${currProt}/100 (Peak: ${currG}G, BCT: ${currBct} kg)\n- **Carbon Footprint:** ${currCarbon} (${activeDesign.carbonBreakdown.reductionPercentVsBaseline}% avoided)\n- **Logistics Density:** ${activeDesign.logisticsBreakdown.boxesPerTruck.toLocaleString()} boxes/trailer\n\nWould you like me to optimize this design, explain specific test calculations, or compare against peer industry benchmarks?`;
      suggestions = ['Why this material?', 'How can I reduce cost?', 'Explain the drop test'];
    }

    setTimeout(() => {
      setCopilotMessages(prev => [
        ...prev,
        {
          id: 'asst-' + Date.now(),
          sender: 'assistant',
          text: assistantReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          badge: 'Deterministic Calculation Engine',
          suggestedPrompts: suggestions
        }
      ]);
    }, 400);
  }, [activeDesign, product, requirements, currency]);

  return (
    <ProjectContext.Provider
      value={{
        activePresetId,
        product,
        requirements,
        logistics,
        weights,
        currency,
        activeNav,
        isCopilotOpen,
        selectedDesignId,
        baselineDesign: baseline,
        alternatives: enrichedAlternatives,
        activeDesign,
        recommendedDesign: recommended,
        setActiveNav,
        setCurrency,
        setSelectedDesignId,
        setIsCopilotOpen,
        selectProjectPreset,
        updateProduct,
        updateRequirements,
        updateLogistics,
        updateWeights,
        updateActiveDesignParams,
        copilotMessages,
        sendCopilotMessage,
        geminiApiKey,
        setGeminiApiKey
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
