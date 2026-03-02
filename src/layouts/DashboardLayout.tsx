import { Outlet } from 'react-router-dom';
import DashboardSidebar from '@/features/dashboard/components/layout/DashboardSidebar';
import DashboardTopbar from '@/features/dashboard/components/layout/DashboardTopbar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden flex relative selection:bg-accent/30 selection:text-accent font-['Manrope',sans-serif]">
      {/* Fixed Intelligent Sidebar */}
      <DashboardSidebar />

      {/* Main App Canvas - offset for sidebar */}
      <div className="flex-1 flex flex-col pl-[80px] h-screen overflow-y-auto hide-scrollbar relative z-0">
        {/* Subtle dynamic background glow */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-background to-background pointer-events-none -z-10" />

        <DashboardTopbar />

        <main className="flex-1 p-6 relative w-full h-full max-w-[1800px] mx-auto overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
