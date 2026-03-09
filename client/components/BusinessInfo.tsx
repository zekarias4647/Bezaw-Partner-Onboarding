import React, { useState, useEffect } from 'react';
import { VendorData } from '../types';
import { Building, Hash, Phone, ChevronRight, Upload, FileText, Fingerprint, RefreshCw, Globe, Mail } from 'lucide-react';

interface Props {
  data: VendorData;
  onChange: (data: VendorData) => void;
  onNext: () => void;
}

interface BusinessType {
  id: string;
  name: string;
  description: string;
}

const BusinessInfo: React.FC<Props> = ({ data, onChange, onNext }) => {
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    const fetchBusinessTypes = async () => {
      try {
        const response = await fetch('https://onboardingapi.bezawcurbside.com/api/onboard/business-types');
        if (response.ok) {
          const fetchedTypes = await response.json();
          setBusinessTypes(fetchedTypes);
        }
      } catch (error) {
        console.error('Error fetching business types:', error);
      }
    };
    fetchBusinessTypes();
  }, []);

  useEffect(() => {
    if (businessTypes.length > 0) {
      const current = data.businessType?.toLowerCase();
      const exists = businessTypes.some(t => t.name.toLowerCase() === current);

      if (!current || !exists) {
        onChange({ ...data, businessType: businessTypes[0].name.toLowerCase() });
      }
    }
  }, [businessTypes, data.businessType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  const generateRegCode = () => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000).toString();
    const code = `BZWV-${randomDigits}`;
    onChange({ ...data, regCode: code });
  };

  const handleFileUpload = (field: keyof VendorData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          ...data,
          [field]: reader.result as string,
          [`${field}File`]: file // Store the raw file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    const missing: string[] = [];
    if (!data.regCode) missing.push('Store ID Code');
    if (!data.name.trim()) missing.push('Supermarket Name');
    if (!data.businessType) missing.push('Business Type');
    if (!data.email?.trim()) missing.push('Email Address');
    if (!data.tin.trim()) missing.push('Business TIN');
    if (!data.phone.trim()) missing.push('Phone Number');
    if (!data.logo) missing.push('Logo');
    if (!data.businessLicense) missing.push('Business License');

    if (missing.length > 0) {
      setShowErrors(true);
      return;
    }
    onNext();
  };

  const getErrorStyle = (field: keyof VendorData) => {
    if (!showErrors) return "";
    const val = data[field];
    const isMissing = typeof val === 'string' ? !val.trim() : !val;
    return isMissing ? "border-red-500 ring-2 ring-red-500/10 focus:border-red-500" : "";
  };

  const inputStyles = "w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-[11px] font-medium";

  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Business Registration</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-[10px]">Create your unique supermarket identity on our platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Basic Information */}
        <section className="space-y-2">
          <h3 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <Building size={12} /> Core Identity
          </h3>

          <div className="space-y-1.5">
            <div>
              <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-0.5">Store ID Code</label>
              <div className="flex gap-2">
                <div className="relative flex-1 group">
                  <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform" size={14} />
                  <input
                    name="regCode"
                    value={data.regCode}
                    readOnly
                    className={`${inputStyles} pl-8 font-mono tracking-wider bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:!text-white border-emerald-100 dark:border-emerald-900/50 ${getErrorStyle('regCode')}`}
                    placeholder="Click Generate..."
                  />
                </div>
                <button
                  onClick={generateRegCode}
                  className="px-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1 font-bold text-[10px]"
                >
                  <RefreshCw size={14} /> GENERATE
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-0.5">Supermarket Name</label>
              <input
                name="name"
                value={data.name}
                onChange={handleChange}
                className={`${inputStyles} ${getErrorStyle('name')}`}
                placeholder="e.g. Bezaw Supermarket Bole"
              />
            </div>

            <div>
              <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-0.5">Business Type</label>
              <select
                name="businessType"
                value={data.businessType}
                onChange={handleChange}
                className={`${inputStyles} ${getErrorStyle('businessType')}`}
              >
                {businessTypes.length === 0 && <option value="supermarket">Loading...</option>}
                {businessTypes.map((type) => (
                  <option key={type.id} value={type.name.toLowerCase()}>
                    {type.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-0.5">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  name="website"
                  value={data.website || ''}
                  onChange={handleChange}
                  placeholder="www.example.com"
                  className={`${inputStyles} pl-8`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-0.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  name="email"
                  type="email"
                  value={data.email}
                  onChange={handleChange}
                  className={`${inputStyles} pl-8 ${getErrorStyle('email')}`}
                  placeholder="billing@supermarket.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-0.5">Business TIN</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    name="tin"
                    value={data.tin}
                    onChange={handleChange}
                    className={`${inputStyles} pl-8 ${getErrorStyle('tin')}`}
                    placeholder="0012345678"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-0.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    name="phone"
                    value={data.phone}
                    onChange={handleChange}
                    placeholder="+251..."
                    className={`${inputStyles} pl-8`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest">Document Uploads</label>
              <div className="grid grid-cols-4 gap-2">
                {/* VAT Upload */}
                <input type="file" id="vatCert" className="hidden" onChange={handleFileUpload('vatCert')} accept="image/*" />
                <label htmlFor="vatCert" className="aspect-square flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:border-emerald-500 transition-all text-center p-1">
                  {data.vatCert ? (
                    <img src={data.vatCert} className="w-full h-full object-cover rounded" />
                  ) : (
                    <>
                      <Upload size={14} className="text-slate-300 mb-0.5" />
                      <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">VAT Cert</span>
                    </>
                  )}
                </label>

                {/* License Upload */}
                <input type="file" id="license" className="hidden" onChange={handleFileUpload('businessLicense')} accept="image/*" />
                <label htmlFor="license" className="aspect-square flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:border-emerald-500 transition-all text-center p-1">
                  {data.businessLicense ? (
                    <img src={data.businessLicense} className="w-full h-full object-cover rounded" />
                  ) : (
                    <>
                      <FileText size={14} className="text-slate-300 mb-0.5" />
                      <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">License</span>
                    </>
                  )}
                </label>

                {/* Logo Upload */}
                <input type="file" id="logo" className="hidden" onChange={handleFileUpload('logo')} accept="image/*" />
                <label htmlFor="logo" className="aspect-square flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:border-emerald-500 transition-all text-center p-1">
                  {data.logo ? (
                    <img src={data.logo} className="w-full h-full object-cover rounded" />
                  ) : (
                    <>
                      <Building size={14} className="text-slate-300 mb-0.5" />
                      <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">Logo</span>
                    </>
                  )}
                </label>

                {/* Main Store Image Upload */}
                <input type="file" id="image" className="hidden" onChange={handleFileUpload('image')} accept="image/*" />
                <label htmlFor="image" className="aspect-square flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:border-emerald-500 transition-all text-center p-1">
                  {data.image ? (
                    <img src={data.image} className="w-full h-full object-cover rounded" />
                  ) : (
                    <>
                      <Building size={14} className="text-slate-300 mb-0.5" />
                      <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">Storefront</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="pt-3 border-t dark:border-slate-800 flex items-center justify-between">
        {showErrors && (
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1">
            <Fingerprint size={12} /> Missing required information
          </p>
        )}
        <div className="flex-1" />
        <button
          onClick={handleNext}
          disabled={false}
          className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 text-[10px] uppercase tracking-widest"
        >
          Branch Configuration <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default BusinessInfo;