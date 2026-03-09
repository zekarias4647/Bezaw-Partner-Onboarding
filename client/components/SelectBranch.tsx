import React, { useState } from 'react';
import { BranchData, VendorData } from '../types';
import { Store, ChevronRight, Plus, MapPin, Search, ArrowLeft, Building2 } from 'lucide-react';
import PageDecorations from './PageDecorations';

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
    <div className="animate-fadeIn relative w-full h-full flex flex-col items-center">

      {/* Cinematic Decorations */}
      <PageDecorations variant="onboarding" />

      <div className="relative z-10 w-full max-w-2xl px-5 py-10 flex flex-col gap-6">

        {/* Vendor Header Card */}
        <div className="animate-slideUp glass p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-emerald to-transparent opacity-50" />

          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {/* Logo Wrapper */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-emerald to-brand-dark p-0.5 shadow-glow flex-shrink-0">
              <div className="w-full h-full rounded-[14px] bg-card flex items-center justify-center overflow-hidden">
                {vendor.logo ? (
                  <img
                    src={vendor.logo.startsWith('http') || vendor.logo.startsWith('data:')
                      ? vendor.logo
                      : `https://onboardingapi.bezawcurbside.com${vendor.logo.startsWith('/') ? '' : '/'}${vendor.logo}`}
                    alt={vendor.name}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <span className="font-display font-black text-3xl text-brand-emerald">
                    {vendor.name ? vendor.name.charAt(0) : 'V'}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="text-[10px] font-black tracking-[0.3em] uppercase text-brand-emerald mb-2">
                Authorized Partner
              </div>
              <h2 className="font-display font-black text-3xl tracking-tighter mb-3 text-inherit">
                {vendor.name || 'Vendor Name'}
              </h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-[9px] font-black tracking-widest uppercase text-brand-emerald">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
                  Control Panel
                </div>
                <div className="px-3 py-1.5 rounded-full bg-surface/40 border border-border text-[9px] font-bold tracking-widest uppercase opacity-60">
                  {branches.length} {branches.length === 1 ? 'Branch' : 'Branches'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="animate-slideUp delay-100 flex flex-col gap-4">
          <div className="flex items-center gap-4 px-2">
            <h3 className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40 whitespace-nowrap">
              Select Branch
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
          </div>

          {/* Search Wrapper */}
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-40 group-focus-within:opacity-100 transition-opacity" />
            <input
              id="branch-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search branch name or address..."
              className="input-field pl-12 h-14 text-sm font-bold tracking-wide transition-all"
            />
          </div>

          <div className="flex flex-col gap-3">
            {filtered.length === 0 && search && (
              <div className="text-center py-10 opacity-40 text-sm font-bold uppercase tracking-widest italic">
                No matching branches found
              </div>
            )}

            {filtered.map((branch) => (
              <button
                key={branch.id}
                onClick={() => onSelect(branch)}
                className="glass group p-5 rounded-[2rem] flex items-center justify-between hover:scale-[1.02] transition-all duration-300 border border-border"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center group-hover:bg-brand-emerald/20 transition-colors">
                    <Store size={20} className="text-brand-emerald" />
                  </div>
                  <div>
                    <div className="font-display font-black text-sm tracking-widest uppercase mb-1 text-inherit">
                      {branch.name}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold opacity-40">
                      <MapPin size={10} className="text-brand-emerald" />
                      {branch.address}
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-brand-emerald/10 text-brand-emerald opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                  <ChevronRight size={24} />
                </div>
              </button>
            ))}

            <button
              id="add-new-branch-btn"
              onClick={onAddNew}
              className="p-6 rounded-[2rem] border-2 border-dashed border-brand-emerald/20 hover:border-brand-emerald/50 hover:bg-brand-emerald/5 transition-all flex items-center justify-center gap-4 text-brand-emerald/60 hover:text-brand-emerald"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 flex items-center justify-center">
                <Plus size={20} />
              </div>
              <span className="text-[11px] font-black tracking-widest uppercase">
                Register New Physical Branch
              </span>
            </button>
          </div>
        </div>

        {/* Footer Back Button */}
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 py-4 text-[10px] font-black tracking-widest uppercase opacity-40 hover:opacity-100 hover:text-brand-emerald transition-all"
        >
          <ArrowLeft size={14} /> Back to Login
        </button>
      </div>
    </div>
  );
};

export default SelectBranch;