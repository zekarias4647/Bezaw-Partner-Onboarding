import React, { useState } from 'react';
import { ManagerData, BranchData } from '../types';
import { ShieldCheck, UserPlus, Mail, Phone, Lock, ChevronLeft, ChevronRight, UserMinus, Building, RefreshCw } from 'lucide-react';

interface Props {
  managers: ManagerData[];
  branches: BranchData[];
  onChange: (managers: ManagerData[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const ManagerSetup: React.FC<Props> = ({ managers, branches, onChange, onNext, onBack }) => {
  const [showErrors, setShowErrors] = useState(false);

  const addManager = () => {
    onChange([...managers, {
      id: Math.random().toString(36).substr(2, 9),
      name: '', email: '', phone: '',
      branchId: branches[0]?.id || '',
      password: Math.random().toString(36).substr(2, 8)
    }]);
  };

  const updateManager = (id: string, field: keyof ManagerData, value: string) =>
    onChange(managers.map(m => m.id === id ? { ...m, [field]: value } : m));

  const removeManager = (id: string) => onChange(managers.filter(m => m.id !== id));

  const handleNext = () => {
    const isValid = managers.length > 0 && managers.every(m => m.name.trim() && m.email.trim() && m.branchId);
    if (isValid) onNext(); else setShowErrors(true);
  };

  const errStyle = (val: string) =>
    showErrors && !val.trim() ? { borderColor: 'rgba(239,68,68,0.6)', boxShadow: '0 0 0 3px rgba(239,68,68,0.1)' } : {};

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl tracking-tighter mb-1 text-inherit">
            Branch Access
          </h2>
          <p className="text-xs opacity-50 font-medium">Grant secure credentials to your local branch personnel.</p>
        </div>
        <button onClick={addManager} className="btn-primary py-3 px-6 text-[10px] uppercase font-black tracking-widest shadow-glow">
          <UserPlus size={14} /> New Manager
        </button>
      </div>

      {/* Empty */}
      {managers.length === 0 && (
        <div className="border-2 border-dashed border-brand-emerald/20 rounded-[2rem] py-16 px-10 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center text-brand-emerald">
            <ShieldCheck size={28} />
          </div>
          <p className="text-xs font-black tracking-widest uppercase opacity-30">
            No managers assigned
          </p>
          {showErrors && (
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">
              Add at least one manager
            </p>
          )}
        </div>
      )}

      {/* Manager Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {managers.map((manager) => (
          <div key={manager.id} className="glass rounded-[2rem] p-6 relative group border border-border overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-emerald/30 to-transparent" />

            <button
              onClick={() => removeManager(manager.id)}
              className="absolute top-4 right-4 p-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500/40 hover:text-red-500 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
            >
              <UserMinus size={14} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-emerald/20 to-brand-dark/40 border border-brand-emerald/30 flex items-center justify-center text-brand-emerald">
                <ShieldCheck size={20} />
              </div>
              <div className="flex-1 pr-6 border-b border-white/5">
                <input
                  value={manager.name}
                  onChange={(e) => updateManager(manager.id, 'name', e.target.value)}
                  placeholder="Full Name"
                  className="bg-transparent border-none outline-none font-display font-black text-sm tracking-widest uppercase w-full placeholder:opacity-20 text-inherit"
                  style={{ color: showErrors && !manager.name.trim() ? '#f87171' : 'inherit' }}
                />
                <div className="text-[8px] font-black tracking-widest uppercase opacity-30 mt-1">
                  Personnel Profile
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="field-label flex items-center gap-2"><Mail size={10} />Email Identity</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" size={14} />
                  <input
                    value={manager.email}
                    onChange={e => updateManager(manager.id, 'email', e.target.value)}
                    placeholder="manager@store.com"
                    className="input-field pl-10 h-12 text-xs"
                    style={errStyle(manager.email)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label flex items-center gap-2"><Phone size={10} />Contact</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" size={14} />
                    <input value={manager.phone} onChange={e => updateManager(manager.id, 'phone', e.target.value)} placeholder="+251..." className="input-field pl-10 h-12 text-xs" />
                  </div>
                </div>
                <div>
                  <label className="field-label flex items-center justify-between">
                    <span className="flex items-center gap-2"><Lock size={10} />Pass</span>
                    <button onClick={() => updateManager(manager.id, 'password', Math.random().toString(36).substr(2, 8))} className="text-brand-emerald opacity-50 hover:opacity-100 transition-opacity">
                      <RefreshCw size={10} />
                    </button>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" size={14} />
                    <input value={manager.password} onChange={e => updateManager(manager.id, 'password', e.target.value)} placeholder="••••" className="input-field pl-10 h-12 text-xs font-mono" />
                  </div>
                </div>
              </div>

              <div>
                <label className="field-label flex items-center gap-2"><Building size={10} />Assigned Branch</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" size={14} />
                  <select
                    value={manager.branchId}
                    onChange={e => updateManager(manager.id, 'branchId', e.target.value)}
                    className="input-field pl-10 h-12 text-xs appearance-none cursor-pointer"
                    style={errStyle(manager.branchId)}
                  >
                    <option value="">Select Branch...</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name || 'Unnamed Branch'}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
        <button onClick={onBack} className="btn-ghost px-8 h-14 text-[10px] uppercase font-black tracking-widest w-full sm:w-auto">
          <ChevronLeft size={16} /> Network Map
        </button>
        {showErrors && managers.length > 0 && (
          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
            <span>⚠</span> Complete all profiles
          </p>
        )}
        <button onClick={handleNext} className="btn-primary px-10 h-14 text-[10px] uppercase font-black tracking-widest w-full sm:w-auto shadow-glow">
          Review Final Plan <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ManagerSetup;
