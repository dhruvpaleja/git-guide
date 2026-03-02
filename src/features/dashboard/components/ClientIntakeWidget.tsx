import { UserRound } from 'lucide-react';

interface IntakeItemProps {
    name: string;
    type: string;
    dateStr: string;
}

export function ClientIntakeItem({ name, type, dateStr }: IntakeItemProps) {
    return (
        <div className="py-4 border-b border-gray-100 last:border-0 flex items-center justify-between bg-white w-full rounded-2xl px-4 border border-gray-100 shadow-sm mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-gray-900 bg-[#1A1A1A]">
                    <UserRound className="w-5 h-5 text-white/50" />
                </div>

                <div className="flex flex-col truncate pr-2">
                    <span className="font-semibold text-sm leading-snug truncate text-gray-900">{name}</span>
                    <span className="text-[11px] font-medium text-gray-500 truncate">{type}</span>
                </div>
            </div>

            <div className="flex flex-col items-start pr-4 border-l border-gray-100 pl-4 w-32 shrink-0">
                <span className="text-[10px] font-medium text-gray-400">Chosen Date</span>
                <span className="text-[11px] font-semibold text-gray-600 line-clamp-1">{dateStr}</span>
            </div>

            <button className="px-5 py-1.5 shrink-0 rounded-full text-xs font-semibold text-rose-500 border border-rose-100 bg-rose-50/50 hover:bg-rose-50 transition-colors ml-2">
                Ignore
            </button>
        </div>
    );
}

export function ClientIntakeWidget() {
    return (
        <div className="flex flex-col">
            <div className="flex items-baseline justify-between mb-4 px-1">
                <div className="flex items-baseline gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">Client Intake</h3>
                    <span className="text-xs font-medium text-gray-400 tracking-wide">(Read Only)</span>
                </div>
                <button className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">View All</button>
            </div>

            <div className="flex flex-col gap-0">
                <ClientIntakeItem
                    name="Sabrina N..."
                    type="For Counselling"
                    dateStr="Sat, 28 Dec, 4 PM"
                />
                <ClientIntakeItem
                    name="Zayn Malik"
                    type="For Counselling"
                    dateStr="Sat, 28 Dec | 2 PM"
                />
            </div>
        </div>
    );
}
