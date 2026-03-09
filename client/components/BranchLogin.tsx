import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, ArrowLeft, Key, Sparkles, Lock } from 'lucide-react';
import { VendorData } from '../types';
import PageDecorations from './PageDecorations';

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
      const response = await fetch('https://onboardingapi.bezawcurbside.com/api/onboard/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regCode: code })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      onSuccess(data.vendor, data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center animate-fadeIn relative" style={{ padding: '40px 20px', minHeight: 'calc(100vh - 160px)' }}>

      {/* Cinematic Decorations for Login */}
      <PageDecorations variant="login" />

      {/* Floating orbs */}
      <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full blur-[40px] pointer-events-none z-0 animate-float"
        style={{ background: 'radial-gradient(circle, var(--glow), transparent)' }} />
      <div className="absolute bottom-[20%] right-[10%] w-[250px] h-[250px] rounded-full blur-[30px] pointer-events-none z-0 animate-float"
        style={{ background: 'radial-gradient(circle, var(--grid), transparent)', animationDelay: '2s' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 400 }}>

        {/* Icon Hero */}
        <div className="animate-slideUp mb-10 text-center" style={{ animationFillMode: 'both' }}>
          <div className="w-20 h-20 bg-gradient-to-br from-brand-emerald to-brand-dark rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow animate-pulse">
            <ShieldCheck size={36} color="#fff" />
          </div>
          <h2 className="font-display font-black text-3xl tracking-tighter mb-2 text-inherit">
            Partner Access
          </h2>
          <p className="text-sm opacity-50 font-medium">
            Enter your Store ID to access your branch management portal
          </p>
        </div>

        {/* Card */}
        <div
          className="animate-slideUp delay-100 glass p-10 rounded-[2.5rem] relative overflow-hidden"
          style={{ animationFillMode: 'both' }}
        >
          {/* Top glow bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-emerald to-transparent" />

          {/* Corner decoration */}
          <div className="absolute top-0 right-0 w-24 h-24"
            style={{ background: 'radial-gradient(circle at top right, var(--glow), transparent)' }} />

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div>
              <label className="text-[10px] font-black tracking-widest uppercase opacity-40 mb-3 block">Store ID Code</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 text-brand-emerald" />
                <input
                  id="store-id-input"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="E.G. BZWV-123456"
                  className="input-field pl-12 h-14 font-mono font-bold tracking-widest text-sm uppercase"
                  maxLength={20}
                />
              </div>

              {error && (
                <div className="animate-slideUp mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] text-red-500 font-bold flex items-center gap-2 uppercase tracking-wider">
                  <span className="text-sm">⚠</span> {error}
                </div>
              )}
            </div>

            <button
              id="verify-continue-btn"
              type="submit"
              disabled={loading || code.length < 4}
              className="btn-primary h-14 text-sm font-black uppercase tracking-widest"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Verify & Continue
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back */}
        <button
          onClick={onBack}
          className="animate-slideUp delay-200 w-full mt-6 flex items-center justify-center gap-2 text-[10px] font-black tracking-widest uppercase opacity-40 hover:opacity-100 hover:text-brand-emerald transition-all"
        >
          <ArrowLeft size={14} />
          Back to menu
        </button>

        {/* Security badge */}
        <div className="animate-slideUp delay-300 flex items-center justify-center gap-2 mt-10 text-[9px] font-black tracking-widest uppercase opacity-30">
          <Sparkles size={12} className="text-brand-emerald" />
          Secured by Tech5 Ethiopia
        </div>
      </div>
    </div>
  );
};

export default BranchLogin;
