import { useEffect, useState, useCallback } from 'react';
import { Bell, Search, Settings2, Info, Star, Loader2 } from 'lucide-react';
import { therapyApi } from '@/services/therapy.api';
import type { TherapistDashboard } from '@/types/therapy.types';

function formatEarnings(amount: number): { main: string; decimal: string } {
    if (amount >= 1000) {
        const k = amount / 1000;
        const whole = Math.floor(k * 10) / 10; // one decimal
        const parts = whole.toFixed(1).split('.');
        return { main: `₹${parts[0]}k`, decimal: `.${parts[1]}` };
    }
    const parts = amount.toFixed(2).split('.');
    return { main: `₹${parts[0]}`, decimal: `.${parts[1]}` };
}

export function PractitionerHeader() {
    const [dashboard, setDashboard] = useState<TherapistDashboard | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        try {
            const res = await therapyApi.getTherapistDashboard();
            if (res.success && res.data) {
                setDashboard(res.data as TherapistDashboard);
            }
        } catch { /* show defaults */ }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

    const earnings = dashboard ? formatEarnings(dashboard.totalEarnings) : { main: '₹0', decimal: '.00' };
    const rating = dashboard?.rating ?? 0;
    const totalSessions = dashboard?.totalSessions ?? 0;
    const sessionsDisplay = totalSessions >= 100 ? `${totalSessions}+` : String(totalSessions);

    return (
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 w-full font-sans">

            {/* Left Area: Greeting & Bell */}
            <div className="flex flex-col md:flex-row md:items-center gap-6">
                <h1 className="text-4xl font-semibold tracking-tight text-gray-900">Welcome!</h1>
                <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-[#F8F9FA] rounded-[30px] pr-5 pb-1 pt-1 pl-1 border border-gray-100 shadow-sm">
                        <img
                            src="https://i.pravatar.cc/150?img=47"
                            alt="Practitioner"
                            className="w-10 h-10 rounded-full object-cover border-2 border-white"
                        />
                        <div className="flex flex-col -gap-1">
                            <span className="font-semibold text-[15px] leading-tight text-gray-900">Wellness Guide</span>
                            <span className="text-[11px] text-gray-500 font-medium">Soul Guide | Practitioner</span>
                        </div>
                    </div>

                    <button className="w-11 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                    </button>
                </div>
            </div>

            {/* Right Area: Search, Tools & Black Stats Card */}
            <div className="flex flex-wrap items-center gap-4 relative">

                {/* Search Bar Container */}
                <div className="relative flex-1 min-w-[220px] sm:min-w-[280px] max-w-[360px]">
                    <input
                        type="text"
                        placeholder="Search for what you want..."
                        className="w-full h-10 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-[30px] py-2.5 px-5 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer hover:text-gray-600" />
                </div>

                {/* Action Icons */}
                <button className="w-11 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                    <Settings2 className="w-4 h-4" />
                </button>
                <button className="w-11 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                    <Info className="w-4 h-4" />
                </button>

                {/* Links */}
                <div className="flex items-center gap-2 sm:gap-4 ml-0 sm:ml-2">
                    <button className="inline-flex min-h-[40px] items-center px-2 text-[13px] font-medium text-red-400 hover:text-red-500 transition-colors">Ignored Clients</button>
                    <button className="inline-flex min-h-[40px] items-center px-2 text-[13px] font-medium text-gray-500 hover:text-gray-700 transition-colors">Report</button>
                </div>

                {/* Floating Black Stats Card */}
                <div className="absolute -bottom-8 right-0 xl:right-0 xl:top-20 mt-6 xl:mt-0 flex w-full xl:w-auto z-50">
                    <div className="bg-[#1e1e1e] text-white rounded-[28px] xl:rounded-full py-4 px-4 sm:px-6 md:px-8 xl:px-[50px] flex flex-wrap items-center justify-between xl:justify-start gap-4 sm:gap-6 md:gap-8 w-full xl:w-max shadow-[0_20px_50px_rgba(0,0,0,0.3)]">

                        <div className="flex items-center gap-3 md:gap-5 min-w-[150px]">
                            <span className="text-[12px] md:text-[14px] text-white/80 font-normal whitespace-nowrap">Total Earnings</span>
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin text-white/50" />
                            ) : (
                                <div className="flex items-baseline">
                                    <span className="text-2xl md:text-[32px] font-semibold tracking-tight text-white leading-none">{earnings.main}</span>
                                    <span className="text-[12px] md:text-[14px] font-medium text-white/50 ml-0.5 leading-none">{earnings.decimal}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 md:gap-5 min-w-[150px]">
                            <span className="text-[12px] md:text-[14px] text-white/80 font-normal whitespace-nowrap">Your Rating</span>
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin text-white/50" />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl md:text-[32px] font-semibold tracking-tight text-white leading-none">{rating.toFixed(1)}</span>
                                    <Star className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] fill-[#FFD700] text-[#FFD700]" />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 md:gap-5 min-w-[150px] hidden sm:flex">
                            <span className="text-[12px] md:text-[14px] text-white/80 font-normal whitespace-nowrap">Total Sessions</span>
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin text-white/50" />
                            ) : (
                                <span className="text-2xl md:text-[32px] font-semibold tracking-tight text-white leading-none">{sessionsDisplay}</span>
                            )}
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
}
