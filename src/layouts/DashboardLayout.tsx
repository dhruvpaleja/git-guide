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
    <div className="min-h-screen bg-[#050507] text-white overflow-hidden flex relative selection:bg-amber-500/20 selection:text-amber-200 font-['Inter','Manrope',system-ui,sans-serif]">
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
        {/* Ambient background — warm, cinematic, matching landing page */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-[-20%] left-[5%] w-[50%] h-[50%] bg-orange-900/[0.06] blur-[180px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-amber-900/[0.04] blur-[160px] rounded-full" />
        </div>

        <DashboardTopbar onMenuToggle={() => setMobileNavOpen((v) => !v)} />

        <main id="main-content" className="flex-1 px-5 pb-12 pt-6 sm:px-8 md:px-10 sm:pt-8 relative w-full max-w-[1400px] mx-auto">
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
