import React, { useState, useEffect } from 'react';
import { BranchData, ManagerData } from '../types';
import { Store, ChevronLeft, UserPlus, Users, MapPin, ShieldCheck, Mail, Phone, AlertCircle, Trash2, Sparkles } from 'lucide-react';
import SingleManagerForm from './SingleManagerForm';

interface Props {
    branch: BranchData;
    vendorName?: string;
    onBack: () => void;
}

const BranchDashboard: React.FC<Props> = ({ branch, vendorName, onBack }) => {
    const [showAddManager, setShowAddManager] = useState(false);
    const [managers, setManagers] = useState<ManagerData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchManagers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://onboardingapi.bezawcurbside.com/api/onboard/branches/${branch.id}/managers`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) setManagers(await response.json());
        } catch (error) {
            console.error("Failed to fetch managers", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchManagers(); }, [branch.id]);

    const deleteManager = async (id: string) => {
        if (!confirm('Are you sure you want to remove this personnel account?')) return;
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`https://onboardingapi.bezawcurbside.com/api/onboard/managers/${id}`, {
                method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchManagers();
        } catch (e) { console.error(e); }
    };

    return (
        <div className="flex-1 flex flex-col gap-8 py-6">

            {/* ── Header Banner ── */}
            <div className="animate-slideUp glass rounded-[2.5rem] p-10 relative overflow-hidden group border border-border">
                {/* Visual Decorations */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-emerald/50 to-transparent" />
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-brand-emerald/5 blur-[80px]" />

                <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
                    <div className="flex-1">
                        <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                            <div className="w-2 h-2 rounded-full bg-brand-emerald shadow-glow animate-pulse" />
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-brand-emerald">
                                {vendorName || 'Partner'} Dashboard
                            </span>
                        </div>
                        <h2 className="font-display font-black text-4xl tracking-tighter mb-4 text-inherit">
                            {branch.name}
                        </h2>
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-medium opacity-50">
                            <MapPin size={14} className="text-brand-emerald" />
                            {branch.address}
                        </div>
                    </div>

                    <button
                        id="add-personnel-btn"
                        onClick={() => setShowAddManager(true)}
                        className="btn-primary px-8 h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-glow group hover:scale-105 transition-all"
                    >
                        <UserPlus size={18} /> Add Personnel
                    </button>
                </div>
            </div>

            {/* ── Staff Section ── */}
            <div className="animate-slideUp delay-100 flex flex-col gap-6">
                <div className="flex items-center gap-4 px-2">
                    <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center">
                        <Users size={18} className="text-brand-emerald" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-black tracking-widest uppercase text-inherit">Staff Management</h3>
                        <p className="text-[9px] font-black tracking-widest uppercase opacity-30">Active Personnel Access</p>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                </div>

                {loading ? (
                    <div className="glass rounded-[2rem] p-20 flex flex-col items-center justify-center gap-4 text-center border border-border">
                        <div className="w-8 h-8 border-2 border-brand-emerald/30 border-t-brand-emerald rounded-full animate-spin" />
                        <p className="text-[10px] font-black tracking-widest uppercase opacity-30">Fetching accounts...</p>
                    </div>
                ) : managers.length === 0 ? (
                    <div className="border-2 border-dashed border-brand-emerald/20 rounded-[2.5rem] p-16 flex flex-col items-center text-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-brand-emerald/5 border border-brand-emerald/10 flex items-center justify-center opacity-30">
                            <AlertCircle size={32} />
                        </div>
                        <div>
                            <h4 className="font-display font-black text-base uppercase tracking-widest mb-2">No Staff Assigned</h4>
                            <p className="text-xs font-medium opacity-40 max-w-sm">
                                This branch currently has no active personnel accounts. Personnel can login to manage local orders.
                            </p>
                        </div>
                        <button onClick={() => setShowAddManager(true)} className="btn-primary py-3 px-8 text-[10px] uppercase font-black tracking-widest">
                            <UserPlus size={14} /> Assign First Manager
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {managers.map(manager => (
                            <div
                                key={manager.id}
                                className="glass group rounded-[2rem] p-6 border border-border relative overflow-hidden hover:scale-[1.02] transition-all duration-300"
                            >
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-emerald/20 to-transparent" />

                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-emerald/10 to-brand-dark/20 border border-brand-emerald/30 flex items-center justify-center text-brand-emerald">
                                                <ShieldCheck size={22} />
                                            </div>
                                            <div>
                                                <div className="font-display font-black text-sm tracking-widest uppercase text-inherit">
                                                    {manager.name}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[8px] font-black tracking-[0.2em] uppercase text-brand-emerald px-2 py-0.5 rounded-full bg-brand-emerald/10 border border-brand-emerald/20">
                                                        Manager
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => deleteManager(manager.id)}
                                            className="p-2 bg-red-500/5 border border-red-500/10 rounded-xl text-red-500/30 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                            title="Delete Account"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3 p-3 bg-surface/50 rounded-xl border border-border group-hover:border-brand-emerald/20 transition-colors overflow-hidden">
                                            <Mail size={14} className="text-brand-emerald opacity-50 flex-shrink-0" />
                                            <span className="text-[10px] font-bold opacity-60 truncate">{manager.email}</span>
                                        </div>
                                        {manager.phone && (
                                            <div className="flex items-center gap-3 p-3 bg-surface/50 rounded-xl border border-border group-hover:border-brand-emerald/20 transition-colors">
                                                <Phone size={14} className="text-brand-emerald opacity-50 flex-shrink-0" />
                                                <span className="text-[10px] font-bold opacity-60">{manager.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Back Button */}
            <button
                onClick={onBack}
                className="self-center mt-4 py-4 px-8 flex items-center gap-2 text-[10px] font-black tracking-widest uppercase opacity-40 hover:opacity-100 hover:text-brand-emerald transition-all"
            >
                <ChevronLeft size={16} /> Back to Branch Portal
            </button>

            {/* Add Manager Modal */}
            {showAddManager && (
                <SingleManagerForm
                    branchId={branch.id} branchName={branch.name}
                    onSuccess={() => { setShowAddManager(false); fetchManagers(); }}
                    onCancel={() => setShowAddManager(false)}
                />
            )}

            {/* Security Footer */}
            <div className="self-center flex items-center gap-2 text-[9px] font-black tracking-widest uppercase opacity-20 mt-10">
                <Sparkles size={12} className="text-brand-emerald" />
                Live Network Connection Established
            </div>
        </div>
    );
};

export default BranchDashboard;
