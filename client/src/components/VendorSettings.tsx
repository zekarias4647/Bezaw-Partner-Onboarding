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
    Image as ImageIcon,
    Sparkles
} from 'lucide-react';

import { API_ROUTES } from '../api';

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
            const response = await fetch(API_ROUTES.VENDOR_SETTINGS, {
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
        return API_ROUTES.IMAGE_PATH(path);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fadeIn">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="glass relative w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp flex flex-col max-h-[90vh] border border-brand-emerald/20">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-emerald to-transparent" />

                {/* Header */}
                <div className="p-8 pb-4 flex items-center justify-between border-b border-white/5 bg-brand-emerald/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-brand-emerald to-brand-dark rounded-xl flex items-center justify-center text-white shadow-glow">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h2 className="font-display font-black text-2xl tracking-tighter text-inherit">Business Profile</h2>
                            <div className="flex items-center gap-2">
                                <Sparkles size={12} className="text-brand-emerald" />
                                <p className="text-[10px] font-black tracking-widest uppercase opacity-40">System Core Settings</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-inherit opacity-40 hover:opacity-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {message && (
                        <div className={`p-4 rounded-2xl flex items-center gap-4 animate-slideUp ${message.type === 'success'
                            ? 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 shadow-glow-sm'
                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                            }`}>
                            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span className="text-[11px] font-black uppercase tracking-widest">{message.text}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Identity & Contact */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 px-2">
                                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-brand-emerald">Identity & Node</span>
                                <div className="flex-1 h-px bg-gradient-to-r from-brand-emerald/20 to-transparent" />
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="field-label px-1">Legal Entity Name</label>
                                    <div className="relative">
                                        <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" />
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="input-field pl-12 h-12 text-sm font-bold"
                                            placeholder="Supermarket Name"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="field-label px-1">Primary Email</label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" />
                                            <input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="input-field pl-12 h-12 text-sm font-bold"
                                                placeholder="contact@email.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="field-label px-1">Operational Phone</label>
                                        <div className="relative">
                                            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" />
                                            <input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="input-field pl-12 h-12 text-sm font-bold"
                                                placeholder="+251..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="field-label px-1">Digital Presence (URL)</label>
                                    <div className="relative">
                                        <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" />
                                        <input
                                            name="website"
                                            value={formData.website || ''}
                                            onChange={handleChange}
                                            className="input-field pl-12 h-12 text-sm font-bold"
                                            placeholder="www.supermarket-network.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="field-label px-1">Tax Identification (TIN)</label>
                                    <div className="relative">
                                        <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" />
                                        <input
                                            name="tin"
                                            value={formData.tin}
                                            onChange={handleChange}
                                            className="input-field pl-12 h-12 font-mono font-bold tracking-widest text-sm"
                                            placeholder="0001234567"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Media & Assets */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 px-2">
                                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-brand-emerald">Media & Core Assets</span>
                                <div className="flex-1 h-px bg-gradient-to-r from-brand-emerald/20 to-transparent" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Logo */}
                                <div className="space-y-3">
                                    <label className="field-label px-1">Brand Logo</label>
                                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 border-2 border-dashed border-brand-emerald/10 group transition-all hover:border-brand-emerald/40 shadow-glow-sm">
                                        <img
                                            src={getFullUrl(previews.logo)}
                                            alt="Logo"
                                            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <input type="file" id="logo-up" className="hidden" onChange={handleFileUpload('logo')} accept="image/*" />
                                            <label htmlFor="logo-up" className="cursor-pointer bg-white text-brand-dark px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                                <Upload size={14} /> Update
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Storefront */}
                                <div className="space-y-3">
                                    <label className="field-label px-1">Storefront</label>
                                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 border-2 border-dashed border-brand-emerald/10 group transition-all hover:border-brand-emerald/40">
                                        {previews.image ? (
                                            <img
                                                src={getFullUrl(previews.image)}
                                                alt="Storefront"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-brand-emerald opacity-20">
                                                <ImageIcon size={40} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <input type="file" id="image-up" className="hidden" onChange={handleFileUpload('image')} accept="image/*" />
                                            <label htmlFor="image-up" className="cursor-pointer bg-white text-brand-dark px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                                <Upload size={14} /> Update
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Documents */}
                                <div className="space-y-3">
                                    <label className="field-label px-1">VAT Proof</label>
                                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 border-2 border-dashed border-brand-emerald/10 group transition-all hover:border-brand-emerald/40 overflow-hidden">
                                        <img
                                            src={getFullUrl(previews.vatCert)}
                                            alt="VAT"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform blur-[2px] opacity-40 group-hover:blur-0 group-hover:opacity-100 transition-all"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <input type="file" id="vat-up" className="hidden" onChange={handleFileUpload('vatCert')} accept="image/*,application/pdf" />
                                            <label htmlFor="vat-up" className="cursor-pointer bg-white text-brand-dark px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                                                <Upload size={12} /> Replace
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="field-label px-1">Licensing</label>
                                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 border-2 border-dashed border-brand-emerald/10 group transition-all hover:border-brand-emerald/40 overflow-hidden">
                                        <img
                                            src={getFullUrl(previews.businessLicense)}
                                            alt="License"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform blur-[2px] opacity-40 group-hover:blur-0 group-hover:opacity-100 transition-all"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <input type="file" id="license-up" className="hidden" onChange={handleFileUpload('businessLicense')} accept="image/*,application/pdf" />
                                            <label htmlFor="license-up" className="cursor-pointer bg-white text-brand-dark px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                                                <Upload size={12} /> Replace
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-8 border-t border-white/5 bg-brand-emerald/5 flex items-center justify-between">
                    <p className="text-[10px] font-black text-brand-emerald uppercase tracking-[0.25em] flex items-center gap-2 animate-pulse">
                        <ShieldCheck size={16} /> Encrypted Node Connection
                    </p>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-inherit opacity-40 hover:opacity-100 font-black text-[10px] uppercase tracking-widest transition-all"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-10 py-3 bg-brand-emerald hover:brightness-110 text-brand-dark font-black rounded-xl shadow-glow transition-all flex items-center gap-3 disabled:opacity-50 text-[10px] uppercase tracking-widest"
                        >
                            {isSubmitting ? (
                                <div className="w-4 h-4 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            Sync Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorSettings;
