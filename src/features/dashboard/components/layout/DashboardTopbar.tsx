import { Bell, Search, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

interface DashboardTopbarProps { onMenuToggle: () => void; }

export default function DashboardTopbar({ onMenuToggle }: DashboardTopbarProps) {
    const [greeting, setGreeting] = useState('Good Evening');
    const { user } = useAuth();
    const userName = user?.name ?? 'Friend';
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const h = new Date().getHours();
        setGreeting(h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening');
    }, []);

    const firstInitial = userName.charAt(0).toUpperCase();

    return (
        <header className="sticky top-0 z-40 h-16 sm:h-[68px] w-full flex items-center justify-between px-4 sm:px-8 bg-black/40 backdrop-blur-xl border-b border-white/[0.06] transition-colors duration-500">
            <div className="flex items-center gap-3">
                {/* Mobile hamburger */}
                <button
                    onClick={onMenuToggle}
                    className="lg:hidden w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] border border-white/[0.06] transition-colors"
                >
                    <Menu className="w-[18px] h-[18px] text-white/60" />
                </button>
                <div className="flex flex-col">
                    <h1 className="text-base sm:text-lg font-medium text-white/90 tracking-[-0.02em]">
                        {greeting}, <span className="font-semibold">{userName}</span>
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Search */}
                <div className="relative hidden md:flex items-center">
                    <Search className="absolute left-3.5 w-[14px] h-[14px] text-white/25" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-[200px] h-9 bg-white/[0.03] rounded-xl pl-9 pr-4 text-[13px] text-white/80 placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-white/10 focus:bg-white/[0.06] border border-white/[0.06] transition-all"
                    />
                </div>

                {/* Notification Bell */}
                <Link
                    to="/dashboard/notifications"
                    className="relative w-9 h-9 rounded-xl bg-white/[0.03] flex items-center justify-center hover:bg-white/[0.08] border border-white/[0.06] transition-colors"
                >
                    <Bell className="w-[16px] h-[16px] text-white/50" />
                </Link>

                {/* Profile Pill */}
                <Link
                    to="/dashboard/profile"
                    className="h-9 pl-1 pr-3 rounded-xl bg-white/[0.03] flex items-center gap-2 hover:bg-white/[0.08] border border-white/[0.06] transition-colors"
                >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-[11px] font-semibold text-white/80">
                        {firstInitial}
                    </div>
                    <span className="text-[13px] font-medium text-white/65 hidden sm:inline">{userName}</span>
                </Link>
            </div>
        </header>
    );
}
