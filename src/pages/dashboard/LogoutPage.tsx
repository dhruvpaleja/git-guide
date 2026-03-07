import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PractitionerSidebar } from '@/features/dashboard/components/PractitionerSidebar';
import { useAuth } from '@/context/AuthContext';
import {
    Search, SlidersHorizontal, AlertCircle, ChevronLeft,
    LogOut, Shield, ArrowLeft, Clock, Users, FileText,
    Calendar, Star, TrendingUp, Heart
} from 'lucide-react';
import { therapyApi } from '@/services/therapy.api';

interface SessionItem {
  id: string;
  scheduledAt: string;
  sessionType: string;
  user: { name: string };
}

export default function LogoutPage() {
    useDocumentTitle('Logging Out');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [loggedOut, setLoggedOut] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const [statsData, setStatsData] = useState({
        upcomingSessions: 0,
        activeClients: 0,
        totalSessions: 0,
        totalEarnings: '₹0',
        rating: 0,
        completedThisMonth: 0,
    });
    const [upcomingSessions, setUpcomingSessions] = useState<SessionItem[]>([]);
    const SESSION_COLORS = ['#14B8A6', '#6366F1', '#F59E0B', '#EC4899', '#8B5CF6'];

    const loadStats = useCallback(async () => {
        try {
            const [metricsRes, sessionsRes, clientsRes] = await Promise.all([
                therapyApi.getTherapistMetrics(),
                therapyApi.getTherapistSessions({ status: 'SCHEDULED' }),
                therapyApi.getTherapistClients(),
            ]);
            const m = metricsRes as unknown as Record<string, unknown>;
            const sessData = sessionsRes as unknown as Record<string, unknown>;
            const sessions = (Array.isArray(sessData) ? sessData : (sessData.sessions as unknown[]) ?? []) as SessionItem[];
            const clientData = clientsRes as unknown as Record<string, unknown>;
            const clients = Array.isArray(clientData) ? clientData : (clientData.clients as unknown[]) ?? [];

            const earnings = Number(m.totalEarnings ?? m.earnings ?? 0);
            const earningsStr = earnings >= 100000 ? `₹${(earnings / 100000).toFixed(1)}L` : earnings >= 1000 ? `₹${(earnings / 1000).toFixed(1)}k` : `₹${earnings}`;

            setStatsData({
                upcomingSessions: sessions.length,
                activeClients: clients.length,
                totalSessions: Number(m.totalSessions ?? 0),
                totalEarnings: earningsStr,
                rating: Number(m.averageRating ?? m.rating ?? 0),
                completedThisMonth: Number(m.completedThisMonth ?? m.completedThisWeek ?? 0),
            });
            setUpcomingSessions(sessions.slice(0, 3));
        } catch {
            // Silently fall back to zeros
        }
    }, []);

    useEffect(() => { loadStats(); }, [loadStats]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await new Promise(r => setTimeout(r, 1000));
        setIsLoggingOut(false);
        setLoggedOut(true);
    };

    /* After logout confirmed, countdown then redirect */
    useEffect(() => {
        if (!loggedOut) return;
        if (countdown <= 0) {
            logout().then(() => navigate('/login'));
            return;
        }
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [loggedOut, countdown, logout, navigate]);

    return (
        <div className="min-h-screen bg-[#F5F5F7] flex font-sans">
            <PractitionerSidebar />

            <main className="flex-1 ml-20 md:ml-24 overflow-y-auto">
                {/* ─── Top Welcome Bar ─── */}
                <div className="bg-white px-6 md:px-10 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <img src="/images/main-logo.png" alt="Soul Yatri" className="w-8 h-8 object-contain" />
                        <span className="text-2xl font-bold text-gray-900 hidden sm:block">Welcome!</span>
                        <img src="/images/practitioner/imgImage.png" alt={user?.name || 'Practitioner'} className="w-10 h-10 rounded-full object-cover border-2 border-gray-100" />
                        <div className="hidden md:flex flex-col">
                            <span className="text-sm font-semibold text-gray-800">{user?.name || 'Swati Agarwal'}</span>
                            <span className="text-[11px] text-gray-400">Counsellor | Therapist</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <button aria-label="Notifications" className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                            <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        </button>
                        <div className="hidden lg:flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-100 min-w-[200px]">
                            <span className="text-sm text-gray-400 truncate">Search for what you want...</span>
                            <Search className="w-4 h-4 text-gray-300 ml-auto shrink-0" />
                        </div>
                        <button aria-label="Filter" className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                            <SlidersHorizontal className="w-4 h-4" />
                        </button>
                        <button aria-label="Info" className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                            <AlertCircle className="w-4 h-4" />
                        </button>
                        <button className="text-sm font-medium text-orange-400 hover:text-orange-500 transition-colors hidden md:block">Ignored Clients</button>
                        <button className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors hidden md:block">Report</button>
                    </div>
                </div>

                {/* ─── Page Content ─── */}
                <div className="px-6 md:px-10 py-6 max-w-[1400px] mx-auto">
                    <span className="text-xs text-gray-400 font-medium">Practitioner Dashboard</span>

                    {/* Title Row */}
                    <div className="flex items-center gap-3 mt-1 mb-6">
                        <Link to="/practitioner" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors bg-white shrink-0">
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-[36px] font-bold text-gray-900 leading-tight">Logout Account</h1>
                            <p className="text-[13px] text-gray-400 mt-1">We're sad to see you go. You can always come back.</p>
                        </div>
                    </div>

                    {/* ─── Logout Grid ─── */}
                    {!loggedOut ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                            {/* ── COL 1: Account Card (3 cols) ── */}
                            <div className="lg:col-span-3 flex flex-col gap-4">
                                {/* Profile Card */}
                                <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-5 text-center">
                                    <div className="relative inline-block mb-3">
                                        <img src="/images/practitioner/imgImage.png" alt="Profile" className="w-[80px] h-[80px] rounded-full object-cover border-2 border-gray-100 mx-auto" />
                                        <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white" />
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900">{user?.name || 'Swati Agarwal'}</h3>
                                    <p className="text-[11px] text-gray-400 mt-0.5">{user?.email || 'swati.agarwal@soulyatri.com'}</p>
                                    <span className="inline-block mt-2.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold border border-indigo-100 uppercase tracking-wider">
                                        Counsellor | Therapist
                                    </span>
                                </div>

                                {/* Stats Card */}
                                <div className="bg-[#1A1A1A] rounded-[20px] p-5 text-white">
                                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-4">Your Impact</p>
                                    {[
                                        { icon: Star, label: 'Rating', value: `${statsData.rating.toFixed(1)} ★`, color: 'text-yellow-400' },
                                        { icon: TrendingUp, label: 'Total Earnings', value: statsData.totalEarnings, color: 'text-emerald-400' },
                                        { icon: Users, label: 'Active Clients', value: String(statsData.activeClients), color: 'text-blue-400' },
                                        { icon: FileText, label: 'Total Sessions', value: `${statsData.totalSessions}+`, color: 'text-purple-400' },
                                        { icon: Heart, label: 'This Month', value: String(statsData.completedThisMonth), color: 'text-pink-400' },
                                    ].map(stat => (
                                        <div key={stat.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                            <div className="flex items-center gap-2.5">
                                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                                <span className="text-[11px] text-white/50 font-medium">{stat.label}</span>
                                            </div>
                                            <span className="text-sm font-bold">{stat.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── COL 2: Logout Confirmation (5 cols) ── */}
                            <div className="lg:col-span-5">
                                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 sm:p-8">
                                    {/* Warning Illustration */}
                                    <div className="relative w-24 h-24 mx-auto mb-6">
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-100 to-red-50 animate-pulse" style={{ animationDuration: '3s' }} />
                                        <div className="relative w-full h-full rounded-full border-2 border-orange-200 flex items-center justify-center">
                                            <LogOut className="w-10 h-10 text-orange-500" />
                                        </div>
                                    </div>

                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">
                                        Are you sure you want to log out?
                                    </h2>
                                    <p className="text-[13px] text-gray-400 leading-relaxed text-center mb-6 max-w-sm mx-auto">
                                        You'll be signed out of your practitioner dashboard. All your data remains safe and secure.
                                    </p>

                                    {/* Active Sessions Warning */}
                                    <div className="bg-amber-50 rounded-[16px] border border-amber-200/60 p-4 mb-5">
                                        <div className="flex items-start gap-3">
                                            <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-[13px] font-bold text-amber-800">Active Session Notice</p>
                                                <p className="text-[12px] text-amber-600 mt-0.5 leading-relaxed">
                                                    You have <span className="font-bold">{statsData.upcomingSessions} upcoming sessions</span> this week.
                                                    Logging out won't cancel them but notifications will pause.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* What happens */}
                                    <div className="bg-[#F9F9FB] rounded-[16px] p-4 mb-6">
                                        <p className="text-[12px] font-bold text-gray-700 mb-2.5">What happens when you log out:</p>
                                        <div className="space-y-2">
                                            {[
                                                { text: 'Your session data is saved securely', ok: true },
                                                { text: 'Client appointments remain unchanged', ok: true },
                                                { text: 'Push notifications will stop', ok: false },
                                                { text: 'Availability status shows as offline', ok: false },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-2.5 text-[12px]">
                                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 ${item.ok
                                                            ? 'bg-emerald-100 text-emerald-600'
                                                            : 'bg-red-100 text-red-500'
                                                        }`}>
                                                        {item.ok ? '✓' : '!'}
                                                    </span>
                                                    <span className={item.ok ? 'text-gray-600' : 'text-gray-500'}>{item.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={handleLogout}
                                            disabled={isLoggingOut}
                                            className="w-full h-[52px] rounded-full bg-[#E53E3E] text-white text-[14px] font-bold hover:bg-[#C53030] transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 active:scale-[0.98] disabled:opacity-60"
                                        >
                                            {isLoggingOut ? (
                                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <><LogOut className="w-5 h-5" /> Yes, Log Me Out</>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => navigate('/practitioner')}
                                            className="w-full h-[52px] rounded-full bg-white text-gray-700 text-[14px] font-bold border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2.5 active:scale-[0.98]"
                                        >
                                            <ArrowLeft className="w-5 h-5" /> No, Take Me Back
                                        </button>
                                    </div>

                                    {/* Quick Links */}
                                    <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-center gap-5">
                                        <Link to="/practitioner/profile" className="text-[11px] font-bold text-[#2C2F7A] hover:underline transition-colors uppercase tracking-wide">Edit Profile</Link>
                                        <Link to="/practitioner/availability" className="text-[11px] font-bold text-[#2C2F7A] hover:underline transition-colors uppercase tracking-wide">Availability</Link>
                                        <Link to="/practitioner/clients" className="text-[11px] font-bold text-[#2C2F7A] hover:underline transition-colors uppercase tracking-wide">Clients</Link>
                                    </div>
                                </div>
                            </div>

                            {/* ── COL 3: Upcoming Sessions (4 cols) ── */}
                            <div className="lg:col-span-4 flex flex-col gap-4">
                                {/* Upcoming Sessions */}
                                <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            Upcoming Sessions
                                        </h4>
                                        <span className="text-[10px] font-bold text-white bg-[#1A1A1A] px-2.5 py-1 rounded-full">{statsData.upcomingSessions}</span>
                                    </div>
                                    <div className="space-y-2.5">
                                        {upcomingSessions.map((session, i) => (
                                            <div key={session.id} className="flex items-center gap-3 p-3 bg-[#F9F9FB] rounded-[14px] border border-gray-50 hover:border-gray-200 transition-colors">
                                                <div className="w-2 h-10 rounded-full" style={{ backgroundColor: SESSION_COLORS[i % SESSION_COLORS.length] }} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[13px] font-semibold text-gray-800 truncate">{session.user?.name ?? 'Client'}</p>
                                                    <p className="text-[11px] text-gray-400">{session.sessionType ?? 'Session'}</p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-[12px] font-bold text-gray-700">{new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                    <p className="text-[10px] text-gray-400">{new Date(session.scheduledAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {upcomingSessions.length === 0 && (
                                            <p className="text-[12px] text-gray-400 text-center py-3">No upcoming sessions</p>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-3 text-center leading-relaxed">
                                        These sessions will <span className="font-semibold text-gray-600">not</span> be cancelled if you log out.
                                    </p>
                                </div>

                                {/* Calendar Preview */}
                                <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <h4 className="text-sm font-bold text-gray-900">This Week</h4>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-center">
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                            <span key={i} className="text-[10px] text-gray-400 font-bold">{d}</span>
                                        ))}
                                        {[1, 2, 3, 4, 5, 6, 7].map(d => {
                                            const isToday = d === 4;
                                            const hasSession = [1, 2, 5].includes(d);
                                            return (
                                                <div key={d} className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-[12px] font-semibold relative ${isToday ? 'bg-[#1A1A1A] text-white' : 'text-gray-600'
                                                    }`}>
                                                    {d}
                                                    {hasSession && (
                                                        <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#14B8A6]" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Remember */}
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[20px] border border-indigo-100 p-5">
                                    <p className="text-[13px] font-bold text-indigo-800 mb-1">💜 We'll miss you!</p>
                                    <p className="text-[12px] text-indigo-600 leading-relaxed">
                                        Your account and all client data will remain safe. Come back anytime to continue your practice.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* ─── Logged Out State ─── */
                        <div className="flex items-center justify-center min-h-[55vh]">
                            <div className="bg-white rounded-[24px] border border-gray-100 shadow-lg p-8 sm:p-10 text-center max-w-md w-full">
                                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                                    <svg className="w-9 h-9 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">You've been logged out</h2>
                                <p className="text-[14px] text-gray-400 mb-5">Thank you for your time, {user?.name || 'Swati'}. See you again soon!</p>

                                <div className="bg-[#F9F9FB] rounded-[14px] p-4 mb-5">
                                    <p className="text-[13px] text-gray-600">
                                        Redirecting to login in <span className="font-bold text-[#2C2F7A] text-lg">{countdown}</span> seconds...
                                    </p>
                                    <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#2C2F7A] rounded-full transition-all duration-1000"
                                            style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full h-[50px] rounded-full bg-[#2C2F7A] text-white text-[14px] font-bold hover:bg-[#24276B] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                                >
                                    Go to Login Now
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
