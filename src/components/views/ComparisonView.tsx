import React from 'react';
import { useProject } from '../../store/projectStore';
import { MATERIALS_DATABASE } from '../../data/materials';
import {
  GitCompare,
  CheckCircle2,
  TrendingDown,
  Leaf,
  ShieldCheck,
  Truck,
  Box,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ComparisonView: React.FC = () => {
  const {
    baselineDesign,
    alternatives,
    currency,
    selectedDesignId,
    setSelectedDesignId,
    setActiveNav
  } = useProject();

  const sym = currency === 'INR' ? '₹' : '$';
  const allConfigs = [baselineDesign, ...alternatives];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-emerald-400" />
            Packaging Options Comparison Matrix
          </h1>
          <p className="text-sm text-slate-400">
            Compare Legacy Baseline against all generated alternatives and the AI-Optimized configuration across engineering, financial, and environmental dimensions.
          </p>
        </div>

        <button
          onClick={() => setActiveNav('matrix')}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition border border-slate-700"
        >
          View Bubble Matrix
        </button>
      </div>

      {/* Comparison Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400">
                <th className="p-4 font-semibold uppercase tracking-wider text-[11px] min-w-[200px] sticky left-0 bg-slate-900 z-10">
                  Configuration / Metric
                </th>
                {allConfigs.map(c => {
                  const isSelected = c.id === selectedDesignId;
                  return (
                    <th
                      key={c.id}
                      className={`p-4 min-w-[180px] font-semibold text-xs border-l border-slate-800/60 ${
                        c.isRecommended
                          ? 'bg-emerald-950/40 text-emerald-300'
                          : c.isBaseline
                          ? 'bg-rose-950/20 text-rose-300'
                          : 'text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold truncate">{c.name}</span>
                        {c.isRecommended && (
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-black">
                            Best Pick
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block font-normal truncate">
                        {c.tagline}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {/* Financial Section */}
              <tr className="bg-slate-950/40 font-bold text-slate-400">
                <td colSpan={allConfigs.length + 1} className="px-4 py-2 text-[11px] uppercase tracking-wider text-emerald-400">
                  Financial & Cost Metrics
                </td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-300 sticky left-0 bg-slate-950">
                  Unit Cost / Package
                </td>
                {allConfigs.map(c => (
                  <td key={c.id} className="p-4 font-bold font-mono text-white border-l border-slate-800/60 text-sm">
                    {sym}{c.costBreakdown.totalCostPerPackage}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-300 sticky left-0 bg-slate-950">
                  Cost Savings vs Baseline
                </td>
                {allConfigs.map(c => (
                  <td key={c.id} className="p-4 font-mono border-l border-slate-800/60">
                    {c.isBaseline ? (
                      <span className="text-slate-500">—</span>
                    ) : (
                      <span className="text-emerald-400 font-semibold">
                        -{sym}{c.costBreakdown.savingsPerPackageVsBaseline} ({c.costBreakdown.savingsPercentVsBaseline}%)
                      </span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-300 sticky left-0 bg-slate-950">
                  Annual Packaging Expenditure
                </td>
                {allConfigs.map(c => (
                  <td key={c.id} className="p-4 font-mono text-slate-300 border-l border-slate-800/60">
                    {sym}{c.costBreakdown.annualTotalCost.toLocaleString()}
                  </td>
                ))}
              </tr>

              {/* Protection Section */}
              <tr className="bg-slate-950/40 font-bold text-slate-400">
                <td colSpan={allConfigs.length + 1} className="px-4 py-2 text-[11px] uppercase tracking-wider text-cyan-400">
                  Protection & Physical Performance
                </td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-300 sticky left-0 bg-slate-950">
                  Overall Protection Score
                </td>
                {allConfigs.map(c => (
                  <td key={c.id} className="p-4 font-mono font-bold text-emerald-400 border-l border-slate-800/60 text-sm">
                    {c.protectionBreakdown.overallProtectionScore} / 100
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-300 sticky left-0 bg-slate-950">
                  1.0m Drop Peak Deceleration
                </td>
                {allConfigs.map(c => (
                  <td key={c.id} className="p-4 font-mono text-slate-300 border-l border-slate-800/60">
                    {c.protectionBreakdown.gForceExperienced} G
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-300 sticky left-0 bg-slate-950">
                  Box Compression Test (BCT)
                </td>
                {allConfigs.map(c => (
                  <td key={c.id} className="p-4 font-mono text-slate-300 border-l border-slate-800/60">
                    {c.protectionBreakdown.boxCompressionCapacityKg} kg
                  </td>
                ))}
              </tr>

              {/* Sustainability Section */}
              <tr className="bg-slate-950/40 font-bold text-slate-400">
                <td colSpan={allConfigs.length + 1} className="px-4 py-2 text-[11px] uppercase tracking-wider text-amber-400">
                  Sustainability & Carbon Footprint
                </td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-300 sticky left-0 bg-slate-950">
                  CO₂e per Package
                </td>
                {allConfigs.map(c => (
                  <td key={c.id} className="p-4 font-mono text-cyan-400 font-semibold border-l border-slate-800/60">
                    {c.carbonBreakdown.totalCo2ePerPackageKg} kg
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-300 sticky left-0 bg-slate-950">
                  Carbon Reduction vs Baseline
                </td>
                {allConfigs.map(c => (
                  <td key={c.id} className="p-4 font-mono border-l border-slate-800/60">
                    {c.isBaseline ? (
                      <span className="text-slate-500">—</span>
                    ) : (
                      <span className="text-emerald-400 font-semibold">
                        -{c.carbonBreakdown.reductionPercentVsBaseline}%
                      </span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-300 sticky left-0 bg-slate-950">
                  Curbside Recyclability
                </td>
                {allConfigs.map(c => {
                  const m = MATERIALS_DATABASE[c.materialId];
                  return (
                    <td key={c.id} className="p-4 font-mono text-slate-300 border-l border-slate-800/60">
                      {m.recyclabilityPercent}% ({m.name.split(' ')[0]})
                    </td>
                  );
                })}
              </tr>

              {/* Logistics Section */}
              <tr className="bg-slate-950/40 font-bold text-slate-400">
                <td colSpan={allConfigs.length + 1} className="px-4 py-2 text-[11px] uppercase tracking-wider text-indigo-400">
                  Logistics & Trailer Density
                </td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-300 sticky left-0 bg-slate-950">
                  Boxes per 53ft Trailer
                </td>
                {allConfigs.map(c => (
                  <td key={c.id} className="p-4 font-mono font-bold text-indigo-300 border-l border-slate-800/60">
                    {c.logisticsBreakdown.boxesPerTruck.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-300 sticky left-0 bg-slate-950">
                  Trailer Cube Utilization
                </td>
                {allConfigs.map(c => (
                  <td key={c.id} className="p-4 font-mono text-slate-300 border-l border-slate-800/60">
                    {c.logisticsBreakdown.truckSpaceUtilizationPercent}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-300 sticky left-0 bg-slate-950">
                  Outer Dimensions (L×W×H)
                </td>
                {allConfigs.map(c => (
                  <td key={c.id} className="p-4 font-mono text-slate-400 border-l border-slate-800/60 text-[11px]">
                    {c.outerLength}×{c.outerWidth}×{c.outerHeight} mm
                  </td>
                ))}
              </tr>

              {/* Final Decision Action Row */}
              <tr className="bg-slate-900/90 font-bold">
                <td className="p-4 text-slate-200 sticky left-0 bg-slate-900">
                  Action
                </td>
                {allConfigs.map(c => (
                  <td key={c.id} className="p-4 border-l border-slate-800/60">
                    <button
                      onClick={() => {
                        setSelectedDesignId(c.id);
                        setActiveNav('studio');
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white font-semibold text-xs transition flex items-center justify-center gap-1"
                    >
                      Inspect 3D <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
