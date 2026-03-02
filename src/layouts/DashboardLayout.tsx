import { useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import DashboardSidebar from '@/features/dashboard/components/layout/DashboardSidebar';
import DashboardTopbar from '@/features/dashboard/components/layout/DashboardTopbar';

export default function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex relative selection:bg-accent/30 selection:text-accent font-['Manrope',sans-serif]">
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden lg:block">
        <DashboardSidebar />
      </div>

      {/* Mobile Backdrop + Drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
              onClick={closeMobileNav}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-[95] lg:hidden"
            >
              <DashboardSidebar forceExpanded onNavigate={closeMobileNav} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col lg:pl-[84px] h-screen overflow-y-auto hide-scrollbar relative z-0">
        {/* Ambient background gradients */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[rgba(15,40,60,0.5)] blur-[140px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#cc6200]/10 blur-[150px] rounded-full mix-blend-screen" />
        </div>

        <DashboardTopbar onMenuToggle={() => setMobileNavOpen((v) => !v)} />

        <main className="flex-1 px-4 pb-12 pt-6 sm:px-8 sm:pt-8 relative w-full max-w-[1800px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
