
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
    const newBranch: BranchData = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      address: '',
      coordinates: '',
      phone: '',
      openingHours: '',
      closingHours: '',
      isBusy: false
    };
    onChange([...branches, newBranch]);
  };

  const updateBranch = (id: string, field: keyof BranchData, value: string) => {
    onChange(branches.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const removeBranch = (id: string) => {
    onChange(branches.filter(b => b.id !== id));
  };

  const handleAISuggest = async (id: string, address: string) => {
    if (!address) return;
    setIsSuggesting(id);
    const coords = await suggestCoordinates(address);
    if (coords) {
      updateBranch(id, 'coordinates', `${coords.lat}, ${coords.lng}`);
    }
    setIsSuggesting(null);
  };

  const inputStyles = "w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-[11px] font-medium";

  const getErrorStyle = (value: string) => {
    if (!showErrors) return "";
    return !value.trim() ? "border-red-500 ring-2 ring-red-500/10 focus:border-red-500" : "";
  };

  return (
    <div className="space-y-3 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Branch Network</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-[11px] font-medium">Add physical pickup locations for your customers.</p>
        </div>
        <button
          onClick={addBranch}
          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200 dark:border-emerald-800 uppercase tracking-widest text-[9px]"
        >
          <Plus size={14} /> Add Branch
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {branches.length === 0 && (
          <div className="py-6 text-center bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-xs">No branches mapped yet</p>
          </div>
        )}

        {branches.map((branch, idx) => (
          <div key={branch.id} className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center text-slate-500 font-bold text-[9px]">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <input
                  value={branch.name}
                  onChange={(e) => updateBranch(branch.id, 'name', e.target.value)}
                  placeholder="E.G. BOLE MEDHANIALEM BRANCH"
                  className={`text-xs font-bold outline-none border-b focus:border-emerald-500 w-64 bg-transparent px-1 uppercase tracking-tight transition-colors ${showErrors && !branch.name.trim() ? 'text-red-500 border-red-500' : 'text-black dark:text-emerald-500 border-transparent text-black dark:text-white'}`}
                />
              </div>
              <button onClick={() => removeBranch(branch.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 space-y-1.5">
                <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Physical Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-slate-300" size={12} />
                  <textarea
                    value={branch.address}
                    onChange={(e) => updateBranch(branch.id, 'address', e.target.value)}
                    placeholder="Area, Street, Landmark..."
                    className={`${inputStyles} pl-8 h-12 resize-none ${getErrorStyle(branch.address)}`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center justify-between">
                  Coordinates
                  <button onClick={() => handleAISuggest(branch.id, branch.address)} className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline">
                    <Wand2 size={10} /> {isSuggesting === branch.id ? 'Thinking...' : 'AI Pin'}
                  </button>
                </label>
                <div className="relative">
                  <Map className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={12} />
                  <input
                    value={branch.coordinates}
                    onChange={(e) => updateBranch(branch.id, 'coordinates', e.target.value)}
                    placeholder="9.01, 38.75"
                    className={`${inputStyles} pl-8 font-mono ${getErrorStyle(branch.coordinates)}`}
                  />
                </div>
                <p className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Precision tracking</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Branch Hot-line</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={12} />
                  <input
                    value={branch.phone}
                    onChange={(e) => updateBranch(branch.id, 'phone', e.target.value)}
                    placeholder="+251 9..."
                    className={`${inputStyles} pl-8 ${getErrorStyle(branch.phone)}`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Opening Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={12} />
                  <input
                    type="time"
                    value={branch.openingHours || ''}
                    onChange={(e) => updateBranch(branch.id, 'openingHours', e.target.value)}
                    className={`${inputStyles} pl-8`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Closing Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={12} />
                  <input
                    type="time"
                    value={branch.closingHours || ''}
                    onChange={(e) => updateBranch(branch.id, 'closingHours', e.target.value)}
                    className={`${inputStyles} pl-8`}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-400 font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-[10px] uppercase tracking-widest">
            <ChevronLeft size={14} /> Back
          </button>
          {showErrors && (
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1 animate-pulse">
              <MapPin size={12} /> Map all branches to proceed
            </p>
          )}
        </div>
        <button
          onClick={() => {
            if (branches.length === 0) {
              setShowErrors(true);
              return;
            }
            const incomplete = branches.filter(b => !b.name.trim() || !b.address.trim() || !b.coordinates.trim() || !b.phone.trim());
            if (incomplete.length > 0) {
              setShowErrors(true);
              return;
            }
            onNext();
          }}
          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2 text-[10px] uppercase tracking-widest"
        >
          Assign Managers <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default BranchSetup;
