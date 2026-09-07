import React, { useState } from 'react';
import { useProject } from '../../store/projectStore';
import { MATERIALS_DATABASE } from '../../data/materials';
import {
  runVirtualDropTest,
  runVirtualCompressionTest,
  runVirtualVibrationTest,
  DropTestInput,
  CompressionTestInput,
  VibrationTestInput
} from '../../engines/validationEngine';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Play,
  RotateCcw,
  Sliders,
  Scale,
  Activity,
  Layers,
  Truck,
  ArrowDown,
  Info
} from 'lucide-react';

export const ValidationLabView: React.FC = () => {
  const { activeDesign, product } = useProject();
  const material = MATERIALS_DATABASE[activeDesign.materialId];

  // Test Mode
  const [activeTest, setActiveTest] = useState<'drop' | 'compression' | 'vibration'>('drop');

  // Drop Test Inputs
  const [dropInputs, setDropInputs] = useState<DropTestInput>({
    dropHeightMeters: 1.0,
    orientation: 'corner',
    surface: 'concrete'
  });

  // Compression Test Inputs
  const [compInputs, setCompInputs] = useState<CompressionTestInput>({
    warehouseStackHeightMeters: 2.4,
    durationDays: 45,
    ambientHumidityPercent: 75
  });

  // Vibration Test Inputs
  const [vibInputs, setVibInputs] = useState<VibrationTestInput>({
    transportProfile: 'ASTM_D4169_Truck',
    travelDistanceKm: 650
  });

  // Run simulation calculations
  const dropResult = runVirtualDropTest(activeDesign, product, material, dropInputs);
  const compResult = runVirtualCompressionTest(activeDesign, product, material, compInputs);
  const vibResult = runVirtualVibrationTest(activeDesign, product, material, vibInputs);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Virtual Engineering Simulation
            </span>
            <span className="text-xs text-slate-400 font-mono">ASTM D5276 / ISO 12048 / ISTA 3A</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Virtual Validation Lab
          </h1>
          <p className="text-sm text-slate-400">
            Simulate drop shocks, warehouse stacking compression, and vehicle vibration resonance before cutting expensive tooling.
          </p>
        </div>

        {/* Global Test Disclaimer Banner */}
        <div className="bg-amber-950/40 border border-amber-800/40 px-3.5 py-2 rounded-xl text-[11px] text-amber-200/90 max-w-md flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Virtual simulation is an engineering estimate and does not replace physical testing or certification.</span>
        </div>
      </div>

      {/* Test Selection Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTest('drop')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTest === 'drop'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ArrowDown className="w-4 h-4" /> Drop Shock Test
        </button>
        <button
          onClick={() => setActiveTest('compression')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTest === 'compression'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" /> Stacking Compression Test
        </button>
        <button
          onClick={() => setActiveTest('vibration')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTest === 'vibration'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" /> Transit Vibration Test
        </button>
      </div>

      {/* Simulation Rig Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Parameters Controller (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              {activeTest === 'drop' && 'Drop Test Parameters (ASTM D5276)'}
              {activeTest === 'compression' && 'Warehouse Stacking Environment'}
              {activeTest === 'vibration' && 'Freight Vibration Profile'}
            </h3>

            {/* Drop Test Form */}
            {activeTest === 'drop' && (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Drop Height</span>
                    <span className="font-mono text-emerald-400 font-bold">{dropInputs.dropHeightMeters} meters</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={dropInputs.dropHeightMeters}
                    onChange={e => setDropInputs(prev => ({ ...prev, dropHeightMeters: parseFloat(e.target.value) }))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>0.5m (Standard conveyor)</span>
                    <span>2.0m (High velocity drop)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Impact Orientation</label>
                  <select
                    value={dropInputs.orientation}
                    onChange={e => setDropInputs(prev => ({ ...prev, orientation: e.target.value as any }))}
                    className="w-full glass-input px-3 py-2 text-xs"
                  >
                    <option value="corner" className="bg-slate-900">Corner Drop (Worst-case shear concentration)</option>
                    <option value="edge" className="bg-slate-900">Edge Drop (Joint stress)</option>
                    <option value="flat_bottom" className="bg-slate-900">Flat Bottom Face</option>
                    <option value="flat_face" className="bg-slate-900">Flat Side Face</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Floor Impact Surface</label>
                  <select
                    value={dropInputs.surface}
                    onChange={e => setDropInputs(prev => ({ ...prev, surface: e.target.value as any }))}
                    className="w-full glass-input px-3 py-2 text-xs"
                  >
                    <option value="concrete" className="bg-slate-900">Rigid Concrete (Zero bounce compliance)</option>
                    <option value="hardwood" className="bg-slate-900">Hardwood Floor</option>
                    <option value="packed_earth" className="bg-slate-900">Packed Earth</option>
                  </select>
                </div>
              </div>
            )}

            {/* Compression Test Form */}
            {activeTest === 'compression' && (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Stack Height in Warehouse</span>
                    <span className="font-mono text-cyan-400 font-bold">{compInputs.warehouseStackHeightMeters} meters</span>
                  </div>
                  <input
                    type="range"
                    min="1.2"
                    max="3.6"
                    step="0.2"
                    value={compInputs.warehouseStackHeightMeters}
                    onChange={e => setCompInputs(prev => ({ ...prev, warehouseStackHeightMeters: parseFloat(e.target.value) }))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>1.2m (Single pallet)</span>
                    <span>3.6m (High-bay double tier)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Duration in Storage</span>
                    <span className="font-mono text-amber-400 font-bold">{compInputs.durationDays} days</span>
                  </div>
                  <input
                    type="range"
                    min="7"
                    max="180"
                    step="7"
                    value={compInputs.durationDays}
                    onChange={e => setCompInputs(prev => ({ ...prev, durationDays: parseInt(e.target.value) }))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>7 days (Cross-dock)</span>
                    <span>180 days (Seasonal inventory creep)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Ambient Relative Humidity (RH)</span>
                    <span className="font-mono text-indigo-400 font-bold">{compInputs.ambientHumidityPercent}% RH</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="95"
                    step="5"
                    value={compInputs.ambientHumidityPercent}
                    onChange={e => setCompInputs(prev => ({ ...prev, ambientHumidityPercent: parseInt(e.target.value) }))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>40% (Dry climate control)</span>
                    <span>95% (Monsoon / Tropical humidity)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Vibration Test Form */}
            {activeTest === 'vibration' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Standard Vibration Spectrum</label>
                  <select
                    value={vibInputs.transportProfile}
                    onChange={e => setVibInputs(prev => ({ ...prev, transportProfile: e.target.value as any }))}
                    className="w-full glass-input px-3 py-2 text-xs"
                  >
                    <option value="ASTM_D4169_Truck" className="bg-slate-900">ASTM D4169 Random Truck Profile (3-18 Hz dominant)</option>
                    <option value="ISO_13355_Rail" className="bg-slate-900">ISO 13355 Rail Freight Harmonic Spectrum</option>
                    <option value="ISTA_3A_Air" className="bg-slate-900">ISTA 3A Air Cargo High-Frequency Vibration</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Haul Distance</span>
                    <span className="font-mono text-emerald-400 font-bold">{vibInputs.travelDistanceKm} km</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="2500"
                    step="50"
                    value={vibInputs.travelDistanceKm}
                    onChange={e => setVibInputs(prev => ({ ...prev, travelDistanceKm: parseInt(e.target.value) }))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
            Active Design: <strong className="text-slate-200">{activeDesign.name}</strong> ({activeDesign.wallThicknessMm}mm {material.name})
          </div>
        </div>

        {/* Right: Simulation Output Gauges & Engineering Observations (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Simulation Diagnostics
              </span>
              {activeTest === 'drop' && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    dropResult.riskLevel === 'safe'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : dropResult.riskLevel === 'caution'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {dropResult.riskLevel === 'safe' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {dropResult.riskLevel === 'caution' && <AlertTriangle className="w-3.5 h-3.5" />}
                  {dropResult.riskLevel === 'critical_failure' && <XCircle className="w-3.5 h-3.5" />}
                  {dropResult.riskLevel.replace('_', ' ').toUpperCase()}
                </span>
              )}
              {activeTest === 'compression' && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    compResult.pass
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {compResult.pass ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {compResult.pass ? 'PASS (ADEQUATE BCT)' : 'STACKING RISK (COLLAPSE)'}
                </span>
              )}
              {activeTest === 'vibration' && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    vibResult.pass
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {vibResult.pass ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  {vibResult.pass ? 'PASS (STABLE)' : 'ABRASION RISK'}
                </span>
              )}
            </div>

            {/* Test Specific Diagnostic Cards */}
            {activeTest === 'drop' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Peak Deceleration</span>
                    <span className={`text-2xl font-black ${dropResult.peakGForce <= dropResult.allowableGForce ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {dropResult.peakGForce} G
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">Limit: {dropResult.allowableGForce} G</span>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Impact Velocity</span>
                    <span className="text-2xl font-black text-cyan-400">
                      {dropResult.impactVelocityMs} m/s
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">Kinetic contact</span>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Buffer Deflection</span>
                    <span className="text-2xl font-black text-amber-400">
                      {dropResult.cushioningDeflectionMm} mm
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">of {activeDesign.cushioningThicknessMm}mm buffer</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-slate-200 block mb-1">
                    Engineering Findings & Mechanics:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {dropResult.engineeringObservations}
                  </p>
                </div>
              </div>
            )}

            {activeTest === 'compression' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Box BCT Capacity</span>
                    <span className="text-2xl font-black text-emerald-400">
                      {compResult.calculatedBctKg} kg
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">McKee Formula</span>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Required Capacity</span>
                    <span className="text-2xl font-black text-white">
                      {compResult.requiredCapacityKg} kg
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">w/ Safety Factor {compResult.dynamicSafetyFactor}x</span>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Safety Margin</span>
                    <span className={`text-2xl font-black ${compResult.safetyMarginPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {compResult.safetyMarginPercent}%
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">Bottom tier deadload</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-slate-200 block mb-1">
                    McKee Stacking Observations:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {compResult.engineeringObservations}
                  </p>
                </div>
              </div>
            )}

            {activeTest === 'vibration' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">System Resonance</span>
                    <span className="text-2xl font-black text-indigo-400">
                      {vibResult.resonancePeakHz} Hz
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">Harmonic natural peak</span>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Fatigue Health</span>
                    <span className="text-2xl font-black text-emerald-400">
                      {vibResult.fatigueDamageScore}/100
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">Damping capacity</span>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Surface Scuffing</span>
                    <span className={`text-2xl font-black uppercase ${vibResult.abrasionRisk === 'low' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {vibResult.abrasionRisk}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">Frictional wear</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-slate-200 block mb-1">
                    Vibration Dynamics Summary:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {vibResult.engineeringObservations}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-3">
            Note: All virtual calculations utilize standard engineering finite formulations (McKee ECT equation and dynamic cushion impact acceleration curves).
          </div>
        </div>
      </div>
    </div>
  );
};
