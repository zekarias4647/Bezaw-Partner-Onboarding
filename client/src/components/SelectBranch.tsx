import React, { useState } from 'react';
import { BranchData, VendorData } from '../types';
import { Store, ChevronRight, Plus, MapPin, Search, ArrowLeft, Trash2, AlertTriangle, X, Clock } from 'lucide-react';
import PageDecorations from './PageDecorations';
import { API_ROUTES } from '../api';

interface Props {
  vendor: VendorData;
  branches: BranchData[];
  onSelect: (branch: BranchData) => void;
  onAddNew: () => void;
  onBack: () => void;
  onBranchDeleted?: () => void;
}

const SelectBranch: React.FC<Props> = ({ vendor, branches, onSelect, onAddNew, onBack, onBranchDeleted }) => {
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmBranch, setConfirmBranch] = useState<BranchData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = branches.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteConfirm = async () => {
    if (!confirmBranch) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(API_ROUTES.DELETE_BRANCH(vendor.regCode, confirmBranch.id), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete branch');
      setConfirmBranch(null);
      onBranchDeleted?.();
    } catch (err) {
      alert('Could not delete branch. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="animate-fadeIn relative w-full h-full flex flex-col items-center">

      {/* Decorations */}
      <PageDecorations variant="onboarding" />

      <div className="relative z-10 w-full max-w-2xl px-5 py-10 flex flex-col gap-6">

        {/* Vendor Header Card */}
        <div className="animate-slideUp p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl" style={{ background: 'var(--surface)' }}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-emerald to-transparent opacity-50" />
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-emerald to-brand-dark p-0.5 shadow-glow flex-shrink-0">
              <div className="w-full h-full rounded-[14px] bg-card flex items-center justify-center overflow-hidden">
                {vendor.logo ? (
                  <img
                    src={vendor.logo.startsWith('http') || vendor.logo.startsWith('data:')
                      ? vendor.logo
                      : API_ROUTES.IMAGE_PATH(vendor.logo)}
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
        <div className="animate-slideUp flex flex-col gap-4">
          <div className="flex items-center gap-4 px-2">
            <h3 className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40 whitespace-nowrap">
              Select Branch
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
          </div>

          {/* Search */}
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-40 group-focus-within:opacity-100 transition-opacity" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search branch name or address..."
              className="input-field pl-12 h-14 text-sm font-bold tracking-wide"
            />
          </div>

          <div className="flex flex-col gap-3">
            {filtered.length === 0 && search && (
              <div className="text-center py-10 opacity-40 text-sm font-bold uppercase tracking-widest italic">
                No matching branches found
              </div>
            )}

            {filtered.map((branch) => (
              <div
                key={branch.id}
                className="group rounded-[2rem] flex items-center justify-between transition-all duration-300 hover:scale-[1.015] overflow-hidden border border-border bg-white dark:bg-slate-900 shadow-sm"
                style={{
                  background: 'var(--surface)',
                  boxShadow: deletingId === branch.id ? '0 0 0 2px rgba(239,68,68,0.4)' : undefined
                }}
              >
                {/* Main clickable area */}
                <button
                  onClick={() => onSelect(branch)}
                  className="flex-1 flex items-center gap-4 text-left p-5 min-w-0"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center group-hover:bg-brand-emerald/20 flex-shrink-0 transition-colors">
                    <Store size={20} className="text-brand-emerald" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display font-black text-sm tracking-widest uppercase mb-1 text-inherit truncate">
                      {branch.name}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold opacity-40 truncate">
                      <MapPin size={10} className="text-brand-emerald flex-shrink-0" />
                      <span className="truncate">{branch.address}</span>
                    </div>
                    {(branch.opening_hours || branch.closing_hours) && (
                      <div className="flex items-center gap-1 mt-1 text-[9px] font-bold opacity-30">
                        <Clock size={9} className="flex-shrink-0" />
                        {branch.opening_hours} – {branch.closing_hours}
                      </div>
                    )}
                  </div>
                  <ChevronRight size={20} className="text-brand-emerald opacity-0 group-hover:opacity-100 flex-shrink-0 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </button>

                {/* Delete trigger */}
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmBranch(branch); }}
                  className="flex-shrink-0 w-12 h-full flex items-center justify-center text-red-400/40 hover:text-red-500 hover:bg-red-500/10 transition-all border-l border-border"
                  style={{ minHeight: 72 }}
                  title="Delete branch"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {/* Add New */}
            <button
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

        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 py-4 text-[10px] font-black tracking-widest uppercase opacity-40 hover:opacity-100 hover:text-brand-emerald transition-all"
        >
          <ArrowLeft size={14} /> Back to Login
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmBranch && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-fadeIn"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
          onClick={(e) => e.target === e.currentTarget && setConfirmBranch(null)}
        >
          <div
            className="w-full relative overflow-hidden"
            style={{
              maxWidth: 420,
              borderRadius: 24,
              background: 'var(--surface)',
              border: '1px solid rgba(239,68,68,0.2)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(239,68,68,0.05)',
            }}
          >
            {/* Red hero top */}
            <div className="relative overflow-hidden flex items-center gap-4 p-7 pb-5" style={{
              background: 'linear-gradient(135deg, #1c0a0a 0%, #2d1010 100%)',
              borderBottom: '1px solid rgba(239,68,68,0.15)',
            }}>
              <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }} />
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <AlertTriangle size={22} color="#ef4444" />
              </div>
              <div className="relative z-10">
                <div className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: 'rgba(239,68,68,0.7)' }}>Irreversible Action</div>
                <div className="font-display font-black text-lg text-white tracking-tight leading-snug">Delete Branch?</div>
              </div>
              <button
                onClick={() => setConfirmBranch(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <X size={14} color="rgba(255,255,255,0.5)" />
              </button>
            </div>

            {/* Body */}
            <div className="p-7">
              <p className="text-sm font-semibold leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                You are about to permanently remove{' '}
                <span className="font-black" style={{ color: 'var(--text)' }}>"{confirmBranch.name}"</span>{' '}
                from your network. All associated data will be lost.
              </p>

              <div className="rounded-2xl p-4 mb-6 flex items-start gap-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <MapPin size={14} color="#ef4444" className="mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-black uppercase tracking-widest mb-0.5" style={{ color: 'rgba(239,68,68,0.8)' }}>{confirmBranch.name}</div>
                  <div className="text-xs font-semibold" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>{confirmBranch.address}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmBranch(null)}
                  className="btn-ghost flex-1 h-12 rounded-2xl text-xs font-black uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 h-12 rounded-2xl text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: '#ef4444',
                    boxShadow: '0 4px 16px rgba(239,68,68,0.35)',
                    opacity: isDeleting ? 0.7 : 1,
                  }}
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>
                      <Trash2 size={14} />
                      Delete Branch
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectBranch;