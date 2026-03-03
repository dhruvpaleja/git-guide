import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
    Home,
    Users,
    FileText,
    CalendarDays,
    Settings,
    LogOut,
    UserCircle
} from 'lucide-react';

/* ── Navigation items ── */
const navItems = [
    { to: '/practitioner', icon: Home, label: 'Home', exact: true },
    { to: '/practitioner/clients', icon: Users, label: 'Clients' },
    { to: '/practitioner/sessions', icon: FileText, label: 'Sessions' },
    { to: '/practitioner/availability', icon: CalendarDays, label: 'Availability' },
];

export function PractitionerSidebar() {
    const location = useLocation();

    const isActive = (path: string, exact?: boolean) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-20 md:w-24 bg-white border-r border-gray-100 flex flex-col items-center py-6 z-50">
            {/* Brand Icon */}
            <Link
                to="/home"
                className="w-[45px] h-[38px] mb-10 transition-all duration-200 hover:scale-110 active:scale-95"
                title="Go Home"
            >
                <img src="/images/main-logo.png" alt="Soul Yatri" className="w-full h-full object-contain" />
            </Link>

            {/* Back Button */}
            <Link
                to="/practitioner"
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center mb-8 hover:bg-gray-50 hover:border-gray-300 active:scale-90 transition-all duration-150"
            >
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </Link>

            {/* ─── Main Nav Pill ─── */}
            <nav className="bg-black text-white rounded-[40px] py-5 px-3 flex flex-col items-center gap-1.5 shadow-xl mb-4 relative overflow-hidden">
                {/* Subtle inner glow */}
                <div className="absolute inset-0 rounded-[40px] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                {navItems.map(item => {
                    const active = isActive(item.to, item.exact);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            title={item.label}
                            className={`relative p-2.5 rounded-full transition-all duration-200 ease-out group ${active
                                    ? 'bg-white text-black shadow-md scale-105'
                                    : 'text-white/60 hover:text-white hover:bg-white/10 active:scale-90'
                                }`}
                        >
                            <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? '' : 'group-hover:scale-110'}`} />

                            {/* Active indicator dot */}
                            {active && (
                                <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#14B8A6] shadow-sm" />
                            )}

                            {/* Tooltip */}
                            <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-gray-900 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none shadow-lg z-[60]">
                                {item.label}
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* ─── Bottom Section ─── */}
            <div className="flex flex-col gap-2 mt-auto">
                {/* Edit Profile */}
                <Link
                    to="/practitioner/profile"
                    title="Edit Profile"
                    className={`p-3 rounded-full transition-all duration-200 ease-out group relative ${isActive('/practitioner/profile')
                            ? 'bg-[#2C2F7A] text-white shadow-md'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 active:scale-90'
                        }`}
                >
                    <UserCircle className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                    <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-gray-900 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none shadow-lg z-[60]">
                        Edit Profile
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                    </span>
                </Link>

                {/* Settings */}
                <button
                    className="p-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 active:scale-90 transition-all duration-200 ease-out group relative"
                    title="Settings"
                >
                    <Settings className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90 group-hover:scale-110" />
                    <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-gray-900 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none shadow-lg z-[60]">
                        Settings
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                    </span>
                </button>

                {/* Logout */}
                <Link
                    to="/practitioner/logout"
                    title="Logout"
                    className={`p-3 rounded-full transition-all duration-200 ease-out group relative ${isActive('/practitioner/logout')
                            ? 'bg-red-500 text-white shadow-md'
                            : 'bg-black text-white hover:bg-red-600 active:scale-90'
                        }`}
                >
                    <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-gray-900 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none shadow-lg z-[60]">
                        Logout
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                    </span>
                </Link>
            </div>
        </aside>
    );
}
