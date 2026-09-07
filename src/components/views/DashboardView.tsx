import React from 'react';
import { useProject } from '../../store/projectStore';
import { DEMO_PROJECT_PRESETS } from '../../data/demoProject';
import {
  TrendingDown,
  Leaf,
  ShieldCheck,
  Scale,
  DollarSign,
  IndianRupee,
  ArrowUpRight,
  Sparkles,
  Layers,
  Truck,
  Box,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
  Legend
} from 'recharts';

export const DashboardView: React.FC = () => {
  const {
    activeDesign,
    baselineDesign,
    alternatives,
    currency,
    product,
    requirements,
    selectProjectPreset,
    setActiveNav,
    setSelectedDesignId
  } = useProject();

  const sym = currency === 'INR' ? '₹' : '$';

  // Cost vs Sustainability Scatter Data
  const scatterData = alternatives.map(alt => ({
    name: alt.name,
    cost: alt.costBreakdown.totalCostPerPackage,
    sustainability: alt.scores.sustainabilityScore,
    carbon: alt.carbonBreakdown.totalCo2ePerPackageKg,
    protection: alt.protectionBreakdown.overallProtectionScore,
    isRec: alt.isRecommended
  }));

  // Carbon by Material / Component breakdown
  const carbonBreakdownData = [
    { name: 'Raw Material', kg: activeDesign.carbonBreakdown.materialEmissionsKg },
    { name: 'Manufacturing', kg: activeDesign.carbonBreakdown.manufacturingEmissionsKg },
    { name: 'Transit (500km)', kg: activeDesign.carbonBreakdown.transportEmissionsKg },
    { name: 'End-of-Life', kg: activeDesign.carbonBreakdown.endOfLifeEmissionsKg }
  ];

  // Radar Scores
  const radarData = [
    { subject: 'Protection', value: activeDesign.scores.protectionScore, fullMark: 100 },
    { subject: 'Cost Eff.', value: activeDesign.scores.costScore, fullMark: 100 },
    { subject: 'Sustainability', value: activeDesign.scores.sustainabilityScore, fullMark: 100 },
    { subject: 'Logistics', value: activeDesign.scores.logisticsScore, fullMark: 100 },
    { subject: 'Material Eff.', value: activeDesign.scores.materialEfficiencyScore, fullMark: 100 },
    { subject: 'Branding', value: activeDesign.scores.brandingScore, fullMark: 100 }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Optimization Active
            </span>
            <span className="text-xs text-slate-400 font-mono">Project: {product.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Packaging Intelligence Dashboard
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Synthesizing multi-objective trade-offs between drop protection, raw materials, lifecycle carbon, and pallet logistics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveNav('studio')}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20"
          >
            <Box className="w-4 h-4" /> Open 3D Studio
          </button>
          <button
            onClick={() => setActiveNav('matrix')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 transition border border-slate-700"
          >
            Decision Matrix <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Cost Savings */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Unit Savings</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              {currency === 'INR' ? <IndianRupee className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {sym}{activeDesign.costBreakdown.savingsPerPackageVsBaseline}
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <TrendingDown className="w-3 h-3 mr-0.5" />
              {activeDesign.costBreakdown.savingsPercentVsBaseline}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            Annual: {sym}{activeDesign.costBreakdown.annualSavingsVsBaseline.toLocaleString()}
          </p>
        </div>

        {/* CO2 Avoided */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">CO₂ Avoided</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {activeDesign.carbonBreakdown.reductionPercentVsBaseline}%
            </span>
            <span className="text-xs font-bold text-cyan-400">
              -{activeDesign.carbonBreakdown.co2AvoidedKgVsBaseline} kg/pkg
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            {activeDesign.carbonBreakdown.annualCo2AvoidedTonnes} tonnes/yr (~{activeDesign.carbonBreakdown.equivalentTreesYear} trees)
          </p>
        </div>

        {/* Material Saved */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tare Weight</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {activeDesign.tareWeightGrams}g
            </span>
            <span className="text-xs font-bold text-indigo-400">
              {baselineDesign.tareWeightGrams - activeDesign.tareWeightGrams > 0
                ? `-${baselineDesign.tareWeightGrams - activeDesign.tareWeightGrams}g`
                : 'Optimized'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            {activeDesign.materialAreaM2} m² blank area
          </p>
        </div>

        {/* Protection Score */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Protection</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">
              {activeDesign.protectionBreakdown.overallProtectionScore}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            BCT: {activeDesign.protectionBreakdown.boxCompressionCapacityKg} kg capacity
          </p>
        </div>

        {/* Sustainability Score */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sustainability</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400">
              {activeDesign.scores.sustainabilityScore}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            Curbside Recyclable Grade A
          </p>
        </div>
      </div>

      {/* Middle Row: Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Cost vs Sustainability Quadrant */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Cost vs. Sustainability Trade-off</h3>
              <p className="text-xs text-slate-400">Bubble size = Carbon footprint</p>
            </div>
            <button
              onClick={() => setActiveNav('matrix')}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-medium"
            >
              Full Matrix <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  type="number"
                  dataKey="cost"
                  name="Cost"
                  unit={sym}
                  stroke="#64748b"
                  fontSize={11}
                  domain={['dataMin - 3', 'dataMax + 3']}
                />
                <YAxis
                  type="number"
                  dataKey="sustainability"
                  name="Sustainability"
                  stroke="#64748b"
                  fontSize={11}
                  domain={[40, 100]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs space-y-1">
                          <p className="font-bold text-emerald-400">{data.name}</p>
                          <p className="text-slate-300">Cost: {sym}{data.cost}</p>
                          <p className="text-slate-300">Sustainability: {data.sustainability}/100</p>
                          <p className="text-slate-300">Protection: {data.protection}/100</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Designs" data={scatterData} fill="#10b981" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Carbon Footprint Lifecycle Breakdown */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Lifecycle CO₂e Breakdown</h3>
              <p className="text-xs text-slate-400">Total: {activeDesign.carbonBreakdown.totalCo2ePerPackageKg} kg CO₂e / unit</p>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              LCA DEFRA
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={carbonBreakdownData} margin={{ top: 10, right: 10, bottom: 20, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} unit="kg" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="kg" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Radar of 6 Balanced Dimensions */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-white">Packaging Efficiency Radar</h3>
              <p className="text-xs text-slate-400">Overall Score: {activeDesign.scores.overallWeightedScore}/100</p>
            </div>
            <span className="text-[11px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60">
              Pareto Optimal
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                <Radar name="EchoPack Design" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Projects & Quick Switch */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Preset Projects & Use Cases</h3>
            <p className="text-xs text-slate-400">Test different product fragilities and supply chains instantly</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEMO_PROJECT_PRESETS.map(preset => {
            const isSelected = preset.product.name === product.name;
            return (
              <div
                key={preset.id}
                onClick={() => selectProjectPreset(preset.id)}
                className={`p-4 rounded-xl cursor-pointer transition border ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-white">{preset.name}</span>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate mb-3">
                  {preset.product.category}
                </p>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pt-2 border-t border-slate-800/80">
                  <span>{preset.product.length}×{preset.product.width}×{preset.product.height} mm</span>
                  <span className="text-emerald-400 font-semibold">{preset.product.weight}g</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
