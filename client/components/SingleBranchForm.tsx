import React, { useState } from 'react';
import { Store, MapPin, Phone, Wand2, X, Plus, Clock, Sparkles } from 'lucide-react';
import { suggestCoordinates } from '../services/geminiService';

interface Props {
    vendorId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

const SingleBranchForm: React.FC<Props> = ({ vendorId, onSuccess, onCancel }) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [coordinates, setCoordinates] = useState('');
    const [phone, setPhone] = useState('');
    const [openingHours, setOpeningHours] = useState('');
    const [closingHours, setClosingHours] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);

    const handleAISuggest = async () => {
        if (!address) return;
        setIsSuggesting(true);
        const coords = await suggestCoordinates(address);
        if (coords) setCoordinates(`${coords.lat}, ${coords.lng}`);
        setIsSuggesting(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !address) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://onboardingapi.bezawcurbside.com/api/onboard/${vendorId}/branches`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ name, address, coordinates, phone, openingHours, closingHours })
            });
            if (!response.ok) throw new Error('Failed to add branch');
            onSuccess();
        } catch (error) {
            console.error(error);
            alert('Failed to add branch');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fadeIn" onClick={(e) => e.target === e.currentTarget && onCancel()}>
            <div className="glass w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-brand-emerald/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-emerald to-transparent" />

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="font-display font-black text-2xl tracking-tighter text-inherit mb-1">New Physical Branch</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40">Expanding Operations</span>
                            <Sparkles size={12} className="text-brand-emerald animate-pulse" />
                        </div>
                    </div>
                    <button onClick={onCancel} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                        <X size={20} className="text-inherit opacity-40 hover:opacity-100" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label className="text-[10px] font-black tracking-widest uppercase opacity-40 mb-3 block px-1">Branch Name</label>
                        <div className="relative">
                            <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" size={18} />
                            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. BOLE BRANCH" className="input-field pl-12 h-14 text-sm font-black tracking-widest uppercase" />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black tracking-widest uppercase opacity-40 mb-3 block px-1">Physical Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-4 text-brand-emerald opacity-30" size={18} />
                            <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Street, Area, Landmark..." className="input-field pl-12 h-24 pt-4 text-sm font-bold resize-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black tracking-widest uppercase opacity-40 mb-3 flex justify-between items-center px-1">
                                Coordinates
                                <button type="button" onClick={handleAISuggest} className="text-brand-emerald opacity-50 hover:opacity-100 flex items-center gap-1 font-black underline decoration-dashed">
                                    <Wand2 size={12} /> {isSuggesting ? 'Thinking' : 'AI Pin'}
                                </button>
                            </label>
                            <input value={coordinates} onChange={e => setCoordinates(e.target.value)} placeholder="9.01, 38.75" className="input-field h-14 font-mono font-bold text-xs tracking-widest" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black tracking-widest uppercase opacity-40 mb-3 block px-1">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" size={18} />
                                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+251..." className="input-field pl-12 h-14 text-sm font-bold" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black tracking-widest uppercase opacity-40 mb-3 block px-1">Opening Time</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" size={18} />
                                <input type="time" value={openingHours} onChange={e => setOpeningHours(e.target.value)} className="input-field pl-12 h-14" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black tracking-widest uppercase opacity-40 mb-3 block px-1">Closing Time</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" size={18} />
                                <input type="time" value={closingHours} onChange={e => setClosingHours(e.target.value)} className="input-field pl-12 h-14" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !name || !address}
                        className="btn-primary h-16 w-full rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-glow group hover:scale-[1.02] transition-all mt-4"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                                Register Physical Branch
                            </>
                        )}
                    </button>

                    <div className="text-center">
                        <span className="text-[9px] font-black tracking-widest uppercase opacity-20">Network Node Authorization Required</span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SingleBranchForm;
