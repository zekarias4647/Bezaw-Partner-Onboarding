
import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Users,
  LayoutDashboard,
  Sun,
  Moon,
  ArrowLeft,
  Settings
} from 'lucide-react';
import { VendorData, BranchData, ManagerData, Step, ViewState } from './types';
import BusinessInfo from './components/BusinessInfo';
import BranchSetup from './components/BranchSetup';
import ManagerSetup from './components/ManagerSetup';
import Summary from './components/Summary';
import Landing from './components/Landing';
import BranchLogin from './components/BranchLogin';
import SelectBranch from './components/SelectBranch';
import BranchDashboard from './components/BranchDashboard';
import SingleBranchForm from './components/SingleBranchForm';
import VendorSettings from './components/VendorSettings';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [currentStep, setCurrentStep] = useState<Step>(Step.BUSINESS_INFO);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  const [vendor, setVendor] = useState<VendorData>({
    name: '',
    logo: '',
    vatCert: '',
    businessLicense: '',
    tin: '',
    email: '',
    phone: '',
    website: '',

    regCode: '',
    businessType: ''
  });

  // Start with no branches
  const [branches, setBranches] = useState<BranchData[]>([]);

  const [managers, setManagers] = useState<ManagerData[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<BranchData | null>(null);
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleBranchAdded = async () => {
    setShowAddBranchModal(false);
    // Refresh branches list
    if (vendor.regCode) {
      try {
        const token = localStorage.getItem('authToken');
        const res = await fetch(`https://onboardingapi.bezawcurbside.com/api/onboard/${vendor.regCode}/branches`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBranches(data);
        }
      } catch (err) {
        console.error("Failed to refresh branches", err);
      }
    }
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Force application to start on Landing page
  useEffect(() => {
    setView('LANDING');
  }, []);

  const handleNext = () => {
    if (currentStep < Step.SUMMARY) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > Step.BUSINESS_INFO) setCurrentStep(currentStep - 1);
  };

  const resetToLanding = () => {
    resetForm();
    setView('LANDING');
  };

  const resetForm = () => {
    setVendor({
      name: '',
      logo: '',
      vatCert: '',
      businessLicense: '',
      tin: '',
      email: '',
      phone: '',
      website: '',

      regCode: '',
      businessType: 'supermarket'
    });
    setBranches([]);
    setManagers([]);
    setCurrentStep(Step.BUSINESS_INFO);
  };

  const steps = [
    { label: 'Business Profile', icon: Building2 },
    { label: 'Branches', icon: StoreIcon },
    { label: 'Managers', icon: Users },
    { label: 'Finalize', icon: CheckCircle2 }
  ];

  const renderWizard = () => (
    <div className="glass dark:bg-slate-900/50 dark:border-slate-800 rounded-xl shadow-xl p-4 transition-all duration-500">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={resetToLanding}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Exit to Menu
        </button>
        <div className="hidden md:flex items-center gap-4">
          {steps.map((s, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${currentStep >= idx ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-600'
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

      <div className="min-h-[300px]">
        {currentStep === Step.BUSINESS_INFO && (
          <BusinessInfo data={vendor} onChange={setVendor} onNext={handleNext} />
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
            vendor={vendor}
            branches={branches}
            managers={managers}
            onBack={handleBack}
            onComplete={() => {
              resetForm();
              setView('LANDING'); // Optional: redirect to landing after completion workflow
            }}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 flex flex-col selection:bg-emerald-500/30">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 sticky top-0 z-30 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={resetToLanding}>
          <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <LayoutDashboard size={16} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              {vendor.name && (view === 'SELECT_BRANCH' || view === 'BRANCH_DASHBOARD') ? vendor.name : 'Bezaw Partner'}
            </h1>
            <p className="text-[9px] text-slate-500 dark:text-slate-500 font-bold tracking-widest uppercase">
              {vendor.name && (view === 'SELECT_BRANCH' || view === 'BRANCH_DASHBOARD') ? 'Authorized Partner Portal' : 'Drive-Through Network'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {(view === 'SELECT_BRANCH' || view === 'BRANCH_DASHBOARD') && (
            <button
              onClick={() => setShowSettings(true)}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-transparent dark:border-slate-700"
              title="Business Settings"
            >
              <Settings size={14} />
            </button>
          )}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-transparent dark:border-slate-700"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-2 flex flex-col">
        {view === 'LANDING' && <Landing onSelectRegister={() => setView('REGISTER')} onSelectLogin={() => setView('BRANCH_LOGIN')} />}

        {view === 'BRANCH_LOGIN' && (
          <BranchLogin
            onSuccess={async (data: any, token: string) => {
              // Store token securely (using localStorage for this demo session)
              localStorage.setItem('authToken', token);

              // Map DB snake_case to frontend camelCase
              const mappedVendor: VendorData = {
                regCode: data.id,
                name: data.name,
                logo: data.logo,
                vatCert: data.vat_cert,
                businessLicense: data.business_license,
                tin: data.tin,
                email: data.email,
                phone: data.phone,
                website: data.website,
                businessType: (data.business_type || 'supermarket').toLowerCase()

              };
              setVendor(mappedVendor);

              try {
                const res = await fetch(`https://onboardingapi.bezawcurbside.com/api/onboard/${data.id}/branches`, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });

                if (!res.ok) {
                  if (res.status === 401 || res.status === 403) throw new Error('Unauthorized access');
                  throw new Error('Failed to fetch branches');
                }

                const branchesData = await res.json();
                setBranches(branchesData);
                setView('SELECT_BRANCH');
              } catch (err: any) {
                console.error("Failed to load branches", err);
                alert(`Login successful but request failed: ${err.message}`);
              }
            }}
            onBack={resetToLanding}
          />
        )}

        {view === 'SELECT_BRANCH' && (
          <>
            <SelectBranch
              vendor={vendor}
              branches={branches}
              onSelect={(branch) => {
                setSelectedBranch(branch);
                setView('BRANCH_DASHBOARD');
              }}
              onAddNew={() => setShowAddBranchModal(true)}
              onBack={() => setView('BRANCH_LOGIN')}
            />
            {showAddBranchModal && (
              <SingleBranchForm
                vendorId={vendor.regCode}
                onSuccess={handleBranchAdded}
                onCancel={() => setShowAddBranchModal(false)}
              />
            )}
          </>
        )}

        {view === 'BRANCH_DASHBOARD' && selectedBranch && (
          <BranchDashboard
            branch={selectedBranch}
            vendorName={vendor.name}
            onBack={() => setView('SELECT_BRANCH')}
          />
        )}

        {view === 'REGISTER' && renderWizard()}
      </main>

      {showSettings && (
        <VendorSettings
          vendor={vendor}
          onUpdate={(updated) => {
            setVendor(updated);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      <footer className="py-2.5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2 text-emerald-600 dark:text-emerald-500 font-bold tracking-widest text-[9px] uppercase">
          <div className="h-px w-6 bg-slate-200 dark:bg-slate-800" />
          Bezaw Ecosystem
          <div className="h-px w-6 bg-slate-200 dark:bg-slate-800" />
        </div>

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
