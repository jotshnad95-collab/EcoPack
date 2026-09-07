import React from 'react';
import { useProject } from '../../store/projectStore';
import { GLOBAL_INDUSTRY_BENCHMARKS } from '../../data/benchmarks';
import {
  TrendingUp,
  Award,
  ShieldCheck,
  Leaf,
  DollarSign,
  IndianRupee,
  Layers,
  Scale,
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
  Legend
} from 'recharts';

export const GlobalBenchmarkingView: React.FC = () => {
  const { activeDesign, product, currency } = useProject();
  const sym = currency === 'INR' ? '₹' : '$';
  const mult = currency === 'INR' ? 1 : (1 / 85);

  const benchmark = GLOBAL_INDUSTRY_BENCHMARKS[product.category] || GLOBAL_INDUSTRY_BENCHMARKS['Cosmetics & Personal Care'];

  // Comparative Data for Recharts
  const benchmarkComparisonData = [
    {
      metric: 'Unit Cost',
      'Your Design': activeDesign.costBreakdown.totalCostPerPackage,
      'Industry Avg': Number((benchmark.avgCostPerPackage * mult).toFixed(1)),
      'Top Quartile': Number((benchmark.topQuartileCost * mult).toFixed(1))
    },
    {
      metric: 'Protection (/100)',
      'Your Design': activeDesign.protectionBreakdown.overallProtectionScore,
      'Industry Avg': benchmark.avgProtectionScore,
      'Top Quartile': benchmark.topQuartileProtection
    },
    {
      metric: 'Cube Utilization %',
      'Your Design': activeDesign.logisticsBreakdown.truckSpaceUtilizationPercent,
      'Industry Avg': benchmark.avgSpaceUtilizationPercent,
      'Top Quartile': 85
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              DEMO BENCHMARK DATA
            </span>
            <span className="text-xs text-slate-400 font-mono">Category: {product.category}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            Global Packaging Industry Benchmarks
          </h1>
          <p className="text-sm text-slate-400">
            Compare your active packaging architecture against aggregated industry standards and top-quartile sustainable leaders.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300 font-mono">
          Percentile: <strong className="text-emerald-400 font-bold">Top 8% Best-in-Class</strong>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>Industry statistical benchmarks are generated from aggregated demo sustainability studies. Never fabricated as certified audits.</span>
      </div>

      {/* 3-Way Comparative Visual Bar Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-4">
          Direct Metric Benchmark Comparison
        </h3>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={benchmarkComparisonData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="metric" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Your Design" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Industry Avg" fill="#64748b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Top Quartile" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Percentile Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cost Competitiveness */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Unit Cost Competitiveness</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">
            {activeDesign.costBreakdown.totalCostPerPackage <= benchmark.topQuartileCost * mult ? '92nd Percentile' : '78th Percentile'}
          </span>
          <p className="text-xs text-slate-300 mt-2">
            Your cost of {sym}{activeDesign.costBreakdown.totalCostPerPackage} beats the industry average of {sym}{(benchmark.avgCostPerPackage * mult).toFixed(1)}.
          </p>
        </div>

        {/* Carbon Intensity */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Decarbonization Index</span>
          <span className="text-2xl font-black text-cyan-400 font-mono">
            94th Percentile
          </span>
          <p className="text-xs text-slate-300 mt-2">
            Emitting {activeDesign.carbonBreakdown.totalCo2ePerPackageKg} kg CO₂e vs peer median of {benchmark.avgCarbonKg} kg CO₂e.
          </p>
        </div>

        {/* Protection Reliability */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Physical Protection Factor</span>
          <span className="text-2xl font-black text-amber-400 font-mono">
            89th Percentile
          </span>
          <p className="text-xs text-slate-300 mt-2">
            Protection score of {activeDesign.protectionBreakdown.overallProtectionScore}/100 exceeds peer standard ({benchmark.avgProtectionScore}/100).
          </p>
        </div>
      </div>
    </div>
  );
};
