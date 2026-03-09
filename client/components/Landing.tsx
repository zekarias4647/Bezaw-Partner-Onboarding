import React from 'react';
import { Store, UserPlus, ArrowRight, Zap } from 'lucide-react';

interface Props {
  onSelectRegister: () => void;
  onSelectLogin: () => void;
}

const Landing: React.FC<Props> = ({ onSelectRegister, onSelectLogin }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-4">
      <div className="text-center space-y-2 max-w-xl">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-[9px] font-bold tracking-widest uppercase">
          <Zap size={10} fill="currentColor" /> Welcome to the Future
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-[1.1]">
          Grow your vendor <span className="text-emerald-600">exponentially.</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto">
          Choose an option below to get started with the Bezaw Partner network.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {/* Register Supermarket */}
        <button
          onClick={onSelectRegister}
          className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-left hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300"
        >
          <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <UserPlus size={18} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">Register Vendor</h3>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed mb-2.5">
            Start your journey as a primary partner. Set up your global profile, financial details, and master account.
          </p>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-widest">
            Begin Onboarding <ArrowRight size={12} />
          </div>
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          </div>
        </button>

        {/* Add Branches */}
        <button
          onClick={onSelectLogin}
          className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-left hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
        >
          <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Store size={18} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">Add Branches</h3>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed mb-2.5">
            Already registered? Login with your unique Store ID to add new physical locations or manage existing ones.
          </p>
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-widest">
            Access Branch Portal <ArrowRight size={12} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Landing;