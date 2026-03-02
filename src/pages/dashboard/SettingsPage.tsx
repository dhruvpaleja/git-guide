import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '@/services/api.service';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Moon,
  Bell,
  Shield,
  Eye,
  Download,
  Trash2,
  Globe,
  Volume2,
  Zap,
  Lock,
  Palette,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToggleSetting {
  id: string;
  label: string;
  description: string;
  icon: typeof Settings;
  defaultValue: boolean;
  iconColor: string;
}

const settingSections = [
  {
    title: 'Appearance',
    description: 'Visual preferences',
    settings: [
      { id: 'darkMode', label: 'Dark Mode', description: 'Keep the obsidian aesthetic (always on)', icon: Moon, defaultValue: true, iconColor: 'text-purple-400' },
      { id: 'animations', label: 'Animations', description: 'Enable motion and transitions', icon: Zap, defaultValue: true, iconColor: 'text-amber-400' },
      { id: 'compactMode', label: 'Compact Mode', description: 'Reduce spacing for denser layouts', icon: Palette, defaultValue: false, iconColor: 'text-blue-400' },
    ] as ToggleSetting[],
  },
  {
    title: 'Notifications',
    description: 'Control what alerts you receive',
    settings: [
      { id: 'pushNotifs', label: 'Push Notifications', description: 'Browser push for new matches and alerts', icon: Bell, defaultValue: true, iconColor: 'text-accent' },
      { id: 'soundEffects', label: 'Sound Effects', description: 'Audio feedback on interactions', icon: Volume2, defaultValue: false, iconColor: 'text-emerald-400' },
      { id: 'patternAlerts', label: 'Pattern Alerts', description: 'AI-detected behavioral loop warnings', icon: Zap, defaultValue: true, iconColor: 'text-red-400' },
    ] as ToggleSetting[],
  },
  {
    title: 'Privacy & Security',
    description: 'Control your data and visibility',
    settings: [
      { id: 'profileVisible', label: 'Profile Visible', description: 'Allow matched users to see your profile', icon: Eye, defaultValue: true, iconColor: 'text-blue-400' },
      { id: 'constellationPublic', label: 'Share Constellation', description: 'Allow constellation data for matching', icon: Globe, defaultValue: true, iconColor: 'text-emerald-400' },
      { id: 'twoFactor', label: 'Two-Factor Auth', description: 'Extra security on login', icon: Lock, defaultValue: false, iconColor: 'text-amber-400' },
    ] as ToggleSetting[],
  },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0',
        checked ? 'bg-accent' : 'bg-white/10',
      )}
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
        animate={{ left: checked ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      />
    </button>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    settingSections.forEach((s) => s.settings.forEach((setting) => { initial[setting.id] = setting.defaultValue; }));
    return initial;
  });
  const [loaded, setLoaded] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load settings from backend on mount
  useEffect(() => {
    let cancelled = false;
    apiService.get<Record<string, boolean>>('/users/settings').then((res) => {
      if (!cancelled && res.success && res.data) {
        setValues((prev) => ({ ...prev, ...res.data }));
      }
      if (!cancelled) setLoaded(true);
    }).catch(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, []);

  const toggleSetting = (id: string, value: boolean) => {
    const next = { ...values, [id]: value };
    setValues(next);

    // Debounce save to backend (400ms)
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      apiService.put('/users/settings', next).catch(() => {/* silent */});
    }, 400);
  };

  return (
    <div className="w-full pb-20 max-w-2xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/[0.05] flex items-center justify-center">
            <Settings className="w-5 h-5 text-white/50" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Settings</h1>
            <p className="text-sm text-white/35 mt-0.5">Preferences, privacy, and account controls</p>
          </div>
        </div>
      </motion.div>

      {/* Setting Sections */}
      <div className={cn('space-y-6 transition-opacity duration-300', !loaded && 'opacity-50')}>
        {settingSections.map((section, sIdx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sIdx * 0.06 }}
            className="rounded-[24px] bg-[#0c0c0c] border border-[#2b2b2b]/60 overflow-hidden"
          >
            <div className="px-5 pt-5 pb-4">
              <h2 className="text-sm font-semibold text-white/80">{section.title}</h2>
              <p className="text-xs text-white/35 mt-0.5">{section.description}</p>
            </div>

            <div className="divide-y divide-white/[0.03]">
              {section.settings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                      <setting.icon className={cn('w-4 h-4', setting.iconColor)} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white/80 font-medium">{setting.label}</p>
                      <p className="text-xs text-white/35 mt-0.5 truncate">{setting.description}</p>
                    </div>
                  </div>
                  <Toggle checked={values[setting.id]} onChange={(v) => toggleSetting(setting.id, v)} />
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[24px] bg-[#0c0c0c] border border-[#2b2b2b]/60 overflow-hidden"
        >
          <div className="px-5 pt-5 pb-4">
            <h2 className="text-sm font-semibold text-white/80">Data & Account</h2>
            <p className="text-xs text-white/35 mt-0.5">Export or manage your data</p>
          </div>

          <div className="divide-y divide-white/[0.03]">
            <button
              onClick={async () => {
                setExporting(true);
                try {
                  const res = await apiService.get('/users/export-my-data');
                  if (res.success && res.data) {
                    const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = 'my-data-export.json'; a.click();
                    URL.revokeObjectURL(url);
                    toast.success('Data exported!');
                  } else {
                    toast.info('Data export is not yet available on the server.');
                  }
                } catch { toast.error('Export failed'); }
                setExporting(false);
              }}
              disabled={exporting}
              className="flex items-center gap-3 w-full px-5 py-4 hover:bg-white/[0.02] transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
                <Download className={cn('w-4 h-4 text-blue-400', exporting && 'animate-pulse')} />
              </div>
              <div>
                <p className="text-sm text-white/80 font-medium">{exporting ? 'Exporting…' : 'Export All Data'}</p>
                <p className="text-xs text-white/35 mt-0.5">Download constellation, journal, and mood data as JSON</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/privacy')}
              className="flex items-center gap-3 w-full px-5 py-4 hover:bg-white/[0.02] transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
                <Shield className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-white/80 font-medium">Privacy Policy</p>
                <p className="text-xs text-white/35 mt-0.5">Review how your data is stored and used</p>
              </div>
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-3 w-full px-5 py-4 hover:bg-red-500/[0.02] transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-red-500/[0.05] flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-red-400/70" />
              </div>
              <div>
                <p className="text-sm text-red-400/80 font-medium">Delete Account</p>
                <p className="text-xs text-white/35 mt-0.5">Permanently erase all data. This cannot be undone.</p>
              </div>
            </button>

            {showDeleteConfirm && (
              <div className="px-5 py-4 bg-red-500/[0.03] flex items-center justify-between gap-3">
                <p className="text-xs text-red-400/80">Are you sure? This is irreversible.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1.5 text-xs rounded-lg bg-white/[0.05] text-white/60 hover:bg-white/[0.08] transition-colors"
                  >Cancel</button>
                  <button
                    onClick={async () => {
                      const res = await apiService.delete('/users/delete-account');
                      if (res.success) {
                        toast.success('Account deleted');
                        navigate('/login');
                      } else {
                        toast.info('Account deletion is not yet available on the server.');
                      }
                      setShowDeleteConfirm(false);
                    }}
                    className="px-3 py-1.5 text-xs rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium"
                  >Delete</button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
