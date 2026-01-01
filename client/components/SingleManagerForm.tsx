
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
            const response = await fetch('http://localhost:5000/api/onboard/managers', {
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

    const inputStyles = "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-black dark:text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-bold shadow-sm";

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Add Personnel</h2>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                            To: <span className="text-emerald-600">{branchName}</span>
                        </p>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-4 top-3.5 text-slate-300" size={18} />
                            <input value={name} onChange={e => setName(e.target.value)} placeholder="Official Name" className={`${inputStyles} pl-12`} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Identity</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-slate-300" size={18} />
                            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="manager@supermarket.com" className={`${inputStyles} pl-12`} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-3.5 text-slate-300" size={18} />
                                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+251..." className={`${inputStyles} pl-12`} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex justify-between">
                                Password <button type="button" onClick={regeneratePassword} className="text-indigo-500"><RefreshCw size={10} /></button>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 text-slate-300" size={18} />
                                <input value={password} onChange={e => setPassword(e.target.value)} className={`${inputStyles} pl-12 font-mono`} />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !name || !email}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 uppercase text-sm tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Adding...' : <><UserPlus size={18} /> Confirm Assignment</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SingleManagerForm;
