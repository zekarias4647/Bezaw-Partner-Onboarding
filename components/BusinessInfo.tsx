
import React from 'react';
import { SupermarketData, BankAccount } from '../types';
import { Building, Hash, Phone, Landmark, CreditCard, UserCircle, ChevronRight, Upload, Plus, Trash2, FileText, Fingerprint, RefreshCw } from 'lucide-react';

interface Props {
  data: SupermarketData;
  onChange: (data: SupermarketData) => void;
  onNext: () => void;
}

const BusinessInfo: React.FC<Props> = ({ data, onChange, onNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  const generateRegCode = () => {
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const code = `BEZAW-${random}`;
    onChange({ ...data, regCode: code });
  };

  const handleFileUpload = (field: keyof SupermarketData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addBankAccount = () => {
    onChange({
      ...data,
      bankAccounts: [...data.bankAccounts, { bankName: '', accountName: '', accountNumber: '' }]
    });
  };

  const removeBankAccount = (index: number) => {
    const newAccounts = data.bankAccounts.filter((_, i) => i !== index);
    onChange({ ...data, bankAccounts: newAccounts });
  };

  const updateBankAccount = (index: number, field: keyof BankAccount, value: string) => {
    const newAccounts = data.bankAccounts.map((acc, i) => 
      i === index ? { ...acc, [field]: value } : acc
    );
    onChange({ ...data, bankAccounts: newAccounts });
  };

  const inputStyles = "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white text-black focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all";

  return (
    <div className="space-y-10 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Business Registration</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Create your unique supermarket identity on our platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        {/* Basic Information */}
        <section className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <Building size={16} /> Core Identity
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-2">Store ID Code</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Fingerprint className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input
                    name="regCode"
                    value={data.regCode}
                    readOnly
                    placeholder="CLICK GENERATE ->"
                    className={`${inputStyles} pl-11 font-mono tracking-widest bg-slate-50 dark:bg-slate-50`}
                  />
                </div>
                <button 
                  onClick={generateRegCode}
                  className="px-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 font-bold text-xs"
                >
                  <RefreshCw size={16} /> GENERATE
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-2">Supermarket Name</label>
              <input
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder="Legal Store Name"
                className={inputStyles}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-2">Business TIN</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input
                    name="tin"
                    value={data.tin}
                    onChange={handleChange}
                    placeholder="0001234567"
                    className={`${inputStyles} pl-11`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input
                    name="phone"
                    value={data.phone}
                    onChange={handleChange}
                    placeholder="+251..."
                    className={`${inputStyles} pl-11`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[11px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest">Document Uploads</label>
              <div className="grid grid-cols-3 gap-3">
                {/* VAT Upload */}
                <input type="file" id="vatCert" className="hidden" onChange={handleFileUpload('vatCert')} accept="image/*" />
                <label htmlFor="vatCert" className="aspect-square flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-emerald-500 transition-all text-center p-2">
                  {data.vatCert ? (
                    <img src={data.vatCert} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <>
                      <Upload size={20} className="text-slate-300 mb-2" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">VAT Cert</span>
                    </>
                  )}
                </label>

                {/* License Upload */}
                <input type="file" id="license" className="hidden" onChange={handleFileUpload('businessLicense')} accept="image/*" />
                <label htmlFor="license" className="aspect-square flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-emerald-500 transition-all text-center p-2">
                  {data.businessLicense ? (
                    <img src={data.businessLicense} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <>
                      <FileText size={20} className="text-slate-300 mb-2" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">License</span>
                    </>
                  )}
                </label>

                {/* Logo Upload */}
                <input type="file" id="logo" className="hidden" onChange={handleFileUpload('logo')} accept="image/*" />
                <label htmlFor="logo" className="aspect-square flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-emerald-500 transition-all text-center p-2">
                  {data.logo ? (
                    <img src={data.logo} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <>
                      <Building size={20} className="text-slate-300 mb-2" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Logo</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Financial Details */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Landmark size={16} /> Settlement Network
            </h3>
            <button onClick={addBankAccount} className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline uppercase tracking-widest">
              <Plus size={14} /> Add Bank
            </button>
          </div>

          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {data.bankAccounts.map((account, index) => (
              <div key={index} className="p-6 bg-white dark:bg-slate-800/50 rounded-[2rem] border border-slate-200 dark:border-slate-800 space-y-4 relative group shadow-sm">
                {data.bankAccounts.length > 1 && (
                  <button onClick={() => removeBankAccount(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                )}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Select Institution</label>
                  <select
                    value={account.bankName}
                    onChange={(e) => updateBankAccount(index, 'bankName', e.target.value)}
                    className={inputStyles}
                  >
                    <option value="">Choose a Bank</option>
                    <option value="CBE">Commercial Bank of Ethiopia (CBE)</option>
                    <option value="Dashen">Dashen Bank</option>
                    <option value="Awash">Awash Bank</option>
                    <option value="Abyssinia">Bank of Abyssinia</option>
                    <option value="Telebirr">Telebirr Merchant Account</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-3.5 text-slate-400" size={16} />
                    <input
                      value={account.accountName}
                      onChange={(e) => updateBankAccount(index, 'accountName', e.target.value)}
                      placeholder="Account Holder Name"
                      className={`${inputStyles} pl-10`}
                    />
                  </div>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3.5 text-slate-400" size={16} />
                    <input
                      value={account.accountNumber}
                      onChange={(e) => updateBankAccount(index, 'accountNumber', e.target.value)}
                      placeholder="Account Number"
                      className={`${inputStyles} pl-10 font-mono`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="pt-8 border-t dark:border-slate-800 flex justify-end">
        <button
          onClick={onNext}
          disabled={!data.name || !data.regCode || data.bankAccounts.some(a => !a.accountNumber)}
          className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          Branch Configuration <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default BusinessInfo;
