import React, { useState } from 'react';
import { useProject } from '../../store/projectStore';
import {
  Settings as SettingsIcon,
  Key,
  IndianRupee,
  DollarSign,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Sparkles,
  Info
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    currency,
    setCurrency,
    selectProjectPreset,
    activePresetId,
    geminiApiKey,
    setGeminiApiKey
  } = useProject();

  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiApiKey(apiKeyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-emerald-400" />
          Platform Settings & Engine Configuration
        </h1>
        <p className="text-sm text-slate-400">
          Configure physical units, currency display, AI LLM reasoning keys, and application defaults.
        </p>
      </div>

      {/* Currency & Units */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
          Localization & Financial Units
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-2">Display Currency</label>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrency('INR')}
                className={`flex-1 py-2.5 px-3 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition ${
                  currency === 'INR'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <IndianRupee className="w-4 h-4" /> Indian Rupee (₹)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`flex-1 py-2.5 px-3 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition ${
                  currency === 'USD'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <DollarSign className="w-4 h-4" /> US Dollar ($)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-2">Measurement Standard</label>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono flex items-center justify-between">
              <span>Metric Standard (mm, g, kg)</span>
              <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gemini AI Key for EchoCopilot (Optional) */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" />
            Gemini API Integration (Optional)
          </h3>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            Offline Fallback Active
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          EchoPack includes built-in deterministic physics & engineering rules for EchoCopilot that run 100% offline. If you enter your Google Gemini API key below, EchoCopilot can perform deeper open-ended multi-turn LLM synthesis.
        </p>

        <form onSubmit={handleSaveKey} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 glass-input px-3.5 py-2 text-xs font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow"
            >
              Save Key
            </button>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> API key configured successfully!
            </div>
          )}
        </form>
      </div>

      {/* Reset Cache & Defaults */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Reset Demo Session</h3>
          <p className="text-xs text-slate-400">Restore the Fragile Glass Cosmetic Bottle demo state and clear parameter overrides.</p>
        </div>
        <button
          onClick={() => selectProjectPreset(activePresetId)}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
        >
          <RotateCcw className="w-4 h-4" /> Reset Data
        </button>
      </div>

      {/* Architecture Disclaimer */}
      <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-1">
        <span className="font-semibold text-slate-200 block">EchoPack Core Architecture:</span>
        <p>• Deterministic Engines: Cost (Blank area + FEFCO 0201), Carbon (DEFRA/GLEC), Protection (McKee BCT + ISO 12048).</p>
        <p>• AI Communication: LLM explains and summarizes calculated values; calculations are never hallucinated.</p>
      </div>
    </div>
  );
};
