
import React, { useState } from 'react';
import { BranchData, VendorData } from '../types';
import { Store, ChevronRight, Plus, MapPin, Search, ArrowLeft, Building2 } from 'lucide-react';

interface Props {
  vendor: VendorData;
  branches: BranchData[];
  onSelect: (branch: BranchData) => void;
  onAddNew: () => void;
  onBack: () => void;
}

const SelectBranch: React.FC<Props> = ({ vendor, branches, onSelect, onAddNew, onBack }) => {
  const [search, setSearch] = useState('');

  const filtered = branches.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-start animate-fadeIn space-y-4">
      {/* Premium Vendor Header */}
      <div className="w-full max-w-2xl relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-sky-500/20 to-emerald-500/20 blur-3xl opacity-50 animate-pulse" />
        <div className="relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 p-3 rounded-xl shadow-2xl flex flex-col items-center text-center space-y-2 overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Building2 size={60} />
          </div>

          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-sky-600 rounded-xl p-0.5 shadow-2xl shadow-emerald-500/20">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden">
              {vendor.logo ? (
                <img
                  src={vendor.logo.startsWith('http') ? vendor.logo : `https://onboardingapi.bezawcurbside.com${vendor.logo.startsWith('/') ? '' : '/'}${vendor.logo}`}
                  alt={vendor.name}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <span className="text-xl font-bold bg-gradient-to-br from-emerald-500 to-sky-600 bg-clip-text text-transparent">
                  {vendor.name ? vendor.name.charAt(0) : 'V'}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-0.5">
            <p className="text-[8px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.4em]">Authorized Partner</p>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {vendor.name || 'Vendor Name'}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/5 dark:bg-white/5 rounded-full border border-slate-950/5 dark:border-white/5">
            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">
              Control Panel &bull; {branches.length} Branches
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Select Branch</h3>
          <div className="h-px flex-1 mx-6 bg-slate-200 dark:bg-slate-800/50" />
        </div>

        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search network..."
            className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 h-9 pl-9 pr-3 rounded-lg focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-[11px] font-medium"
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filtered.map((branch) => (
            <button
              key={branch.id}
              onClick={() => onSelect(branch)}
              className="group bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-3 rounded-xl text-left hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-lg transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Store size={16} />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">{branch.name}</h4>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
                    <MapPin size={10} /> {branch.address}
                  </div>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" size={18} />
            </button>
          ))}

          <button
            onClick={onAddNew}
            className="group border-2 border-dashed border-slate-100 dark:border-slate-800 p-3 rounded-xl text-left hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/10 transition-all flex items-center justify-center gap-2.5"
          >
            <div className="w-7 h-7 bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-emerald-600 rounded-lg flex items-center justify-center transition-colors">
              <Plus size={16} />
            </div>
            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">Register New Physical Branch</span>
          </button>
        </div>

        <button
          onClick={onBack}
          className="w-full py-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
        >
          <ArrowLeft size={12} /> Back to Login
        </button>
      </div>
    </div>
  );
};

export default SelectBranch;