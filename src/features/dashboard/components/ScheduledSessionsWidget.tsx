import { useEffect, useState, useCallback } from 'react';
import { UserRound, CalendarOff } from 'lucide-react';
import { therapyApi } from '@/services/therapy.api';
import type { SessionDetail } from '@/types/therapy.types';

/* ── helpers ── */

function getSessionTypeLabel(type: string): { label: string; cls: string } {
    switch (type) {
        case 'discovery':
            return { label: 'Discovery (Free)', cls: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
        case 'pay_as_you_like':
            return { label: 'Pay As You Like', cls: 'text-blue-600 bg-blue-50 border-blue-200' };
        default:
            return { label: 'Standard', cls: 'text-gray-600 bg-gray-50 border-gray-200' };
    }
}

function formatSessionTime(iso: string): string {
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase();
}

function isToday(iso: string): boolean {
    const d = new Date(iso);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

/** Is the session starting within 15 minutes? */
function isStartingSoon(iso: string): boolean {
    const diff = new Date(iso).getTime() - Date.now();
    return diff > 0 && diff <= 15 * 60 * 1000;
}

/** Unwrap paginated or raw array from API */
function unwrapSessions(payload: unknown): SessionDetail[] {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload as SessionDetail[];
    const obj = payload as Record<string, unknown>;
    for (const key of ['data', 'sessions', 'items']) {
        if (Array.isArray(obj[key])) return obj[key] as SessionDetail[];
    }
    return [];
}

/* ── skeleton ── */

function SkeletonRow() {
    return (
        <div className="p-4 rounded-[20px] bg-white border border-gray-100 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100" />
                <div className="space-y-1.5">
                    <div className="h-3.5 w-24 bg-gray-100 rounded" />
                    <div className="h-2.5 w-16 bg-gray-100 rounded" />
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="h-7 w-16 bg-gray-100 rounded-full" />
                <div className="h-9 w-24 bg-gray-100 rounded-full" />
            </div>
        </div>
    );
}

/* ── session row ── */

interface SessionRowProps {
    session: SessionDetail;
    isActive: boolean;
}

function SessionRow({ session, isActive }: SessionRowProps) {
    const badge = getSessionTypeLabel(session.sessionType);
    const time = formatSessionTime(session.scheduledAt);
    const name = session.therapist?.name ?? 'Unknown';
    const initial = name.charAt(0);
    const photoUrl = session.therapist?.photoUrl;

    const bgColor = isActive ? 'bg-[#1A1A1A] text-white' : 'bg-white text-gray-900 border border-gray-100 hover:border-gray-200';
    const avatarBg = isActive ? 'bg-white/10' : 'bg-gray-100 text-gray-400';
    const timeBg = isActive ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-600 border border-gray-100';
    const badgeCls = isActive
        ? 'bg-white/10 text-white/70 border-white/10'
        : `${badge.cls} border`;

    return (
        <div className={`p-4 rounded-[20px] flex items-center justify-between transition-colors shadow-sm ${bgColor}`}>
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg overflow-hidden flex-shrink-0 ${avatarBg}`}>
                    {photoUrl ? (
                        <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
                    ) : isActive ? (
                        <UserRound className="w-5 h-5 text-white/50" />
                    ) : (
                        initial
                    )}
                </div>

                <div className="flex flex-col">
                    <span className="font-semibold text-sm leading-snug">{name}</span>
                    <span className={`inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-full w-fit mt-0.5 border ${badgeCls}`}>
                        {badge.label}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className={`px-4 py-1.5 rounded-full text-xs font-semibold ${timeBg}`}>
                    {time}
                </div>
                {/* Start Call — disabled until BUILD 4 (Daily.co) */}
                <button
                    disabled
                    title="Coming Soon — video calls available in next update"
                    className={`min-h-[36px] px-5 py-2 rounded-full text-xs font-semibold transition-colors cursor-not-allowed opacity-50 ${
                        isActive
                            ? 'bg-green-900/40 text-green-400 border border-green-800/50'
                            : 'text-green-600 border border-green-200 bg-green-50/50'
                    }`}
                >
                    Start Call
                </button>
            </div>
        </div>
    );
}

/* ── main widget ── */

interface ScheduledSessionsWidgetProps {
    variant?: 'user' | 'practitioner';
}

export function ScheduledSessionsWidget({ variant = 'user' }: ScheduledSessionsWidgetProps) {
    const [sessions, setSessions] = useState<SessionDetail[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchToday = useCallback(async () => {
        setLoading(true);
        try {
            const res = variant === 'practitioner'
                ? await therapyApi.getTherapistSessions({ status: 'SCHEDULED' })
                : await therapyApi.listSessions({ status: 'SCHEDULED', pageSize: 50 });
            if (res.success && res.data) {
                const all = unwrapSessions(res.data);
                const today = all.filter(s => isToday(s.scheduledAt));
                today.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
                setSessions(today);
            }
        } catch { /* empty state will show */ }
        finally { setLoading(false); }
    }, [variant]);

    useEffect(() => { fetchToday(); }, [fetchToday]);

    return (
        <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 px-1">Today's Scheduled Sessions</h3>

            {loading ? (
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
                </div>
            ) : sessions.length === 0 ? (
                <div className="py-10 flex flex-col items-center text-center">
                    <CalendarOff className="w-8 h-8 text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500 font-medium">No sessions scheduled for today</p>
                    <p className="text-xs text-gray-400 mt-1">Upcoming sessions will appear here</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {sessions.map((s, i) => (
                        <SessionRow key={s.id} session={s} isActive={i === 0 && isStartingSoon(s.scheduledAt)} />
                    ))}
                </div>
            )}
        </div>
    );
}

/** @deprecated — kept for backwards compat; prefer ScheduledSessionsWidget */
export function ScheduledSessionItem({ name, type, time, isActive = false }: { name: string; type: string; time: string; isActive?: boolean }) {
    const bgColor = isActive ? 'bg-[#1A1A1A] text-white' : 'bg-white text-gray-900 border border-gray-100 hover:border-gray-200';
    const subtextColor = isActive ? 'text-white/60' : 'text-gray-500';
    const avatarBg = isActive ? 'bg-white/10' : 'bg-gray-100 text-gray-400';
    const timeBg = isActive ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-600 border border-gray-100';

    return (
        <div className={`p-4 rounded-[20px] flex items-center justify-between transition-colors shadow-sm ${bgColor}`}>
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${avatarBg}`}>
                    {isActive ? <UserRound className="w-5 h-5 text-white/50" /> : name.charAt(0)}
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-sm leading-snug">{name}</span>
                    <span className={`text-[11px] font-medium ${subtextColor}`}>{type}</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className={`px-4 py-1.5 rounded-full text-xs font-semibold ${timeBg}`}>{time}</div>
                <button disabled title="Coming Soon" className={`min-h-[36px] px-5 py-2 rounded-full text-xs font-semibold transition-colors cursor-not-allowed opacity-50 ${isActive ? 'bg-green-900/40 text-green-400 border border-green-800/50' : 'text-green-600 border border-green-200 bg-green-50/50'}`}>
                    Start Call
                </button>
            </div>
        </div>
    );
}
