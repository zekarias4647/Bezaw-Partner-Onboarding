
import React, { useState } from 'react';
import { Store, MapPin, Phone, Wand2, X, Plus } from 'lucide-react';
import { suggestCoordinates } from '../services/geminiService';

interface Props {
    supermarketId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

const SingleBranchForm: React.FC<Props> = ({ supermarketId, onSuccess, onCancel }) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [coordinates, setCoordinates] = useState('');
    const [phone, setPhone] = useState('');
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
            const response = await fetch(`https://onboardingapi.ristestate.com/api/onboard/${supermarketId}/branches`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    address,
                    coordinates,
                    phone
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

    const inputStyles = "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white text-black focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-bold shadow-sm";

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">New Physical Branch</h2>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Expanding Network</p>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Branch Name</label>
                        <div className="relative">
                            <Store className="absolute left-4 top-3.5 text-slate-300" size={18} />
                            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Bole Branch" className={`${inputStyles} pl-12 uppercase`} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Physical Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-3.5 text-slate-300" size={18} />
                            <textarea
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                placeholder="Street, Area..."
                                className={`${inputStyles} pl-12 resize-none h-24`}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex justify-between">
                                Coordinates
                                <button type="button" onClick={handleAISuggest} className="text-emerald-500 flex items-center gap-1"><Wand2 size={10} /> AI Pin</button>
                            </label>
                            <input value={coordinates} onChange={e => setCoordinates(e.target.value)} placeholder="0.00, 0.00" className={`${inputStyles} font-mono`} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-3.5 text-slate-300" size={18} />
                                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+251..." className={`${inputStyles} pl-12`} />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !name || !address}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 uppercase text-sm tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Registering...' : <><Plus size={18} /> Register Location</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SingleBranchForm;
