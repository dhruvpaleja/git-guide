import { Bell, Search, Menu, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import apiService from '@/services/api.service';
import { Link } from 'react-router-dom';

interface DashboardTopbarProps { onMenuToggle: () => void; }

export default function DashboardTopbar({ onMenuToggle }: DashboardTopbarProps) {
    const [greeting, setGreeting] = useState('Good Evening');
    const { user } = useAuth();
    const { setTheme, actualTheme } = useTheme();
    const userName = user?.name ?? 'Friend';
    const [unreadCount, setUnreadCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const h = new Date().getHours();
        setGreeting(h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening');
    }, []);

    useEffect(() => {
        apiService.get('/notifications?unread=true').then((res: any) => {
            setUnreadCount(res?.data?.length ?? 0);
        }).catch(() => { });
    }, []);

    const firstInitial = userName.charAt(0).toUpperCase();

    return (
        <header className="sticky top-0 z-40 h-16 sm:h-[72px] w-full flex items-center justify-between px-4 sm:px-8 bg-white/10 backdrop-blur-md border-b border-white/10 shadow-lg transition-colors duration-500">
            <div className="flex items-center gap-3">
                {/* Mobile hamburger */}
                <button
                    onClick={onMenuToggle}
                    className="lg:hidden w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 border border-white/10 transition-colors"
                >
                    <Menu className="w-5 h-5 text-white/70" />
                </button>
                <div className="flex flex-col">
                    <h1 className="text-lg sm:text-2xl font-semibold text-white tracking-[-0.02em]">
                        {greeting}, {userName}.
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                {/* Search */}
                <div className="relative hidden md:flex items-center">
                    <Search className="absolute left-4 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Ask the Oracle..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-[240px] h-[40px] bg-white/5 rounded-full pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-accent/40 focus:bg-white/10 border border-white/10 transition-all"
                    />
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(actualTheme === 'dark' ? 'light' : 'dark')}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 border border-white/10 transition-colors"
                >
                    {actualTheme === 'dark' ? (
                        <Sun className="w-[18px] h-[18px] text-white/60 hover:text-amber-300 transition-colors" />
                    ) : (
                        <Moon className="w-[18px] h-[18px] text-white/60 hover:text-indigo-400 transition-colors" />
                    )}
                </button>

                {/* Notification Bell */}
                <Link
                    to="/dashboard/notifications"
                    className="relative w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 border border-white/10 transition-colors"
                >
                    <Bell className="w-[18px] h-[18px] text-white/60" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" />
                    )}
                </Link>

                {/* Profile Pill */}
                <Link
                    to="/dashboard/profile"
                    className="h-10 pl-1 pr-3 rounded-full bg-white/5 flex items-center gap-2.5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                        {firstInitial}
                    </div>
                    <span className="text-sm font-medium text-white/80 mr-0.5 hidden sm:inline">{userName}</span>
                </Link>
            </div>
        </header>
    );
}
