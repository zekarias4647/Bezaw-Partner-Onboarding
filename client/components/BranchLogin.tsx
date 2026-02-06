
import React, { useState } from 'react';
import { Key, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';

import { VendorData } from '../types';

interface Props {
  onSuccess: (vendor: VendorData, token: string) => void;
  onBack: () => void;
}

const BranchLogin: React.FC<Props> = ({ onSuccess, onBack }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 4) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5002/api/onboard/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regCode: code })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      onSuccess(data.vendor, data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center animate-fadeIn">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-2xl transition-colors duration-500">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Partner Access</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Enter your Store ID Code to proceed to branch management.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] px-1">Store ID Code</label>
            <div className="relative group">
              <Key className="absolute left-4 top-4 text-slate-300 dark:text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="E.G. BEZAW-XXXX"
                className="w-full bg-white text-black font-mono tracking-widest border border-slate-200 dark:border-slate-800 h-14 pl-12 pr-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all uppercase placeholder:text-slate-300 dark:placeholder:text-slate-800"
                maxLength={20}
              />
            </div>
            {error && <p className="text-red-500 text-xs font-bold text-center mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || code.length < 4}
            className="w-full h-14 bg-slate-900 dark:bg-emerald-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-emerald-900/10 active:scale-95"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Verify & Continue <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <button
          onClick={onBack}
          className="w-full py-2 text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
        >
          <ArrowLeft size={14} /> Back to menu
        </button>
      </div>
    </div>
  );
};

export default BranchLogin;
