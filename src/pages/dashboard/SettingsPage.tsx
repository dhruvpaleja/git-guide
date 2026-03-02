import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="w-full pb-20 max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-white/40 mt-1">App preferences and privacy controls</p>
      </div>

      <div className="p-6 rounded-[24px] bg-[#0c0c0c] border border-[#2b2b2b]/80 flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <Settings className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">Settings coming soon</p>
        </div>
      </div>
    </div>
  );
}
