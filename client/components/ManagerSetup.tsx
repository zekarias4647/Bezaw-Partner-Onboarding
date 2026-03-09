
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
    // Standard "Add Manager" button
    const newManager: ManagerData = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      email: '',
      phone: '',
      // Default to the first branch to be helpful, or empty if they prefer
      branchId: branches[0]?.id || '',
      password: Math.random().toString(36).substr(2, 8)
    };
    onChange([...managers, newManager]);
  };

  const updateManager = (id: string, field: keyof ManagerData, value: string) => {
    onChange(managers.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const regeneratePassword = (id: string) => {
    const newPass = Math.random().toString(36).substr(2, 8);
    updateManager(id, 'password', newPass);
  };

  const removeManager = (id: string) => {
    onChange(managers.filter(m => m.id !== id));
  };

  const handleNext = () => {
    // Check validation
    const isValid = managers.length > 0 && managers.every(m => m.name.trim() && m.email.trim() && m.branchId);

    if (isValid) {
      onNext();
    } else {
      setShowErrors(true);
    }
  };

  // Helper for error styling
  const inputStyles = (hasError: boolean) =>
    `w-full px-3 py-2 rounded-lg border ${hasError ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-xs font-medium shadow-sm`;

  return (
    <div className="space-y-3 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Branch Access</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-[10px] font-medium">Grant secure credentials to your local branch personnel.</p>
        </div>
        <button
          onClick={addManager}
          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 uppercase tracking-widest text-[9px]"
        >
          <UserPlus size={14} /> New Manager
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {managers.length === 0 && (
          <div className="md:col-span-2 py-6 text-center bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-xs">No managers assigned</p>
          </div>
        )}

        {managers.map((manager) => (
          <div key={manager.id} className="bg-white dark:bg-slate-900/60 rounded-xl p-3 relative border border-slate-200 dark:border-slate-800 shadow-lg transition-all hover:border-indigo-500/50 group">
            <button
              onClick={() => removeManager(manager.id)}
              className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors bg-slate-50 dark:bg-slate-800 p-2 rounded-full"
            >
              <UserMinus size={18} />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center shadow-inner">
                  <ShieldCheck size={18} />
                </div>
                <div className="flex-1">
                  <input
                    value={manager.name}
                    onChange={(e) => updateManager(manager.id, 'name', e.target.value)}
                    placeholder="Full Name"
                    className={`font-bold text-sm text-black dark:text-white outline-none border-b bg-transparent w-full transition-colors uppercase tracking-tight ${showErrors && !manager.name.trim() ? 'border-red-500' : 'border-slate-100 dark:border-slate-800 focus:border-indigo-500'}`}
                  />
                  <p className="text-[8px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest mt-0.5">Personnel Profile</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Email Identity</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={12} />
                    <input
                      value={manager.email}
                      onChange={(e) => updateManager(manager.id, 'email', e.target.value)}
                      placeholder="manager@supermarket.com"
                      className={`${inputStyles(showErrors && !manager.email.trim())} pl-8`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Contact</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={12} />
                      <input
                        value={manager.phone}
                        onChange={(e) => updateManager(manager.id, 'phone', e.target.value)}
                        placeholder="Phone"
                        className={`${inputStyles(false)} pl-8`}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 flex justify-between">
                      Password
                      <button onClick={() => regeneratePassword(manager.id)} className="text-indigo-500 hover:text-indigo-600">
                        <RefreshCw size={10} />
                      </button>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={12} />
                      <input
                        value={manager.password}
                        onChange={(e) => updateManager(manager.id, 'password', e.target.value)}
                        placeholder="Password"
                        className={`${inputStyles(false)} pl-8 font-mono tracking-wider`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Assigned Branch (Select)</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={12} />
                    <select
                      value={manager.branchId}
                      onChange={(e) => updateManager(manager.id, 'branchId', e.target.value)}
                      className={`${inputStyles(showErrors && !manager.branchId)} pl-8 appearance-none`}
                    >
                      <option value="">Select Branch...</option>
                      {branches.length === 0 && <option value="" disabled>No Branches Created Yet</option>}
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name || 'Unnamed Branch'}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all uppercase text-[10px] tracking-widest">
            <ChevronLeft size={14} /> Network Map
          </button>
          {showErrors && (
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1 animate-pulse">
              <ShieldCheck size={12} /> Complete all personnel profiles
            </p>
          )}
        </div>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2 uppercase text-[10px] tracking-widest"
        >
          Review Final Plan <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default ManagerSetup;
