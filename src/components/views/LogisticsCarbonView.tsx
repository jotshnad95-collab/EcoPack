import React from 'react';
import { useProject } from '../../store/projectStore';
import {
  Truck,
  Layers,
  Leaf,
  ArrowRight,
  TrendingDown,
  Info,
  Box,
  Scale,
  DollarSign,
  IndianRupee
} from 'lucide-react';

export const LogisticsCarbonView: React.FC = () => {
  const { activeDesign, baselineDesign, logistics, product, currency } = useProject();
  const sym = currency === 'INR' ? '₹' : '$';

  const baseTruckBoxes = activeDesign.logisticsBreakdown.boxesPerTruck;
  const baselineBoxes = baselineDesign.logisticsBreakdown.boxesPerTruck;
  const extraBoxes = Math.max(0, baseTruckBoxes - baselineBoxes);
  const percentGain = Number(((extraBoxes / Math.max(baselineBoxes, 1)) * 100).toFixed(1));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-emerald-400" />
            Logistics & Freight Carbon Engine
          </h1>
          <p className="text-sm text-slate-400">
            Simulate trailer cube utilization, EUR/US palletization stacking, and supply chain transportation carbon.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300">
          Route: <strong className="text-white">{logistics.shippingDistanceKm} km</strong> via <strong className="text-emerald-400 uppercase">{logistics.transportMode}</strong>
        </div>
      </div>

      {/* Major Highlight Card: Pallet & Trailer Yield Improvement */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Logistics Density Transformation
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            +{percentGain}% Higher Payload Density
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Baseline State */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">Legacy Baseline Packaging</span>
            <span className="text-3xl font-black text-slate-300 font-mono">
              {baselineBoxes.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 block mt-1">Boxes per 53ft Trailer</span>
            <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              {baselineDesign.logisticsBreakdown.truckSpaceUtilizationPercent}% Cube Utilization
            </div>
          </div>

          {/* Arrow / Delta Indicator */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-2 shadow-lg shadow-emerald-500/10">
              <ArrowRight className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-sm font-bold text-emerald-400">
              +{extraBoxes.toLocaleString()} more boxes / truck
            </span>
            <span className="text-xs text-slate-400 mt-0.5">
              Reduces annual roundtrips
            </span>
          </div>

          {/* Optimized State */}
          <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/60 text-center shadow-lg shadow-emerald-500/10">
            <span className="text-xs text-emerald-400 font-semibold block mb-1">EchoPack Optimized</span>
            <span className="text-3xl font-black text-white font-mono">
              {baseTruckBoxes.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-300/80 block mt-1">Boxes per 53ft Trailer</span>
            <div className="mt-3 pt-3 border-t border-emerald-800/40 text-[11px] text-emerald-300 font-mono font-bold">
              {activeDesign.logisticsBreakdown.truckSpaceUtilizationPercent}% Cube Utilization
            </div>
          </div>
        </div>
      </div>

      {/* Palletization Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pallet Layer Density */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Per Pallet</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-black text-white font-mono">
            {activeDesign.logisticsBreakdown.boxesPerPallet}
          </span>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            Standard EUR 1200×800mm
          </p>
        </div>

        {/* Pallets per Trailer */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Trailer Spaces</span>
            <Truck className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-2xl font-black text-white font-mono">
            {activeDesign.logisticsBreakdown.palletsPerTruck}
          </span>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            53ft Dry Van Standard
          </p>
        </div>

        {/* Volumetric Weight */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Volumetric Weight</span>
            <Scale className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-white font-mono">
            {activeDesign.logisticsBreakdown.volumetricWeightKg} kg
          </span>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            IATA 5000 cm³/kg divisor
          </p>
        </div>

        {/* Freight Carbon per Unit */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Freight CO₂e</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-black text-emerald-400 font-mono">
            {activeDesign.carbonBreakdown.transportEmissionsKg} kg
          </span>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            Per shipment ({logistics.shippingDistanceKm} km)
          </p>
        </div>
      </div>
    </div>
  );
};
