import React, { useState, useEffect } from 'react';
import { VendorData } from '../types';
import {
    Building2,
    Mail,
    Phone,
    Globe,
    Hash,
    Upload,
    Save,
    X,
    CheckCircle2,
    AlertCircle,
    ShieldCheck,
    FileText,
    Image as ImageIcon
} from 'lucide-react';

interface Props {
    vendor: VendorData;
    onUpdate: (updatedVendor: VendorData) => void;
    onClose: () => void;
}

const VendorSettings: React.FC<Props> = ({ vendor, onUpdate, onClose }) => {
    const [formData, setFormData] = useState<VendorData>({ ...vendor });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [previews, setPreviews] = useState<{ [key: string]: string }>({
        logo: vendor.logo,
        vatCert: vendor.vatCert,
        businessLicense: vendor.businessLicense,
        image: vendor.image || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = (field: keyof VendorData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [field]: reader.result as string }));
                setFormData(prev => ({
                    ...prev,
                    [`${field}File`]: file
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('website', formData.website || '');
            data.append('tin', formData.tin);
            data.append('businessType', formData.businessType);

            if (formData.logoFile) data.append('logo', formData.logoFile);
            if (formData.vatCertFile) data.append('vatCert', formData.vatCertFile);
            if (formData.businessLicenseFile) data.append('businessLicense', formData.businessLicenseFile);
            if (formData.imageFile) data.append('image', formData.imageFile);

            const token = localStorage.getItem('authToken');
            const response = await fetch('https://onboardingapi.bezawcurbside.com/api/settings/vendor', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            if (!response.ok) throw new Error('Failed to update profile');

            const result = await response.json();

            // Map DB snake_case back to camelCase
            const updatedVendor: VendorData = {
                ...formData,
                name: result.vendor.name,
                email: result.vendor.email,
                phone: result.vendor.phone,
                website: result.vendor.website,
                tin: result.vendor.tin,
                logo: result.vendor.logo,
                vatCert: result.vendor.vat_cert,
                businessLicense: result.vendor.business_license,
                image: result.vendor.image,
                businessType: result.vendor.business_type
            };

            onUpdate(updatedVendor);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            setTimeout(() => {
                setMessage(null);
            }, 3000);

        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Something went wrong' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFullUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        return `https://onboardingapi.bezawcurbside.com/${path}`;
    };

    const inputStyles = "w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium";
    const labelStyles = "block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 ml-1";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-950 rounded-2xl shadow-2xl overflow-hidden animate-slideUp flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b dark:border-slate-900 flex items-center justify-between bg-gradient-to-r from-emerald-600/5 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                            <Building2 size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">Business Settings</h2>
                            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Update your partner profile</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors text-slate-400"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {message && (
                        <div className={`p-3 rounded-xl flex items-center gap-3 animate-fadeIn ${message.type === 'success'
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/40'
                            }`}>
                            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            <span className="text-xs font-bold uppercase tracking-tight">{message.text}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Identity & Contact */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-2.5">
                                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Identity & Contact</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className={labelStyles}>Business Name</label>
                                    <div className="relative">
                                        <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`${inputStyles} pl-10`}
                                            placeholder="Legal Entity Name"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelStyles}>Email Address</label>
                                        <div className="relative">
                                            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`${inputStyles} pl-10`}
                                                placeholder="contact@email.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelStyles}>Phone Number</label>
                                        <div className="relative">
                                            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={`${inputStyles} pl-10`}
                                                placeholder="+251..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelStyles}>Website URL</label>
                                    <div className="relative">
                                        <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            name="website"
                                            value={formData.website || ''}
                                            onChange={handleChange}
                                            className={`${inputStyles} pl-10`}
                                            placeholder="www.example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelStyles}>Tax ID (TIN Number)</label>
                                    <div className="relative">
                                        <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            name="tin"
                                            value={formData.tin}
                                            onChange={handleChange}
                                            className={`${inputStyles} pl-10 font-mono`}
                                            placeholder="0001234567"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Media & Assets */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-2.5">
                                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Media & Documents</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Logo */}
                                <div className="space-y-1.5">
                                    <label className={labelStyles}>Brand Logo</label>
                                    <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 group transition-all shadow-sm">
                                        <img
                                            src={getFullUrl(previews.logo)}
                                            alt="Logo"
                                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <input type="file" id="logo-up" className="hidden" onChange={handleFileUpload('logo')} accept="image/*" />
                                            <label htmlFor="logo-up" className="cursor-pointer bg-white text-slate-900 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
                                                <Upload size={12} /> Change
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Storefront */}
                                <div className="space-y-1.5">
                                    <label className={labelStyles}>Storefront Image</label>
                                    <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 group transition-all shadow-sm">
                                        {previews.image ? (
                                            <img
                                                src={getFullUrl(previews.image)}
                                                alt="Storefront"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                                <ImageIcon size={32} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <input type="file" id="image-up" className="hidden" onChange={handleFileUpload('image')} accept="image/*" />
                                            <label htmlFor="image-up" className="cursor-pointer bg-white text-slate-900 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
                                                <Upload size={12} /> Change
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* VAT Cert */}
                                <div className="space-y-1.5">
                                    <label className={labelStyles}>VAT Certificate</label>
                                    <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 group transition-all shadow-sm">
                                        {previews.vatCert ? (
                                            <img
                                                src={getFullUrl(previews.vatCert)}
                                                alt="VAT Cert"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                                <ShieldCheck size={32} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <input type="file" id="vat-up" className="hidden" onChange={handleFileUpload('vatCert')} accept="image/*,application/pdf" />
                                            <label htmlFor="vat-up" className="cursor-pointer bg-white text-slate-900 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
                                                <Upload size={12} /> Update
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Business License */}
                                <div className="space-y-1.5">
                                    <label className={labelStyles}>Business License</label>
                                    <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 group transition-all shadow-sm">
                                        {previews.businessLicense ? (
                                            <img
                                                src={getFullUrl(previews.businessLicense)}
                                                alt="Business License"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                                <FileText size={32} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <input type="file" id="license-up" className="hidden" onChange={handleFileUpload('businessLicense')} accept="image/*,application/pdf" />
                                            <label htmlFor="license-up" className="cursor-pointer bg-white text-slate-900 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
                                                <Upload size={12} /> Update
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-4 border-t dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-500" /> Secure Data
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-all"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50 text-[10px] uppercase tracking-widest"
                        >
                            {isSubmitting ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save size={14} />
                            )}
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RefreshCw: React.FC<{ size?: number }> = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M3 21v-5h5" />
    </svg>
);

export default VendorSettings;
