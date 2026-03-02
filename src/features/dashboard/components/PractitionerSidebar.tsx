import {
    Home,
    Users,
    FileText,
    Settings,
    LogOut
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function PractitionerSidebar() {
    return (
        <aside className="fixed left-0 top-0 h-screen w-20 md:w-24 bg-white border-r border-gray-100 flex flex-col items-center py-6 z-50">
            {/* Brand Icon */}
            <Link to="/home" className="w-[45px] h-[38px] mb-10 transition-transform hover:scale-105" title="Go Home">
                <img src="/images/main-logo.png" alt="Soul Yatri" className="w-full h-full object-contain" />
            </Link>

            {/* Back Button Placeholder */}
            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center mb-8 hover:bg-gray-50 transition-colors">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Main Nav Pill */}
            <nav className="bg-black text-white rounded-[40px] py-6 px-3 flex flex-col items-center gap-6 shadow-xl mb-4">
                <button className="p-2 bg-white text-black rounded-full shadow-sm hover:scale-105 transition-transform" title="Home">
                    <Home className="w-5 h-5" />
                </button>
                <button className="p-2 text-white/70 hover:text-white transition-colors" title="Clients">
                    <Users className="w-5 h-5" />
                </button>
                <button className="p-2 text-white/70 hover:text-white transition-colors" title="Records">
                    <FileText className="w-5 h-5" />
                </button>
            </nav>

            {/* Secondary Nav Items */}
            <div className="flex flex-col gap-6 mt-4">
                <button className="p-3 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 transition-colors" title="Settings">
                    <Settings className="w-5 h-5" />
                </button>
                <button className="p-3 bg-black rounded-full text-white hover:bg-gray-800 transition-colors" title="Logout">
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </aside>
    );
}
