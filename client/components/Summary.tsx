
import React, { useState } from 'react';
import { VendorData, BranchData, ManagerData } from '../types';
import { Rocket, Send, ArrowLeft, Building2, Store, Users, CheckCircle, FileCheck, Fingerprint } from 'lucide-react';

interface Props {
  vendor: VendorData;
  branches: BranchData[];
  managers: ManagerData[];
  onBack: () => void;
  onComplete: () => void;
}

const Summary: React.FC<Props> = ({ vendor, branches, managers, onBack, onComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Local state to hold success details so we can display them even if parent state resets
  const [successDetails, setSuccessDetails] = useState({ name: '', regCode: '' });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append files if they exist
      if (vendor.logoFile) {
        formData.append('logo', vendor.logoFile);
      }
      if (vendor.vatCertFile) {
        formData.append('vatCert', vendor.vatCertFile);
      }
      if (vendor.businessLicenseFile) {
        formData.append('businessLicense', vendor.businessLicenseFile);
      }
      if (vendor.imageFile) {
        formData.append('image', vendor.imageFile);
      }

      // Create a clean version of vendor data for the JSON payload
      const { logoFile, vatCertFile, businessLicenseFile, ...cleanVendor } = vendor;

      formData.append('vendor', JSON.stringify(cleanVendor));
      formData.append('branches', JSON.stringify(branches));
      formData.append('managers', JSON.stringify(managers));

      const response = await fetch('https://onboardingapi.bezawcurbside.com/api/onboard/register', {
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
        name: vendor.name,
        regCode: vendor.regCode
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
      <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-fadeIn">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center animate-bounce shadow-2xl shadow-emerald-500/20">
          <CheckCircle size={40} />
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Registration Finalized.</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
            Welcome to Bezaw, <span className="text-emerald-600 font-bold">{successDetails.name}</span>.
            Your Store ID <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono text-black dark:text-emerald-400">{successDetails.regCode}</span> is now active.
          </p>
        </div>
        <button
          onClick={onComplete}
          className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-transform text-xs uppercase tracking-widest"
        >
          LAUNCH PARTNER DASHBOARD
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 animate-fadeIn">
      <div className="text-center space-y-0.5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Final Review</h2>
        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-medium">One last check before your network goes live.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-widest text-[8px]">
              <Building2 size={14} className="text-emerald-500" /> Vendor Profile
            </h3>
            {vendor.logo && (
              <img
                src={vendor.logo.startsWith('http') || vendor.logo.startsWith('data:')
                  ? vendor.logo
                  : `https://onboardingapi.bezawcurbside.com${vendor.logo.startsWith('/') ? '' : '/'}${vendor.logo}`
                }
                className="w-10 h-10 object-cover rounded-xl shadow-lg border border-slate-100 dark:border-slate-800"
              />
            )}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg flex items-center justify-between border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2.5">
              <Fingerprint className="text-emerald-600" size={16} />
              <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Master ID Code</p>
                <p className="font-mono text-xs text-black dark:text-emerald-400 font-bold">{vendor.regCode}</p>
              </div>
            </div>
            <FileCheck size={16} className="text-emerald-500" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Brand Name</p>
              <p className="text-black dark:text-white font-bold text-[11px]">{vendor.name}</p>
            </div>
            <div>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Tax Ident. (TIN)</p>
              <p className="text-black dark:text-white font-bold text-[11px]">{vendor.tin}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 flex items-center justify-center gap-1.5 text-[8px] font-bold uppercase p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-900/40">
              VAT CERTIFIED
            </div>
            <div className="flex-1 flex items-center justify-center gap-1.5 text-[8px] font-bold uppercase p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-900/40">
              LICENSE VERIFIED
            </div>
          </div>
        </div>



        {/* Network & Team Combined */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-widest text-[8px]">
              <Store size={14} className="text-amber-500" /> Operational Network
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-black dark:text-white">{branches.length}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branches Mapped</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {branches.map(b => (
                <span key={b.id} className="text-[8px] font-bold px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-md border border-amber-100 dark:border-amber-900/40 uppercase">
                  {b.name}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-widest text-[8px]">
              <Users size={14} className="text-indigo-500" /> Human Capital
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-black dark:text-white">{managers.length}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Managers Hired</span>
            </div>
            <div className="space-y-0.5">
              {managers.slice(0, 3).map(m => (
                <p key={m.id} className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">• {m.name}</p>
              ))}
              {managers.length > 3 && <p className="text-[8px] text-emerald-600 dark:text-emerald-400 font-bold">+ {managers.length - 3} MORE ASSIGNED</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-emerald-950 text-emerald-400 rounded-lg p-2.5 flex items-center gap-2.5 shadow-2xl">
        <div className="w-8 h-8 bg-emerald-900 rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse">
          <Rocket size={14} />
        </div>
        <div>
          <h4 className="font-bold text-xs uppercase tracking-widest">Launch Protocol Ready</h4>
          <p className="text-[10px] text-emerald-500/80 font-medium leading-relaxed">
            By confirming registration, you authorize Bezaw to act as the primary drive-through facilitator for your network.
          </p>
        </div>
      </div>

      <div className="pt-3 border-t dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-all disabled:opacity-50 text-[10px] uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-2xl shadow-emerald-500/30 flex items-center gap-2 transition-all hover:scale-[1.02] text-[10px] uppercase tracking-widest"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              SENDING...
            </div>
          ) : (
            <><Send size={14} /> PUSH TO PRODUCTION</>
          )}
        </button>
      </div>
    </div>
  );
};

export default Summary;
