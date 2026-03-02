import { Bell, Search, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import apiService from '@/services/api.service';
import { Link } from 'react-router-dom';

interface DashboardTopbarProps {
  onMenuToggle?: () => void;
}

export default function DashboardTopbar({ onMenuToggle }: DashboardTopbarProps) {
    const [greeting, setGreeting] = useState('Good Evening');
    const { user } = useAuth();
    const userName = user?.name ?? 'Friend';
    const [unreadCount, setUnreadCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

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
        <header className="sticky top-0 z-40 h-16 sm:h-[72px] w-full flex items-center justify-between px-4 sm:px-8 bg-[#0a0a0a] border-b border-white/[0.04]">
            <div className="flex items-center gap-3">
                {/* Mobile hamburger */}
                <button
                    onClick={onMenuToggle}
                    className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] transition-colors"
                >
                    <Menu className="w-5 h-5 text-white/70" />
                </button>
                <div className="flex flex-col">
                    <h1 className="text-lg sm:text-2xl font-semibold text-white tracking-[-0.24px]">
                        {greeting}, {userName}.
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
                {/* Search */}
                <div className="relative hidden md:flex items-center">
                    <Search className="absolute left-4 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Ask the Oracle..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-[260px] h-[42px] bg-white/[0.04] rounded-2xl pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/40 focus:bg-white/[0.06] transition-all"
                    />
                </div>

                {/* Notification Bell */}
                <Link
                    to="/dashboard/notifications"
                    className="relative w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.07] transition-colors"
                >
                    <Bell className="w-[18px] h-[18px] text-white/60" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse-glow" />
                    )}
                </Link>

                {/* Profile Pill */}
                <Link
                    to="/dashboard/profile"
                    className="h-10 pl-1 pr-3 rounded-2xl bg-white/[0.04] flex items-center gap-2.5 hover:bg-white/[0.07] transition-colors"
                >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                        {firstInitial}
                    </div>
                    <span className="text-sm font-medium text-white/80 mr-0.5 hidden sm:inline">{userName}</span>
                </Link>
            </div>
        </header>
    );
}

