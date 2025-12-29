
import React from 'react';
import { Store, UserPlus, ArrowRight, Zap } from 'lucide-react';

interface Props {
  onSelectRegister: () => void;
  onSelectLogin: () => void;
}

const Landing: React.FC<Props> = ({ onSelectRegister, onSelectLogin }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-12 animate-fadeIn">
      <div className="text-center space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] font-black tracking-widest uppercase">
          <Zap size={12} fill="currentColor" /> Welcome to the Future
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1]">
          Grow your supermarket <span className="text-emerald-600">exponentially.</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
          Choose an option below to get started with the Bezaw Partner network.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Register Supermarket */}
        <button 
          onClick={onSelectRegister}
          className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] text-left hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300"
        >
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <UserPlus size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Register Supermarket</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            Start your journey as a primary partner. Set up your global profile, financial details, and master account.
          </p>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            Begin Onboarding <ArrowRight size={16} />
          </div>
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          </div>
        </button>

        {/* Add Branches */}
        <button 
          onClick={onSelectLogin}
          className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] text-left hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
        >
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Store size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Add Branches</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            Already registered? Login with your unique Store ID to add new physical locations or manage existing ones.
          </p>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
            Access Branch Portal <ArrowRight size={16} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Landing;
