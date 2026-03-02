import { Bell, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiService from '@/services/api.service';
import { Link } from 'react-router-dom';

export default function DashboardTopbar() {
    const [greeting, setGreeting] = useState('Good Evening');
    const { user } = useAuth();
    const userName = user?.name ?? 'Friend';
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    // Fetch unread notification count
    useEffect(() => {
        let cancelled = false;
        apiService.get<{ unreadCount: number }>('/notifications').then((res) => {
            if (!cancelled && res.success && res.data) {
                setUnreadCount(res.data.unreadCount);
            }
        });
        return () => { cancelled = true; };
    }, []);

    const firstInitial = userName.charAt(0).toUpperCase();

    return (
        <header className="h-[80px] w-full flex items-center justify-between px-8 bg-transparent z-40">
            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold text-white tracking-[-0.24px]">
                    {greeting}, {userName}.
                </h1>
                <p className="text-sm text-white/50 font-medium">
                    The stars are shifting. Your aura is stable.
                </p>
            </div>

            <div className="flex items-center gap-6">
                {/* Magic Search */}
                <div className="relative hidden md:flex items-center">
                    <Search className="absolute left-4 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        placeholder="Ask the Oracle..."
                        className="w-[280px] h-[44px] bg-[#1a1a1a] border border-[#2b2b2b] rounded-[50px] pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-accent transition-colors glass"
                    />
                </div>

                {/* Intelligence Bell */}
                <Link
                    to="/dashboard/notifications"
                    className="relative w-11 h-11 rounded-full bg-[#1a1a1a] border border-[#2b2b2b] flex items-center justify-center hover:bg-[#252525] transition-colors glass"
                >
                    <Bell className="w-5 h-5 text-white/80" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-accent rounded-full animate-pulse-glow" />
                    )}
                </Link>

                {/* Profile Pill */}
                <Link
                    to="/dashboard/profile"
                    className="h-11 pl-1 pr-3 rounded-[50px] bg-[#1a1a1a] border border-[#2b2b2b] flex items-center gap-3 hover:bg-[#252525] transition-colors glass"
                >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white shadow-inner">
                        {firstInitial}
                    </div>
                    <span className="text-sm font-medium text-white/90 mr-1">{userName}</span>
                </Link>
            </div>
        </header>
    );
}

