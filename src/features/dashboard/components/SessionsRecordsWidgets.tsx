import { UserRound, MessageSquare, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SessionRecordProps {
    name: string;
    type: string;
    date: string;
    time: string;
    actionText: string;
    isCompleted?: boolean;
}

export function SessionRecordItem({ name, type, date, time, actionText, isCompleted = false }: SessionRecordProps) {
    const actionButtonStyle = isCompleted
        ? "px-5 py-2 rounded-full text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
        : "px-5 py-2 rounded-full text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300";

    return (
        <div className="py-4 border-b border-gray-100 last:border-0 flex items-center justify-between group hover:bg-gray-50/50 transition-colors px-2 -mx-2 rounded-xl">
            {/* Left side: Avatar & Name */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center font-bold text-gray-900 bg-[#1A1A1A]">
                    <UserRound className="w-5 h-5 text-white/50" />
                </div>

                <div className="flex flex-col truncate pr-2">
                    <span className="font-semibold text-[15px] leading-snug truncate text-gray-900">{name}</span>
                    <span className="text-xs font-medium text-gray-500 truncate">{type}</span>
                </div>
            </div>

            {/* Right side: Actions & Time */}
            <div className="flex items-center gap-3 shrink-0">
                {/* Icons */}
                {!isCompleted && (
                    <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white transition-colors">
                        <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                )}

                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                </button>

                {/* Date/Time Tag */}
                <div className="px-5 py-2 rounded-full text-xs font-medium text-gray-600 border border-gray-200 bg-gray-50 hidden sm:block mx-1">
                    {date} | {time}
                </div>

                {/* Main Action Button */}
                <button className={`transition-all ${actionButtonStyle}`}>
                    {actionText}
                </button>
            </div>
        </div>
    );
}

export function WeeklySessionsWidget() {
    return (
        <div className="flex flex-col">
            <div className="flex items-baseline justify-between mb-4 px-1">
                <h3 className="text-xl font-semibold text-gray-900">Appointments & Sessions</h3>
                <Link to="/practitioner/sessions" className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">View All</Link>
            </div>

            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-200/60">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <h4 className="font-semibold text-gray-800">Weekly Sessions Records</h4>
                    <div className="flex gap-4 text-xs font-medium text-gray-400">
                        <span>Total Week Sessions - 30</span>
                        <span>Completed Sessions - 15</span>
                    </div>
                </div>

                <div className="flex flex-col">
                    <SessionRecordItem name="Yash Rathi" type="Weekly Therapy" date="Fri, 27 Dec" time="10 AM" actionText="Reschedule" />
                    <SessionRecordItem name="Esha Gup..." type="Counselling" date="Fri, 27 Dec" time="12 PM" actionText="Reschedule" />
                    <SessionRecordItem name="Peter Wa..." type="Weekly Therapy" date="Fri, 27 Dec" time="2 PM" actionText="Reschedule" />
                    <SessionRecordItem name="Manish S..." type="Counselling" date="Fri, 27 Dec" time="4 PM" actionText="Reschedule" />
                    <SessionRecordItem name="Vansh Th..." type="Counselling" date="Fri, 27 Dec" time="6 PM" actionText="Reschedule" />
                </div>
            </div>
        </div>
    );
}

export function CompletedSessionsWidget() {
    return (
        <div className="flex flex-col mt-8">
            <div className="flex items-baseline justify-between mb-4 px-1">
                <h3 className="text-xl font-semibold text-gray-900">Completed Sessions</h3>
                <button className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">View All</button>
            </div>

            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-200/60">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <h4 className="font-semibold text-gray-800">Last 5 Sessions Records</h4>
                    <span className="text-xs font-medium text-gray-400">Total Completed Sessions - 100+</span>
                </div>

                <div className="flex flex-col">
                    <SessionRecordItem name="Suresh C..." type="Counselling" date="Tue, 24 Dec" time="10 AM" actionText="See Summary" isCompleted={true} />
                    <SessionRecordItem name="Alex Seb..." type="Counselling" date="Tue, 24 Dec" time="12 PM" actionText="See Summary" isCompleted={true} />
                    <SessionRecordItem name="Steve Jobs" type="Therapy" date="Tue, 24 Dec" time="2 PM" actionText="See Summary" isCompleted={true} />
                    <SessionRecordItem name="Om Malh..." type="Counselling" date="Tue, 24 Dec" time="4 PM" actionText="See Summary" isCompleted={true} />
                    <SessionRecordItem name="Lalit Shar..." type="Therapy" date="Tue, 24 Dec" time="6 PM" actionText="See Summary" isCompleted={true} />
                </div>
            </div>
        </div>
    );
}
