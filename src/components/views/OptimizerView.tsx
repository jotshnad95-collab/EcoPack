import React from 'react';
import { useProject } from '../../store/projectStore';
import { OptimizationWeights } from '../../types';
import {
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  Leaf,
  Truck,
  Box,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const OptimizerView: React.FC = () => {
  const {
    weights,
    updateWeights,
    alternatives,
    recommendedDesign,
    currency,
    setSelectedDesignId,
    setActiveNav
  } = useProject();

  const sym = currency === 'INR' ? '₹' : '$';

  // Preset Mode Handler
  const applyPreset = (mode: string) => {
    switch (mode) {
      case 'balanced':
        updateWeights({ protection: 30, cost: 20, sustainability: 20, branding: 10, logistics: 10, materialEfficiency: 10 });
        break;
      case 'lowest_cost':
        updateWeights({ protection: 15, cost: 55, sustainability: 10, branding: 5, logistics: 10, materialEfficiency: 5 });
        break;
      case 'max_protection':
        updateWeights({ protection: 65, cost: 10, sustainability: 10, branding: 5, logistics: 5, materialEfficiency: 5 });
        break;
      case 'lowest_carbon':
        updateWeights({ protection: 15, cost: 15, sustainability: 55, branding: 5, logistics: 5, materialEfficiency: 5 });
        break;
      case 'best_logistics':
        updateWeights({ protection: 20, cost: 15, sustainability: 15, branding: 5, logistics: 35, materialEfficiency: 10 });
        break;
      case 'min_material':
        updateWeights({ protection: 20, cost: 15, sustainability: 15, branding: 5, logistics: 10, materialEfficiency: 35 });
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6 text-emerald-400" />
            Packaging Optimizer — Core Multi-Objective Engine
          </h1>
          <p className="text-sm text-slate-400">
            Tune objective weights dynamically. EchoPack finds the mathematically optimal compromise across cost, protection, carbon, logistics, and branding.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-400 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800">
            Pareto Frontier Active
          </span>
        </div>
      </div>

      {/* Preset Optimization Modes */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
          Quick Optimization Archetypes
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { id: 'balanced', label: 'Balanced Optimum', icon: Sparkles, desc: 'Equal trade-offs' },
            { id: 'lowest_cost', label: 'Lowest Cost', icon: TrendingDown, desc: 'Cost prioritized' },
            { id: 'max_protection', label: 'Max Protection', icon: ShieldCheck, desc: 'Zero drop failure' },
            { id: 'lowest_carbon', label: 'Lowest Carbon', icon: Leaf, desc: 'Minimum LCA CO₂' },
            { id: 'best_logistics', label: 'Best Logistics', icon: Truck, desc: 'Max trailer cube' },
            { id: 'min_material', label: 'Min Material', icon: Box, desc: 'Lightweight tare' }
          ].map(p => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-left border border-slate-800 hover:border-emerald-500/50 transition group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-emerald-400 mb-1">
                  <Icon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{p.label}</span>
                </div>
                <span className="text-[10px] text-slate-400 block truncate">{p.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Weight Sliders & Top Feasible Candidates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            Priority Weights Distribution
          </h3>

          <div className="space-y-3.5 text-xs">
            {/* Protection */}
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Drop & Stack Protection
                </span>
                <span className="font-mono text-emerald-400 font-bold">{weights.protection}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.protection}
                onChange={e => updateWeights({ protection: parseInt(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Cost */}
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span className="flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5 text-cyan-400" /> Cost Efficiency
                </span>
                <span className="font-mono text-cyan-400 font-bold">{weights.cost}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.cost}
                onChange={e => updateWeights({ cost: parseInt(e.target.value) })}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Sustainability */}
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span className="flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-amber-400" /> Sustainability & Circularity
                </span>
                <span className="font-mono text-amber-400 font-bold">{weights.sustainability}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.sustainability}
                onChange={e => updateWeights({ sustainability: parseInt(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Logistics */}
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-indigo-400" /> Logistics & Cube Density
                </span>
                <span className="font-mono text-indigo-400 font-bold">{weights.logistics}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.logistics}
                onChange={e => updateWeights({ logistics: parseInt(e.target.value) })}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Material Efficiency */}
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span className="flex items-center gap-1">
                  <Box className="w-3.5 h-3.5 text-purple-400" /> Material & Tare Efficiency
                </span>
                <span className="font-mono text-purple-400 font-bold">{weights.materialEfficiency}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.materialEfficiency}
                onChange={e => updateWeights({ materialEfficiency: parseInt(e.target.value) })}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Top Feasible Alternatives Generated (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">
                Top 5 Feasible Candidate Architectures
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                Sorted by Composite Weighted Score
              </span>
            </div>

            <div className="space-y-2.5">
              {alternatives.map((alt, idx) => (
                <div
                  key={alt.id}
                  className={`p-3.5 rounded-xl border transition flex items-center justify-between ${
                    alt.isRecommended
                      ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1 max-w-[60%]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white truncate">{alt.name}</span>
                      {alt.isRecommended && (
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-black">
                          Pareto Pick
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{alt.tagline}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-300 font-mono pt-1">
                      <span>Cost: <strong>{sym}{alt.costBreakdown.totalCostPerPackage}</strong></span>
                      <span>Prot: <strong className="text-emerald-400">{alt.protectionBreakdown.overallProtectionScore}</strong></span>
                      <span>CO₂: <strong className="text-cyan-400">{alt.carbonBreakdown.totalCo2ePerPackageKg}kg</strong></span>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div className="text-center">
                      <span className="text-lg font-black text-emerald-400 block font-mono">
                        {alt.scores.overallWeightedScore}
                      </span>
                      <span className="text-[9px] uppercase text-slate-500 font-bold">Score</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedDesignId(alt.id);
                        setActiveNav('studio');
                      }}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 transition"
                      title="Load in 3D"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
            Overall Score = Protection × {weights.protection}% + Cost × {weights.cost}% + Sustainability × {weights.sustainability}% + Logistics × {weights.logistics}% + Material Eff × {weights.materialEfficiency}%.
          </div>
        </div>
      </div>
    </div>
  );
};
