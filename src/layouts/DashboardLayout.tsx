import { Outlet } from 'react-router-dom';
import Navigation from '@/components/layout/Navigation';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navigation />
      <div className="flex">
        <aside className="hidden lg:block w-64 border-r border-white/10 min-h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-2">
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-4">
              Dashboard
            </p>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
