import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PractitionerSidebar } from '@/features/dashboard/components/PractitionerSidebar';
import {
    Search, SlidersHorizontal, AlertCircle, ChevronLeft, ChevronRight,
    Calendar as CalendarIcon, Plus, ExternalLink
} from 'lucide-react';

/* ── Hard-coded schedule data ────────────────────────────────── */

interface ScheduleEvent {
    title: string;
    client: string;
    type: string;
    startHour: number; // 10 = 10AM, 14 = 2PM
    duration: number;  // in hours (0.5 = 30 min, 1 = 1hr)
    color: string;     // bg color
}

const weeklySchedule: Record<string, ScheduleEvent[]> = {
    MON: [
        { title: 'Karan Patel', client: 'Weekly Therapy', type: 'therapy', startHour: 10, duration: 1, color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
        { title: 'Suman Chaudhary', client: 'Counselling', type: 'counselling', startHour: 12, duration: 1, color: 'bg-blue-50 border-blue-200 text-blue-800' },
        { title: 'Thomas Simon', client: 'Weekly Therapy', type: 'therapy', startHour: 14, duration: 1, color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
        { title: 'Free Slot', client: '', type: 'free', startHour: 16, duration: 1, color: 'bg-gray-50 border-gray-200 text-gray-500' },
        { title: 'Raj Vardhan', client: 'Counselling', type: 'counselling', startHour: 18, duration: 1, color: 'bg-violet-50 border-violet-200 text-violet-800' },
    ],
    TUE: [
        { title: 'James Breathe', client: 'Weekly Therapy', type: 'therapy', startHour: 10, duration: 1, color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
        { title: 'Free Slot', client: '', type: 'free', startHour: 12, duration: 1, color: 'bg-gray-50 border-gray-200 text-gray-500' },
        { title: 'Asha Mehta', client: 'Therapy', type: 'therapy', startHour: 14, duration: 1, color: 'bg-amber-50 border-amber-200 text-amber-800' },
        { title: 'Priya Singh', client: 'Counselling', type: 'counselling', startHour: 16, duration: 1, color: 'bg-blue-50 border-blue-200 text-blue-800' },
        { title: 'Vikram Rao', client: 'Counselling', type: 'counselling', startHour: 18, duration: 1, color: 'bg-violet-50 border-violet-200 text-violet-800' },
    ],
    WED: [
        { title: 'Sabrina Nice', client: 'Counselling', type: 'counselling', startHour: 10, duration: 1, color: 'bg-blue-50 border-blue-200 text-blue-800' },
        { title: 'Zayn Malik', client: 'Counselling', type: 'counselling', startHour: 12, duration: 1, color: 'bg-violet-50 border-violet-200 text-violet-800' },
        { title: 'Karan Patel', client: 'Weekly Therapy', type: 'therapy', startHour: 14, duration: 1, color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
        { title: 'Free Slot', client: '', type: 'free', startHour: 16, duration: 1, color: 'bg-gray-50 border-gray-200 text-gray-500' },
        { title: 'Jasmine Sandles', client: 'Therapy', type: 'therapy', startHour: 18, duration: 1, color: 'bg-amber-50 border-amber-200 text-amber-800' },
    ],
    THU: [
        { title: 'Aditya Singhania', client: 'Therapy', type: 'therapy', startHour: 10, duration: 1, color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
        { title: 'Shubham Kamath', client: 'Counselling', type: 'counselling', startHour: 12, duration: 1, color: 'bg-blue-50 border-blue-200 text-blue-800' },
        { title: 'Sahil Verma', client: 'Counselling', type: 'counselling', startHour: 14, duration: 1, color: 'bg-violet-50 border-violet-200 text-violet-800' },
        { title: 'Hrithik Patel', client: 'Counselling', type: 'counselling', startHour: 16, duration: 1, color: 'bg-blue-50 border-blue-200 text-blue-800' },
        { title: 'Free Slot', client: '', type: 'free', startHour: 18, duration: 1, color: 'bg-gray-50 border-gray-200 text-gray-500' },
    ],
    FRI: [
        { title: 'Suman Chaudhary', client: 'Counselling', type: 'counselling', startHour: 10, duration: 1, color: 'bg-blue-50 border-blue-200 text-blue-800' },
        { title: 'Free Slot', client: '', type: 'free', startHour: 12, duration: 1, color: 'bg-gray-50 border-gray-200 text-gray-500' },
        { title: 'Asha Mehta', client: 'Therapy', type: 'therapy', startHour: 14, duration: 1, color: 'bg-amber-50 border-amber-200 text-amber-800' },
        { title: 'Thomas Simon', client: 'Weekly Therapy', type: 'therapy', startHour: 16, duration: 1, color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
        { title: 'Raj Vardhan', client: 'Counselling', type: 'counselling', startHour: 18, duration: 1, color: 'bg-violet-50 border-violet-200 text-violet-800' },
    ],
    SAT: [],
    SUN: [],
};

const timeSlots = ['10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'];
const timeHours = [10, 12, 14, 16, 18, 20];
const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

/* ── Calendar helpers ────────────────────────────────────────── */

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    const d = new Date(year, month, 1).getDay();
    return d === 0 ? 6 : d - 1; // Mon=0
}

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/* ── Component ───────────────────────────────────────────────── */

export default function ManageAvailabilityPage() {
    useDocumentTitle('Manage Availability');
    const [activeTab, setActiveTab] = useState<'schedule' | 'tasks' | 'events'>('schedule');
    const [viewMode, setViewMode] = useState<'Day' | 'Week'>('Week');
    const [currentMonth, setCurrentMonth] = useState(11); // December
    const [currentYear, setCurrentYear] = useState(2025);
    const [selectedDay, setSelectedDay] = useState(17);
    const [googleConnected, setGoogleConnected] = useState(false);

    const daysInMonth = useMemo(() => getDaysInMonth(currentYear, currentMonth), [currentYear, currentMonth]);
    const firstDay = useMemo(() => getFirstDayOfMonth(currentYear, currentMonth), [currentYear, currentMonth]);

    const calendarDays = useMemo(() => {
        const days: (number | null)[] = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let d = 1; d <= daysInMonth; d++) days.push(d);
        return days;
    }, [firstDay, daysInMonth]);

    const handlePrevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
        else setCurrentMonth(m => m - 1);
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
        else setCurrentMonth(m => m + 1);
    };

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
                        <button aria-label="Notifications" className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                            <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        </button>
                        <div className="hidden lg:flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-100 min-w-[220px]">
                            <span className="text-sm text-gray-400">Search for what you want...</span>
                            <Search className="w-4 h-4 text-gray-300 ml-auto" />
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
                <div className="px-6 md:px-10 py-6">
                    {/* Breadcrumb */}
                    <span className="text-xs text-gray-400 font-medium">Practitioner Dashboard</span>

                    {/* Title Row */}
                    <div className="flex items-start justify-between mt-1 mb-4">
                        <div className="flex items-center gap-3">
                            <Link to="/practitioner" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors bg-white">
                                <ChevronLeft className="w-4 h-4 text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-3xl md:text-[36px] font-bold text-gray-900 leading-tight">Manage Availability</h1>
                                <p className="text-[13px] text-gray-400 mt-1 max-w-lg leading-relaxed">
                                    Set your schedule, Manage recurring hours, and block time off in ease.
                                </p>
                            </div>
                        </div>

                        {/* Google Calendar Sync */}
                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                onClick={() => setGoogleConnected(!googleConnected)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${googleConnected
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                {googleConnected ? 'Google Calendar Synced' : 'Sync Google Calendar'}
                                {googleConnected && (
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                )}
                            </button>
                            <button aria-label="Add event" className="w-10 h-10 rounded-full bg-[#2C2F7A] text-white flex items-center justify-center hover:bg-[#24276B] transition-colors shadow-md">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* ─── Tab Bar ─── */}
                    <div className="flex items-center gap-1 bg-white rounded-full p-1 w-fit mb-6 border border-gray-100 shadow-sm">
                        {([
                            { key: 'schedule' as const, label: 'Weekly Schedule' },
                            { key: 'tasks' as const, label: 'Tasks' },
                            { key: 'events' as const, label: 'Events' },
                        ]).map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === tab.key
                                        ? 'bg-[#1A1A1A] text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* ─── Calendar Header ─── */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {monthNames[currentMonth]} {currentYear}
                            </h2>
                            <button className="px-4 py-1.5 rounded-full bg-[#1A1A1A] text-white text-xs font-semibold hover:bg-black transition-colors">
                                Today
                            </button>
                            <div className="flex items-center gap-1">
                                <button onClick={handlePrevMonth} aria-label="Previous month" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors bg-white">
                                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                                </button>
                                <button onClick={handleNextMonth} aria-label="Next month" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors bg-white">
                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 bg-white rounded-full p-1 border border-gray-100 shadow-sm">
                            {(['Day', 'Week'] as const).map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${viewMode === mode
                                            ? 'bg-[#1A1A1A] text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ─── Calendar Grid + Schedule ─── */}
                    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
                        {/* Day headers */}
                        <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-100">
                            <div className="p-3 text-center" />
                            {daysOfWeek.map((day, i) => {
                                const dayNum = (() => {
                                    // Calculate dates for Mon-Sun of current week around selectedDay
                                    const dateObj = new Date(currentYear, currentMonth, selectedDay);
                                    const currentDow = dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1; // Mon=0
                                    const mondayDate = selectedDay - currentDow;
                                    return mondayDate + i;
                                })();

                                return (
                                    <div key={day} className={`p-3 text-center border-l border-gray-100 cursor-pointer transition-colors ${dayNum === selectedDay ? 'bg-[#1A1A1A]' : 'hover:bg-gray-50'
                                        }`}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`Select ${day}${dayNum > 0 && dayNum <= daysInMonth ? ` ${dayNum}` : ''}`}
                                        onClick={() => { if (dayNum > 0 && dayNum <= daysInMonth) setSelectedDay(dayNum); }}
                                        onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && dayNum > 0 && dayNum <= daysInMonth) { e.preventDefault(); setSelectedDay(dayNum); } }}
                                    >
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${dayNum === selectedDay ? 'text-white/60' : 'text-gray-400'}`}>
                                            {day}
                                        </span>
                                        <div className={`text-lg font-bold mt-0.5 ${dayNum === selectedDay ? 'text-white' : 'text-gray-800'}`}>
                                            {dayNum > 0 && dayNum <= daysInMonth ? dayNum : ''}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Time slots grid */}
                        <div className="grid grid-cols-[80px_repeat(7,1fr)]">
                            {timeSlots.map((slot, slotIdx) => (
                                <div key={slot} className="contents">
                                    {/* Time label */}
                                    <div className="p-3 text-right pr-4 border-t border-gray-50">
                                        <span className="text-[11px] font-semibold text-gray-400">{slot}</span>
                                    </div>

                                    {/* Day columns */}
                                    {daysOfWeek.map(day => {
                                        const events = weeklySchedule[day] || [];
                                        const event = events.find(e => e.startHour === timeHours[slotIdx]);

                                        return (
                                            <div key={`${day}-${slot}`} className="p-1.5 border-l border-t border-gray-50 min-h-[90px] relative group">
                                                {event ? (
                                                    <div className={`rounded-lg p-2.5 h-full border ${event.color} transition-all hover:shadow-md cursor-pointer`}>
                                                        <p className="text-[12px] font-bold leading-tight truncate">{event.title}</p>
                                                        {event.client && (
                                                            <p className="text-[10px] mt-0.5 opacity-70 truncate">{event.client}</p>
                                                        )}
                                                        {event.type !== 'free' && (
                                                            <p className="text-[9px] mt-1 opacity-50 uppercase font-semibold tracking-wider">{slot}</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-full rounded-lg border border-dashed border-transparent group-hover:border-gray-200 transition-all flex items-center justify-center">
                                                        <Plus className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ─── Google Calendar Connect CTA ─── */}
                    {!googleConnected && (
                        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-[20px] border border-blue-100 p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                                    <CalendarIcon className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">Sync with Google Calendar</h3>
                                    <p className="text-[13px] text-gray-500 mt-0.5">Connect your Google Calendar to automatically import events and keep everything in sync.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setGoogleConnected(true)}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2C2F7A] text-white text-sm font-semibold hover:bg-[#24276B] transition-colors shadow-md shrink-0"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Connect Now
                            </button>
                        </div>
                    )}

                    {googleConnected && (
                        <div className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-[20px] border border-emerald-100 p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">Google Calendar Connected</h3>
                                    <p className="text-[13px] text-gray-500 mt-0.5">Your Google Calendar is synced. Events will automatically appear in your schedule.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setGoogleConnected(false)}
                                className="px-5 py-2 rounded-full text-sm font-semibold text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors"
                            >
                                Disconnect
                            </button>
                        </div>
                    )}

                    {/* Mini calendar widget */}
                    <div className="mt-6 mb-8 bg-white rounded-[20px] border border-gray-100 shadow-sm p-5 max-w-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-gray-900">{monthNames[currentMonth]} {currentYear}</h4>
                            <div className="flex items-center gap-1">
                                <button onClick={handlePrevMonth} aria-label="Previous month" className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                                    <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
                                </button>
                                <button onClick={handleNextMonth} aria-label="Next month" className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                                    <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                <span key={i} className="text-[10px] font-bold text-gray-400 uppercase py-1">{d}</span>
                            ))}
                            {calendarDays.map((day, i) => (
                                <button
                                    key={i}
                                    onClick={() => day && setSelectedDay(day)}
                                    disabled={!day}
                                    className={`w-8 h-8 rounded-full text-xs font-semibold transition-all ${day === selectedDay
                                            ? 'bg-[#1A1A1A] text-white shadow-sm'
                                            : day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()
                                                ? 'bg-teal-50 text-teal-700 font-bold'
                                                : day
                                                    ? 'text-gray-700 hover:bg-gray-100'
                                                    : 'invisible'
                                        }`}
                                >
                                    {day || ''}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
