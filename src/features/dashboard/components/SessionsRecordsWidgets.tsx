import { useEffect, useState, useCallback } from 'react';
import { UserRound, MessageSquare, MoreVertical, CalendarOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { therapyApi } from '@/services/therapy.api';
import type { SessionDetail } from '@/types/therapy.types';

/* ── helpers ── */

function unwrapSessions(payload: unknown): SessionDetail[] {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload as SessionDetail[];
    const obj = payload as Record<string, unknown>;
    for (const key of ['data', 'sessions', 'items']) {
        if (Array.isArray(obj[key])) return obj[key] as SessionDetail[];
    }
    return [];
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase();
}

function getSessionTypeLabel(type: string): string {
    switch (type) {
        case 'discovery': return 'Discovery (Free)';
        case 'pay_as_you_like': return 'Pay As You Like';
        default: return 'Standard';
    }
}

/* ── skeleton ── */

function SkeletonRow() {
    return (
        <div className="py-4 border-b border-gray-100 last:border-0 flex items-center justify-between px-2 animate-pulse">
            <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gray-100" />
                <div className="space-y-1.5">
                    <div className="h-3.5 w-28 bg-gray-100 rounded" />
                    <div className="h-2.5 w-20 bg-gray-100 rounded" />
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="h-8 w-28 bg-gray-100 rounded-full" />
                <div className="h-8 w-20 bg-gray-100 rounded-full" />
            </div>
        </div>
    );
}

/* ── session record item ── */

interface SessionRecordProps {
    name: string;
    type: string;
    date: string;
    time: string;
    actionText: string;
    isCompleted?: boolean;
    photoUrl?: string | null;
    sessionId?: string;
}

export function SessionRecordItem({ name, type, date, time, actionText, isCompleted = false, photoUrl, sessionId: _sessionId }: SessionRecordProps) {
    const actionButtonStyle = isCompleted
        ? "px-5 py-2 rounded-full text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
        : "px-5 py-2 rounded-full text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300";

    return (
        <div className="py-4 border-b border-gray-100 last:border-0 flex items-center justify-between group hover:bg-gray-50/50 transition-colors px-2 -mx-2 rounded-xl">
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center font-bold text-gray-900 bg-[#1A1A1A] overflow-hidden">
                    {photoUrl ? (
                        <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <UserRound className="w-5 h-5 text-white/50" />
                    )}
                </div>

                <div className="flex flex-col truncate pr-2">
                    <span className="font-semibold text-[15px] leading-snug truncate text-gray-900">{name}</span>
                    <span className="text-xs font-medium text-gray-500 truncate">{type}</span>
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                {!isCompleted && (
                    <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white transition-colors">
                        <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                )}

                <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                </button>

                <div className="px-5 py-2 rounded-full text-xs font-medium text-gray-600 border border-gray-200 bg-gray-50 hidden sm:block mx-1">
                    {date} | {time}
                </div>

                <button className={`transition-all ${actionButtonStyle}`}>
                    {actionText}
                </button>
            </div>
        </div>
    );
}

/* ── WeeklySessionsWidget (Scheduled / upcoming sessions for therapist) ── */

export function WeeklySessionsWidget() {
    const [sessions, setSessions] = useState<SessionDetail[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await therapyApi.getTherapistSessions({ status: 'SCHEDULED' });
            if (res.success && res.data) {
                const all = unwrapSessions(res.data);
                all.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
                setSessions(all);
            }
        } catch { /* empty state */ }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchSessions(); }, [fetchSessions]);

    return (
        <div className="flex flex-col">
            <div className="flex items-baseline justify-between mb-4 px-1">
                <h3 className="text-xl font-semibold text-gray-900">Appointments & Sessions</h3>
                <Link to="/practitioner/sessions" className="inline-flex min-h-[36px] items-center px-2 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">View All</Link>
            </div>

            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-200/60">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <h4 className="font-semibold text-gray-800">Upcoming Sessions</h4>
                    <div className="flex gap-4 text-xs font-medium text-gray-400">
                        <span>Scheduled - {sessions.length}</span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col">
                        {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="py-8 flex flex-col items-center text-center">
                        <CalendarOff className="w-7 h-7 text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500 font-medium">No upcoming sessions</p>
                        <p className="text-xs text-gray-400 mt-1">Scheduled sessions will appear here</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {sessions.slice(0, 5).map(s => (
                            <SessionRecordItem
                                key={s.id}
                                name={s.therapist?.name ?? 'Unknown Client'}
                                type={getSessionTypeLabel(s.sessionType)}
                                date={formatDate(s.scheduledAt)}
                                time={formatTime(s.scheduledAt)}
                                actionText="Reschedule"
                                sessionId={s.id}
                                photoUrl={s.therapist?.photoUrl}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── CompletedSessionsWidget ── */

export function CompletedSessionsWidget() {
    const [sessions, setSessions] = useState<SessionDetail[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await therapyApi.getTherapistSessions({ status: 'COMPLETED' });
            if (res.success && res.data) {
                const all = unwrapSessions(res.data);
                all.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
                setSessions(all);
            }
        } catch { /* empty state */ }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchSessions(); }, [fetchSessions]);

    return (
        <div className="flex flex-col mt-8">
            <div className="flex items-baseline justify-between mb-4 px-1">
                <h3 className="text-xl font-semibold text-gray-900">Completed Sessions</h3>
                <button className="inline-flex min-h-[36px] items-center px-2 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">View All</button>
            </div>

            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-200/60">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <h4 className="font-semibold text-gray-800">Recent Completed Sessions</h4>
                    <span className="text-xs font-medium text-gray-400">Total Completed - {sessions.length}</span>
                </div>

                {loading ? (
                    <div className="flex flex-col">
                        {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="py-8 flex flex-col items-center text-center">
                        <CalendarOff className="w-7 h-7 text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500 font-medium">No completed sessions yet</p>
                        <p className="text-xs text-gray-400 mt-1">Session records will appear after completion</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {sessions.slice(0, 5).map(s => (
                            <SessionRecordItem
                                key={s.id}
                                name={s.therapist?.name ?? 'Unknown Client'}
                                type={getSessionTypeLabel(s.sessionType)}
                                date={formatDate(s.scheduledAt)}
                                time={formatTime(s.scheduledAt)}
                                actionText="See Summary"
                                isCompleted
                                sessionId={s.id}
                                photoUrl={s.therapist?.photoUrl}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
