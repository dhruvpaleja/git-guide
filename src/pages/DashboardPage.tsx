import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SoulConstellationMap from '@/features/dashboard/components/widgets/SoulConstellationMap';
import TheConfessional from '@/features/dashboard/components/widgets/TheConfessional';
import HumanMatchCard from '@/features/dashboard/components/widgets/HumanMatchCard';
import SoulSyncCard from '@/features/dashboard/components/widgets/SoulSyncCard';
import PatternAlerts from '@/features/dashboard/components/widgets/PatternAlerts';

export default function DashboardPage() {
  const [isConfessionalActive, setIsConfessionalActive] = useState(false);

  return (
    <div className="w-full h-full pb-20 relative">

      {/* Global Background Dimmer for "Safe Room" Effect */}
      <AnimatePresence>
        {isConfessionalActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10 p-2">

        {/* Left Column (Main Focus - Map & Interaction) */}
        <div className={`xl:col-span-2 flex flex-col gap-8 transition-all duration-700 ease-in-out ${isConfessionalActive ? "opacity-30 blur-md grayscale-[0.5]" : "opacity-100"}`}>
          <SoulConstellationMap />
        </div>

        {/* Right Column (Intelligence & Funnels) */}
        <div className={`xl:col-span-1 flex flex-col gap-6 transition-all duration-700 ease-in-out ${isConfessionalActive ? "opacity-30 blur-md grayscale-[0.5]" : "opacity-100"}`}>
          <PatternAlerts />

          <div className="my-1">
            <h3 className="text-white/40 uppercase tracking-widest text-[11px] font-semibold mb-3 ml-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Ecosystem Resonance
            </h3>
            <SoulSyncCard type="romantic" />
          </div>

          <div className="my-1">
            <h3 className="text-white/40 uppercase tracking-widest text-[11px] font-semibold mb-3 ml-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
              Professional Resolution
            </h3>
            <HumanMatchCard />
          </div>
        </div>

      </div>

      {/* Confessional Container - Breaks out of the dimming effect */}
      <div className={`mt-8 relative z-50 transition-all duration-700 ease-in-out ${isConfessionalActive ? '-translate-y-32 xl:-translate-y-64 scale-105 shadow-2xl' : 'translate-y-0 scale-100 xl:w-2/3'}`}>
        <TheConfessional onFocusChange={setIsConfessionalActive} />
      </div>

    </div>
  );
}
