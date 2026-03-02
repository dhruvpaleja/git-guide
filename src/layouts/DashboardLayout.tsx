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
    <div className="min-h-screen bg-[#060608] text-white overflow-hidden flex relative selection:bg-accent/30 selection:text-accent font-['Manrope',sans-serif]">
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
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90] lg:hidden"
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
        {/* Ambient background — very subtle, not distracting */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-[-15%] left-[-5%] w-[40%] h-[40%] bg-[rgba(15,30,50,0.4)] blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-[rgba(50,20,60,0.15)] blur-[150px] rounded-full" />
        </div>

        <DashboardTopbar onMenuToggle={() => setMobileNavOpen((v) => !v)} />

        <main className="flex-1 px-4 pb-12 pt-5 sm:px-8 sm:pt-6 relative w-full max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
