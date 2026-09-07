import React, { useState } from 'react';
import { useProject } from '../../store/projectStore';
import { MATERIALS_DATABASE } from '../../data/materials';
import { MaterialId, TransportModeType, FragilityLevel } from '../../types';
import {
  Shuffle,
  TrendingDown,
  TrendingUp,
  Leaf,
  ShieldCheck,
  Truck,
  ArrowRight,
  Sparkles,
  Info,
  DollarSign,
  IndianRupee,
  RotateCcw
} from 'lucide-react';

export const WhatIfSimulatorView: React.FC = () => {
  const {
    activeDesign,
    product,
    requirements,
    logistics,
    weights,
    currency,
    updateRequirements,
    updateProduct,
    updateLogistics,
    updateWeights,
    updateActiveDesignParams,
    selectProjectPreset,
    activePresetId
  } = useProject();

  const sym = currency === 'INR' ? '₹' : '$';

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Scenario Modeling
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Shuffle className="w-6 h-6 text-cyan-400" />
            What-If Trade-Off Simulator
          </h1>
          <p className="text-sm text-slate-400">
            Perturb priorities, budget constraints, or transport modes to instantly witness how the optimal packaging balance shifts.
          </p>
        </div>

        <button
          onClick={() => selectProjectPreset(activePresetId)}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Scenario
        </button>
      </div>

      {/* Main Grid: Sandbox Controls on Left (5 cols), Instant Impact on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Sandbox */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            What If We Change...
          </h3>

          {/* 1. Sustainability vs Protection Priority Sliders */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Sustainability Weight</span>
                <span className="font-mono text-emerald-400 font-bold">{weights.sustainability}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                value={weights.sustainability}
                onChange={e => updateWeights({ sustainability: parseInt(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Protection Weight</span>
                <span className="font-mono text-cyan-400 font-bold">{weights.protection}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                value={weights.protection}
                onChange={e => updateWeights({ protection: parseInt(e.target.value) })}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Cost Weight</span>
                <span className="font-mono text-amber-400 font-bold">{weights.cost}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                value={weights.cost}
                onChange={e => updateWeights({ cost: parseInt(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* 2. Target Cost Budget Input */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-300 font-medium">Target Cost per Package</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400">{sym}</span>
                <input
                  type="number"
                  value={requirements.targetCost}
                  onChange={e => updateRequirements({ targetCost: parseFloat(e.target.value) || 5 })}
                  className="w-20 glass-input px-2 py-1 text-xs font-mono font-bold text-white text-right"
                />
              </div>
            </div>

            {/* 3. Transport Mode */}
            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1.5">
                Supply Chain Logistics Mode
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['road', 'rail', 'air', 'sea'] as TransportModeType[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => updateLogistics({ transportMode: mode })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize transition ${
                      logistics.transportMode === mode
                        ? 'bg-emerald-500 text-slate-950 shadow'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Product Fragility Level */}
            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1.5">
                Product Fragility Severity
              </label>
              <select
                value={product.fragility}
                onChange={e => {
                  const frag = e.target.value as FragilityLevel;
                  const gLimits: Record<FragilityLevel, number> = {
                    very_low: 90,
                    low: 65,
                    moderate: 50,
                    high: 35,
                    very_high: 22
                  };
                  updateProduct({ fragility: frag, fragilityGMax: gLimits[frag] });
                }}
                className="w-full glass-input px-3 py-2 text-xs font-medium cursor-pointer"
              >
                <option value="very_low" className="bg-slate-900">Very Low (Rugged item)</option>
                <option value="low" className="bg-slate-900">Low (Durable plastics)</option>
                <option value="moderate" className="bg-slate-900">Moderate (Electronics)</option>
                <option value="high" className="bg-slate-900">High (Glass bottles / cosmetics)</option>
                <option value="very_high" className="bg-slate-900">Very High (Delicate crystal/ceramics)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Impact Display */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Simulated Impact on Current Architecture
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
                Dynamic Recalculation
              </span>
            </div>

            {/* Core Metrics Delta Comparison Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {/* Cost Impact */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block">Unit Cost</span>
                <span className="text-xl font-black text-white">
                  {sym}{activeDesign.costBreakdown.totalCostPerPackage}
                </span>
                <span className={`text-[10px] font-bold block mt-1 ${
                  activeDesign.costBreakdown.totalCostPerPackage <= requirements.targetCost
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}>
                  {activeDesign.costBreakdown.totalCostPerPackage <= requirements.targetCost ? 'Within Target' : 'Over Target'}
                </span>
              </div>

              {/* Protection Impact */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block">Protection</span>
                <span className="text-xl font-black text-emerald-400">
                  {activeDesign.protectionBreakdown.overallProtectionScore}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Peak: {activeDesign.protectionBreakdown.gForceExperienced}G
                </span>
              </div>

              {/* Carbon Impact */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block">CO₂e / Pkg</span>
                <span className="text-xl font-black text-cyan-400">
                  {activeDesign.carbonBreakdown.totalCo2ePerPackageKg} kg
                </span>
                <span className="text-[10px] text-cyan-300 block mt-1">
                  -{activeDesign.carbonBreakdown.reductionPercentVsBaseline}% vs base
                </span>
              </div>

              {/* Logistics Density */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block">Trailer Yield</span>
                <span className="text-xl font-black text-indigo-400">
                  {activeDesign.logisticsBreakdown.boxesPerTruck.toLocaleString()}
                </span>
                <span className="text-[10px] text-indigo-300 block mt-1">
                  {activeDesign.logisticsBreakdown.truckSpaceUtilizationPercent}% cubing
                </span>
              </div>
            </div>

            {/* AI Change Analysis & Rationale */}
            <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Engineering Trade-Off Analysis:
              </h4>

              <div className="text-xs text-slate-300 leading-relaxed space-y-2">
                <p>
                  <strong>Active Configuration:</strong> {activeDesign.name} utilizing {activeDesign.wallThicknessMm}mm {MATERIALS_DATABASE[activeDesign.materialId].name} with {activeDesign.cushioningThicknessMm}mm buffer.
                </p>
                <p>
                  <strong>Why this shift occurred:</strong> Priority weights currently prioritize {
                    weights.sustainability > weights.protection
                      ? `Sustainability (${weights.sustainability}%) over Protection (${weights.protection}%)`
                      : `Protection (${weights.protection}%) over Sustainability (${weights.sustainability}%)`
                  }. Transport mode set to <strong>{logistics.transportMode.toUpperCase()}</strong> applies specific GLEC carbon factors ({
                    logistics.transportMode === 'air' ? '0.602' : logistics.transportMode === 'road' ? '0.096' : '0.028'
                  } kg CO₂e/tonne-km).
                </p>
                <p className="text-emerald-400">
                  <strong>Recommended Next Step:</strong> If budget ceiling is strictly {sym}{requirements.targetCost}, consider reducing box length and width by 4mm to decrease tare paper mass and maximize trailer cube density.
                </p>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 pt-4 border-t border-slate-800">
            All scenario models dynamically re-evaluate McKee Box Compression capacity and DEFRA lifecycle carbon factors.
          </div>
        </div>
      </div>
    </div>
  );
};
