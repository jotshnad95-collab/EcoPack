import React, { useState } from 'react';
import { useProject } from '../../store/projectStore';
import { MATERIALS_DATABASE } from '../../data/materials';
import { MaterialId, MaterialProperties } from '../../types';
import {
  Database,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Layers,
  ShieldCheck,
  Leaf,
  Scale,
  DollarSign,
  IndianRupee,
  HelpCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';

export const MaterialIntelligenceView: React.FC = () => {
  const { currency, activeDesign, updateActiveDesignParams, setActiveNav } = useProject();
  const sym = currency === 'INR' ? '₹' : '$';
  const currencyMult = currency === 'INR' ? 85 : 1;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [compareIds, setCompareIds] = useState<MaterialId[]>(['corrugated_b_flute', 'molded_pulp', 'recycled_paperboard']);

  const allMaterials = Object.values(MATERIALS_DATABASE);

  const filteredMaterials = allMaterials.filter(m => {
    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleCompare = (id: MaterialId) => {
    if (compareIds.includes(id)) {
      if (compareIds.length > 1) {
        setCompareIds(compareIds.filter(x => x !== id));
      }
    } else {
      if (compareIds.length < 3) {
        setCompareIds([...compareIds, id]);
      } else {
        setCompareIds([compareIds[1], compareIds[2], id]);
      }
    }
  };

  // Comparative Radar Data
  const radarMetrics = [
    { subject: 'Recyclability %', key: 'recyclabilityPercent' },
    { subject: 'Recycled Content %', key: 'recycledContentPercent' },
    { subject: 'Tensile Strength', key: 'tensileStrengthMpa' },
    { subject: 'Moisture Barrier', key: 'moistureResistanceScore' },
    { subject: 'End-of-Life Score', key: 'endOfLifeScore' }
  ];

  const radarData = radarMetrics.map(metric => {
    const row: any = { subject: metric.subject };
    compareIds.forEach(id => {
      const mat = MATERIALS_DATABASE[id];
      if (mat) {
        row[mat.name] = (mat as any)[metric.key];
      }
    });
    return row;
  });

  const colors = ['#10b981', '#06b6d4', '#f59e0b'];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-emerald-400" />
            Material Intelligence Database
          </h1>
          <p className="text-sm text-slate-400">
            Comprehensive physical, mechanical, and LCA dataset across 12 packaging substrates. Select any material to apply directly to your active project.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Current Material:</span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-900 border border-emerald-500/40 text-emerald-400">
            {MATERIALS_DATABASE[activeDesign.materialId].name}
          </span>
        </div>
      </div>

      {/* Side-by-Side Material Comparison Radar Section */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Side-by-Side Material Comparative Radar</h3>
            <p className="text-xs text-slate-400">
              Comparing {compareIds.map(id => MATERIALS_DATABASE[id].name.split(' ')[0]).join(', ')}
            </p>
          </div>
          <div className="text-[11px] text-slate-400">
            Click 'Compare' on any card below to swap materials (up to 3)
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Radar Chart (6 cols) */}
          <div className="lg:col-span-6 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                {compareIds.map((id, index) => {
                  const m = MATERIALS_DATABASE[id];
                  return (
                    <Radar
                      key={id}
                      name={m.name}
                      dataKey={m.name}
                      stroke={colors[index]}
                      fill={colors[index]}
                      fillOpacity={0.25}
                    />
                  );
                })}
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Comparative Metrics Table (6 cols) */}
          <div className="lg:col-span-6 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 text-[11px] font-semibold">Attribute</th>
                  {compareIds.map((id, idx) => (
                    <th key={id} className="py-2 font-bold text-xs" style={{ color: colors[idx] }}>
                      {MATERIALS_DATABASE[id].name.split(' ')[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300 text-[11px]">
                <tr>
                  <td className="py-2 text-slate-400">Bulk Density (g/cm³)</td>
                  {compareIds.map(id => <td key={id} className="py-2">{MATERIALS_DATABASE[id].densityGcm3}</td>)}
                </tr>
                <tr>
                  <td className="py-2 text-slate-400">Cost per kg ({sym})</td>
                  {compareIds.map(id => <td key={id} className="py-2 font-bold">{sym}{Math.round(MATERIALS_DATABASE[id].costPerKg * currencyMult)}</td>)}
                </tr>
                <tr>
                  <td className="py-2 text-slate-400">LCA Carbon Factor (kg CO₂e/kg)</td>
                  {compareIds.map(id => <td key={id} className="py-2">{MATERIALS_DATABASE[id].carbonFactorKgCo2PerKg}</td>)}
                </tr>
                <tr>
                  <td className="py-2 text-slate-400">Edge Crush Test (kN/m ECT)</td>
                  {compareIds.map(id => <td key={id} className="py-2">{MATERIALS_DATABASE[id].ectKnM}</td>)}
                </tr>
                <tr>
                  <td className="py-2 text-slate-400">Recyclability %</td>
                  {compareIds.map(id => <td key={id} className="py-2 text-emerald-400 font-bold">{MATERIALS_DATABASE[id].recyclabilityPercent}%</td>)}
                </tr>
                <tr>
                  <td className="py-2 text-slate-400">End-of-Life Circularity / 100</td>
                  {compareIds.map(id => <td key={id} className="py-2 text-amber-400 font-bold">{MATERIALS_DATABASE[id].endOfLifeScore}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search materials or properties..."
            className="w-full glass-input pl-9 pr-3 py-2 text-xs"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All (12)' },
            { id: 'paper_fiber', label: 'Paper & Fiber' },
            { id: 'plastic', label: 'Recycled Plastic' },
            { id: 'bio', label: 'Bio-Polymers' },
            { id: 'cushion', label: 'Bio-Foam' },
            { id: 'metal', label: 'Aluminum' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Material Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map(m => {
          const isCurrent = activeDesign.materialId === m.id;
          const isComparing = compareIds.includes(m.id);

          return (
            <div
              key={m.id}
              className={`glass-panel p-5 rounded-2xl border transition flex flex-col justify-between ${
                isCurrent
                  ? 'border-emerald-500/80 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: m.colorHex }} />
                    <span className="text-xs font-bold text-white truncate">{m.name}</span>
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                      Active
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                  {m.description}
                </p>

                {/* Properties Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-4">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Density</span>
                    <span className="text-slate-200">{m.densityGcm3} g/cm³</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Estimated Cost</span>
                    <span className="text-white font-bold">{sym}{Math.round(m.costPerKg * currencyMult)}/kg</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Carbon Factor</span>
                    <span className="text-cyan-400">{m.carbonFactorKgCo2PerKg} kg CO₂/kg</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Recyclability</span>
                    <span className="text-emerald-400 font-bold">{m.recyclabilityPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    updateActiveDesignParams({ materialId: m.id });
                    setActiveNav('studio');
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                >
                  Apply to Design
                </button>
                <button
                  onClick={() => toggleCompare(m.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition border ${
                    isComparing
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
                  }`}
                >
                  {isComparing ? 'Comparing' : 'Compare'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
