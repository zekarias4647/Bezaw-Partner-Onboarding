import React, { useState } from 'react';
import { ShieldCheck, UserPlus, Mail, Phone, Lock, ChevronRight, RefreshCw, X, Sparkles } from 'lucide-react';

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
            const response = await fetch('https://onboardingapi.bezawcurbside.com/api/onboard/managers', {
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

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fadeIn">
            <div className="glass w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-brand-emerald/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-emerald to-transparent" />

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="font-display font-black text-2xl tracking-tighter text-inherit mb-1">Add Personnel</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40">Assigning To:</span>
                            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-brand-emerald">{branchName}</span>
                        </div>
                    </div>
                    <button onClick={onCancel} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                        <X size={20} className="text-inherit opacity-40 hover:opacity-100" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <label className="text-[10px] font-black tracking-widest uppercase opacity-40 mb-3 block px-1">Full Name</label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" size={18} />
                            <input value={name} onChange={e => setName(e.target.value)} placeholder="Personnel Official Name" className="input-field pl-12 h-14 text-sm font-bold" />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black tracking-widest uppercase opacity-40 mb-3 block px-1">Email Identity</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" size={18} />
                            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="manager@supermarket.com" className="input-field pl-12 h-14 text-sm font-bold" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black tracking-widest uppercase opacity-40 mb-3 block px-1">Contact</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" size={18} />
                                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+251..." className="input-field pl-12 h-14 text-sm font-bold" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black tracking-widest uppercase opacity-40 mb-3 flex justify-between items-center px-1">
                                Password
                                <button type="button" onClick={regeneratePassword} className="text-brand-emerald opacity-50 hover:opacity-100"><RefreshCw size={12} /></button>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald opacity-30" size={18} />
                                <input value={password} onChange={e => setPassword(e.target.value)} className="input-field pl-12 h-14 font-mono font-bold text-sm tracking-widest" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !name || !email}
                        className="btn-primary h-16 w-full rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-glow group hover:scale-[1.02] transition-all mt-4"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
                                Confirm Assignment
                            </>
                        )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[9px] font-black tracking-widest uppercase opacity-20 mt-2">
                        <Sparkles size={12} className="text-brand-emerald" />
                        Secure Access Provisioning
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SingleManagerForm;
