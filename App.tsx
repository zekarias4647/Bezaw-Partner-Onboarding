
import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  Users,
  LayoutDashboard,
  Sun,
  Moon,
  ArrowLeft
} from 'lucide-react';
import { SupermarketData, BranchData, ManagerData, Step, ViewState } from './types';
import BusinessInfo from './components/BusinessInfo';
import BranchSetup from './components/BranchSetup';
import ManagerSetup from './components/ManagerSetup';
import Summary from './components/Summary';
import Landing from './components/Landing';
import BranchLogin from './components/BranchLogin';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [currentStep, setCurrentStep] = useState<Step>(Step.BUSINESS_INFO);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const [supermarket, setSupermarket] = useState<SupermarketData>({
    name: '',
    logo: '',
    vatCert: '',
    businessLicense: '',
    tin: '',
    email: '',
    phone: '',
    website: '',
    bankAccounts: [{ bankName: '', accountName: '', accountNumber: '' }],
    regCode: ''
  });
  const [branches, setBranches] = useState<BranchData[]>([]);
  const [managers, setManagers] = useState<ManagerData[]>([]);

  // Initialize theme from system preference or local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleNext = () => {
    if (currentStep < Step.SUMMARY) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > Step.BUSINESS_INFO) setCurrentStep(currentStep - 1);
  };

  const resetToLanding = () => {
    setView('LANDING');
    setCurrentStep(Step.BUSINESS_INFO);
  };

  const steps = [
    { label: 'Business Profile', icon: Building2 },
    { label: 'Branches', icon: StoreIcon },
    { label: 'Managers', icon: Users },
    { label: 'Finalize', icon: CheckCircle2 }
  ];

  const renderWizard = () => (
    <div className="glass dark:bg-slate-900/50 dark:border-slate-800 rounded-3xl shadow-xl p-8 transition-all duration-500">
      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={resetToLanding}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Exit to Menu
        </button>
        <div className="hidden md:flex items-center gap-4">
          {steps.map((s, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                currentStep >= idx ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-600'
              }`}>
                {currentStep > idx ? <CheckCircle2 size={14} /> : idx + 1}
              </div>
              <span className={`text-xs font-bold uppercase tracking-tighter ${currentStep >= idx ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-600'}`}>
                {s.label}
              </span>
              {idx < steps.length - 1 && <div className="w-4 h-px bg-slate-200 dark:bg-slate-800" />}
            </div>
          ))}
        </div>
      </div>

      <div className="min-h-[400px]">
        {currentStep === Step.BUSINESS_INFO && (
          <BusinessInfo data={supermarket} onChange={setSupermarket} onNext={handleNext} />
        )}
        {currentStep === Step.BRANCHES && (
          <BranchSetup 
            branches={branches} 
            onChange={setBranches} 
            onNext={handleNext} 
            onBack={handleBack} 
          />
        )}
        {currentStep === Step.MANAGERS && (
          <ManagerSetup 
            managers={managers} 
            branches={branches}
            onChange={setManagers} 
            onNext={handleNext} 
            onBack={handleBack} 
          />
        )}
        {currentStep === Step.SUMMARY && (
          <Summary 
            supermarket={supermarket}
            branches={branches}
            managers={managers}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 flex flex-col selection:bg-emerald-500/30">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={resetToLanding}>
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white leading-tight">Bezaw Partner</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-500 font-black tracking-widest uppercase">Drive-Through Network</p>
          </div>
        </div>
        
        <button 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-transparent dark:border-slate-700"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 flex flex-col">
        {view === 'LANDING' && <Landing onSelectRegister={() => setView('REGISTER')} onSelectLogin={() => setView('BRANCH_LOGIN')} />}
        
        {view === 'BRANCH_LOGIN' && (
          <BranchLogin 
            onSuccess={() => {
              setView('REGISTER');
              setCurrentStep(Step.BRANCHES);
            }} 
            onBack={resetToLanding}
          />
        )}

        {view === 'REGISTER' && renderWizard()}
      </main>

      <footer className="py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2 text-emerald-600 dark:text-emerald-500 font-black tracking-widest text-[10px] uppercase">
          <div className="h-px w-8 bg-slate-200 dark:bg-slate-800" />
          Bezaw Ecosystem
          <div className="h-px w-8 bg-slate-200 dark:bg-slate-800" />
        </div>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-700 uppercase tracking-[0.3em]">
          &copy; 2025 BEZAW TECH &middot; ADDIS ABABA, ETHIOPIA
        </p>
      </footer>
    </div>
  );
};

const StoreIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
    <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
  </svg>
);

export default App;
