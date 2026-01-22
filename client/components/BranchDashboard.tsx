
import React, { useState, useEffect } from 'react';
import { BranchData, ManagerData } from '../types';
import { Store, ChevronLeft, UserPlus, Users, MapPin, ShieldCheck, Mail, Phone, AlertCircle } from 'lucide-react';
import SingleManagerForm from './SingleManagerForm';

interface Props {
    branch: BranchData;
    onBack: () => void;
}

const BranchDashboard: React.FC<Props> = ({ branch, onBack }) => {
    const [showAddManager, setShowAddManager] = useState(false);
    const [managers, setManagers] = useState<ManagerData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchManagers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://onboardingapi.ristestate.com/api/onboard/branches/${branch.id}/managers`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setManagers(data);
            }
        } catch (error) {
            console.error("Failed to fetch managers", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManagers();
    }, [branch.id]);

    const handleManagerAdded = () => {
        setShowAddManager(false);
        fetchManagers(); // Refresh list
    };

    return (
        <div className="animate-fadeIn space-y-8">
            {/* Header */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-xs mb-2">
                            <Store size={14} /> Branch Dashboard
                        </div>
                        <h2 className="text-4xl font-black">{branch.name}</h2>
                        <div className="flex items-center gap-2 mt-2 text-slate-400 font-medium text-sm">
                            <MapPin size={14} /> {branch.address}
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAddManager(true)}
                        className="px-6 py-3 bg-white text-slate-900 font-black rounded-xl hover:bg-emerald-50 transition-colors flex items-center gap-2 uppercase text-xs tracking-widest shadow-lg"
                    >
                        <UserPlus size={16} /> Add Personnel
                    </button>
                </div>

                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>

            {/* Managers List */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                        <Users size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black">Staff Management</h3>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Active Personnel</p>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-400 animate-pulse font-bold uppercase tracking-widest text-xs">Loading Personnel...</div>
                ) : managers.length === 0 ? (
                    <div className="bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={32} />
                        </div>
                        <h4 className="text-slate-900 dark:text-white font-bold">No Staff Assigned</h4>
                        <p className="text-slate-500 text-sm mt-1 mb-6">This branch currently has no active managers.</p>
                        <button
                            onClick={() => setShowAddManager(true)}
                            className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-xs hover:underline"
                        >
                            Assign First Manager
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {managers.map(manager => (
                            <div key={manager.id || Math.random()} className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 hover:shadow-xl hover:border-emerald-500/30 transition-all group">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-500 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-lg font-black text-slate-900 dark:text-white truncate">{manager.name}</h4>
                                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                                            Manager
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                                                <Mail size={14} className="text-slate-300" /> {manager.email}
                                            </div>
                                            {manager.phone && (
                                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                                                    <Phone size={14} className="text-slate-300" /> {manager.phone}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 border-l border-slate-100 dark:border-slate-800 pl-4 items-end ml-4">
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const token = localStorage.getItem('authToken');
                                                    const res = await fetch(`https://onboardingapi.ristestate.com/api/onboard/managers/${manager.id}`, {
                                                        method: 'DELETE',
                                                        headers: { 'Authorization': `Bearer ${token}` }
                                                    });
                                                    if (res.ok) fetchManagers();
                                                } catch (e) {
                                                    console.error(e);
                                                }
                                            }}
                                            className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 text-[10px] font-black uppercase tracking-widest transition-colors w-24 text-center"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-bold uppercase tracking-widest text-xs transition-colors">
                <ChevronLeft size={16} /> Back to Branches
            </button>

            {/* Add Manager Modal */}
            {showAddManager && (
                <SingleManagerForm
                    branchId={branch.id}
                    branchName={branch.name}
                    onSuccess={handleManagerAdded}
                    onCancel={() => setShowAddManager(false)}
                />
            )}
        </div>
    );
};

export default BranchDashboard;
