import React, { useState, useEffect } from 'react';
import { BranchData, ManagerData } from '../types';
import {
    Store, ChevronLeft, UserPlus, Users, MapPin, ShieldCheck, Mail, Phone,
    AlertCircle, Trash2, Sparkles, Clock, Hash, BarChart3, ShoppingBag,
    Package, MessageSquare, ExternalLink, Wifi, WifiOff, Settings,
    ArrowUpRight, Activity, FileText, Layers
} from 'lucide-react';
import SingleManagerForm from './SingleManagerForm';
import { API_ROUTES } from '../api';

interface Props {
    branch: BranchData;
    vendorName?: string;
    onBack: () => void;
}

const TABS = [
    { id: 'overview', label: 'Overview', icon: <Activity size={14} /> },
    { id: 'staff', label: 'Staff', icon: <Users size={14} /> },
    { id: 'links', label: 'Quick Access', icon: <Layers size={14} /> },
];

/* ── Stat tile ── */
const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color?: string; sub?: string }> = ({ label, value, icon, color = 'var(--em)', sub }) => (
    <div style={{
        borderRadius: 24, padding: '24px 26px',
        backgroundColor: 'var(--surface)', border: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', gap: 14,
        transition: 'all .3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: 1, position: 'relative', zIndex: 10,
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `${color}14`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
        </div>
        <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)', lineHeight: 1, fontFamily: "'Poppins',sans-serif" }}>{value}</div>
            {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, opacity: 0.5 }}>{sub}</div>}
        </div>
    </div>
);

/* ── Quick-link tile pointing to admin panel ── */
const QuickLink: React.FC<{ label: string; desc: string; icon: React.ReactNode; color: string; href?: string }> = ({ label, desc, icon, color, href }) => (
    <a
        href={href || 'https://branchportal.bezawcurbside.com'}
        target="_blank"
        rel="noopener noreferrer"
        style={{
            borderRadius: 24, padding: '24px 26px',
            backgroundColor: 'var(--surface)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'flex-start', gap: 16, cursor: 'pointer',
            textDecoration: 'none', color: 'inherit', transition: 'all .3s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: 1, position: 'relative', zIndex: 5,
            boxShadow: '0 4px 20px -5px rgba(0,0,0,0.2)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color + '50'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
    >
        <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: color + '14', border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text)', marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', opacity: 0.6, lineHeight: 1.4 }}>{desc}</div>
        </div>
        <ExternalLink size={14} style={{ color: 'var(--text-muted)', opacity: 0.3, flexShrink: 0, marginTop: 2 }} />
    </a>
);

const ADMIN_URL = 'https://branchportal.bezawcurbside.com';

const BranchDashboard: React.FC<Props> = ({ branch, vendorName, onBack }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [showAddManager, setShowAddManager] = useState(false);
    const [managers, setManagers] = useState<ManagerData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchManagers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const res = await fetch(API_ROUTES.BRANCH_MANAGERS(branch.id), {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setManagers(await res.json());
        } catch (e) {
            console.error('Failed to fetch managers', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchManagers(); }, [branch.id]);

    const deleteManager = async (id: string) => {
        if (!confirm('Remove this manager account?')) return;
        const token = localStorage.getItem('authToken');
        const res = await fetch(API_ROUTES.DELETE_MANAGER(id), { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) fetchManagers();
    };

    return (
        <div className="flex-1 flex flex-col gap-0 py-6 animate-fadeIn">

            {/* ══ HERO BANNER ══ */}
            <div className="rounded-[2.5rem] relative overflow-hidden border border-border mb-8 shadow-2xl"
                style={{ backgroundColor: 'var(--surface)', opacity: 1, zIndex: 1 }}>
                {/* decorative header stripe */}
                <div style={{ height: 4, background: 'var(--em)', opacity: 0.1 }} />
                {/* REMOVED GLOW ORB */}

                <div className="relative p-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    {/* Branch icon */}
                    <div style={{
                        width: 72, height: 72, borderRadius: 22, flexShrink: 0,
                        background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(16,185,129,0.15)',
                    }}>
                        <Store size={32} style={{ color: 'var(--em)' }} />
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--em)', boxShadow: '0 0 8px var(--em)' }} className="animate-pulse" />
                            <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--em)' }}>
                                {vendorName} · Branch Dashboard
                            </span>
                        </div>
                        <h2 className="font-display font-black text-4xl tracking-tighter mb-3">{branch.name}</h2>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4" style={{ fontSize: 12 }}>
                            <span className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                                <MapPin size={13} style={{ color: 'var(--em)' }} />
                                {branch.address}
                            </span>
                            {branch.phone && (
                                <span className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                                    <Phone size={13} style={{ color: 'var(--em)' }} />
                                    {branch.phone}
                                </span>
                            )}
                            {(branch.opening_hours || branch.openingHours) && (
                                <span className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                                    <Clock size={13} style={{ color: 'var(--em)' }} />
                                    {branch.opening_hours || branch.openingHours} – {branch.closing_hours || branch.closingHours}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Admin panel CTA */}
                    <a
                        href={ADMIN_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary flex items-center gap-2 rounded-2xl text-xs font-black uppercase tracking-widest"
                        style={{ padding: '0 22px', height: 48, textDecoration: 'none', flexShrink: 0 }}
                    >
                        <ArrowUpRight size={16} /> Open Branch Panel
                    </a>
                </div>

                {/* ── TABS ── */}
                <div className="flex border-t" style={{ borderColor: 'var(--border)' }}>
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                flex: 1, padding: '14px 8px',
                                fontSize: 11, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                                color: activeTab === tab.id ? 'var(--em)' : 'var(--text-muted)',
                                background: activeTab === tab.id ? 'rgba(16,185,129,0.06)' : 'transparent',
                                border: 'none', cursor: 'pointer', position: 'relative',
                                opacity: activeTab === tab.id ? 1 : 0.45, transition: 'all .2s',
                            }}
                        >
                            {tab.icon}{tab.label}
                            {activeTab === tab.id && (
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'var(--em)', borderRadius: '2px 2px 0 0' }} />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* ══ TAB CONTENT ══ */}

            {/* ── Overview ── */}
            {activeTab === 'overview' && (
                <div className="animate-fadeIn flex flex-col gap-6">
                    {/* Stats row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard label="Staff" value={loading ? '…' : managers.length} icon={<Users size={16} />} sub="active managers" />
                        <StatCard label="Branch ID" value={branch.id?.slice(-6) || '—'} icon={<Hash size={16} />} sub="internal code" color="#6366f1" />
                        <StatCard label="Status" value="Active" icon={<Wifi size={16} />} sub="online & serving" color="#10b981" />
                        <StatCard label="Hours" value={(branch.opening_hours || branch.openingHours) ? '✓ Set' : 'Not set'} icon={<Clock size={16} />} sub={(branch.opening_hours || branch.openingHours) ? `${branch.opening_hours || branch.openingHours} – ${branch.closing_hours || branch.closingHours}` : 'check schedule'} color="#f59e0b" />
                    </div>

                    {/* Info card */}
                    <div className="rounded-[2.5rem] border border-border overflow-hidden shadow-2xl" style={{ backgroundColor: 'var(--surface)', opacity: 1, position: 'relative', zIndex: 1 }}>
                        <div className="px-8 py-6 border-b flex items-center gap-3" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                            <Store size={18} style={{ color: 'var(--em)' }} />
                            <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Branch Details</span>
                        </div>
                        <div className="p-10 grid grid-cols-1 sm:grid-cols-2 gap-8" style={{ backgroundColor: 'var(--surface)' }}>
                            {[
                                { label: 'Full Name', value: branch.name, icon: <Store size={13} /> },
                                { label: 'Address', value: branch.address, icon: <MapPin size={13} /> },
                                { label: 'Phone', value: branch.phone || 'Not set', icon: <Phone size={13} /> },
                                { label: 'GPS', value: branch.coordinates || branch.map_pin || 'Not set', icon: <MapPin size={13} /> },
                                { label: 'Opening Time', value: branch.opening_hours || branch.openingHours || 'Not set', icon: <Clock size={13} /> },
                                { label: 'Closing Time', value: branch.closing_hours || branch.closingHours || 'Not set', icon: <Clock size={13} /> },
                            ].map((row, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--em)' }}>
                                        {row.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 3 }}>{row.label}</div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{row.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Staff ── */}
            {activeTab === 'staff' && (
                <div className="animate-fadeIn flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Users size={18} style={{ color: 'var(--em)' }} />
                            </div>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Personnel</div>
                                <div style={{ fontSize: 9, fontWeight: 700, opacity: 0.3, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{managers.length} active account{managers.length !== 1 ? 's' : ''}</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowAddManager(true)}
                            className="btn-primary rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2"
                            style={{ padding: '0 20px', height: 44 }}
                        >
                            <UserPlus size={16} /> Add Manager
                        </button>
                    </div>

                    {loading ? (
                        <div className="rounded-[2rem] p-20 flex flex-col items-center gap-4 border border-border shadow-md" style={{ background: 'var(--surface)' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(16,185,129,0.3)', borderTopColor: 'var(--em)', animation: 'spin 1s linear infinite' }} />
                            <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.3 }}>Loading accounts...</span>
                        </div>
                    ) : managers.length === 0 ? (
                        <div style={{ borderRadius: 28, padding: '60px 32px', border: '2px dashed rgba(16,185,129,0.18)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 20 }}>
                            <div style={{ width: 60, height: 60, borderRadius: 18, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                                <AlertCircle size={28} />
                            </div>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>No Staff Assigned</div>
                                <div style={{ fontSize: 12, opacity: 0.4, maxWidth: 340, lineHeight: 1.6 }}>No manager accounts yet. Add a manager to let staff handle orders and operations through the Branch Panel.</div>
                            </div>
                            <button onClick={() => setShowAddManager(true)} className="btn-primary rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2" style={{ padding: '0 24px', height: 46 }}>
                                <UserPlus size={14} /> Assign First Manager
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {managers.map(mgr => (
                                <div key={mgr.id} className="group rounded-[2rem] border border-border relative overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-sm" style={{ background: 'var(--surface)' }}>
                                    <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, var(--em), transparent)', opacity: 0.4 }} />
                                    <div className="p-6 flex flex-col gap-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div style={{ width: 46, height: 46, borderRadius: 14, background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.04))', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <ShieldCheck size={22} style={{ color: 'var(--em)' }} />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{mgr.name}</div>
                                                    <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--em)', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 99, padding: '2px 8px', display: 'inline-block', marginTop: 3 }}>Manager</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => deleteManager(mgr.id)}
                                                title="Remove account"
                                                style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid rgba(239,68,68,0.12)', background: 'rgba(239,68,68,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s', color: 'rgba(239,68,68,0.4)' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.04)'; e.currentTarget.style.color = 'rgba(239,68,68,0.4)'; }}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                                                <Mail size={13} style={{ color: 'var(--em)', opacity: 0.5, flexShrink: 0 }} />
                                                <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mgr.email}</span>
                                            </div>
                                            {mgr.phone && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                                                    <Phone size={13} style={{ color: 'var(--em)', opacity: 0.5, flexShrink: 0 }} />
                                                    <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.6 }}>{mgr.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Quick Access ── */}
            {activeTab === 'links' && (
                <div className="animate-fadeIn flex flex-col gap-6">
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
                        The full operational panel for this branch is in the <strong style={{ color: 'var(--em)' }}>Bezaw Branch Admin</strong>.
                        Click any tile below to open that section directly.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <QuickLink label="Live Orders" icon={<ShoppingBag size={18} />} desc="View and manage real-time order queue, accept or reject orders" color="#10b981" href={ADMIN_URL} />
                        <QuickLink label="Inventory" icon={<Package size={18} />} desc="Manage products, categories, stock levels and availability" color="#6366f1" href={ADMIN_URL} />
                        <QuickLink label="Performance" icon={<BarChart3 size={18} />} desc="Revenue charts, daily order count and performance analytics" color="#f59e0b" href={ADMIN_URL} />
                        <QuickLink label="Feedback" icon={<MessageSquare size={18} />} desc="Customer ratings and comments for this branch" color="#06b6d4" href={ADMIN_URL} />
                        <QuickLink label="Reports" icon={<FileText size={18} />} desc="Exportable sales reports and operational summaries" color="#8b5cf6" href={ADMIN_URL} />
                        <QuickLink label="Settings" icon={<Settings size={18} />} desc="Branch status (busy/active), operating hours and config" color="#ef4444" href={ADMIN_URL} />
                    </div>

                    {/* Admin panel CTA */}
                    <div style={{
                        borderRadius: 24, padding: '32px',
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--border)',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
                        position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{ position: 'relative', zIndex: 2 }}>
                            <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--em)', marginBottom: 8 }}>Full Operations Panel</div>
                            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 6 }}>Bezaw Branch Admin Dashboard</div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)', opacity: 0.8 }}>Live orders · Inventory · Analytics · Gifts · Runners</div>
                        </div>
                        <a
                            href={ADMIN_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2"
                            style={{ padding: '0 24px', height: 48, textDecoration: 'none', flexShrink: 0 }}
                        >
                            <ArrowUpRight size={16} /> Open Admin Panel
                        </a>
                    </div>
                </div>
            )}

            {/* Back */}
            <button
                onClick={onBack}
                className="self-center mt-10 flex items-center gap-2 text-[10px] font-black tracking-widest uppercase opacity-40 hover:opacity-100 hover:text-brand-emerald transition-all"
                style={{ padding: '12px 24px' }}
            >
                <ChevronLeft size={14} /> Back to Branch Portal
            </button>

            {/* Add Manager Modal */}
            {showAddManager && (
                <SingleManagerForm
                    branchId={branch.id} branchName={branch.name}
                    onSuccess={() => { setShowAddManager(false); fetchManagers(); }}
                    onCancel={() => setShowAddManager(false)}
                />
            )}

            {/* Footer */}
            <div className="self-center flex items-center gap-2 mt-6 opacity-20" style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                <Sparkles size={11} className="text-brand-emerald" />
                Live Network Connection Established
            </div>
        </div>
    );
};

export default BranchDashboard;
