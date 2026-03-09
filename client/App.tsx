
import React, { useState, useEffect, useRef } from 'react';
import {
  Building2, CheckCircle2, ChevronRight, Users,
  Sun, Moon, ArrowLeft, Settings, Sparkles, Zap
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
import PageDecorations from './components/PageDecorations';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [currentStep, setCurrentStep] = useState<Step>(Step.BUSINESS_INFO);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
  });
  const [vendor, setVendor] = useState<VendorData>({
    name: '', logo: '', vatCert: '', businessLicense: '',
    tin: '', email: '', phone: '', website: '', regCode: '', businessType: ''
  });
  const [branches, setBranches] = useState<BranchData[]>([]);
  const [managers, setManagers] = useState<ManagerData[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<BranchData | null>(null);
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleBranchAdded = async () => {
    setShowAddBranchModal(false);
    if (vendor.regCode) {
      try {
        const token = localStorage.getItem('authToken');
        const res = await fetch(`https://onboardingapi.bezawcurbside.com/api/onboard/${vendor.regCode}/branches`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setBranches(await res.json());
      } catch (err) { console.error("Failed to refresh branches", err); }
    }
  };

  useEffect(() => { setView('LANDING'); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNext = () => { if (currentStep < Step.SUMMARY) setCurrentStep(currentStep + 1); };
  const handleBack = () => { if (currentStep > Step.BUSINESS_INFO) setCurrentStep(currentStep - 1); };
  const resetToLanding = () => { resetForm(); setView('LANDING'); };
  const resetForm = () => {
    setVendor({ name: '', logo: '', vatCert: '', businessLicense: '', tin: '', email: '', phone: '', website: '', regCode: '', businessType: 'supermarket' });
    setBranches([]); setManagers([]); setCurrentStep(Step.BUSINESS_INFO);
  };

  const steps = [
    { label: 'Business', icon: Building2 },
    { label: 'Branches', icon: StoreIcon },
    { label: 'Managers', icon: Users },
    { label: 'Finalize', icon: CheckCircle2 },
  ];

  const renderWizard = () => (
    <div className="animate-slideUp glass rounded-2xl overflow-hidden shadow-glow-lg" style={{ animationFillMode: 'both', border: '1px solid rgba(16,185,129,0.15)' }}>
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <button onClick={resetToLanding} className="btn-ghost text-xs" style={{ padding: '6px 12px' }}>
          <ArrowLeft size={14} /> Exit
        </button>
        <div className="flex items-center gap-2">
          {steps.map((s, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black transition-all duration-300 ${currentStep > idx ? 'step-done' :
                  currentStep === idx ? 'step-active' : 'step-future'
                  }`}>
                  {currentStep > idx ? <CheckCircle2 size={12} /> : idx + 1}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-wider hidden md:block transition-colors ${currentStep >= idx ? 'text-inherit opacity-80' : 'text-inherit opacity-20'
                  }`}>{s.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-6 h-px transition-colors ${currentStep > idx ? 'bg-brand-emerald/50' : 'bg-white/10'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="p-6">
        {currentStep === Step.BUSINESS_INFO && <BusinessInfo data={vendor} onChange={setVendor} onNext={handleNext} />}
        {currentStep === Step.BRANCHES && <BranchSetup branches={branches} onChange={setBranches} onNext={handleNext} onBack={handleBack} />}
        {currentStep === Step.MANAGERS && <ManagerSetup managers={managers} branches={branches} onChange={setManagers} onNext={handleNext} onBack={handleBack} />}
        {currentStep === Step.SUMMARY && <Summary vendor={vendor} branches={branches} managers={managers} onBack={handleBack} onComplete={() => { resetForm(); setView('LANDING'); }} />}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300" style={{ position: 'relative', zIndex: 1 }}>

      <header
        ref={headerRef}
        className="sticky top-0 z-40 transition-all duration-300"
        style={{
          background: scrolled ? (theme === 'dark' ? 'rgba(2,13,9,0.85)' : 'rgba(255,255,255,0.85)') : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(16,185,129,0.1)' : '1px solid transparent',
        }}
      >
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
          <button onClick={resetToLanding} className="flex items-center gap-3 group" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <div className="relative">
              <img
                src="/logo.png"
                alt="Bezaw Logo"
                style={{ width: 40, height: 40, borderRadius: 8, boxShadow: '0 0 20px rgba(16,185,129,0.2)' }}
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1 }}>
              <div className="shimmer-text" style={{
                fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: 15,
                letterSpacing: -0.5,
              }}>
                BezawPartner
              </div>
              <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: '0.2em', color: 'rgba(16,185,129,0.6)', textTransform: 'uppercase', marginTop: 2 }}>
                Drive-Through Network
              </div>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald hover:bg-brand-emerald/20 transition-all"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {(view === 'SELECT_BRANCH' || view === 'BRANCH_DASHBOARD') && (
              <button
                onClick={() => setShowSettings(true)}
                title="Business Settings"
                className="p-2 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald hover:bg-brand-emerald/20 transition-all"
              >
                <Settings size={18} />
              </button>
            )}

            <div className="hidden sm:flex items-center gap-6 px-3 py-1.5 bg-brand-emerald/10 border border-brand-emerald/20 rounded-full text-[9px] font-black tracking-widest uppercase text-brand-emerald">
              <div className="w-2 h-2 rounded-full bg-brand-emerald shadow-[0_0_8px_#10B981] animate-pulse" />
              Live Network
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-5 py-6 flex flex-col relative" style={{ zIndex: 1 }}>
        {/* Dynamic Decorations based on View */}
        {view === 'REGISTER' && <PageDecorations variant="onboarding" />}
        {view === 'SELECT_BRANCH' && <PageDecorations variant="onboarding" />}
        {view === 'BRANCH_DASHBOARD' && <PageDecorations variant="landing" />}

        {view === 'LANDING' && <Landing onSelectRegister={() => setView('REGISTER')} onSelectLogin={() => setView('BRANCH_LOGIN')} />}

        {view === 'BRANCH_LOGIN' && (
          <BranchLogin
            onSuccess={async (data: any, token: string) => {
              localStorage.setItem('authToken', token);
              const mappedVendor: VendorData = {
                regCode: data.id, name: data.name, logo: data.logo,
                vatCert: data.vat_cert, businessLicense: data.business_license,
                tin: data.tin, email: data.email, phone: data.phone,
                website: data.website, businessType: (data.business_type || 'supermarket').toLowerCase()
              };
              setVendor(mappedVendor);
              try {
                const res = await fetch(`https://onboardingapi.bezawcurbside.com/api/onboard/${data.id}/branches`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to fetch branches');
                setBranches(await res.json());
                setView('SELECT_BRANCH');
              } catch (err: any) {
                alert(`Login OK but fetch failed: ${err.message}`);
              }
            }}
            onBack={resetToLanding}
          />
        )}

        {view === 'SELECT_BRANCH' && (
          <>
            <SelectBranch
              vendor={vendor} branches={branches}
              onSelect={(b) => { setSelectedBranch(b); setView('BRANCH_DASHBOARD'); }}
              onAddNew={() => setShowAddBranchModal(true)}
              onBack={() => setView('BRANCH_LOGIN')}
            />
            {showAddBranchModal && (
              <SingleBranchForm vendorId={vendor.regCode} onSuccess={handleBranchAdded} onCancel={() => setShowAddBranchModal(false)} />
            )}
          </>
        )}

        {view === 'BRANCH_DASHBOARD' && selectedBranch && (
          <BranchDashboard branch={selectedBranch} vendorName={vendor.name} onBack={() => setView('SELECT_BRANCH')} />
        )}

        {view === 'REGISTER' && renderWizard()}
      </main>

      {showSettings && (
        <VendorSettings vendor={vendor} onUpdate={setVendor} onClose={() => setShowSettings(false)} />
      )}

      <footer className="relative z-10 border-t border-brand-emerald/10 px-5 py-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="h-px w-6 bg-brand-emerald/30" />
          <span className="text-[9px] font-black tracking-[0.25em] uppercase opacity-50">
            Bezaw Ecosystem
          </span>
          <div className="h-px w-6 bg-brand-emerald/30" />
        </div>
        <div className="flex items-center gap-2 text-[9px] font-bold opacity-30">
          <Sparkles size={10} className="text-brand-emerald" />
          Powered by Tech5 Ethiopia &nbsp;·&nbsp; © {new Date().getFullYear()}
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
    <path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
  </svg>
);

export default App;
