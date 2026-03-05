import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { PractitionerSidebar } from '@/features/dashboard/components/PractitionerSidebar';
import { PractitionerHeader } from '@/features/dashboard/components/PractitionerHeader';
import { MetricCard } from '@/features/dashboard/components/MetricCard';
import { ScheduledSessionsWidget } from '@/features/dashboard/components/ScheduledSessionsWidget';
import { PendingApprovalsWidget } from '@/features/dashboard/components/PendingApprovalsWidget';
import { ClientIntakeWidget } from '@/features/dashboard/components/ClientIntakeWidget';
import { WeeklySessionsWidget, CompletedSessionsWidget } from '@/features/dashboard/components/SessionsRecordsWidgets';
import { QuickLinksWidget } from '@/features/dashboard/components/QuickLinksWidget';

export default function PractitionerDashboard() {
  useDocumentTitle('Practitioner Dashboard');
    return (
        <div className="min-h-screen bg-[#FDFDFD] flex font-sans">
            {/* Fixed Left Navigation */}
            <PractitionerSidebar />

            {/* Main Content Container (Pushed right to account for fixed sidebar) */}
            <main className="flex-1 ml-20 md:ml-24 p-6 md:p-10 pt-10 overflow-y-auto">
                <div className="max-w-[1400px] mx-auto relative">
                    <h1 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wide">Practitioner</h1>
                    <h2 className="text-3xl md:text-[32px] font-semibold mb-10 text-gray-900 border-b border-gray-100 pb-6">Your Dashboard</h2>

                    {/* Top Bar with Search & Quick Stats */}
                    <div className="absolute top-0 right-0 w-full md:w-auto xl:-mt-6">
                        <PractitionerHeader />
                    </div>

                    {/* Dashboard Grid Container - pushed down to clear the title and floating stats */}
                    <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 mt-[120px] xl:mt-[40px]">
                        {/* Left Column (Stats + Schedule + Approvals + Intake) */}
                        <div className="xl:w-[45%] flex flex-col gap-8">
                            {/* Metric Cards Row */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-2">
                                <MetricCard
                                    title="Today's Earning"
                                    date="Thurs 11 Dec"
                                    amount="₹5.5k.55"
                                    badgeText="+55% Today"
                                    theme="green"
                                />
                                <MetricCard
                                    title="Pending Pays"
                                    date="This Month"
                                    amount="₹1.3K.20"
                                    badgeText="+65% This Month"
                                    theme="red"
                                />
                                <MetricCard
                                    title="Monthly Records"
                                    date="December"
                                    amount="₹18.8k.50"
                                    badgeText="+70% This Month"
                                    theme="green"
                                />
                            </div>

                            <ScheduledSessionsWidget />

                            <PendingApprovalsWidget />

                            <div className="mb-8">
                                <ClientIntakeWidget />
                            </div>
                        </div>

                        {/* Right Column (Weekly Records + Completed + Quick Links) */}
                        <div className="xl:w-[55%] flex flex-col gap-8 mb-12">
                            <WeeklySessionsWidget />
                            <CompletedSessionsWidget />
                            <QuickLinksWidget />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
