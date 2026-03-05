import { UserRound } from 'lucide-react';

interface ApprovalItemProps {
    name: string;
    type: string;
}

export function PendingApprovalItem({ name, type }: ApprovalItemProps) {
    return (
        <div className="p-4 rounded-[20px] bg-white border border-gray-100 flex items-center justify-between hover:border-gray-200 transition-colors shadow-sm">
            <div className="flex items-center gap-3">
                {/* Avatar Placeholder */}
                <div className="w-10 h-10 rounded-full bg-gray-100 max-w-full flex items-center justify-center font-bold text-gray-900">
                    <UserRound className="w-5 h-5 text-gray-400" />
                </div>

                <div className="flex flex-col">
                    <span className="font-semibold text-sm leading-snug">{name}</span>
                    <span className="text-[11px] font-medium text-gray-500">{type}</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button className="min-h-[36px] px-5 py-2 rounded-full text-xs font-semibold text-gray-500 border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                    Ignore
                </button>
                <button className="min-h-[36px] px-5 py-2 rounded-full text-xs font-semibold text-green-600 border border-green-200 bg-green-50/50 hover:bg-green-50 transition-colors">
                    Accept
                </button>
            </div>
        </div>
    );
}

export function PendingApprovalsWidget() {
    return (
        <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 px-1">Pending Approvals</h3>
            <div className="bg-[#F8F9FB] rounded-[24px] p-5 shadow-sm border border-gray-100/50">
                <div className="flex flex-col gap-3">
                    <PendingApprovalItem name="Akshay S..." type="For Therapy" />
                    <PendingApprovalItem name="Kunal Wa..." type="For Therapy" />
                    <PendingApprovalItem name="Lalita Qu..." type="For Counselling" />
                    <PendingApprovalItem name="Parth Vis..." type="For Counselling" />
                    <PendingApprovalItem name="Samarth ..." type="For Counselling" />
                </div>
            </div>
        </div>
    );
}
