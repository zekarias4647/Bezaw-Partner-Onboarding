
import React, { useState } from 'react';
import { BranchData } from '../types';
import { suggestCoordinates } from '../services/geminiService';
import { MapPin, Plus, Trash2, Phone, ChevronLeft, ChevronRight, Wand2, Map } from 'lucide-react';

interface Props {
  branches: BranchData[];
  onChange: (branches: BranchData[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const BranchSetup: React.FC<Props> = ({ branches, onChange, onNext, onBack }) => {
  const [isSuggesting, setIsSuggesting] = useState<string | null>(null);

  const addBranch = () => {
    const newBranch: BranchData = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      address: '',
      coordinates: '',
      phone: '',
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

  const inputStyles = "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white text-black focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm";

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Branch Network</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Add physical pickup locations for your customers.</p>
        </div>
        <button
          onClick={addBranch}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-black rounded-xl hover:bg-emerald-100 transition-colors border border-emerald-200 dark:border-emerald-800 uppercase tracking-widest text-[11px]"
        >
          <Plus size={18} /> Add Branch
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {branches.length === 0 && (
          <div className="py-20 text-center bg-slate-50/50 dark:bg-slate-900/50 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-xs">No branches mapped yet</p>
          </div>
        )}
        
        {branches.map((branch, idx) => (
          <div key={branch.id} className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 font-black text-xs">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <input
                  value={branch.name}
                  onChange={(e) => updateBranch(branch.id, 'name', e.target.value)}
                  placeholder="E.G. BOLE MEDHANIALEM BRANCH"
                  className="text-xl font-black text-black dark:text-emerald-500 outline-none border-b border-transparent focus:border-emerald-500 w-80 bg-transparent px-1 uppercase tracking-tight"
                />
              </div>
              <button onClick={() => removeBranch(branch.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                <Trash2 size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-2">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Physical Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-slate-300" size={18} />
                  <textarea
                    value={branch.address}
                    onChange={(e) => updateBranch(branch.id, 'address', e.target.value)}
                    placeholder="Area, Street, Landmark..."
                    className={`${inputStyles} pl-10 h-28 resize-none`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center justify-between">
                  Coordinates
                  <button onClick={() => handleAISuggest(branch.id, branch.address)} className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline">
                    <Wand2 size={12} /> {isSuggesting === branch.id ? 'Thinking...' : 'AI Pin'}
                  </button>
                </label>
                <div className="relative">
                  <Map className="absolute left-3 top-3.5 text-slate-300" size={18} />
                  <input
                    value={branch.coordinates}
                    onChange={(e) => updateBranch(branch.id, 'coordinates', e.target.value)}
                    placeholder="9.01, 38.75"
                    className={`${inputStyles} pl-10 font-mono`}
                  />
                </div>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Required for precision drive-through tracking</p>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Branch Hot-line</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-slate-300" size={18} />
                  <input
                    value={branch.phone}
                    onChange={(e) => updateBranch(branch.id, 'phone', e.target.value)}
                    placeholder="+251 9..."
                    className={`${inputStyles} pl-10`}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t dark:border-slate-800 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 px-6 py-4 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all">
          <ChevronLeft size={20} /> Back
        </button>
        <button
          onClick={onNext}
          disabled={branches.length === 0}
          className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          Assign Managers <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default BranchSetup;
