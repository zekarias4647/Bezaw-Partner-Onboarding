
import React, { useState } from 'react';
import { Store, MapPin, Phone, Wand2, X, Plus, Clock } from 'lucide-react';
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
        if (coords) {
            setCoordinates(`${coords.lat}, ${coords.lng}`);
        }
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
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    address,
                    coordinates,
                    phone,
                    openingHours,
                    closingHours
                })
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

    const inputStyles = "w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-[11px] font-medium shadow-sm";

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-xl p-4 shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">New Physical Branch</h2>
                        <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">Expanding Network</p>
                    </div>
                    <button onClick={onCancel} className="p-1 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <X size={18} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest px-1">Branch Name</label>
                        <div className="relative">
                            <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Bole Branch" className={`${inputStyles} pl-8 uppercase`} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest px-1">Physical Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-slate-300" size={14} />
                            <textarea
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                placeholder="Street, Area..."
                                className={`${inputStyles} pl-8 resize-none h-16`}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest px-1 flex justify-between">
                                Coordinates
                                <button type="button" onClick={handleAISuggest} className="text-emerald-500 font-bold flex items-center gap-1"><Wand2 size={10} /> AI Pin</button>
                            </label>
                            <input value={coordinates} onChange={e => setCoordinates(e.target.value)} placeholder="0.00, 0.00" className={`${inputStyles} font-mono`} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest px-1">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+251..." className={`${inputStyles} pl-8`} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest px-1">Opening Time</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                <input type="time" value={openingHours} onChange={e => setOpeningHours(e.target.value)} className={`${inputStyles} pl-8`} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest px-1">Closing Time</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                <input type="time" value={closingHours} onChange={e => setClosingHours(e.target.value)} className={`${inputStyles} pl-8`} />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !name || !address}
                        className="w-full h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Registering...' : <><Plus size={14} /> Register Branch</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SingleBranchForm;
