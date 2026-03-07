import { useEffect, useState, useCallback } from 'react';
import { UserRound, Users } from 'lucide-react';
import { therapyApi } from '@/services/therapy.api';
import type { TherapistClient } from '@/types/therapy.types';

interface IntakeItemProps {
    name: string;
    type: string;
    dateStr: string;
    avatarUrl?: string | null;
}

export function ClientIntakeItem({ name, type, dateStr, avatarUrl }: IntakeItemProps) {
    return (
        <div className="py-4 border-b border-gray-100 last:border-0 flex items-center justify-between bg-white w-full rounded-2xl px-4 border border-gray-100 shadow-sm mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-gray-900 bg-[#1A1A1A] overflow-hidden">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <UserRound className="w-5 h-5 text-white/50" />
                    )}
                </div>

                <div className="flex flex-col truncate pr-2">
                    <span className="font-semibold text-sm leading-snug truncate text-gray-900">{name}</span>
                    <span className="text-[11px] font-medium text-gray-500 truncate">{type}</span>
                </div>
            </div>

            <div className="flex flex-col items-start pr-4 border-l border-gray-100 pl-4 w-32 shrink-0">
                <span className="text-[10px] font-medium text-gray-400">Last Session</span>
                <span className="text-[11px] font-semibold text-gray-600 line-clamp-1">{dateStr}</span>
            </div>

            <button className="min-h-[36px] px-5 py-2 shrink-0 rounded-full text-xs font-semibold text-rose-500 border border-rose-100 bg-rose-50/50 hover:bg-rose-50 transition-colors ml-2">
                Ignore
            </button>
        </div>
    );
}

function SkeletonIntakeItem() {
    return (
        <div className="py-4 flex items-center justify-between bg-white w-full rounded-2xl px-4 border border-gray-100 shadow-sm mb-3 animate-pulse">
            <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-gray-100" />
                <div className="space-y-1.5">
                    <div className="h-3.5 w-24 bg-gray-100 rounded" />
                    <div className="h-2.5 w-16 bg-gray-100 rounded" />
                </div>
            </div>
            <div className="h-6 w-20 bg-gray-100 rounded" />
        </div>
    );
}

function formatLastSession(iso: string | null): string {
    if (!iso) return 'No sessions yet';
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true });
}

export function ClientIntakeWidget() {
    const [clients, setClients] = useState<TherapistClient[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchClients = useCallback(async () => {
        setLoading(true);
        try {
            const res = await therapyApi.getTherapistClients();
            if (res.success && res.data) {
                const list = Array.isArray(res.data) ? res.data : [];
                setClients(list as TherapistClient[]);
            }
        } catch { /* empty state */ }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchClients(); }, [fetchClients]);

    return (
        <div className="flex flex-col">
            <div className="flex items-baseline justify-between mb-4 px-1">
                <div className="flex items-baseline gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">Client Intake</h3>
                    <span className="text-xs font-medium text-gray-400 tracking-wide">({clients.length} clients)</span>
                </div>
                <button className="inline-flex min-h-[36px] items-center px-2 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">View All</button>
            </div>

            {loading ? (
                <div className="flex flex-col gap-0">
                    {Array.from({ length: 2 }).map((_, i) => <SkeletonIntakeItem key={i} />)}
                </div>
            ) : clients.length === 0 ? (
                <div className="py-10 flex flex-col items-center text-center">
                    <Users className="w-8 h-8 text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500 font-medium">No clients yet</p>
                    <p className="text-xs text-gray-400 mt-1">Clients will appear here after their first session</p>
                </div>
            ) : (
                <div className="flex flex-col gap-0">
                    {clients.slice(0, 5).map(c => (
                        <ClientIntakeItem
                            key={c.userId}
                            name={c.name}
                            type={c.struggles.length > 0 ? c.struggles.slice(0, 2).join(', ') : 'General Wellness'}
                            dateStr={formatLastSession(c.lastSessionAt)}
                            avatarUrl={c.avatarUrl}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
