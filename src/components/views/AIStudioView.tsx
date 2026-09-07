import React, { useState } from 'react';
import { useProject } from '../../store/projectStore';
import { PackagingViewer3D } from '../3d/PackagingViewer3D';
import { MATERIALS_DATABASE } from '../../data/materials';
import { MaterialId, CushioningType } from '../../types';
import {
  Box,
  Sliders,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  Info,
  HelpCircle,
  Truck,
  Leaf,
  Layers,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';

export const AIStudioView: React.FC = () => {
  const {
    activeDesign,
    product,
    requirements,
    currency,
    updateActiveDesignParams,
    updateProduct,
    setIsCopilotOpen
  } = useProject();

  const [activeTab, setActiveTab] = useState<'box' | 'product' | 'cushion'>('box');
  const [showCostFormula, setShowCostFormula] = useState(false);
  const [showProtectionFormula, setShowProtectionFormula] = useState(false);

  const sym = currency === 'INR' ? '₹' : '$';
  const mat = MATERIALS_DATABASE[activeDesign.materialId];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Box className="w-6 h-6 text-emerald-400" />
            3D AI Design Studio
          </h1>
          <p className="text-sm text-slate-400">
            Interactive 3D packaging simulation. Every dimensional change ripples through the deterministic physics & cost engines in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-emerald-500/40 hover:bg-emerald-950/40 text-emerald-400 font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5" /> Ask Copilot to Optimize
          </button>
        </div>
      </div>

      {/* Main Studio Grid: 3D Viewport on Left, Control Drawer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 3D Viewport (7 cols) */}
        <div className="lg:col-span-7 h-[540px]">
          <PackagingViewer3D design={activeDesign} product={product} />
        </div>

        {/* Right: Engineering Controls & Instant Propagation (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Real-time Calculated Metrics Card */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Calculated Physics State
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Live Dynamic
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Unit Cost</span>
                <span className="text-lg font-bold text-white">
                  {sym}{activeDesign.costBreakdown.totalCostPerPackage}
                </span>
                <button
                  onClick={() => setShowCostFormula(!showCostFormula)}
                  className="text-[10px] text-emerald-400 hover:underline flex items-center justify-center gap-0.5 mx-auto mt-1"
                >
                  <Info className="w-2.5 h-2.5" /> Breakdown
                </button>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Protection</span>
                <span className="text-lg font-bold text-emerald-400">
                  {activeDesign.protectionBreakdown.overallProtectionScore}/100
                </span>
                <button
                  onClick={() => setShowProtectionFormula(!showProtectionFormula)}
                  className="text-[10px] text-cyan-400 hover:underline flex items-center justify-center gap-0.5 mx-auto mt-1"
                >
                  <HelpCircle className="w-2.5 h-2.5" /> Why?
                </button>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Truck Packing</span>
                <span className="text-lg font-bold text-cyan-400">
                  {activeDesign.logisticsBreakdown.boxesPerTruck.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  {activeDesign.logisticsBreakdown.truckSpaceUtilizationPercent}% fill
                </span>
              </div>
            </div>

            {/* Expandable Cost Calculation Breakdown */}
            {showCostFormula && (
              <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1.5 font-mono">
                <p className="font-bold text-emerald-400">How is Cost Calculated?</p>
                <p>• Raw Material: {sym}{activeDesign.costBreakdown.materialCost} ({activeDesign.costBreakdown.calculationExplanation?.materialFormula || 'Area × Thickness × Cost/kg'})</p>
                <p>• Cushioning: {sym}{activeDesign.costBreakdown.cushioningCost} ({activeDesign.costBreakdown.calculationExplanation?.cushioningFormula || 'Void Volume × Cushion Material'})</p>
                <p>• Manufacturing & Tooling: {sym}{activeDesign.costBreakdown.manufacturingCost}</p>
                <p>• Transport Allocation: {sym}{activeDesign.costBreakdown.transportCostShare}</p>
              </div>
            )}

            {/* Expandable Protection Explanation */}
            {showProtectionFormula && (
              <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1.5 font-mono">
                <p className="font-bold text-cyan-400">Why this Protection Score?</p>
                <p>{activeDesign.protectionBreakdown.whyExplanation}</p>
                <div className="flex justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-400">
                  <span>Impact G-Force: {activeDesign.protectionBreakdown.gForceExperienced}G</span>
                  <span>BCT Capacity: {activeDesign.protectionBreakdown.boxCompressionCapacityKg} kg</span>
                </div>
              </div>
            )}
          </div>

          {/* Design Parameter Adjusters Tabs */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex-1 flex flex-col">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
              <button
                onClick={() => setActiveTab('box')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'box'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Box & Material
              </button>
              <button
                onClick={() => setActiveTab('cushion')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'cushion'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cushion & Buffer
              </button>
              <button
                onClick={() => setActiveTab('product')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'product'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Product Specs
              </button>
            </div>

            {/* Tab 1: Box & Material Controls */}
            {activeTab === 'box' && (
              <div className="space-y-4 text-xs">
                {/* Material Select */}
                <div>
                  <label className="block text-slate-400 font-medium mb-1.5">
                    Structural Material
                  </label>
                  <select
                    value={activeDesign.materialId}
                    onChange={e => updateActiveDesignParams({ materialId: e.target.value as MaterialId })}
                    className="w-full glass-input px-3 py-2 text-xs font-medium cursor-pointer"
                  >
                    {Object.values(MATERIALS_DATABASE).map(m => (
                      <option key={m.id} value={m.id} className="bg-slate-900 text-slate-100">
                        {m.name} — {m.recyclabilityPercent}% Recyclable
                      </option>
                    ))}
                  </select>
                </div>

                {/* Wall Thickness Slider */}
                <div>
                  <div className="flex justify-between text-slate-300 font-medium mb-1">
                    <span>Wall Caliper / Thickness</span>
                    <span className="font-mono text-emerald-400">{activeDesign.wallThicknessMm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="1.2"
                    max="6.0"
                    step="0.2"
                    value={activeDesign.wallThicknessMm}
                    onChange={e => updateActiveDesignParams({ wallThicknessMm: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>1.2mm (Single-wall E)</span>
                    <span>6.0mm (Double-wall BC)</span>
                  </div>
                </div>

                {/* Internal Clearance / Snugness Slider */}
                <div>
                  <div className="flex justify-between text-slate-300 font-medium mb-1">
                    <span>Internal Clearance (Snugness)</span>
                    <span className="font-mono text-cyan-400">{activeDesign.internalClearanceMm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={activeDesign.internalClearanceMm}
                    onChange={e => updateActiveDesignParams({ internalClearanceMm: parseInt(e.target.value) })}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>1mm (Tight interference)</span>
                    <span>15mm (Loose cavity)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Cushion Controls */}
            {activeTab === 'cushion' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1.5">
                    Cushioning Mechanism
                  </label>
                  <select
                    value={activeDesign.cushioningType}
                    onChange={e => updateActiveDesignParams({ cushioningType: e.target.value as CushioningType })}
                    className="w-full glass-input px-3 py-2 text-xs font-medium cursor-pointer"
                  >
                    <option value="none" className="bg-slate-900">None (Direct Fit)</option>
                    <option value="molded_pulp_endcaps" className="bg-slate-900">Thermoformed Molded Pulp Endcaps</option>
                    <option value="honeycomb_kraft" className="bg-slate-900">Kraft Paper Honeycomb Buffer</option>
                    <option value="corrugated_die_cut" className="bg-slate-900">Die-Cut Corrugated Folded Insert</option>
                    <option value="biodegradable_air_pillows" className="bg-slate-900">Compostable Bio Air Pillows</option>
                    <option value="bio_foam_corners" className="bg-slate-900">Mycelium / Bio-Foam Corner Blocks</option>
                  </select>
                </div>

                {/* Cushion Depth Slider */}
                <div>
                  <div className="flex justify-between text-slate-300 font-medium mb-1">
                    <span>Cushion Thickness (Buffer Depth)</span>
                    <span className="font-mono text-amber-400">{activeDesign.cushioningThicknessMm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="2"
                    value={activeDesign.cushioningThicknessMm}
                    onChange={e => updateActiveDesignParams({ cushioningThicknessMm: parseInt(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>0mm (Zero Cushion)</span>
                    <span>30mm (Heavy Shock Armor)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Product Specs Controls */}
            {activeTab === 'product' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Length (mm)</label>
                    <input
                      type="number"
                      value={product.length}
                      onChange={e => updateProduct({ length: parseInt(e.target.value) || 10 })}
                      className="w-full glass-input px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Width (mm)</label>
                    <input
                      type="number"
                      value={product.width}
                      onChange={e => updateProduct({ width: parseInt(e.target.value) || 10 })}
                      className="w-full glass-input px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Height (mm)</label>
                    <input
                      type="number"
                      value={product.height}
                      onChange={e => updateProduct({ height: parseInt(e.target.value) || 10 })}
                      className="w-full glass-input px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Weight (grams)</label>
                    <input
                      type="number"
                      value={product.weight}
                      onChange={e => updateProduct({ weight: parseInt(e.target.value) || 10 })}
                      className="w-full glass-input px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Fragility Level</label>
                    <select
                      value={product.fragility}
                      onChange={e => updateProduct({ fragility: e.target.value as any })}
                      className="w-full glass-input px-2.5 py-1.5 text-xs"
                    >
                      <option value="very_low" className="bg-slate-900">Very Low</option>
                      <option value="low" className="bg-slate-900">Low</option>
                      <option value="moderate" className="bg-slate-900">Moderate</option>
                      <option value="high" className="bg-slate-900">High (Glass/Optics)</option>
                      <option value="very_high" className="bg-slate-900">Very High (Ceramics)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
