
import React from 'react';
import { ManagerData, BranchData } from '../types';
import { ShieldCheck, UserPlus, Mail, Phone, Lock, ChevronLeft, ChevronRight, UserMinus, Building } from 'lucide-react';

interface Props {
  managers: ManagerData[];
  branches: BranchData[];
  onChange: (managers: ManagerData[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const ManagerSetup: React.FC<Props> = ({ managers, branches, onChange, onNext, onBack }) => {
  const addManager = () => {
    const newManager: ManagerData = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      email: '',
      phone: '',
      branchId: branches[0]?.id || '',
      password: Math.random().toString(36).substr(2, 8)
    };
    onChange([...managers, newManager]);
  };

  const updateManager = (id: string, field: keyof ManagerData, value: string) => {
    onChange(managers.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeManager = (id: string) => {
    onChange(managers.filter(m => m.id !== id));
  };

  const inputStyles = "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-black focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all text-sm";

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Branch Access</h2>
          <p className="text-slate-500 mt-2">Grant secure access to branch personnel.</p>
        </div>
        <button onClick={addManager} className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl border border-indigo-200 hover:bg-indigo-100 transition-colors">
          <UserPlus size={20} /> New Manager
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {managers.map((manager) => (
          <div key={manager.id} className="bg-white rounded-2xl p-6 relative border border-slate-200 shadow-sm">
            <button onClick={() => removeManager(manager.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">
              <UserMinus size={18} />
            </button>

            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                  <ShieldCheck size={24} />
                </div>
                <div className="flex-1">
                  <input
                    value={manager.name}
                    onChange={(e) => updateManager(manager.id, 'name', e.target.value)}
                    placeholder="Full Name"
                    className="font-bold text-black outline-none border-b border-slate-100 focus:border-indigo-400 bg-transparent w-full"
                  />
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Access Credentials</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    value={manager.email}
                    onChange={(e) => updateManager(manager.id, 'email', e.target.value)}
                    placeholder="Email Address"
                    className={`${inputStyles} pl-10`}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input
                      value={manager.phone}
                      onChange={(e) => updateManager(manager.id, 'phone', e.target.value)}
                      placeholder="Phone"
                      className={`${inputStyles} pl-10`}
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input
                      readOnly
                      value={manager.password}
                      className={`${inputStyles} pl-10 font-mono text-xs text-slate-500 cursor-default`}
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <Building className="absolute left-3 top-3 text-slate-400" size={16} />
                  <select
                    value={manager.branchId}
                    onChange={(e) => updateManager(manager.id, 'branchId', e.target.value)}
                    className={`${inputStyles} pl-10 appearance-none`}
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name || 'Unnamed Branch'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 px-6 py-4 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all">
          <ChevronLeft size={20} /> Back
        </button>
        <button onClick={onNext} className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2">
          Review & Submit <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ManagerSetup;
