import React, { useState } from 'react';
import { COMPLIANCE_RULES, COMPLIANCE_DISCLAIMER } from '../../data/complianceRules';
import { useProject } from '../../store/projectStore';
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Filter,
  Info,
  Shield,
  HelpCircle
} from 'lucide-react';

export const ComplianceCenterView: React.FC = () => {
  const { product, activeDesign } = useProject();
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('all');

  const filteredRules = COMPLIANCE_RULES.filter(r => {
    if (selectedJurisdiction === 'all') return true;
    return r.jurisdiction.toLowerCase().includes(selectedJurisdiction.toLowerCase());
  });

  const compliantCount = COMPLIANCE_RULES.filter(r => r.status === 'compliant').length;
  const warningCount = COMPLIANCE_RULES.filter(r => r.status === 'warning').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-emerald-400" />
            Packaging Compliance & Regulatory Center
          </h1>
          <p className="text-sm text-slate-400">
            Cross-jurisdictional compliance verification against EU PPWR, US EPR State Laws, Indian PWM Rules, and food/cosmetic contact standards.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> {compliantCount} Compliant
          </span>
          {warningCount > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> {warningCount} Action Advised
            </span>
          )}
        </div>
      </div>

      {/* Decision Support Disclaimer Alert Banner */}
      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 flex items-start gap-3 text-xs text-amber-200/90 leading-relaxed shadow-lg">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-400 font-semibold block mb-0.5">Legal Disclaimer:</strong>
          {COMPLIANCE_DISCLAIMER}
        </div>
      </div>

      {/* Jurisdiction Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Jurisdictions' },
          { id: 'European Union', label: 'EU PPWR (2030)' },
          { id: 'United States', label: 'US EPR Laws' },
          { id: 'India', label: 'India PWM & EPR' },
          { id: 'UK', label: 'UK Plastic Tax' },
          { id: 'Global', label: 'ISO / Global' }
        ].map(j => (
          <button
            key={j.id}
            onClick={() => setSelectedJurisdiction(j.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedJurisdiction === j.id
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {j.label}
          </button>
        ))}
      </div>

      {/* Rules Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map(rule => {
          const isPass = rule.status === 'compliant';
          const isWarn = rule.status === 'warning';

          return (
            <div
              key={rule.id}
              className={`glass-panel p-5 rounded-2xl border transition space-y-3 ${
                isPass
                  ? 'border-slate-800 hover:border-emerald-500/40'
                  : 'border-amber-800/50 bg-amber-950/10'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {rule.jurisdiction}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {rule.category}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white leading-snug">
                    {rule.ruleTitle}
                  </h3>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 flex items-center gap-1 ${
                    isPass
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {isPass ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  {isPass ? 'COMPLIANT' : 'REVIEW'}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {rule.description}
              </p>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 font-medium">
                <span className="text-emerald-400 font-semibold block mb-0.5">Recommended Implementation:</span>
                {rule.actionRequired}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
