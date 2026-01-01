
import React, { useState } from 'react';
import { BranchData } from '../types';
import { Store, ChevronRight, Plus, MapPin, Search, ArrowLeft } from 'lucide-react';

interface Props {
  branches: BranchData[];
  onSelect: (branch: BranchData) => void;
  onAddNew: () => void;
  onBack: () => void;
}

const SelectBranch: React.FC<Props> = ({ branches, onSelect, onAddNew, onBack }) => {
  const [search, setSearch] = useState('');

  const filtered = branches.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-start animate-fadeIn space-y-8">
      <div className="text-center space-y-2 max-w-md">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Select Branch</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Choose a location to manage its branch managers or add a completely new physical branch.
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-6">
        <div className="relative group">
          <Search className="absolute left-4 top-4 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by branch name or location..."
            className="w-full bg-white dark:bg-slate-900 text-black dark:text-white border border-slate-200 dark:border-slate-800 h-14 pl-12 pr-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filtered.map((branch) => (
            <button
              key={branch.id}
              onClick={() => onSelect(branch)}
              className="group bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-6 rounded-[1.5rem] text-left hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-xl transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Store size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{branch.name}</h4>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                    <MapPin size={12} /> {branch.address}
                  </div>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" size={24} />
            </button>
          ))}

          <button
            onClick={onAddNew}
            className="group border-2 border-dashed border-slate-200 dark:border-slate-800 p-6 rounded-[1.5rem] text-left hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/10 transition-all flex items-center justify-center gap-3"
          >
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-emerald-600 rounded-xl flex items-center justify-center transition-colors">
              <Plus size={20} />
            </div>
            <span className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-[11px]">Register New Physical Branch</span>
          </button>
        </div>

        <button
          onClick={onBack}
          className="w-full py-2 text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Login
        </button>
      </div>
    </div>
  );
};

export default SelectBranch;
