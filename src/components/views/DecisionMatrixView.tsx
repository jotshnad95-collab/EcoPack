import React, { useState } from 'react';
import { useProject } from '../../store/projectStore';
import { PackagingDesign } from '../../types';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  ReferenceLine
} from 'recharts';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Info,
  Box,
  Leaf
} from 'lucide-react';

export const DecisionMatrixView: React.FC = () => {
  const {
    baselineDesign,
    alternatives,
    currency,
    selectedDesignId,
    setSelectedDesignId,
    setActiveNav
  } = useProject();

  const sym = currency === 'INR' ? '₹' : '$';

  // Combine baseline + alternatives for visualization
  const allDesigns = [baselineDesign, ...alternatives];

  // Map to chart items
  const matrixData = allDesigns.map(d => ({
    id: d.id,
    name: d.name,
    tagline: d.tagline,
    cost: d.costBreakdown.totalCostPerPackage,
    protection: d.protectionBreakdown.overallProtectionScore,
    carbon: d.carbonBreakdown.totalCo2ePerPackageKg,
    // Size multiplier for Z-Axis: scaled proportionally to carbon
    bubbleSize: Math.round(d.carbonBreakdown.totalCo2ePerPackageKg * 800),
    sustainability: d.scores.sustainabilityScore,
    overallScore: d.scores.overallWeightedScore,
    isRecommended: !!d.isRecommended,
    isBaseline: !!d.isBaseline,
    designRef: d
  }));

  const activeInspectDesign = allDesigns.find(d => d.id === selectedDesignId) || alternatives[alternatives.length - 1];

  const getColor = (item: typeof matrixData[0]) => {
    if (item.isRecommended) return '#10b981'; // vibrant emerald
    if (item.isBaseline) return '#ef4444'; // red baseline
    if (item.id === 'design-alt-1') return '#06b6d4'; // cyan eco
    if (item.id === 'design-alt-2') return '#3b82f6'; // blue balanced
    if (item.id === 'design-alt-3') return '#8b5cf6'; // purple premium
    return '#f59e0b'; // amber max protection
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* View Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Multi-Objective Pareto Analysis
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Packaging Decision Matrix
          </h1>
          <p className="text-sm text-slate-400">
            Multi-variable trade-off visualization. Compare all packaging alternatives across Cost (X), Protection (Y), and Carbon Footprint (Bubble Volume).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Sweet Spot:</span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> High Protection + Low Cost
          </span>
        </div>
      </div>

      {/* Main Grid: Decision Matrix Chart (8 cols) and Selected Design Profile (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart Column */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Cost vs. Protection vs. Carbon Frontier</h3>
              <p className="text-xs text-slate-400">
                Click any bubble to inspect engineering details and send to 3D studio
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Recommended
              </span>
              <span className="flex items-center gap-1 text-rose-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Legacy Baseline
              </span>
            </div>
          </div>

          <div className="h-[440px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  type="number"
                  dataKey="cost"
                  name="Unit Cost"
                  unit={sym}
                  stroke="#64748b"
                  fontSize={11}
                  domain={['dataMin - 3', 'dataMax + 4']}
                  label={{ value: `Total Cost per Package (${sym})`, position: 'insideBottom', offset: -25, fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis
                  type="number"
                  dataKey="protection"
                  name="Protection Score"
                  stroke="#64748b"
                  fontSize={11}
                  domain={[30, 100]}
                  label={{ value: 'Protection Score / 100', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
                />
                <ZAxis type="number" dataKey="bubbleSize" range={[120, 650]} name="Carbon Size" />
                
                {/* Reference line for target cost */}
                <ReferenceLine x={20} stroke="#475569" strokeDasharray="3 3" label={{ value: `Target Cost (${sym}20)`, fill: '#64748b', fontSize: 10 }} />
                {/* Reference line for minimum acceptable protection */}
                <ReferenceLine y={75} stroke="#475569" strokeDasharray="3 3" label={{ value: 'Safe Threshold (75)', fill: '#64748b', fontSize: 10 }} />

                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 min-w-[200px]">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{d.name}</span>
                            {d.isRecommended && (
                              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-black">
                                Recommended
                              </span>
                            )}
                          </div>
                          <div className="pt-1 border-t border-slate-800 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Unit Cost:</span>
                              <strong className="text-white">{sym}{d.cost}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Protection:</span>
                              <strong className="text-emerald-400">{d.protection}/100</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Carbon Footprint:</span>
                              <strong className="text-cyan-400">{d.carbon} kg CO₂e</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Sustainability:</span>
                              <strong className="text-amber-400">{d.sustainability}/100</strong>
                            </div>
                            <div className="flex justify-between pt-1 border-t border-slate-800">
                              <span className="text-slate-400">Overall Score:</span>
                              <strong className="text-emerald-400">{d.overallScore}/100</strong>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Scatter
                  name="Packaging Alternatives"
                  data={matrixData}
                  onClick={(entry: any) => {
                    if (entry && entry.id) setSelectedDesignId(entry.id);
                  }}
                  className="cursor-pointer"
                >
                  {matrixData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getColor(entry)}
                      stroke={entry.id === selectedDesignId ? '#ffffff' : getColor(entry)}
                      strokeWidth={entry.id === selectedDesignId ? 3 : 1}
                      fillOpacity={entry.id === selectedDesignId ? 0.95 : 0.75}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 text-center mt-2">
            Tip: Larger bubbles indicate a higher carbon footprint per package. Optimal designs lie in the top-left quadrant with small bubble diameters.
          </div>
        </div>

        {/* Selected Candidate Inspect Drawer */}
        <div className="lg:col-span-4 glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Selected Candidate Details
              </span>
              {activeInspectDesign.isRecommended && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Recommended Pick
                </span>
              )}
            </div>

            <h2 className="text-lg font-bold text-white tracking-tight">
              {activeInspectDesign.name}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 mb-4">
              {activeInspectDesign.tagline}
            </p>

            {/* Metrics Breakdown Grid */}
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Unit Cost</span>
                <span className="text-base font-bold text-white">
                  {sym}{activeInspectDesign.costBreakdown.totalCostPerPackage}
                </span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Protection Index</span>
                <span className="text-base font-bold text-emerald-400">
                  {activeInspectDesign.protectionBreakdown.overallProtectionScore}/100
                </span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Carbon Footprint</span>
                <span className="text-base font-bold text-cyan-400">
                  {activeInspectDesign.carbonBreakdown.totalCo2ePerPackageKg} kg CO₂e
                </span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Trailer Density</span>
                <span className="text-base font-bold text-indigo-400">
                  {activeInspectDesign.logisticsBreakdown.boxesPerTruck.toLocaleString()} units
                </span>
              </div>
            </div>

            {/* AI Recommendation Summary */}
            {activeInspectDesign.whyThisDesign && (
              <div className="mt-4 p-3 bg-emerald-950/30 rounded-xl border border-emerald-800/40 text-[11px] text-emerald-200/90 leading-relaxed">
                <p className="font-semibold text-emerald-400 mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Why this configuration?
                </p>
                {activeInspectDesign.whyThisDesign}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4 flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedDesignId(activeInspectDesign.id);
                setActiveNav('studio');
              }}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md"
            >
              <Box className="w-4 h-4" /> Load in 3D Studio
            </button>
            <button
              onClick={() => setActiveNav('comparison')}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition border border-slate-700"
              title="Compare all side-by-side"
            >
              Compare
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
