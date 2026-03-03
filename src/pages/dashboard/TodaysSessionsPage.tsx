import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PractitionerSidebar } from '@/features/dashboard/components/PractitionerSidebar';
import { PractitionerHeader } from '@/features/dashboard/components/PractitionerHeader';
import { Camera, MoreVertical, ChevronLeft, Star, TrendingUp } from 'lucide-react';

/* ── Hard-coded data ─────────────────────────────────────────── */

const heroSession = {
    name: 'Karan Patel',
    type: 'Weekly Therapy',
    age: 21,
    gender: 'Male',
    concern: 'Stress, Anxiety, Relationship',
    sessions: '2 / 4',
    time: '10 AM',
    avatar: 'https://i.pravatar.cc/150?img=12',
    discussionTopic:
        "Today we'll revisit your recent emotional experiences. Understand what triggers are affecting your stability.\nExplore how these patterns influence your daily mindset. And work on grounding techniques to restore inner balance.",
};

const upcomingSessions = [
    { name: 'Suman Chaudhary', type: 'Weekly Therapy', sessions: '1 / 4', concern: 'Stress, Career', time: '10 AM', avatar: 'https://i.pravatar.cc/150?img=32', hasPrevious: false },
    { name: 'James Breathe', type: 'Weekly Therapy', sessions: '3 / 4', concern: 'Stress, Career', time: '12 PM', avatar: 'https://i.pravatar.cc/150?img=53', hasPrevious: true },
    { name: 'Thomas Simon', type: 'Counselling', sessions: '3 / 4', concern: 'Anxiety, Relationship', time: '2 PM', avatar: 'https://i.pravatar.cc/150?img=14', hasPrevious: true },
    { name: 'Raj Vardhan', type: 'Counselling', sessions: '1 / 4', concern: 'Stress, Anxiety', time: '4 PM', avatar: 'https://i.pravatar.cc/150?img=60', hasPrevious: false },
];

const previousSessions = [
    { name: 'Asha Mehta', type: 'Therapy', sessions: '4 / 4', concern: 'Relationship', time: '9 AM', avatar: 'https://i.pravatar.cc/150?img=44', hasPrevious: true },
    { name: 'Vikram Rao', type: 'Counselling', sessions: '3 / 3', concern: 'Career, Stress', time: '11 AM', avatar: 'https://i.pravatar.cc/150?img=22', hasPrevious: true },
    { name: 'Priya Singh', type: 'Weekly Therapy', sessions: '2 / 2', concern: 'Anxiety', time: '1 PM', avatar: 'https://i.pravatar.cc/150?img=29', hasPrevious: false },
];

const monthlyChartData = [30, 45, 35, 55, 40, 60, 50, 70, 55, 65, 45, 75];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* ── Main component ──────────────────────────────────────────── */

export default function TodaysSessionsPage() {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'previous'>('upcoming');

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex font-sans">
            <PractitionerSidebar />

            <main className="flex-1 ml-20 md:ml-24 p-6 md:p-10 pt-10 overflow-y-auto">
                <div className="max-w-[1400px] mx-auto relative">
                    {/* Breadcrumb / Sub-header */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                        <span>Practitioner Dashboard</span>
                    </div>

                    {/* Page Title + Header */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <Link to="/practitioner" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                                <ChevronLeft className="w-4 h-4 text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-3xl md:text-[34px] font-bold text-gray-900">Today's Sessions</h1>
                                <p className="text-sm text-gray-400 mt-0.5">You can see all the today's sessions you have with your Clients.</p>
                            </div>
                        </div>
                        <PractitionerHeader />
                    </div>

                    {/* Two Column Layout */}
                    <div className="flex flex-col xl:flex-row gap-8 xl:gap-10">

                        {/* ─── Left Column: Analytics Sidebar ─── */}
                        <div className="xl:w-[280px] shrink-0 flex flex-col gap-6">
                            {/* Rating & Sessions Card */}
                            <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-sm text-gray-500 font-medium">Your Rating</span>
                                    <div className="flex items-center gap-1 ml-auto">
                                        <span className="text-2xl font-bold text-gray-900">4.8</span>
                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 font-medium">Total Sessions</span>
                                    <span className="text-2xl font-bold text-gray-900">100+</span>
                                </div>
                            </div>

                            {/* Performance Chart */}
                            <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-semibold text-gray-800">December</span>
                                    <TrendingUp className="w-4 h-4 text-teal-500" />
                                </div>
                                {/* Mini Bar Chart */}
                                <div className="flex items-end gap-1.5 h-[100px]">
                                    {monthlyChartData.map((val, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                            <div
                                                className={`w-full rounded-t-sm transition-all ${i === 11 ? 'bg-teal-500' : 'bg-gray-200'}`}
                                                style={{ height: `${val}%` }}
                                            />
                                            <span className="text-[8px] text-gray-400">{months[i].charAt(0)}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="text-xs text-teal-600 font-medium mt-3 hover:underline">View Details</button>
                            </div>

                            {/* Week Stats */}
                            <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500 font-medium">Total Week Sessions</span>
                                    <span className="text-lg font-bold text-gray-900">30</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 font-medium">Completed Sessions</span>
                                    <span className="text-lg font-bold text-gray-900">15</span>
                                </div>
                            </div>
                        </div>

                        {/* ─── Right Column: Sessions ─── */}
                        <div className="flex-1 flex flex-col gap-6">

                            {/* ── Hero Session Card ── */}
                            <div className="bg-[#1A1A1A] rounded-[24px] p-6 md:p-8 text-white">
                                {/* Top row: client details */}
                                <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6">
                                    <img src={heroSession.avatar} alt={heroSession.name} className="w-14 h-14 rounded-full object-cover border-2 border-white/20" />
                                    <div className="flex flex-col">
                                        <span className="font-bold text-lg">{heroSession.name}</span>
                                        <span className="text-xs text-white/60">{heroSession.type}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-6 md:gap-10 ml-auto text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-white/50 text-xs font-medium">Age</span>
                                            <span className="font-semibold">{heroSession.age}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white/50 text-xs font-medium">Gender</span>
                                            <span className="font-semibold">{heroSession.gender}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white/50 text-xs font-medium">Concern</span>
                                            <span className="font-semibold">{heroSession.concern}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white/50 text-xs font-medium">Sessions</span>
                                            <span className="font-semibold">{heroSession.sessions}</span>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-2 ml-auto">
                                        <span className="px-4 py-1.5 rounded-full border border-white/20 text-xs font-medium text-white/70">{heroSession.time}</span>
                                        <button className="px-5 py-1.5 rounded-full border border-white/20 text-xs font-semibold hover:bg-white/10 transition-colors">Reschedule</button>
                                        <button className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                                            <Camera className="w-4 h-4 text-white/70" />
                                        </button>
                                        <button className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                                            <MoreVertical className="w-4 h-4 text-white/70" />
                                        </button>
                                    </div>
                                </div>

                                {/* Discussion Topic */}
                                <div className="bg-white/5 rounded-[16px] p-5">
                                    <h4 className="text-sm font-semibold text-white/90 mb-3">Today's Discussion Topic</h4>
                                    <p className="text-sm text-white/60 leading-relaxed whitespace-pre-line">{heroSession.discussionTopic}</p>
                                    <div className="flex items-center gap-3 mt-5">
                                        <button className="px-6 py-2.5 rounded-full bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/20">
                                            Live Now
                                        </button>
                                        <button className="px-6 py-2.5 rounded-full bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-colors border border-white/10">
                                            Previous Sessions
                                        </button>
                                    </div>
                                    <button className="text-xs text-teal-400 hover:underline mt-3 block">View Client History</button>
                                </div>
                            </div>

                            {/* ── Tab Header ── */}
                            <div className="flex items-center gap-6 border-b border-gray-100 pb-3">
                                <button
                                    onClick={() => setActiveTab('upcoming')}
                                    className={`text-sm font-semibold pb-1 transition-colors ${activeTab === 'upcoming' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    Upcoming Sessions
                                </button>
                                <button
                                    onClick={() => setActiveTab('previous')}
                                    className={`text-sm font-semibold pb-1 transition-colors ${activeTab === 'previous' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    Previous Sessions
                                </button>
                            </div>

                            {/* ── Session Rows ── */}
                            <div className="flex flex-col gap-1">
                                {(activeTab === 'upcoming' ? upcomingSessions : previousSessions).map((s, i) => (
                                    <div key={i} className="flex items-center justify-between py-4 px-4 bg-white rounded-[16px] border border-gray-100 hover:shadow-sm transition-all group">
                                        {/* Left */}
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <img src={s.avatar} alt={s.name} className="w-11 h-11 rounded-full object-cover" />
                                            <div className="flex flex-col truncate">
                                                <span className="font-semibold text-[15px] text-gray-900 truncate">{s.name}</span>
                                                <span className="text-xs text-gray-400 font-medium">{s.type}</span>
                                            </div>
                                        </div>

                                        {/* Middle */}
                                        <div className="hidden md:flex items-center gap-8 text-sm">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-400 font-medium">Sessions</span>
                                                <span className="font-semibold text-gray-700">{s.sessions}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-400 font-medium">Concern</span>
                                                <span className="font-semibold text-gray-700">{s.concern}</span>
                                            </div>
                                        </div>

                                        {/* Right actions */}
                                        <div className="flex items-center gap-2 ml-4">
                                            {s.hasPrevious && (
                                                <button className="px-4 py-1.5 rounded-full text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors hidden sm:block">
                                                    Previous Sessions
                                                </button>
                                            )}
                                            <span className="px-4 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-500 bg-gray-50">{s.time}</span>
                                            <button className="px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-[#2C2F7A] hover:bg-[#24276B] transition-colors">
                                                Reschedule
                                            </button>
                                            <button className="w-8 h-8 rounded-full border border-gray-200 items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors hidden sm:flex">
                                                <Camera className="w-3.5 h-3.5" />
                                            </button>
                                            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
