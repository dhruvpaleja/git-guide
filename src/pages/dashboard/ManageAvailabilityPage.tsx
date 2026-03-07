import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PractitionerSidebar } from '@/features/dashboard/components/PractitionerSidebar';
import {
    ChevronLeft, Clock, Save, Wifi, WifiOff, Check, Loader2, ToggleLeft, ToggleRight,
} from 'lucide-react';
import { therapyApi } from '@/services/therapy.api';
import type { AvailabilitySlot } from '@/types/therapy.types';

/* ── Constants ───────────────────────────────────────────────── */

const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_SHORT  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TIME_OPTIONS: string[] = [];
for (let h = 6; h <= 22; h++) {
    for (const m of ['00', '30']) {
        const label = `${h.toString().padStart(2, '0')}:${m}`;
        TIME_OPTIONS.push(label);
    }
}

function buildDefaultSlots(): AvailabilitySlot[] {
    return Array.from({ length: 7 }, (_, i) => ({
        dayOfWeek: i,
        startTime: '09:00',
        endTime: '17:00',
        slotDuration: 60,
        breakAfterSlot: 15,
        isActive: i < 5, // Mon-Fri active by default
    }));
}

/* ── Skeleton ────────────────────────────────────────────────── */

function SkeletonRow() {
    return (
        <div className="flex items-center gap-4 py-5 px-4 animate-pulse">
            <div className="w-20 h-5 bg-gray-200 rounded-md" />
            <div className="w-10 h-6 bg-gray-200 rounded-full" />
            <div className="flex-1 flex items-center gap-3">
                <div className="w-28 h-9 bg-gray-100 rounded-lg" />
                <div className="w-6 h-4 bg-gray-100 rounded" />
                <div className="w-28 h-9 bg-gray-100 rounded-lg" />
            </div>
            <div className="w-16 h-5 bg-gray-100 rounded" />
        </div>
    );
}

/* ── Component ───────────────────────────────────────────────── */

export default function ManageAvailabilityPage() {
    useDocumentTitle('Manage Availability');

    const [slots, setSlots] = useState<AvailabilitySlot[]>(buildDefaultSlots);
    const [isOnline, setIsOnline] = useState(false);
    const [isAcceptingNow, setIsAcceptingNow] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [statusSaving, setStatusSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /* ── Load availability from API ── */
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await therapyApi.getTherapistAvailability();
                if (!cancelled && res.data) {
                    const apiSlots = res.data as AvailabilitySlot[];
                    if (apiSlots.length > 0) {
                        // Merge API slots into full 7-day grid
                        const merged = buildDefaultSlots();
                        for (const s of apiSlots) {
                            if (s.dayOfWeek >= 0 && s.dayOfWeek <= 6) {
                                merged[s.dayOfWeek] = { ...merged[s.dayOfWeek], ...s };
                            }
                        }
                        setSlots(merged);
                    }
                }
            } catch {
                // Use defaults on error
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    /* ── Slot updaters ── */
    const updateSlot = useCallback((dayOfWeek: number, patch: Partial<AvailabilitySlot>) => {
        setSaved(false);
        setSlots(prev => prev.map(s => s.dayOfWeek === dayOfWeek ? { ...s, ...patch } : s));
    }, []);

    const toggleDay = useCallback((dayOfWeek: number) => {
        setSaved(false);
        setSlots(prev => prev.map(s => s.dayOfWeek === dayOfWeek ? { ...s, isActive: !s.isActive } : s));
    }, []);

    /* ── Save availability ── */
    const handleSave = useCallback(async () => {
        setSaving(true);
        setError(null);
        try {
            await therapyApi.updateTherapistAvailability(slots);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch {
            setError('Failed to save availability. Please try again.');
        } finally {
            setSaving(false);
        }
    }, [slots]);

    /* ── Online status toggle ── */
    const handleOnlineToggle = useCallback(async () => {
        setStatusSaving(true);
        try {
            const newVal = !isOnline;
            await therapyApi.updateOnlineStatus({ isOnline: newVal, isAcceptingNow: newVal ? isAcceptingNow : false });
            setIsOnline(newVal);
            if (!newVal) setIsAcceptingNow(false);
        } catch {
            // Revert silently
        } finally {
            setStatusSaving(false);
        }
    }, [isOnline, isAcceptingNow]);

    const handleAcceptingNowToggle = useCallback(async () => {
        if (!isOnline) return;
        setStatusSaving(true);
        try {
            const newVal = !isAcceptingNow;
            await therapyApi.updateOnlineStatus({ isOnline, isAcceptingNow: newVal });
            setIsAcceptingNow(newVal);
        } catch {
            // Revert silently
        } finally {
            setStatusSaving(false);
        }
    }, [isOnline, isAcceptingNow]);

    /* ── Active day count ── */
    const activeDays = slots.filter(s => s.isActive).length;

    return (
        <div className="min-h-screen bg-[#F5F5F7] flex font-sans">
            <PractitionerSidebar />

            <main className="flex-1 ml-20 md:ml-24 overflow-y-auto">
                {/* ─── Page Content ─── */}
                <div className="px-6 md:px-10 py-6 max-w-5xl">
                    {/* Breadcrumb */}
                    <span className="text-xs text-gray-400 font-medium">Practitioner Dashboard</span>

                    {/* Title Row */}
                    <div className="flex items-start justify-between mt-1 mb-6">
                        <div className="flex items-center gap-3">
                            <Link to="/practitioner" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors bg-white">
                                <ChevronLeft className="w-4 h-4 text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-3xl md:text-[36px] font-bold text-gray-900 leading-tight">Manage Availability</h1>
                                <p className="text-[13px] text-gray-400 mt-1 max-w-lg leading-relaxed">
                                    Set your weekly hours, toggle days on/off, and control your online status.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ─── Online Status Card ─── */}
                    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isOnline ? 'bg-emerald-50' : 'bg-gray-100'}`}>
                                    {isOnline ? <Wifi className="w-6 h-6 text-emerald-600" /> : <WifiOff className="w-6 h-6 text-gray-400" />}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">Online Status</h3>
                                    <p className="text-[13px] text-gray-500 mt-0.5">
                                        {isOnline ? 'You are visible to clients' : 'You are offline — clients cannot see you'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                {/* Accepting Instant Calls */}
                                <div className={`flex items-center gap-2 transition-opacity ${isOnline ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                                    <span className="text-sm text-gray-600 font-medium">Instant calls</span>
                                    <button
                                        onClick={handleAcceptingNowToggle}
                                        disabled={statusSaving || !isOnline}
                                        className="focus:outline-none"
                                        aria-label="Toggle accepting instant calls"
                                    >
                                        {isAcceptingNow
                                            ? <ToggleRight className="w-9 h-9 text-emerald-500" />
                                            : <ToggleLeft className="w-9 h-9 text-gray-300" />
                                        }
                                    </button>
                                </div>

                                {/* Online Toggle */}
                                <button
                                    onClick={handleOnlineToggle}
                                    disabled={statusSaving}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${isOnline
                                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                                >
                                    {statusSaving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
                                    )}
                                    {isOnline ? 'Online' : 'Go Online'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ─── Weekly Schedule Card ─── */}
                    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Weekly Schedule</h2>
                                    <p className="text-[12px] text-gray-400">{activeDays} day{activeDays !== 1 ? 's' : ''} active</p>
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={saving || saved}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${saved
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-[#2C2F7A] text-white hover:bg-[#24276B]'
                                }`}
                            >
                                {saving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : saved ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Schedule'}
                            </button>
                        </div>

                        {error && (
                            <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 font-medium">
                                {error}
                            </div>
                        )}

                        {/* Schedule rows */}
                        <div className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 7 }).map((_, i) => <SkeletonRow key={i} />)
                            ) : (
                                slots.map(slot => (
                                    <div
                                        key={slot.dayOfWeek}
                                        className={`flex items-center gap-4 py-4 px-6 transition-colors ${slot.isActive ? 'bg-white' : 'bg-gray-50/60'}`}
                                    >
                                        {/* Day name */}
                                        <div className="w-20 shrink-0">
                                            <span className={`text-sm font-bold ${slot.isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {DAY_SHORT[slot.dayOfWeek]}
                                            </span>
                                            <span className="hidden md:inline text-sm text-gray-400 font-normal ml-0.5">
                                                {DAY_LABELS[slot.dayOfWeek].slice(3)}
                                            </span>
                                        </div>

                                        {/* Active toggle */}
                                        <button
                                            onClick={() => toggleDay(slot.dayOfWeek)}
                                            className="focus:outline-none shrink-0"
                                            aria-label={`Toggle ${DAY_LABELS[slot.dayOfWeek]}`}
                                        >
                                            {slot.isActive
                                                ? <ToggleRight className="w-10 h-6 text-indigo-500" />
                                                : <ToggleLeft className="w-10 h-6 text-gray-300" />
                                            }
                                        </button>

                                        {/* Time range inputs */}
                                        <div className={`flex items-center gap-3 flex-1 transition-opacity ${slot.isActive ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                                            <select
                                                value={slot.startTime}
                                                onChange={e => updateSlot(slot.dayOfWeek, { startTime: e.target.value })}
                                                className="px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all cursor-pointer"
                                            >
                                                {TIME_OPTIONS.map(t => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>

                                            <span className="text-xs font-semibold text-gray-400">to</span>

                                            <select
                                                value={slot.endTime}
                                                onChange={e => updateSlot(slot.dayOfWeek, { endTime: e.target.value })}
                                                className="px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all cursor-pointer"
                                            >
                                                {TIME_OPTIONS.map(t => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>

                                            {/* Slot duration */}
                                            <div className="hidden lg:flex items-center gap-2 ml-4">
                                                <span className="text-[11px] text-gray-400 font-medium">Slot</span>
                                                <select
                                                    value={slot.slotDuration ?? 60}
                                                    onChange={e => updateSlot(slot.dayOfWeek, { slotDuration: Number(e.target.value) })}
                                                    className="px-2 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer"
                                                >
                                                    <option value={30}>30 min</option>
                                                    <option value={45}>45 min</option>
                                                    <option value={60}>60 min</option>
                                                    <option value={90}>90 min</option>
                                                </select>
                                            </div>

                                            {/* Break after slot */}
                                            <div className="hidden lg:flex items-center gap-2">
                                                <span className="text-[11px] text-gray-400 font-medium">Break</span>
                                                <select
                                                    value={slot.breakAfterSlot ?? 15}
                                                    onChange={e => updateSlot(slot.dayOfWeek, { breakAfterSlot: Number(e.target.value) })}
                                                    className="px-2 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer"
                                                >
                                                    <option value={0}>None</option>
                                                    <option value={5}>5 min</option>
                                                    <option value={10}>10 min</option>
                                                    <option value={15}>15 min</option>
                                                    <option value={30}>30 min</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Hours summary */}
                                        <div className="shrink-0 text-right w-16">
                                            {slot.isActive ? (
                                                <span className="text-xs font-semibold text-indigo-600">
                                                    {(() => {
                                                        const [sh, sm] = slot.startTime.split(':').map(Number);
                                                        const [eh, em] = slot.endTime.split(':').map(Number);
                                                        const hours = (eh * 60 + em - sh * 60 - sm) / 60;
                                                        return hours > 0 ? `${hours}h` : '—';
                                                    })()}
                                                </span>
                                            ) : (
                                                <span className="text-xs font-medium text-gray-300">Off</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer summary */}
                        {!loading && (
                            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-500">
                                        Total weekly hours:{' '}
                                        <span className="font-bold text-gray-900">
                                            {(() => {
                                                const total = slots
                                                    .filter(s => s.isActive)
                                                    .reduce((acc, s) => {
                                                        const [sh, sm] = s.startTime.split(':').map(Number);
                                                        const [eh, em] = s.endTime.split(':').map(Number);
                                                        return acc + (eh * 60 + em - sh * 60 - sm);
                                                    }, 0);
                                                const h = Math.floor(total / 60);
                                                const m = total % 60;
                                                return m > 0 ? `${h}h ${m}m` : `${h}h`;
                                            })()}
                                        </span>
                                    </span>
                                </div>
                                <button
                                    onClick={handleSave}
                                    disabled={saving || saved}
                                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ─── Quick Tips ─── */}
                    <div className="mt-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { title: 'Set buffer time', desc: 'Add breaks between sessions to rest and prepare notes.', icon: '☕' },
                            { title: 'Stay consistent', desc: 'Regular hours help clients build a routine with you.', icon: '📅' },
                            { title: 'Go online for instant', desc: 'Toggle online to accept instant "Talk Now" requests.', icon: '⚡' },
                        ].map(tip => (
                            <div key={tip.title} className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-5">
                                <span className="text-2xl">{tip.icon}</span>
                                <h4 className="text-sm font-bold text-gray-900 mt-2">{tip.title}</h4>
                                <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
