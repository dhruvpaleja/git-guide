import { Bell, Search, Menu } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

interface DashboardTopbarProps { onMenuToggle: () => void; }

export default function DashboardTopbar({ onMenuToggle }: DashboardTopbarProps) {
    const { user } = useAuth();
    const userName = user?.name ?? 'Friend';
    const [searchQuery, setSearchQuery] = useState('');

    const firstInitial = userName.charAt(0).toUpperCase();

    return (
        <header className="sticky top-0 z-40 h-[60px] sm:h-16 w-full flex items-center justify-between px-5 sm:px-8 md:px-10 bg-[#050507]/80 backdrop-blur-2xl border-b border-white/[0.04] transition-colors duration-500">
            <div className="flex items-center gap-3">
                {/* Mobile hamburger */}
                <button
                    onClick={onMenuToggle}
                    className="lg:hidden w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] border border-white/[0.05] transition-colors"
                >
                    <Menu className="w-[18px] h-[18px] text-white/50" />
                </button>

                {/* Soul Yatri wordmark — small, understated */}
                <Link to="/dashboard" className="hidden lg:flex items-center">
                    <span className="text-[13px] font-medium text-white/25 tracking-wide">Soul Yatri</span>
                </Link>
            </div>

            <div className="flex items-center gap-2.5">
                {/* Search */}
                <div className="relative hidden md:flex items-center">
                    <Search className="absolute left-3.5 w-[13px] h-[13px] text-white/20" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-[180px] h-8 bg-white/[0.03] rounded-full pl-9 pr-4 text-[12px] text-white/70 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-white/[0.08] focus:bg-white/[0.05] border border-white/[0.04] transition-all"
                    />
                </div>

                {/* Notification Bell */}
                <Link
                    to="/dashboard/notifications"
                    className="relative w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center hover:bg-white/[0.06] border border-white/[0.04] transition-colors"
                >
                    <Bell className="w-[14px] h-[14px] text-white/40" />
                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500/80" />
                </Link>

                {/* Profile Pill */}
                <Link
                    to="/dashboard/profile"
                    className="h-8 pl-0.5 pr-3 rounded-full bg-white/[0.03] flex items-center gap-2 hover:bg-white/[0.06] border border-white/[0.04] transition-colors"
                >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-600/30 to-orange-800/20 flex items-center justify-center text-[11px] font-semibold text-white/70 border border-amber-500/10">
                        {firstInitial}
                    </div>
                    <span className="text-[12px] font-medium text-white/50 hidden sm:inline">{userName}</span>
                </Link>
            </div>
        </header>
    );
}
