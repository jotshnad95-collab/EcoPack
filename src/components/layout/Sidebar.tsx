import React from 'react';
import { useProject, NavigationView } from '../../store/projectStore';
import {
  LayoutDashboard,
  Box,
  SlidersHorizontal,
  ShieldCheck,
  Database,
  Truck,
  GitCompare,
  ScatterChart,
  Shuffle,
  FileCheck2,
  Building2,
  TrendingUp,
  FileText,
  Settings,
  Sparkles
} from 'lucide-react';

interface NavItem {
  id: NavigationView;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'studio', label: 'AI Design Studio', icon: Box, badge: '3D', badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
  { id: 'optimizer', label: 'Packaging Optimizer', icon: SlidersHorizontal, badge: 'Pareto', badgeColor: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' },
  { id: 'validation', label: 'Virtual Validation Lab', icon: ShieldCheck, badge: 'Tests', badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' },
  { id: 'matrix', label: 'Decision Matrix', icon: ScatterChart, badge: 'Core', badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
  { id: 'whatif', label: 'What-If Simulation', icon: Shuffle },
  { id: 'comparison', label: 'Packaging Comparison', icon: GitCompare },
  { id: 'materials', label: 'Material Intelligence', icon: Database },
  { id: 'logistics', label: 'Logistics & Carbon', icon: Truck },
  { id: 'compliance', label: 'Compliance Center', icon: FileCheck2 },
  { id: 'suppliers', label: 'Supplier Engine', icon: Building2 },
  { id: 'benchmarks', label: 'Global Benchmarking', icon: TrendingUp },
  { id: 'reports', label: 'Reports & Export', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { activeNav, setActiveNav, product, activeDesign } = useProject();

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none">
      {/* Product Mini Banner */}
      <div className="p-4 border-b border-slate-850">
        <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Current Product
          </span>
          <p className="text-xs font-semibold text-slate-100 truncate" title={product.name}>
            {product.name}
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80 font-mono">
            <span>{product.length}×{product.width}×{product.height} mm</span>
            <span className="text-emerald-400 font-semibold">{product.weight}g</span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Info */}
      <div className="p-3 border-t border-slate-850">
        <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900/60 p-2.5 rounded-xl border border-emerald-800/30 text-[11px] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="leading-tight">
            <span className="font-semibold text-slate-200 block">EchoPack Core</span>
            <span className="text-slate-400 text-[10px]">Deterministic trade-off v2.4</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
