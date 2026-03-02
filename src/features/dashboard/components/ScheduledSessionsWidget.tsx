import { UserRound } from 'lucide-react';

interface SessionItemProps {
    name: string;
    type: string;
    time: string;
    isActive?: boolean;
}

export function ScheduledSessionItem({ name, type, time, isActive = false }: SessionItemProps) {
    const bgColor = isActive ? 'bg-[#1A1A1A] text-white' : 'bg-white text-gray-900 border border-gray-100 hover:border-gray-200';
    const subtextColor = isActive ? 'text-white/60' : 'text-gray-500';
    const avatarBg = isActive ? 'bg-white/10' : 'bg-gray-100 text-gray-400';
    const timeBg = isActive ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-600 border border-gray-100';
    const buttonStyle = isActive
        ? 'bg-green-900/40 text-green-400 border border-green-800/50 hover:bg-green-900/60'
        : 'text-green-600 border border-green-200 bg-green-50/50 hover:bg-green-50';

    return (
        <div className={`p-4 rounded-[20px] flex items-center justify-between transition-colors shadow-sm ${bgColor}`}>
            <div className="flex items-center gap-3">
                {/* Avatar Placeholder */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${avatarBg}`}>
                    {isActive ? (
                        <UserRound className="w-5 h-5 text-white/50" />
                    ) : (
                        name.charAt(0)
                    )}
                </div>

                <div className="flex flex-col">
                    <span className="font-semibold text-sm leading-snug">{name}</span>
                    <span className={`text-[11px] font-medium ${subtextColor}`}>{type}</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className={`px-4 py-1.5 rounded-full text-xs font-semibold ${timeBg}`}>
                    {time}
                </div>
                <button className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-colors ${buttonStyle}`}>
                    Start Call
                </button>
            </div>
        </div>
    );
}

export function ScheduledSessionsWidget() {
    return (
        <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 px-1">Today's Scheduled Sessions</h3>
            <div className="flex flex-col gap-3">
                <ScheduledSessionItem name="Karan Patel" type="Weekly Therapy" time="10 AM" isActive={true} />
                <ScheduledSessionItem name="Suman C..." type="Weekly Therapy" time="12 PM" />
                <ScheduledSessionItem name="James Br..." type="Weekly Therapy" time="2 PM" />
                <ScheduledSessionItem name="Thomas..." type="Counselling" time="4 PM" />
                <ScheduledSessionItem name="Raj Vardh..." type="Counselling" time="6 PM" />
            </div>
        </div>
    );
}
