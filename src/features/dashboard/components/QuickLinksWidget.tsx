import { HeartHandshake, HeadphonesIcon } from 'lucide-react';

export function QuickLinksWidget() {
    return (
        <div className="flex flex-col mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 px-1">Quick Links</h3>

            <div className="flex flex-col sm:flex-row gap-6">

                {/* Post Therapy Link (Orange) */}
                <div className="flex-1 rounded-[24px] p-8 flex flex-col items-center justify-center text-center text-white bg-gradient-to-tr from-[#FF6B00] to-[#FF8A00] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
                    <HeartHandshake className="w-8 h-8 mb-4 opacity-90" />
                    <h4 className="text-xl font-semibold mb-2">Post Therapy</h4>
                    <p className="text-[13px] text-white/80 font-medium">Get all the clients post therapy records.</p>
                </div>

                {/* Support Link (Blue/Cyan) */}
                <div className="flex-1 rounded-[24px] p-8 flex flex-col items-center justify-center text-center text-white bg-gradient-to-tr from-[#00AEEF] to-[#2DC8FF] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
                    <HeadphonesIcon className="w-8 h-8 mb-4 opacity-90" />
                    <h4 className="text-xl font-semibold mb-2">Support</h4>
                    <p className="text-[13px] text-white/80 font-medium">Get support for your better understanding.</p>
                </div>

            </div>
        </div>
    );
}
