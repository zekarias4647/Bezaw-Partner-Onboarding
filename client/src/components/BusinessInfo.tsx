import React, { useState, useEffect } from 'react';
import { VendorData } from '../types';
import { Building, Hash, Phone, ChevronRight, Upload, FileText, Fingerprint, RefreshCw, Globe, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { API_ROUTES } from '../api';

interface Props {
  data: VendorData;
  onChange: (data: VendorData) => void;
  onNext: () => void;
}

interface BusinessType { id: string; name: string; description: string; }

const BusinessInfo: React.FC<Props> = ({ data, onChange, onNext }) => {
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    fetch(API_ROUTES.BUSINESS_TYPES)
      .then(r => r.json()).then(setBusinessTypes).catch(console.error);
  }, []);

  useEffect(() => {
    if (businessTypes.length > 0) {
      const current = data.businessType?.toLowerCase();
      const exists = businessTypes.some(t => t.name.toLowerCase() === current);
      if (!current || !exists) onChange({ ...data, businessType: businessTypes[0].name.toLowerCase() });
    }
  }, [businessTypes, data.businessType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...data, [e.target.name]: e.target.value });

  const generateRegCode = () => {
    onChange({ ...data, regCode: `BZWV-${Math.floor(100000 + Math.random() * 900000)}` });
  };

  const handleFileUpload = (field: keyof VendorData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => onChange({ ...data, [field]: reader.result as string, [`${field}File`]: file });
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    const missing: string[] = [];
    if (!data.regCode) missing.push('Store ID');
    if (!data.name.trim()) missing.push('Name');
    if (!data.businessType) missing.push('Business Type');
    if (!data.email?.trim()) missing.push('Email');
    if (!data.tin.trim()) missing.push('TIN');
    if (!data.phone.trim()) missing.push('Phone');
    if (!data.logo) missing.push('Logo');
    if (!data.businessLicense) missing.push('License');
    if (missing.length > 0) { setShowErrors(true); return; }
    onNext();
  };

  const errStyle = (field: keyof VendorData) => {
    if (!showErrors) return {};
    const val = data[field];
    const missing = typeof val === 'string' ? !val.trim() : !val;
    return missing ? { borderColor: 'rgba(239,68,68,0.6)', boxShadow: '0 0 0 4px rgba(239,68,68,0.1)' } : {};
  };

  const uploads = [
    { id: 'logo', field: 'logo' as keyof VendorData, label: 'Logo', required: true },
    { id: 'license', field: 'businessLicense' as keyof VendorData, label: 'License', required: true },
    { id: 'vatCert', field: 'vatCert' as keyof VendorData, label: 'VAT Cert' },
    { id: 'image', field: 'image' as keyof VendorData, label: 'Storefront' },
  ];

  return (
    <div className="flex flex-col gap-6 max-h-[75vh] overflow-y-auto px-1 custom-scrollbar">
      {/* Header Compact */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center text-brand-emerald">
            <Building size={20} />
          </div>
          <div>
            <h2 className="font-display font-black text-xl tracking-tighter text-inherit">Business Registration</h2>
            <p className="text-[10px] opacity-40 uppercase font-black tracking-widest">Digital Onboarding Protocol</p>
          </div>
        </div>
        {!data.regCode ? (
          <button
            onClick={generateRegCode}
            className="btn-primary h-10 px-6 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all shadow-glow flex items-center gap-2 group"
          >
            <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
            Generate Store ID
          </button>
        ) : (
          <div className="flex flex-col items-end">
            <div className="text-[8px] font-black uppercase opacity-30 tracking-widest mb-1">Assigned ID</div>
            <div className="font-mono text-brand-emerald font-black text-sm tracking-widest select-all px-3 py-1 bg-brand-emerald/10 border border-brand-emerald/20 rounded-lg">
              {data.regCode}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Fields - Left Side (8/12) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Identity Section */}
          <div className="glass-card bg-surface/30 p-5 rounded-2xl border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Fingerprint size={14} className="text-brand-emerald" />
              <span className="text-[9px] font-black tracking-widest uppercase opacity-60">Legal Entity Profile</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="field-label-compact">Supermarket Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" size={16} />
                  <input name="name" value={data.name} onChange={handleChange} placeholder="Official Name" className="input-field-compact pl-10 h-11 text-xs font-bold" style={errStyle('name')} />
                </div>
              </div>
              <div>
                <label className="field-label-compact">Business Type</label>
                <select name="businessType" value={data.businessType} onChange={handleChange} className="input-field-compact h-11 text-[10px] font-black uppercase tracking-widest block w-full appearance-none">
                  {businessTypes.length === 0 && <option value="supermarket">Loading...</option>}
                  {businessTypes.map((t) => (
                    <option key={t.id} value={t.name.toLowerCase()}>{t.name.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="field-label-compact">Tax ID (TIN)</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" size={16} />
                  <input name="tin" value={data.tin} onChange={handleChange} placeholder="00123..." className="input-field-compact pl-10 h-11 text-xs font-bold tracking-widest" style={errStyle('tin')} />
                </div>
              </div>
              <div>
                <label className="field-label-compact">Email Identity</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" size={16} />
                  <input name="email" value={data.email} onChange={handleChange} placeholder="billing@store.com" className="input-field-compact pl-10 h-11 text-xs font-bold" style={errStyle('email')} />
                </div>
              </div>
              <div>
                <label className="field-label-compact">Phone Line</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" size={16} />
                  <input name="phone" value={data.phone} onChange={handleChange} placeholder="+251..." className="input-field-compact pl-10 h-11 text-xs font-bold" style={errStyle('phone')} />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="field-label-compact">Digital Hub (Website)</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" size={16} />
                <input name="website" value={data.website || ''} onChange={handleChange} placeholder="www.example.com" className="input-field-compact pl-10 h-11 text-xs font-bold" />
              </div>
            </div>
          </div>

          {/* Docs Section Mobile - Hidden on Desktop Sidebar */}
          <div className="lg:hidden glass-card bg-surface/30 p-5 rounded-2xl border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Upload size={14} className="text-brand-emerald" />
              <span className="text-[9px] font-black tracking-widest uppercase opacity-60">Verification Documents</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {uploads.map(u => (
                <div key={u.id} className="relative group">
                  <input type="file" id={`mob-${u.id}`} className="hidden" onChange={handleFileUpload(u.field)} accept="image/*" />
                  <label htmlFor={`mob-${u.id}`} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-brand-emerald/5 transition-colors cursor-pointer overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-brand-emerald/5 flex items-center justify-center flex-shrink-0">
                      {data[u.field] ? <CheckCircle2 size={14} className="text-brand-emerald" /> : <Upload size={14} className="text-brand-emerald opacity-30" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] font-black uppercase truncate opacity-70">{u.label}</div>
                      <div className="text-[8px] font-bold text-brand-emerald/50">{data[u.field] ? 'Attached' : 'Upload'}</div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Right Side (4/12) */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-6">
          <div className="glass-card bg-surface/30 p-5 rounded-2xl border border-border h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <FileText size={14} className="text-brand-emerald" />
              <span className="text-[9px] font-black tracking-widest uppercase opacity-60">Authentication Vault</span>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              {uploads.map(u => (
                <div key={u.id} className="relative group">
                  <input type="file" id={`side-${u.id}`} className="hidden" onChange={handleFileUpload(u.field)} accept="image/*" />
                  <label htmlFor={`side-${u.id}`} className="block relative h-28 rounded-2xl border-2 border-dashed border-brand-emerald/10 hover:border-brand-emerald/40 hover:bg-brand-emerald/5 transition-all cursor-pointer overflow-hidden group/item">
                    {data[u.field] ? (
                      <div className="relative w-full h-full">
                        <img src={data[u.field] as string} className="w-full h-full object-cover transition-transform group-hover/item:scale-105" alt={u.label} />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                          <RefreshCw size={18} className="text-white animate-pulse" />
                        </div>
                        <div className="absolute top-2 left-2 bg-brand-emerald/90 text-white text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-lg">
                          {u.label} Verified
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2">
                        <Upload size={18} className="text-brand-emerald opacity-20 group-hover/item:scale-110 transition-transform" />
                        <span className="text-[9px] font-black uppercase opacity-30">{u.label} Required</span>
                      </div>
                    )}
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <span className="text-[8px] font-black uppercase opacity-20 tracking-widest flex items-center justify-center gap-2">
                <Sparkles size={10} className="text-brand-emerald" /> Cloud Node Security
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Nav Compact */}
      <div className="pt-4 border-t border-border flex items-center justify-between">
        <div className="flex-1">
          {showErrors ? (
            <div className="flex items-center gap-2 text-[9px] font-black text-red-500 uppercase tracking-widest animate-pulse">
              <span>⚠</span> Complete Required Data Points
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[9px] font-black text-brand-emerald uppercase tracking-widest opacity-40">
              <CheckCircle2 size={12} /> Ready for Connection
            </div>
          )}
        </div>
        <button onClick={handleNext} className="btn-primary px-8 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-glow hover:scale-105 transition-all flex items-center gap-2">
          Sync Node Data <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default BusinessInfo;