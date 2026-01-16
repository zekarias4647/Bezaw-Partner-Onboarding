
import React, { useState } from 'react';
import { SupermarketData, BranchData, ManagerData } from '../types';
import { Rocket, Send, ArrowLeft, Building2, Store, Users, CheckCircle, FileCheck, Fingerprint } from 'lucide-react';

interface Props {
  supermarket: SupermarketData;
  branches: BranchData[];
  managers: ManagerData[];
  onBack: () => void;
  onComplete: () => void;
}

const Summary: React.FC<Props> = ({ supermarket, branches, managers, onBack, onComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Local state to hold success details so we can display them even if parent state resets
  const [successDetails, setSuccessDetails] = useState({ name: '', regCode: '' });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append files if they exist
      if (supermarket.logoFile) {
        formData.append('logo', supermarket.logoFile);
      }
      if (supermarket.vatCertFile) {
        formData.append('vatCert', supermarket.vatCertFile);
      }
      if (supermarket.businessLicenseFile) {
        formData.append('businessLicense', supermarket.businessLicenseFile);
      }
      if (supermarket.imageFile) {
        formData.append('image', supermarket.imageFile);
      }

      // Create a clean version of supermarket data for the JSON payload
      const { logoFile, vatCertFile, businessLicenseFile, ...cleanSupermarket } = supermarket;

      formData.append('supermarket', JSON.stringify(cleanSupermarket));
      formData.append('branches', JSON.stringify(branches));
      formData.append('managers', JSON.stringify(managers));

      const response = await fetch('http://localhost:5002/api/onboard/register', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Registration success:', data);

      // Capture details for the success view
      setSuccessDetails({
        name: supermarket.name,
        regCode: supermarket.regCode
      });

      // Delay slightly effectively showing the success state
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
      }, 1500);

    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      alert('Failed to submit registration. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-8 animate-fadeIn">
        <div className="w-32 h-32 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center animate-bounce shadow-2xl shadow-emerald-500/20">
          <CheckCircle size={80} />
        </div>
        <div className="space-y-4">
          <h2 className="text-5xl font-black text-slate-900 dark:text-white">Registration Finalized.</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium">
            Welcome to Bezaw, <span className="text-emerald-600 font-black">{successDetails.name}</span>.
            Your Store ID <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono text-black dark:text-emerald-400">{successDetails.regCode}</span> is now active.
          </p>
        </div>
        <button
          onClick={onComplete}
          className="px-12 py-5 bg-emerald-600 text-white font-black rounded-[2rem] shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-transform"
        >
          LAUNCH PARTNER DASHBOARD
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white">Final Review</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">One last check before your network goes live.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-widest text-xs">
              <Building2 size={18} className="text-emerald-500" /> Supermarket Profile
            </h3>
            {supermarket.logo && <img src={supermarket.logo} className="w-12 h-12 object-cover rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800" />}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <Fingerprint className="text-emerald-600" size={20} />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master ID Code</p>
                <p className="font-mono text-black dark:text-emerald-400 font-bold">{supermarket.regCode}</p>
              </div>
            </div>
            <FileCheck size={20} className="text-emerald-500" />
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Brand Name</p>
              <p className="text-black dark:text-white font-bold">{supermarket.name}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Tax Ident. (TIN)</p>
              <p className="text-black dark:text-white font-bold">{supermarket.tin}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/40">
              VAT CERTIFIED
            </div>
            <div className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/40">
              LICENSE VERIFIED
            </div>
          </div>
        </div>



        {/* Network & Team Combined */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-widest text-xs">
              <Store size={18} className="text-amber-500" /> Operational Network
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-black dark:text-white">{branches.length}</span>
              <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Branches Mapped</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {branches.map(b => (
                <span key={b.id} className="text-[9px] font-black px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg border border-amber-100 dark:border-amber-900/40 uppercase">
                  {b.name}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-widest text-xs">
              <Users size={18} className="text-indigo-500" /> Human Capital
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-black dark:text-white">{managers.length}</span>
              <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Managers Hired</span>
            </div>
            <div className="space-y-1">
              {managers.slice(0, 3).map(m => (
                <p key={m.id} className="text-xs text-slate-600 dark:text-slate-400 font-medium">• {m.name}</p>
              ))}
              {managers.length > 3 && <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black">+ {managers.length - 3} MORE ASSIGNED</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-emerald-950 text-emerald-400 rounded-[2rem] p-8 flex items-center gap-6 shadow-2xl">
        <div className="w-16 h-16 bg-emerald-900 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
          <Rocket size={32} />
        </div>
        <div>
          <h4 className="font-black text-lg uppercase tracking-widest">Launch Protocol Ready</h4>
          <p className="text-sm text-emerald-500/80 font-medium leading-relaxed">
            By confirming registration, you authorize Bezaw to act as the primary drive-through facilitator for your network. Automated billing and fulfillment sync will start immediately.
          </p>
        </div>
      </div>

      <div className="pt-8 border-t dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-4 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all disabled:opacity-50"
        >
          <ArrowLeft size={20} /> Back to Edit
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-14 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-[2rem] shadow-2xl shadow-emerald-500/30 flex items-center gap-4 transition-all hover:scale-[1.02]"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              SYNCHRONIZING...
            </div>
          ) : (
            <><Send size={24} /> PUSH TO PRODUCTION</>
          )}
        </button>
      </div>
    </div>
  );
};

export default Summary;
