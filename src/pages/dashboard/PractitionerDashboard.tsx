import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState, useEffect } from 'react';
import { PractitionerSidebar } from '@/features/dashboard/components/PractitionerSidebar';
import { PractitionerHeader } from '@/features/dashboard/components/PractitionerHeader';
import { MetricCard } from '@/features/dashboard/components/MetricCard';
import { ScheduledSessionsWidget } from '@/features/dashboard/components/ScheduledSessionsWidget';
import { PendingApprovalsWidget } from '@/features/dashboard/components/PendingApprovalsWidget';
import { ClientIntakeWidget } from '@/features/dashboard/components/ClientIntakeWidget';
import { WeeklySessionsWidget, CompletedSessionsWidget } from '@/features/dashboard/components/SessionsRecordsWidgets';
import { QuickLinksWidget } from '@/features/dashboard/components/QuickLinksWidget';
import { therapyApi } from '@/services/therapy.api';

export default function PractitionerDashboard() {
  useDocumentTitle('Practitioner Dashboard');

  const [metrics, setMetrics] = useState({
    todayEarning: '₹0',
    pendingPays: '₹0',
    monthlyRecords: '₹0',
  });

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [dashboard, metricsData] = await Promise.all([
          therapyApi.getTherapistDashboard(),
          therapyApi.getTherapistMetrics(),
        ]);
        const d = dashboard as unknown as Record<string, unknown>;
        const m = metricsData as unknown as Record<string, unknown>;
        const totalCompleted = Number(m.totalCompletedSessions || 0);
        const computedPrice = Number(m.computedPrice || d.pricePerSession || 500);
        const totalEarnings = totalCompleted * computedPrice;
        const todayEarnings = Number(d.todayEarnings || 0);

        setMetrics({
          todayEarning: `₹${(todayEarnings / 1000).toFixed(1)}k`,
          pendingPays: `₹${((Number(d.pendingAmount || 0)) / 1000).toFixed(1)}k`,
          monthlyRecords: `₹${(totalEarnings / 1000).toFixed(1)}k`,
        });
      } catch {
        // Keep defaults on error
      }
    }
    loadMetrics();
  }, []);
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
                                    date={new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                                    amount={metrics.todayEarning}
                                    badgeText="+55% Today"
                                    theme="green"
                                />
                                <MetricCard
                                    title="Pending Pays"
                                    date="This Month"
                                    amount={metrics.pendingPays}
                                    badgeText="+65% This Month"
                                    theme="red"
                                />
                                <MetricCard
                                    title="Monthly Records"
                                    date={new Date().toLocaleDateString('en-IN', { month: 'long' })}
                                    amount={metrics.monthlyRecords}
                                    badgeText="+70% This Month"
                                    theme="green"
                                />
                            </div>

                            <ScheduledSessionsWidget variant="practitioner" />

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
