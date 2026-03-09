
import React, { useState } from 'react';
import { ShieldCheck, UserPlus, Mail, Phone, Lock, ChevronRight, RefreshCw, X } from 'lucide-react';

interface Props {
    branchId: string;
    branchName: string;
    onSuccess: () => void;
    onCancel: () => void;
}

const SingleManagerForm: React.FC<Props> = ({ branchId, branchName, onSuccess, onCancel }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState(Math.random().toString(36).substr(2, 8));
    const [loading, setLoading] = useState(false);

    const regeneratePassword = () => {
        setPassword(Math.random().toString(36).substr(2, 8));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5002/api/onboard/managers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    branchId,
                    name,
                    email,
                    phone,
                    password
                })
            });

            if (!response.ok) throw new Error('Failed to add manager');

            onSuccess();
        } catch (error) {
            console.error(error);
            alert('Failed to add manager');
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
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">Add Personnel</h2>
                        <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">
                            To: <span className="text-emerald-600">{branchName}</span>
                        </p>
                    </div>
                    <button onClick={onCancel} className="p-1 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <X size={18} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                            <input value={name} onChange={e => setName(e.target.value)} placeholder="Official Name" className={`${inputStyles} pl-8`} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest px-1">Email Identity</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="manager@supermarket.com" className={`${inputStyles} pl-8`} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest px-1">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+251..." className={`${inputStyles} pl-8`} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest px-1 flex justify-between">
                                Password <button type="button" onClick={regeneratePassword} className="text-indigo-500"><RefreshCw size={10} /></button>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                <input value={password} onChange={e => setPassword(e.target.value)} className={`${inputStyles} pl-8 font-mono`} />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !name || !email}
                        className="w-full h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Adding...' : <><UserPlus size={14} /> Confirm Assignment</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SingleManagerForm;
