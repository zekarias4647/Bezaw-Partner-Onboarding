import React, { useState } from 'react';
import { BranchData } from '../types';
import { suggestCoordinates } from '../services/geminiService';
import { MapPin, Plus, Trash2, Phone, ChevronLeft, ChevronRight, Wand2, Map, Clock } from 'lucide-react';

interface Props {
  branches: BranchData[];
  onChange: (branches: BranchData[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const BranchSetup: React.FC<Props> = ({ branches, onChange, onNext, onBack }) => {
  const [isSuggesting, setIsSuggesting] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  const addBranch = () => {
    onChange([...branches, {
      id: Math.random().toString(36).substr(2, 9),
      name: '', address: '', coordinates: '', phone: '', openingHours: '', closingHours: '', isBusy: false
    }]);
  };

  const updateBranch = (id: string, field: keyof BranchData, value: string) =>
    onChange(branches.map(b => b.id === id ? { ...b, [field]: value } : b));

  const removeBranch = (id: string) => onChange(branches.filter(b => b.id !== id));

  const handleAISuggest = async (id: string, address: string) => {
    if (!address) return;
    setIsSuggesting(id);
    const coords = await suggestCoordinates(address);
    if (coords) updateBranch(id, 'coordinates', `${coords.lat}, ${coords.lng}`);
    setIsSuggesting(null);
  };

  const handleNext = () => {
    if (branches.length === 0) { setShowErrors(true); return; }
    const incomplete = branches.filter(b => !b.name.trim() || !b.address.trim() || !b.coordinates.trim() || !b.phone.trim());
    if (incomplete.length > 0) { setShowErrors(true); return; }
    onNext();
  };

  const errStyle = (val: string) =>
    showErrors && !val.trim() ? { borderColor: 'rgba(239,68,68,0.6)', boxShadow: '0 0 0 3px rgba(239,68,68,0.1)' } : {};

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl tracking-tighter mb-1 text-inherit">
            Branch Network
          </h2>
          <p className="text-xs opacity-50 font-medium">Add physical pickup locations for your customers.</p>
        </div>
        <button
          onClick={addBranch}
          className="btn-primary py-3 px-6 text-[10px] uppercase font-black tracking-widest"
        >
          <Plus size={14} /> Add Branch
        </button>
      </div>

      {/* Empty State */}
      {branches.length === 0 && (
        <div className="border-2 border-dashed border-brand-emerald/20 rounded-[2rem] py-16 px-10 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center text-brand-emerald">
            <MapPin size={28} />
          </div>
          <p className="text-xs font-black tracking-widest uppercase opacity-30">
            No branches mapped yet
          </p>
          {showErrors && (
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">
              Add at least one branch to continue
            </p>
          )}
        </div>
      )}

      {/* Branch Cards */}
      <div className="flex flex-col gap-4">
        {branches.map((branch, idx) => (
          <div
            key={branch.id}
            className="glass rounded-[2rem] overflow-hidden border border-border"
          >
            {/* Card Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-brand-emerald/5">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-emerald to-brand-dark flex items-center justify-center text-[11px] font-black text-white shadow-glow">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <input
                  value={branch.name}
                  onChange={(e) => updateBranch(branch.id, 'name', e.target.value)}
                  placeholder="BRANCH NAME (E.G. BOLE MEDHANIALEM)"
                  className="bg-transparent border-none outline-none font-display font-black text-base tracking-widest uppercase flex-1 placeholder:opacity-20 text-inherit"
                  style={{ color: showErrors && !branch.name.trim() ? '#f87171' : 'inherit' }}
                />
              </div>
              <button
                onClick={() => removeBranch(branch.id)}
                className="p-2 text-red-500/40 hover:text-red-500 transition-colors"
                title="Remove Branch"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Card Body */}
            <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Address */}
              <div className="lg:col-span-1">
                <label className="field-label flex items-center gap-2"><MapPin size={10} />Physical Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-brand-emerald opacity-30" size={14} />
                  <textarea
                    value={branch.address}
                    onChange={(e) => updateBranch(branch.id, 'address', e.target.value)}
                    placeholder="Area, Street, Landmark..."
                    className="input-field pl-10 h-24 pt-3 text-xs leading-relaxed"
                    style={errStyle(branch.address)}
                  />
                </div>
              </div>

              {/* Coordinates */}
              <div>
                <label className="field-label flex items-center justify-between">
                  <span className="flex items-center gap-2"><Map size={10} />Coordinates</span>
                  <button
                    onClick={() => handleAISuggest(branch.id, branch.address)}
                    className="text-[9px] font-black tracking-widest uppercase text-brand-emerald hover:brightness-125 transition-all flex items-center gap-1"
                  >
                    <Wand2 size={12} />{isSuggesting === branch.id ? 'Thinking...' : 'AI Pin'}
                  </button>
                </label>
                <div className="relative">
                  <Map className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" size={14} />
                  <input
                    value={branch.coordinates}
                    onChange={(e) => updateBranch(branch.id, 'coordinates', e.target.value)}
                    placeholder="9.01, 38.75"
                    className="input-field pl-10 h-14 font-mono text-xs"
                    style={errStyle(branch.coordinates)}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="field-label flex items-center gap-2"><Phone size={10} />Hotline</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" size={14} />
                  <input
                    value={branch.phone}
                    onChange={(e) => updateBranch(branch.id, 'phone', e.target.value)}
                    placeholder="+251 9..."
                    className="input-field pl-10 h-14 text-sm"
                    style={errStyle(branch.phone)}
                  />
                </div>
              </div>

              {/* Hours */}
              <div>
                <label className="field-label flex items-center gap-2"><Clock size={10} />Opening Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" size={14} />
                  <input type="time" value={branch.openingHours || ''} onChange={e => updateBranch(branch.id, 'openingHours', e.target.value)} className="input-field pl-10 h-14" />
                </div>
              </div>

              <div>
                <label className="field-label flex items-center gap-2"><Clock size={10} />Closing Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" size={14} />
                  <input type="time" value={branch.closingHours || ''} onChange={e => updateBranch(branch.id, 'closingHours', e.target.value)} className="input-field pl-10 h-14" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Nav */}
      <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
        <button onClick={onBack} className="btn-ghost px-8 h-14 text-[10px] uppercase font-black tracking-widest w-full sm:w-auto">
          <ChevronLeft size={16} /> Back
        </button>
        {showErrors && branches.length > 0 && (
          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
            <span>⚠</span> Complete all branch details
          </p>
        )}
        <button onClick={handleNext} className="btn-primary px-10 h-14 text-[10px] uppercase font-black tracking-widest w-full sm:w-auto shadow-glow">
          Assign Managers <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default BranchSetup;
