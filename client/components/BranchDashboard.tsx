
import React, { useState, useEffect } from 'react';
import { BranchData, ManagerData } from '../types';
import { Store, ChevronLeft, UserPlus, Users, MapPin, ShieldCheck, Mail, Phone, AlertCircle } from 'lucide-react';
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
            const response = await fetch(`http://localhost:5002/api/onboard/branches/${branch.id}/managers`, {
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
        <div className="animate-fadeIn space-y-3">
            {/* Header */}
            <div className="bg-slate-900 rounded-lg p-2.5 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                    <div>
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-widest text-[8px] mb-0.5">
                            <Store size={10} /> {vendorName || 'Partner'} Dashboard
                        </div>
                        <h2 className="text-base font-bold">{branch.name}</h2>
                        <div className="flex items-center gap-1.5 mt-0.5 text-slate-400 font-medium text-[10px]">
                            <MapPin size={10} /> {branch.address}
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAddManager(true)}
                        className="px-3 py-1.5 bg-white text-slate-900 font-bold rounded-lg hover:bg-emerald-50 transition-colors flex items-center gap-2 uppercase text-[9px] tracking-widest shadow-lg"
                    >
                        <UserPlus size={14} /> Add Personnel
                    </button>
                </div>

                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>

            {/* Managers List */}
            <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                    <div className="w-7 h-7 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
                        <Users size={14} />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-tight">Staff Management</h3>
                        <p className="text-slate-500 text-[8px] font-bold uppercase tracking-widest">Active Personnel</p>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-400 animate-pulse font-bold uppercase tracking-widest text-xs">Loading Personnel...</div>
                ) : managers.length === 0 ? (
                    <div className="bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={32} />
                        </div>
                        <h4 className="text-slate-900 dark:text-white font-bold">No Staff Assigned</h4>
                        <p className="text-slate-500 text-sm mt-1 mb-6">This branch currently has no active managers.</p>
                        <button
                            onClick={() => setShowAddManager(true)}
                            className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-[10px] hover:underline"
                        >
                            Assign First Manager
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {managers.map(manager => (
                            <div key={manager.id || Math.random()} className="bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-xl p-3 hover:shadow-lg hover:border-emerald-500/30 transition-all group">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-500 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <ShieldCheck size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[13px] font-bold text-slate-900 dark:text-white truncate">{manager.name}</h4>
                                        <div className="flex items-center gap-2 text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-0.5">
                                            Manager
                                        </div>

                                        <div className="mt-1.5 space-y-0.5">
                                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                                                <Mail size={12} className="text-slate-300" /> {manager.email}
                                            </div>
                                            {manager.phone && (
                                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                                                    <Phone size={12} className="text-slate-300" /> {manager.phone}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 border-l border-slate-100 dark:border-slate-800 pl-3 items-end ml-3">
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const token = localStorage.getItem('authToken');
                                                    const res = await fetch(`http://localhost:5002/api/onboard/managers/${manager.id}`, {
                                                        method: 'DELETE',
                                                        headers: { 'Authorization': `Bearer ${token}` }
                                                    });
                                                    if (res.ok) fetchManagers();
                                                } catch (e) {
                                                    console.error(e);
                                                }
                                            }}
                                            className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 text-[9px] font-bold uppercase tracking-widest transition-colors w-20 text-center"
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

            <button onClick={onBack} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-bold uppercase tracking-widest text-[10px] transition-colors">
                <ChevronLeft size={14} /> Back to Branches
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
