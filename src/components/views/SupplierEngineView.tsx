import React, { useState } from 'react';
import { DEMO_SUPPLIERS } from '../../data/suppliers';
import { MATERIALS_DATABASE } from '../../data/materials';
import { useProject } from '../../store/projectStore';
import {
  Building2,
  Search,
  CheckCircle2,
  ShieldCheck,
  Mail,
  MapPin,
  Sparkles,
  Info,
  Clock,
  Layers,
  X
} from 'lucide-react';

export const SupplierEngineView: React.FC = () => {
  const { currency } = useProject();
  const sym = currency === 'INR' ? '₹' : '$';
  const mult = currency === 'INR' ? 1 : (1 / 85);

  const [search, setSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<typeof DEMO_SUPPLIERS[0] | null>(null);
  const [rfqSent, setRfqSent] = useState(false);

  const filteredSuppliers = DEMO_SUPPLIERS.filter(s => {
    return (
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase()) ||
      s.materials.some(m => m.includes(search.toLowerCase()))
    );
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              DEMO SUPPLIER DATA
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-400" />
            Sustainable Supplier Sourcing Engine
          </h1>
          <p className="text-sm text-slate-400">
            Discover verified converting mills, thermoformed pulp molders, and FSC-certified packaging converters with verified chain of custody.
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono">
          {DEMO_SUPPLIERS.length} Certified Partners
        </div>
      </div>

      {/* Demo Notice Banner */}
      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>Supplier directory is currently operating in prototype mode with simulated commercial rate tiers and lead times.</span>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter by supplier name, location, or material..."
          className="w-full glass-input pl-10 pr-4 py-2.5 text-xs"
        />
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSuppliers.map(s => (
          <div
            key={s.id}
            className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {s.name}
                    {s.verified && (
                      <span title="Audited Facility">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{s.location}, {s.country}</span>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {s.recycledContentMaxPercent}% PCR Capable
                </span>
              </div>

              {/* Material Capabilities Chips */}
              <div className="flex flex-wrap gap-1 my-3">
                {s.materials.map(mId => (
                  <span
                    key={mId}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800"
                  >
                    {MATERIALS_DATABASE[mId]?.name.split(' ')[0] || mId}
                  </span>
                ))}
              </div>

              {/* Commercial Metrics */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 mb-3">
                <div>
                  <span className="text-slate-500 text-[10px] block">Unit Price Band</span>
                  <span className="text-white font-bold">
                    {sym}{(s.unitCostRange.min * mult).toFixed(1)} – {sym}{(s.unitCostRange.max * mult).toFixed(1)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Minimum Run (MOQ)</span>
                  <span className="text-slate-200 font-bold">{s.moq.toLocaleString()} units</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" /> Lead Time: {s.leadTimeWeeks} weeks
                  </span>
                </div>
              </div>

              {/* Certifications List */}
              <div className="text-[10px] text-slate-400 space-y-1 mb-4">
                <span className="font-semibold text-slate-300 block">Certifications:</span>
                <div className="flex flex-wrap gap-1">
                  {s.certifications.map((c, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400 border border-emerald-900/40">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedSupplier(s);
                setRfqSent(false);
              }}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" /> Request Production Quote
            </button>
          </div>
        ))}
      </div>

      {/* Quote / RFQ Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Production Quote Inquiry</h3>
                <p className="text-xs text-slate-400">To: {selectedSupplier.name}</p>
              </div>
              <button
                onClick={() => setSelectedSupplier(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {rfqSent ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Inquiry Dispatched (Demo Mode)</h4>
                <p className="text-xs text-slate-400">
                  A formal spec sheet containing 3D CAD dimensions, McKee BCT structural thresholds, and DEFRA carbon targets was queued for {selectedSupplier.name}.
                </p>
                <button
                  onClick={() => setSelectedSupplier(null)}
                  className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Target Production Run (Units)</label>
                  <input
                    type="number"
                    defaultValue={50000}
                    className="w-full glass-input px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Engineering Notes</label>
                  <textarea
                    rows={3}
                    defaultValue="Requesting tooling and sample run quote for thermoformed molded fiber packaging with ASTM D5276 drop compliance."
                    className="w-full glass-input px-3 py-2 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedSupplier(null)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setRfqSent(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                  >
                    Send Spec Packet
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
