import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PractitionerSidebar } from '@/features/dashboard/components/PractitionerSidebar';
import { Search, SlidersHorizontal, AlertCircle, Camera, MoreVertical, ChevronLeft } from 'lucide-react';

/* ── Hard-coded data ─────────────────────────────────────────── */

const clients = [
    { name: 'Aditya Singhania', type: 'Therapy', clientId: 'SY 128845', sessions: '5 / 4', sessionDate: 'Fri, 27 Dec, 10 PM', time: '10 AM', avatar: '/images/practitioner/imgImage.png' },
    { name: 'Shubham Kamath', type: 'Counselling', clientId: 'SY 124239', sessions: '3 / 4', sessionDate: 'Fri, 27 Dec, 12 PM', time: '12 PM', avatar: '/images/practitioner/imgImage.png' },
    { name: 'Jasmine Sandles', type: 'Therapy', clientId: 'SY 123344', sessions: '5 / 4', sessionDate: 'Fri, 27 Dec, 2 PM', time: '2 PM', avatar: '/images/practitioner/imgImage.png' },
    { name: 'Sahil Verma', type: 'Counselling', clientId: 'SY 125534', sessions: '5 / 4', sessionDate: 'Fri, 27 Dec, 4 PM', time: '4 PM', avatar: '/images/practitioner/imgImage.png' },
    { name: 'Hrithik Patel', type: 'Counselling', clientId: 'SY 125334', sessions: '5 / 4', sessionDate: 'Fri, 27 Dec, 6 PM', time: '6 PM', avatar: '/images/practitioner/imgImage.png' },
];

const clientIntake = [
    {
        name: 'Sabrina Nice',
        type: 'Counselling',
        chosenDate: 'Sat, 28 Dec',
        chosenTime: '4 PM',
        avatar: '/images/practitioner/imgImage.png',
        discussionTopic: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
        name: 'Zayn Malik',
        type: 'Counselling',
        chosenDate: 'Sat, 28 Dec',
        chosenTime: '6 PM',
        avatar: '/images/practitioner/imgImage.png',
        discussionTopic: 'Seeking guidance on personal growth and self-awareness. Wants to explore coping mechanisms for workplace stress and improve mindfulness practices in daily routine.',
    },
];

/* ── Component ───────────────────────────────────────────────── */

export default function MyClientsPage() {
    useDocumentTitle('My Clients');
    const [activeFilter, setActiveFilter] = useState<'all' | 'therapy' | 'counselling'>('all');

    const filteredClients = activeFilter === 'all'
        ? clients
        : clients.filter(c => c.type.toLowerCase() === activeFilter);

    return (
        <div className="min-h-screen bg-[#F5F5F7] flex font-sans">
            <PractitionerSidebar />

            <main className="flex-1 ml-20 md:ml-24 overflow-y-auto">
                {/* ─── Top Welcome Bar ─── */}
                <div className="bg-white px-6 md:px-10 py-4 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl md:text-3xl font-bold text-gray-900">Welcome!</span>
                        <img src="/images/practitioner/imgImage.png" alt="Swati Agarwal" className="w-10 h-10 rounded-full object-cover" />
                        <div className="hidden md:flex flex-col">
                            <span className="text-sm font-semibold text-gray-800">Swati Agarwal</span>
                            <span className="text-[11px] text-gray-400">Counsellor | Therapist</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Notification bell */}
                        <button aria-label="Notifications" className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                            <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        </button>
                        {/* Search */}
                        <div className="hidden lg:flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-100 min-w-[220px]">
                            <span className="text-sm text-gray-400">Search for what you want...</span>
                            <Search className="w-4 h-4 text-gray-300 ml-auto" />
                        </div>
                        {/* Filter icon */}
                        <button aria-label="Filter" className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                            <SlidersHorizontal className="w-4 h-4" />
                        </button>
                        {/* Info icon */}
                        <button aria-label="Info" className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                            <AlertCircle className="w-4 h-4" />
                        </button>
                        {/* Ignored Clients */}
                        <button className="text-sm font-medium text-orange-400 hover:text-orange-500 transition-colors hidden md:block">Ignored Clients</button>
                        {/* Report */}
                        <button className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors hidden md:block">Report</button>
                    </div>
                </div>

                {/* ─── Floating Stats Bar ─── */}
                <div className="px-6 md:px-10 -mt-0">
                    <div className="bg-[#1A1A1A] text-white rounded-b-[20px] px-6 py-3 flex items-center justify-between max-w-3xl ml-auto">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-white/50 font-medium">Total Earnings</span>
                            <span className="text-xl font-bold">₹48.5k<span className="text-sm font-normal text-white/50">.80</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-white/50 font-medium">Your Rating</span>
                            <span className="text-xl font-bold">4.8</span>
                            <span className="text-yellow-400 text-lg">★</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-white/50 font-medium">Total Sessions</span>
                            <span className="text-xl font-bold">100+</span>
                        </div>
                    </div>
                </div>

                {/* ─── Page Content ─── */}
                <div className="px-6 md:px-10 py-6">
                    {/* Breadcrumb */}
                    <span className="text-xs text-gray-400 font-medium">Practitioner Dashboard</span>

                    {/* Title Row */}
                    <div className="flex items-start justify-between mt-1 mb-2">
                        <div className="flex items-center gap-3">
                            <Link to="/practitioner" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors bg-white">
                                <ChevronLeft className="w-4 h-4 text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-3xl md:text-[36px] font-bold text-gray-900 leading-tight">My Clients</h1>
                                <p className="text-[13px] text-gray-400 mt-1 max-w-md leading-relaxed">
                                    Review client details before the session and securely document insights, summaries, and assigned habits after the session.
                                </p>
                            </div>
                        </div>
                        <button className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[#2C2F7A] hover:bg-[#24276B] transition-colors shrink-0 hidden md:block mt-2">
                            Request All Clients
                        </button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2 mt-6 mb-5">
                        {(['all', 'therapy', 'counselling'] as const).map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all capitalize ${activeFilter === filter
                                        ? 'bg-[#1A1A1A] text-white shadow-sm'
                                        : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {filter === 'all' ? 'All Clients' : filter}
                            </button>
                        ))}
                    </div>

                    {/* Client List */}
                    <div className="flex flex-col gap-2">
                        {filteredClients.map((client, i) => (
                            <div
                                key={i}
                                className="flex items-center py-4 px-5 bg-white rounded-[16px] border border-gray-100 hover:shadow-md transition-all group"
                            >
                                {/* Avatar + Name */}
                                <div className="flex items-center gap-3 min-w-[180px] lg:min-w-[220px]">
                                    <img src={client.avatar} alt={client.name} className="w-11 h-11 rounded-full object-cover shrink-0 border border-gray-100" />
                                    <div className="flex flex-col truncate">
                                        <span className="font-semibold text-[14px] text-gray-900 truncate">{client.name}</span>
                                        <span className="text-[11px] text-gray-400 font-medium">{client.type}</span>
                                    </div>
                                </div>

                                {/* Details columns */}
                                <div className="hidden lg:flex items-center gap-8 flex-1 justify-center text-sm">
                                    <div className="flex flex-col min-w-[80px]">
                                        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Client ID</span>
                                        <span className="font-bold text-gray-800 text-[13px]">{client.clientId}</span>
                                    </div>
                                    <div className="flex flex-col min-w-[60px]">
                                        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Sessions</span>
                                        <span className="font-bold text-gray-800 text-[13px]">{client.sessions}</span>
                                    </div>
                                    <div className="flex flex-col min-w-[120px]">
                                        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Session Date</span>
                                        <span className="font-bold text-gray-800 text-[13px]">{client.sessionDate}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 ml-auto shrink-0">
                                    <button className="min-h-[36px] px-4 py-2 rounded-full text-[11px] font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors hidden sm:block">
                                        Previous Sessions
                                    </button>
                                    <span className="min-h-[36px] inline-flex items-center px-4 py-2 rounded-full border border-gray-200 text-[11px] font-semibold text-gray-500 bg-gray-50">{client.time}</span>
                                    <button className="min-h-[36px] px-5 py-2 rounded-full text-[11px] font-bold text-white bg-[#14B8A6] hover:bg-[#0D9488] transition-colors shadow-sm">
                                        Reschedule
                                    </button>
                                    <button aria-label="Video call" className="w-8 h-8 rounded-full border border-gray-200 items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors hidden sm:flex">
                                        <Camera className="w-3.5 h-3.5" />
                                    </button>
                                    <button aria-label="More options" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Client Intake (Read Only) ── */}
                    <div className="mt-10 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                                Client Intake <span className="text-sm font-normal text-gray-400">(Read Only)</span>
                            </h3>
                            <button className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">View All</button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {clientIntake.map((intake, i) => (
                                <div key={i} className="bg-white rounded-[20px] border border-gray-100 p-5 hover:shadow-md transition-all">
                                    {/* Top Row */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <img src={intake.avatar} alt={intake.name} className="w-11 h-11 rounded-full object-cover border border-gray-100" />
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-[14px] text-gray-900">{intake.name}</span>
                                                <span className="text-[11px] text-gray-400 font-medium">{intake.type}</span>
                                            </div>
                                        </div>

                                        <div className="hidden sm:flex items-center gap-8 text-sm">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Chosen Date</span>
                                                <span className="font-bold text-gray-800 text-[13px]">{intake.chosenDate}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Chosen Time</span>
                                                <span className="font-bold text-gray-800 text-[13px]">{intake.chosenTime}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button className="min-h-[36px] px-5 py-2 rounded-full text-[11px] font-bold text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors">
                                                Ignore
                                            </button>
                                            <button aria-label="Video call" className="w-8 h-8 rounded-full border border-gray-200 items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors hidden sm:flex">
                                                <Camera className="w-3.5 h-3.5" />
                                            </button>
                                            <button aria-label="More options" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Discussion Topic */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Today's Discussion Topic</h4>
                                        <div className="bg-[#F9F9FB] rounded-[12px] p-4 border border-gray-50">
                                            <p className="text-[13px] text-gray-500 leading-relaxed">{intake.discussionTopic}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
