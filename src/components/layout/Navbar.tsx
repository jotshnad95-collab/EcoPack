import React from 'react';
import { useProject } from '../../store/projectStore';
import { DEMO_PROJECT_PRESETS } from '../../data/demoProject';
import {
  Package,
  Sparkles,
  Bot,
  RotateCcw,
  IndianRupee,
  DollarSign,
  ShieldCheck,
  Cpu,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activePresetId,
    selectProjectPreset,
    currency,
    setCurrency,
    isCopilotOpen,
    setIsCopilotOpen,
    activeDesign
  } = useProject();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between">
      {/* Brand & Tagline */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Package className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1">
              Echo<span className="text-emerald-400">Pack</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              AI Decision Platform
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Design smarter. Protect better. Waste less.
          </p>
        </div>
      </div>

      {/* Center: Active Project Selector Dropdown */}
      <div className="hidden lg:flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 shadow-sm">
        <span className="text-xs text-slate-400 font-medium">Active Project:</span>
        <div className="relative">
          <select
            value={activePresetId}
            onChange={e => selectProjectPreset(e.target.value)}
            className="bg-transparent text-sm font-semibold text-emerald-300 pr-7 py-0.5 focus:outline-none cursor-pointer"
          >
            {DEMO_PROJECT_PRESETS.map(preset => (
              <option key={preset.id} value={preset.id} className="bg-slate-900 text-slate-100">
                {preset.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-1 top-1.5 pointer-events-none" />
        </div>
      </div>

      {/* Right Actions: Currency, Engine Badge, Copilot Trigger */}
      <div className="flex items-center gap-2.5">
        {/* Currency Toggle */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
          <button
            onClick={() => setCurrency('INR')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              currency === 'INR' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Indian Rupee (₹)"
          >
            <IndianRupee className="w-3 h-3" /> INR
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              currency === 'USD' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="US Dollar ($)"
          >
            <DollarSign className="w-3 h-3" /> USD
          </button>
        </div>

        {/* Deterministic Engines Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
          <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Physics Engine: <strong className="text-emerald-400 font-normal">Active</strong></span>
        </div>

        {/* EchoCopilot Assistant Drawer Toggle */}
        <button
          onClick={() => setIsCopilotOpen(!isCopilotOpen)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-md border ${
            isCopilotOpen
              ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/20'
              : 'bg-slate-900 hover:bg-slate-850 text-slate-100 border-slate-700 hover:border-emerald-500/50'
          }`}
        >
          <Bot className={`w-4 h-4 ${isCopilotOpen ? 'text-white' : 'text-emerald-400'}`} />
          <span>EchoCopilot</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      </div>
    </header>
  );
};
