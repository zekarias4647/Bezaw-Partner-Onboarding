import React, { useState } from 'react';
import { VendorData, BranchData, ManagerData } from '../types';
import { Rocket, Send, ArrowLeft, Building2, Store, Users, CheckCircle, Fingerprint, Sparkles } from 'lucide-react';
import { API_ROUTES } from '../api';

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
  const [successDetails, setSuccessDetails] = useState({ name: '', regCode: '' });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (vendor.logoFile) formData.append('logo', vendor.logoFile);
      if (vendor.vatCertFile) formData.append('vatCert', vendor.vatCertFile);
      if (vendor.businessLicenseFile) formData.append('businessLicense', vendor.businessLicenseFile);
      if (vendor.imageFile) formData.append('image', vendor.imageFile);

      const { logoFile, vatCertFile, businessLicenseFile, ...cleanVendor } = vendor;
      formData.append('vendor', JSON.stringify(cleanVendor));
      formData.append('branches', JSON.stringify(branches));
      formData.append('managers', JSON.stringify(managers));

      const response = await fetch(API_ROUTES.REGISTER, {
        method: 'POST', body: formData,
      });
      
      if (!response.ok) {
        let errorMessage = `Submission failed: ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // Fallback to status text if JSON parsing fails
        }
        throw new Error(errorMessage);
      }

      setSuccessDetails({ name: vendor.name, regCode: vendor.regCode });
      setTimeout(() => { setIsSubmitting(false); setSubmitted(true); }, 1500);
    } catch (error: any) {
      console.error("Submission failed:", error);
      setIsSubmitting(false);
      alert(error.message || 'Failed to submit registration. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="animate-fadeIn flex flex-col items-center justify-center gap-10 py-16 px-6 text-center">
        <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-brand-emerald to-brand-dark flex items-center justify-center shadow-glow animate-float">
          <CheckCircle size={48} className="text-white" />
        </div>

        <div className="max-w-md">
          <h2 className="font-display font-black text-4xl tracking-tighter mb-4 text-inherit">
            Network Activated.
          </h2>
          <p className="text-sm opacity-50 font-medium leading-relaxed mb-8">
            Welcome to Bezaw, <span className="text-brand-emerald font-black">{successDetails.name}</span>.
            Your Store ID <span className="font-mono bg-brand-emerald/10 border border-brand-emerald/20 px-3 py-1 rounded-lg text-brand-emerald font-black">{successDetails.regCode}</span> is now active and ready for operations.
          </p>
          <div className="flex flex-col gap-4">
            <button
              onClick={onComplete}
              className="btn-primary h-16 px-10 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-glow hover:scale-105 transition-all"
            >
              <Rocket size={18} /> Launch Partner Dashboard
            </button>
            <div className="flex items-center justify-center gap-2 text-[9px] font-black tracking-widest uppercase opacity-30">
              <Sparkles size={12} className="text-brand-emerald" />
              Secured by Tech5 Ethiopia
            </div>
          </div>
        </div>
      </div>
    );
  }

  const infoRows = [
    { label: 'Brand Name', value: vendor.name },
    { label: 'Tax ID (TIN)', value: vendor.tin },
    { label: 'Email', value: vendor.email },
    { label: 'Phone', value: vendor.phone },
    { label: 'Store ID', value: <span className="font-mono text-brand-emerald font-black">{vendor.regCode}</span> },
    { label: 'Type', value: (vendor.businessType || '').toUpperCase() },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-display font-black text-2xl tracking-tighter mb-1 text-inherit">
          Final Review
        </h2>
        <p className="text-xs opacity-50 font-medium">One last check before your network goes live.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vendor Profile Card */}
        <div className="glass rounded-[2rem] overflow-hidden border border-border">
          <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-brand-emerald/5">
            <div className="flex items-center gap-3">
              <Building2 size={16} className="text-brand-emerald" />
              <span className="text-[10px] font-black tracking-widest uppercase opacity-60">Vendor Profile</span>
            </div>
            {vendor.logo && (
              <img
                src={vendor.logo.startsWith('http') || vendor.logo.startsWith('data:') ? vendor.logo : API_ROUTES.IMAGE_PATH(vendor.logo)}
                className="w-10 h-10 object-contain rounded-xl border border-brand-emerald/20 bg-card p-1"
                alt="Logo"
              />
            )}
          </div>
          <div className="p-6 flex flex-col gap-4">
            {infoRows.map((row, i) => (
              <div key={i} className="flex justify-between items-center py-1 border-b border-white/5 last:border-none">
                <span className="text-[9px] font-black tracking-widest uppercase opacity-30">{row.label}</span>
                <span className="text-xs font-bold text-inherit">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Network Stats Card */}
        <div className="grid grid-cols-1 gap-6">
          <div className="glass rounded-[2rem] p-6 border border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-500">
              <Store size={80} />
            </div>
            <div className="flex items-center gap-3 mb-6">
              <Store size={16} className="text-amber-500" />
              <span className="text-[10px] font-black tracking-widest uppercase opacity-60">Operational Network</span>
            </div>
            <div className="font-display font-black text-5xl mb-2 text-inherit leading-none">
              {branches.length}
            </div>
            <div className="text-[9px] font-black tracking-widest uppercase opacity-30 mb-6">Branches Mapped</div>
            <div className="flex flex-wrap gap-2">
              {branches.map(b => (
                <span key={b.id} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 text-[9px] font-black uppercase tracking-wider">
                  {b.name}
                </span>
              ))}
            </div>
          </div>

          <div className="glass rounded-[2rem] p-6 border border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-500">
              <Users size={80} />
            </div>
            <div className="flex items-center gap-3 mb-6">
              <Users size={16} className="text-blue-500" />
              <span className="text-[10px] font-black tracking-widest uppercase opacity-60">Personnel Management</span>
            </div>
            <div className="font-display font-black text-5xl mb-2 text-inherit leading-none">
              {managers.length}
            </div>
            <div className="text-[9px] font-black tracking-widest uppercase opacity-30 mb-6">Staff Accounts Assigned</div>
            <div className="flex flex-col gap-2">
              {managers.slice(0, 3).map(m => (
                <div key={m.id} className="text-[10px] font-bold opacity-50 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-blue-500" /> {m.name}
                </div>
              ))}
              {managers.length > 3 && (
                <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1">
                  + {managers.length - 3} more accounts
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Ready Banner */}
      <div className="relative p-6 rounded-[2rem] bg-gradient-to-br from-brand-emerald/10 to-transparent border border-brand-emerald/20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-emerald/50 to-transparent" />
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/30 flex items-center justify-center text-brand-emerald shadow-glow animate-pulse flex-shrink-0">
            <Rocket size={24} />
          </div>
          <div>
            <div className="font-display font-black text-sm tracking-widest uppercase text-brand-emerald mb-1">
              Launch Protocol Ready
            </div>
            <p className="text-[10px] font-medium opacity-50 leading-relaxed">
              By confirming, you authorize Bezaw to act as the primary drive-through facilitator for your supermarket network in Ethiopia.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="btn-ghost px-8 h-14 text-[10px] uppercase font-black tracking-widest w-full sm:w-auto"
        >
          <ArrowLeft size={16} /> Back to Setup
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn-primary px-10 h-14 text-[10px] uppercase font-black tracking-widest w-full sm:w-auto shadow-glow group hover:scale-105 transition-all"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              Finalize & Push to Production
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Summary;
