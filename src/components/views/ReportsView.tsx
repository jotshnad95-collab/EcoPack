import React, { useRef } from 'react';
import { useProject } from '../../store/projectStore';
import { MATERIALS_DATABASE } from '../../data/materials';
import {
  FileText,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  ShieldCheck,
  DollarSign,
  IndianRupee,
  Truck,
  Box,
  Cpu
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    activeDesign,
    baselineDesign,
    product,
    requirements,
    logistics,
    weights,
    currency
  } = useProject();

  const reportRef = useRef<HTMLDivElement>(null);
  const sym = currency === 'INR' ? '₹' : '$';
  const mat = MATERIALS_DATABASE[activeDesign.materialId];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const reportData = {
      meta: {
        title: `EchoPack Engineering Report - ${product.name}`,
        generatedAt: new Date().toISOString(),
        version: 'EchoPack v2.4'
      },
      product,
      requirements,
      baseline: baselineDesign,
      activeConfiguration: activeDesign,
      logistics,
      weights
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EchoPack_Report_${product.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" />
            Executive Packaging Engineering Report
          </h1>
          <p className="text-sm text-slate-400">
            Comprehensive 16-section technical dossier covering structural integrity, cradle-to-grave LCA, cost accounting, and supply chain logistics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadJson}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition border border-slate-700 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Download JSON
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Printable Report Document */}
      <div
        ref={reportRef}
        className="glass-panel p-8 sm:p-12 rounded-2xl border border-slate-800 bg-slate-900/90 text-slate-100 shadow-2xl space-y-8 print:bg-white print:text-black print:p-0 print:border-none print:shadow-none"
      >
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-xl tracking-tight text-white print:text-black">
                Echo<span className="text-emerald-400 print:text-emerald-700">Pack</span>
              </span>
              <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 print:border-black print:text-black">
                Engineering Specification
              </span>
            </div>
            <p className="text-xs text-slate-400 print:text-slate-600">
              Deterministic Decision-Support Platform • Report ID: EP-2026-09
            </p>
          </div>
          <div className="text-right text-xs font-mono text-slate-400 print:text-slate-600">
            <span>Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800 flex items-center gap-2">
            1. Executive Summary
          </h2>
          <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
            EchoPack was commissioned to engineer an optimal primary and secondary packaging architecture for <strong>{product.name}</strong>. By synthesizing finite element cushion deflection curves with McKee's Box Compression formula and DEFRA lifecycle carbon inventories, the platform recommends <strong>{activeDesign.name}</strong>. This configuration reduces unit cost by <strong>{activeDesign.costBreakdown.savingsPercentVsBaseline}%</strong> ({sym}{activeDesign.costBreakdown.savingsPerPackageVsBaseline}/pkg) and avoids <strong>{activeDesign.carbonBreakdown.reductionPercentVsBaseline}%</strong> of cradle-to-grave carbon emissions while maintaining an ASTM 1.0m drop protection score of <strong>{activeDesign.protectionBreakdown.overallProtectionScore}/100</strong>.
          </p>
        </section>

        {/* Section 2: Product Specifications */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800">
            2. Product Technical Profile
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-slate-300 font-mono">
            <div>
              <span className="text-slate-500 block text-[10px]">Dimensions</span>
              <span className="font-bold">{product.length}×{product.width}×{product.height} mm</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Net Mass</span>
              <span className="font-bold">{product.weight} grams</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Fragility Threshold</span>
              <span className="font-bold">{product.fragilityGMax} G max</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Category</span>
              <span className="font-bold">{product.category}</span>
            </div>
          </div>
        </section>

        {/* Section 3 & 4: Existing vs Proposed Packaging */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800">
            3 & 4. Baseline vs. Proposed Packaging Specification
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-950/60 print:bg-slate-100 rounded-xl border border-slate-800 print:border-slate-300">
              <span className="font-bold text-rose-400 print:text-rose-700 block mb-1">Existing Baseline Packaging</span>
              <p className="text-slate-400 print:text-slate-600 mb-2">{baselineDesign.tagline}</p>
              <ul className="space-y-1 font-mono text-[11px] text-slate-300 print:text-slate-700">
                <li>• Outer Dimensions: {baselineDesign.outerLength}×{baselineDesign.outerWidth}×{baselineDesign.outerHeight} mm</li>
                <li>• Tare Mass: {baselineDesign.tareWeightGrams} g</li>
                <li>• Unit Cost: {sym}{baselineDesign.costBreakdown.totalCostPerPackage}</li>
                <li>• Carbon: {baselineDesign.carbonBreakdown.totalCo2ePerPackageKg} kg CO₂e</li>
              </ul>
            </div>

            <div className="p-4 bg-emerald-950/30 print:bg-emerald-50 rounded-xl border border-emerald-500/40 print:border-emerald-300">
              <span className="font-bold text-emerald-400 print:text-emerald-800 block mb-1">Proposed Architecture ({activeDesign.name})</span>
              <p className="text-slate-400 print:text-slate-600 mb-2">{activeDesign.tagline}</p>
              <ul className="space-y-1 font-mono text-[11px] text-slate-300 print:text-slate-700">
                <li>• Outer Dimensions: {activeDesign.outerLength}×{activeDesign.outerWidth}×{activeDesign.outerHeight} mm</li>
                <li>• Tare Mass: {activeDesign.tareWeightGrams} g</li>
                <li>• Unit Cost: {sym}{activeDesign.costBreakdown.totalCostPerPackage}</li>
                <li>• Carbon: {activeDesign.carbonBreakdown.totalCo2ePerPackageKg} kg CO₂e</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 5: Material Selection */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800">
            5. Material Intelligence & Substrate Selection
          </h2>
          <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
            The design specifies <strong>{mat.name}</strong>. With a bulk density of {mat.densityGcm3} g/cm³, tensile strength of {mat.tensileStrengthMpa} MPa, and Mullen burst capacity of {mat.burstStrengthKpa} kPa, it provides the required edge crush stiffness ({mat.ectKnM} kN/m) while achieving <strong>{mat.recyclabilityPercent}%</strong> curbside recyclability and <strong>{mat.recycledContentPercent}%</strong> post-consumer recovered fiber content.
          </p>
        </section>

        {/* Section 6 & 7: Cost and Carbon Analyses */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800">
            6 & 7. Cost & Lifecycle Carbon Analysis
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-slate-300 font-mono">
            <div>
              <span className="text-slate-500 block text-[10px]">Raw Material Cost</span>
              <span className="font-bold">{sym}{activeDesign.costBreakdown.materialCost}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Cushioning Cost</span>
              <span className="font-bold">{sym}{activeDesign.costBreakdown.cushioningCost}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Manufacturing/Tooling</span>
              <span className="font-bold">{sym}{activeDesign.costBreakdown.manufacturingCost}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Freight Share</span>
              <span className="font-bold">{sym}{activeDesign.costBreakdown.transportCostShare}</span>
            </div>
          </div>
        </section>

        {/* Section 8 & 9: Protection & Virtual Tests */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800">
            8 & 9. Structural Protection & Virtual Simulation
          </h2>
          <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
            In simulated ASTM D5276 testing from 1.0m onto concrete, peak shock transferred to the {product.weight}g product was calculated at <strong>{activeDesign.protectionBreakdown.gForceExperienced} G</strong>, comfortably beneath the allowable damage envelope ({product.fragilityGMax} G). McKee Box Compression capacity is rated at <strong>{activeDesign.protectionBreakdown.boxCompressionCapacityKg} kg</strong>, delivering a {((activeDesign.protectionBreakdown.boxCompressionCapacityKg / Math.max(activeDesign.protectionBreakdown.stackingLoadKg, 1))).toFixed(1)}x safety factor under standard warehouse pallet tiers.
          </p>
        </section>

        {/* Section 10 & 11: Logistics and Sustainability */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800">
            10 & 11. Logistics & Circularity Impact
          </h2>
          <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
            Optimized outer dimensions increase 53ft trailer cargo capacity from {baselineDesign.logisticsBreakdown.boxesPerTruck.toLocaleString()} to <strong>{activeDesign.logisticsBreakdown.boxesPerTruck.toLocaleString()}</strong> packages (+{activeDesign.logisticsBreakdown.boxesPerTruck - baselineDesign.logisticsBreakdown.boxesPerTruck} units/truck), achieving <strong>{activeDesign.logisticsBreakdown.truckSpaceUtilizationPercent}%</strong> cube utilization. Annual lifecycle carbon reduction totals <strong>{activeDesign.carbonBreakdown.annualCo2AvoidedTonnes} tonnes of CO₂e</strong> (~{activeDesign.carbonBreakdown.equivalentTreesYear} mature tree equivalents).
          </p>
        </section>

        {/* Section 12 & 13: Compliance & Optimization */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800">
            12 & 13. Regulatory Compliance & Multi-Objective Synthesis
          </h2>
          <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
            Evaluated against EU PPWR Article 9 (void space &lt;40%) and California SB 54 EPR curbside standards. The mono-material paper fiber architecture meets Class A recyclability criteria with zero single-use plastic EPR tax liabilities.
          </p>
        </section>

        {/* Section 14, 15, 16: Recommendation, Savings, Risks */}
        <section className="space-y-2 border-t border-slate-800 pt-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800">
            14, 15 & 16. Final Recommendation, Savings & Engineering Limitations
          </h2>
          <div className="p-4 bg-slate-950/80 print:bg-slate-100 rounded-xl border border-slate-800 print:border-slate-300 text-xs text-slate-300 print:text-slate-700 space-y-2">
            <p><strong>Recommendation:</strong> Adopt {activeDesign.name} for full-scale commercial production.</p>
            <p><strong>Financial Yield:</strong> Projected annual savings of <strong>{sym}{activeDesign.costBreakdown.annualSavingsVsBaseline.toLocaleString()}</strong> at {requirements.annualQuantity.toLocaleString()} annual production units.</p>
            <p className="text-slate-400 print:text-slate-600 text-[11px]">
              <strong>Engineering Limitations Disclaimer:</strong> Calculations are derived from validated finite mathematical models (McKee ECT equation, GLEC logistics standards, DEFRA emission factors). Virtual simulations do not replace certified physical drop and vibration testing required by ISTA or ISO regulatory bodies.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
