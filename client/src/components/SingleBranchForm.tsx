import React, { useState, useEffect } from 'react';
import { Store, MapPin, Phone, Wand2, X, Plus, Clock, Navigation, Building, CheckCircle2, Sparkles } from 'lucide-react';
import { suggestCoordinates } from '../services/geminiService';
import { API_ROUTES } from '../api';

interface Props {
    vendorId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

const STEPS = ['Identity', 'Location', 'Schedule'];

/* ── Reusable input wrapper ── */
const Field: React.FC<{
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    hint?: string;
    action?: React.ReactNode;
    required?: boolean;
}> = ({ label, icon, children, hint, action, required }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 2, paddingRight: 2 }}>
            <span style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 10, fontWeight: 900, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: 'var(--text-muted)',
            }}>
                {icon}{label}
                {required && <span style={{ color: 'var(--em)', marginLeft: 2 }}>*</span>}
            </span>
            {action}
        </div>
        {children}
        {hint && <span style={{ fontSize: 10, color: 'var(--text-muted)', opacity: 0.5, paddingLeft: 4 }}>{hint}</span>}
    </div>
);

const SingleBranchForm: React.FC<Props> = ({ vendorId, onSuccess, onCancel }) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [coordinates, setCoordinates] = useState('');
    const [phone, setPhone] = useState('');
    const [openingHours, setOpeningHours] = useState('08:00');
    const [closingHours, setClosingHours] = useState('22:00');
    const [loading, setLoading] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [step, setStep] = useState(0);

    // Prevent body scroll when modal is open
    useEffect(() => {
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = original; };
    }, []);

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
            const res = await fetch(API_ROUTES.BRANCHES(vendorId), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ name, address, coordinates, phone, openingHours, closingHours })
            });
            if (!res.ok) throw new Error('Failed');
            onSuccess();
        } catch {
            alert('Failed to add branch. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const canProceed = [name.trim().length > 0, address.trim().length > 0, true];
    const isLast = step === 2;

    const fmt = (t: string) => {
        if (!t) return '—';
        const [h, m] = t.split(':').map(Number);
        return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
    };

    /* ──────────────────────────────────────────────────
       OUTER OVERLAY — full screen, scrollable,
       padded so it never goes under the navbar
    ────────────────────────────────────────────────── */
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 200,               /* well above navbar z-40 */
                background: 'rgba(0,0,0,0.82)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                overflowY: 'auto',
                display: 'flex',
                alignItems: 'flex-start',  /* top-align so scroll works */
                justifyContent: 'center',
                padding: '80px 16px 40px', /* 80px top = clears navbar */
            }}
            onClick={(e) => e.target === e.currentTarget && onCancel()}
        >
            {/* ── CARD ── */}
            <div
                className="animate-slideUp"
                style={{
                    width: '100%',
                    maxWidth: 640,
                    borderRadius: 32,
                    overflow: 'hidden',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 64px 128px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
                    flexShrink: 0,
                }}
            >
                {/* ══ HERO HEADER ══ */}
                <div style={{
                    position: 'relative',
                    overflow: 'hidden',
                    height: 164,
                    background: 'linear-gradient(145deg, #080f1e 0%, #0f1f3a 45%, #091628 100%)',
                }}>
                    {/* fine grid */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }} />
                    {/* glow orbs */}
                    <div style={{
                        position: 'absolute', top: -100, right: -80,
                        width: 360, height: 360, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 65%)',
                        pointerEvents: 'none',
                    }} />
                    <div style={{
                        position: 'absolute', bottom: -80, left: 40,
                        width: 240, height: 240, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)',
                        pointerEvents: 'none',
                    }} />

                    {/* close button */}
                    <button
                        onClick={onCancel}
                        style={{
                            position: 'absolute', top: 18, right: 18, zIndex: 10,
                            width: 38, height: 38, borderRadius: '50%',
                            background: 'rgba(255,255,255,0.07)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', transition: 'all .2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                    >
                        <X size={15} color="rgba(255,255,255,0.65)" />
                    </button>

                    {/* title row */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        padding: '0 32px 28px',
                        display: 'flex', alignItems: 'flex-end', gap: 18,
                    }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: 18, flexShrink: 0,
                            background: 'rgba(16,185,129,0.14)',
                            border: '1px solid rgba(16,185,129,0.32)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(16,185,129,0.2)',
                        }}>
                            <Building size={26} color="var(--em)" />
                        </div>
                        <div>
                            <div style={{
                                fontSize: 9, fontWeight: 900, letterSpacing: '0.28em',
                                textTransform: 'uppercase', color: 'var(--em)', opacity: 0.7, marginBottom: 6,
                                display: 'flex', alignItems: 'center', gap: 6,
                            }}>
                                <Sparkles size={10} />
                                Bezaw Partner Network · Branch Setup
                            </div>
                            <h2 style={{
                                margin: 0, fontFamily: "'Poppins', sans-serif",
                                fontWeight: 900, fontSize: 24, color: '#fff',
                                letterSpacing: '-0.5px', lineHeight: 1.1,
                            }}>
                                Register New Branch
                            </h2>
                        </div>
                    </div>
                </div>

                {/* ══ STEP TABS ══ */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
                    {STEPS.map((tab, i) => {
                        const done = i < step;
                        const active = i === step;
                        return (
                            <button
                                key={i}
                                type="button"
                                onClick={() => done && setStep(i)}
                                style={{
                                    flex: 1, padding: '14px 6px',
                                    fontSize: 10, fontWeight: 900,
                                    letterSpacing: '0.12em', textTransform: 'uppercase',
                                    color: active ? 'var(--em)' : 'var(--text-muted)',
                                    background: active ? 'rgba(16,185,129,0.06)' : 'transparent',
                                    border: 'none', cursor: done ? 'pointer' : 'default',
                                    opacity: active ? 1 : done ? 0.75 : 0.38,
                                    position: 'relative', transition: 'all .2s',
                                }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                                    <span style={{
                                        width: 20, height: 20, borderRadius: '50%',
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 9, fontWeight: 900, flexShrink: 0, transition: 'all .25s',
                                        background: done ? 'rgba(16,185,129,0.18)' : active ? 'var(--em)' : 'var(--border)',
                                        color: done ? 'var(--em)' : active ? (document.documentElement.classList.contains('dark') ? '#020617' : '#fff') : 'var(--text-muted)',
                                    }}>
                                        {done ? <CheckCircle2 size={11} /> : i + 1}
                                    </span>
                                    {tab}
                                </span>
                                {active && (
                                    <div style={{
                                        position: 'absolute', bottom: 0, left: 0, right: 0,
                                        height: 2, background: 'var(--em)', borderRadius: '2px 2px 0 0',
                                    }} />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ══ FORM BODY ══ */}
                <form onSubmit={handleSubmit}>
                    <div style={{ padding: '32px 36px', minHeight: 310 }}>

                        {/* ─── STEP 0: Identity ─── */}
                        {step === 0 && (
                            <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                    Give your branch a name that staff and customers will recognize instantly.
                                </p>

                                {/* Branch name */}
                                <Field label="Branch Name" icon={<Store size={11} />} required hint="Use the area name for easier identification (e.g. BOLE, PIASSA)">
                                    <div style={{ position: 'relative' }}>
                                        <Store size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--em)', opacity: 0.5, pointerEvents: 'none' }} />
                                        <input
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="E.g. BOLE MEDHANIALEM BRANCH"
                                            autoFocus
                                            className="input-field"
                                            style={{ paddingLeft: 46, height: 56, fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}
                                        />
                                    </div>
                                </Field>

                                {/* Phone */}
                                <Field label="Direct Hotline" icon={<Phone size={11} />} hint="Optional — branch-specific contact number">
                                    <div style={{ position: 'relative' }}>
                                        <Phone size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--em)', opacity: 0.5, pointerEvents: 'none' }} />
                                        <input
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            placeholder="+251 91 234 5678"
                                            className="input-field"
                                            style={{ paddingLeft: 46, height: 56, fontSize: 14, fontWeight: 600 }}
                                        />
                                    </div>
                                </Field>
                            </div>
                        )}

                        {/* ─── STEP 1: Location ─── */}
                        {step === 1 && (
                            <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                    Provide the physical address. Use AI to auto-fill GPS coordinates from the address.
                                </p>

                                {/* Address */}
                                <Field label="Physical Address" icon={<MapPin size={11} />} required hint="Include street, landmark and neighborhood">
                                    <div style={{ position: 'relative' }}>
                                        <MapPin size={16} style={{ position: 'absolute', left: 16, top: 18, color: 'var(--em)', opacity: 0.5, pointerEvents: 'none' }} />
                                        <textarea
                                            value={address}
                                            onChange={e => setAddress(e.target.value)}
                                            placeholder="E.g. Bole Road, near Atlas Hotel, Addis Ababa"
                                            className="input-field"
                                            style={{ paddingLeft: 46, paddingTop: 16, height: 104, fontSize: 14, fontWeight: 600, resize: 'none' }}
                                        />
                                    </div>
                                </Field>

                                {/* Coordinates */}
                                <Field
                                    label="GPS Coordinates"
                                    icon={<Navigation size={11} />}
                                    hint="Decimal degrees format · lat, lng"
                                    action={
                                        <button
                                            type="button"
                                            onClick={handleAISuggest}
                                            disabled={!address || isSuggesting}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 5,
                                                fontSize: 10, fontWeight: 900, letterSpacing: '0.12em',
                                                textTransform: 'uppercase', color: 'var(--em)',
                                                opacity: !address ? 0.3 : 1,
                                                cursor: !address ? 'not-allowed' : 'pointer',
                                                background: 'none', border: 'none',
                                                padding: 0, transition: 'opacity .2s',
                                            }}
                                        >
                                            <Wand2 size={11} className={isSuggesting ? 'animate-spin' : ''} />
                                            {isSuggesting ? 'AI Thinking...' : '✦ AI Auto-Fill'}
                                        </button>
                                    }
                                >
                                    <div style={{ position: 'relative' }}>
                                        <span style={{
                                            position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                                            fontSize: 9, fontWeight: 900, fontFamily: 'monospace', letterSpacing: '0.1em',
                                            color: 'var(--text-muted)', opacity: 0.4,
                                        }}>LAT,LNG</span>
                                        <input
                                            value={coordinates}
                                            onChange={e => setCoordinates(e.target.value)}
                                            placeholder="9.0247, 38.7468"
                                            className="input-field"
                                            style={{ paddingLeft: 68, height: 56, fontSize: 14, fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.05em' }}
                                        />
                                    </div>
                                </Field>
                            </div>
                        )}

                        {/* ─── STEP 2: Schedule ─── */}
                        {step === 2 && (
                            <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                    Set the operating hours so customers see accurate availability windows.
                                </p>

                                {/* Time cards */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    {/* Opening */}
                                    <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(16,185,129,0.22)', background: 'rgba(16,185,129,0.04)' }}>
                                        <div style={{
                                            padding: '12px 18px 10px',
                                            borderBottom: '1px solid rgba(16,185,129,0.12)',
                                            display: 'flex', alignItems: 'center', gap: 7,
                                        }}>
                                            <Clock size={12} color="var(--em)" />
                                            <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--em)', opacity: 0.75 }}>Opens at</span>
                                        </div>
                                        <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                                            <div style={{ fontSize: 32, fontWeight: 900, fontFamily: 'monospace', color: 'var(--em)', letterSpacing: '-0.5px', lineHeight: 1 }}>
                                                {fmt(openingHours)}
                                            </div>
                                            <input
                                                type="time"
                                                value={openingHours}
                                                onChange={e => setOpeningHours(e.target.value)}
                                                className="input-field"
                                                style={{
                                                    width: '100%', height: 40, textAlign: 'center',
                                                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                                    borderColor: 'rgba(16,185,129,0.25)',
                                                    background: 'rgba(16,185,129,0.07)',
                                                    color: 'var(--text)',
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Closing */}
                                    <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(239,68,68,0.22)', background: 'rgba(239,68,68,0.04)' }}>
                                        <div style={{
                                            padding: '12px 18px 10px',
                                            borderBottom: '1px solid rgba(239,68,68,0.12)',
                                            display: 'flex', alignItems: 'center', gap: 7,
                                        }}>
                                            <Clock size={12} color="#ef4444" />
                                            <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#ef4444', opacity: 0.75 }}>Closes at</span>
                                        </div>
                                        <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                                            <div style={{ fontSize: 32, fontWeight: 900, fontFamily: 'monospace', color: '#ef4444', letterSpacing: '-0.5px', lineHeight: 1 }}>
                                                {fmt(closingHours)}
                                            </div>
                                            <input
                                                type="time"
                                                value={closingHours}
                                                onChange={e => setClosingHours(e.target.value)}
                                                className="input-field"
                                                style={{
                                                    width: '100%', height: 40, textAlign: 'center',
                                                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                                    borderColor: 'rgba(239,68,68,0.25)',
                                                    background: 'rgba(239,68,68,0.06)',
                                                    color: 'var(--text)',
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Review card */}
                                <div style={{
                                    borderRadius: 18, padding: '18px 22px',
                                    background: 'rgba(16,185,129,0.04)',
                                    border: '1px solid var(--border)',
                                }}>
                                    <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>
                                        ✦ Registration Preview
                                    </div>
                                    {[
                                        { label: 'Branch', value: name || '—', icon: <Store size={10} /> },
                                        { label: 'Address', value: address || '—', icon: <MapPin size={10} /> },
                                        { label: 'Phone', value: phone || 'Not set', icon: <Phone size={10} /> },
                                        { label: 'Hours', value: `${fmt(openingHours)} → ${fmt(closingHours)}`, icon: <Clock size={10} /> },
                                    ].map((row, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10, fontSize: 12 }}>
                                            <span style={{ color: 'var(--em)', opacity: 0.55, marginTop: 1, flexShrink: 0 }}>{row.icon}</span>
                                            <span style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 9, color: 'var(--text-muted)', width: 50, flexShrink: 0, marginTop: 1 }}>{row.label}</span>
                                            <span style={{ fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, minWidth: 0 }}>{row.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ══ FOOTER ══ */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '18px 36px 24px',
                        borderTop: '1px solid var(--border)',
                    }}>
                        {step > 0 && (
                            <button
                                type="button"
                                onClick={() => setStep(s => s - 1)}
                                className="btn-ghost"
                                style={{ borderRadius: 16, fontSize: 11, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 22px', height: 46 }}
                            >
                                ← Back
                            </button>
                        )}

                        {/* animated progress dots */}
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 6 }}>
                            {STEPS.map((_, i) => (
                                <div key={i} style={{
                                    height: 6, borderRadius: 99,
                                    width: i === step ? 24 : 6,
                                    background: i === step ? 'var(--em)' : i < step ? 'rgba(16,185,129,0.35)' : 'var(--border)',
                                    transition: 'all .3s cubic-bezier(.4,0,.2,1)',
                                }} />
                            ))}
                        </div>

                        {!isLast ? (
                            <button
                                type="button"
                                onClick={() => { if (canProceed[step]) setStep(s => s + 1); }}
                                disabled={!canProceed[step]}
                                className="btn-primary"
                                style={{
                                    borderRadius: 16, fontSize: 11, fontWeight: 900,
                                    letterSpacing: '0.1em', textTransform: 'uppercase',
                                    padding: '0 28px', height: 46, minWidth: 140,
                                    opacity: canProceed[step] ? 1 : 0.35,
                                    cursor: canProceed[step] ? 'pointer' : 'not-allowed',
                                }}
                            >
                                Continue →
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading || !name || !address}
                                className="btn-primary"
                                style={{
                                    borderRadius: 16, fontSize: 11, fontWeight: 900,
                                    letterSpacing: '0.1em', textTransform: 'uppercase',
                                    padding: '0 28px', height: 46, minWidth: 180,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                }}
                            >
                                {loading ? (
                                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 1s linear infinite' }} />
                                ) : (
                                    <>
                                        <Plus size={15} />
                                        Confirm & Register
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SingleBranchForm;
