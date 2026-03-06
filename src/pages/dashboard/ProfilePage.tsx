import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/api.service';
import {
  User,
  LogOut,
  Edit3,
  Check,
  X,
  Star,
  Calendar,
  Network,
  BookOpen,
  Shield,
  Loader2,
  Camera,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const defaultStats = [
  { label: 'Meditation', key: 'meditationSessions', icon: Network, color: 'text-accent' },
  { label: 'Journal Entries', key: 'journalEntries', icon: BookOpen, color: 'text-blue-400' },
  { label: 'Mood Logs', key: 'moodEntries', icon: Star, color: 'text-amber-400' },
  { label: 'Sessions', key: 'sessionsCompleted', icon: Calendar, color: 'text-purple-400' },
] as const;

export default function ProfilePage() {
  useDocumentTitle('Profile');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? '');
  const [editEmail, setEditEmail] = useState(user?.email ?? '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [statsData, setStatsData] = useState<Record<string, number>>({});
  const [statsLoading, setStatsLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar ?? null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Load profile stats from dashboard endpoint
  useEffect(() => {
    let cancelled = false;
    apiService.get<{ stats: Record<string, number> }>('/users/dashboard').then((res) => {
      if (!cancelled && res.success && res.data?.stats) {
        setStatsData(res.data.stats);
      }
    }).catch(() => { if (!cancelled) toast.error('Could not load profile stats'); }).finally(() => { if (!cancelled) setStatsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await apiService.put('/users/profile', {
        name: editName.trim(),
        email: editEmail.trim(),
      });
      if (res.success) {
        setEditing(false);
        toast.success('Profile updated');
      } else {
        setSaveError(res.error?.message ?? 'Failed to save profile');
      }
    } catch {
      setSaveError('Network error — could not save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploadingAvatar(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await apiService.upload('/users/avatar', formData);
      if (res.success) {
        toast.success('Avatar uploaded!');
      } else {
        toast.error('Upload failed');
        setAvatarPreview(user?.avatar ?? null); // Revert preview
      }
    } catch {
      toast.error('Upload failed');
      setAvatarPreview(user?.avatar ?? null); // Revert preview
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="w-full pb-20 max-w-2xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.05] flex items-center justify-center">
              <User className="w-5 h-5 text-white/50" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white tracking-tight">Profile</h1>
              <p className="text-sm text-white/35 mt-0.5">Account information &amp; stats</p>
            </div>
          </div>
          <button
            onClick={() => (editing ? handleSave() : setEditing(true))}
            disabled={saving}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors',
              editing
                ? 'bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20'
                : 'bg-white/[0.04] text-white/50 border border-white/[0.06] hover:bg-white/[0.06]',
              saving && 'opacity-60 cursor-not-allowed',
            )}
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : editing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            {saving ? 'Saving…' : editing ? 'Save' : 'Edit'}
          </button>
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04 }}
        className="rounded-[24px] bg-[#0c0c0c] border border-[#2b2b2b]/60 overflow-hidden mb-6"
      >
        {/* Avatar Banner */}
        <div className="relative h-24 bg-gradient-to-r from-accent/15 to-transparent">
          <div className="absolute -bottom-8 left-6">
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-2xl font-bold text-white ring-2 ring-[#0c0c0c] overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase() ?? 'U'
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                aria-label="Upload profile photo"
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-accent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-accent/90 disabled:opacity-50"
              >
                <Camera className="w-3 h-3 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="px-6 pt-12 pb-6">
          <AnimatePresence mode="wait">
            {editing ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-white/25 uppercase tracking-widest">Edit Profile</p>
                  <button
                    onClick={() => { setEditing(false); setEditName(user?.name ?? ''); setEditEmail(user?.email ?? ''); }}
                    aria-label="Cancel editing"
                    className="text-white/50 hover:text-white/60 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label htmlFor="profile-editName" className="text-xs text-white/50 block mb-1.5">Display Name</label>
                  <input
                    id="profile-editName"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-accent/40 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="profile-editEmail" className="text-xs text-white/50 block mb-1.5">Email Address</label>
                  <input
                    id="profile-editEmail"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-accent/40 transition-colors"
                    placeholder="you@example.com"
                    type="email"
                  />
                </div>
                {saveError && (
                  <p role="alert" className="text-xs text-red-400/80 bg-red-500/[0.06] border border-red-500/10 rounded-lg px-3 py-2">{saveError}</p>
                )}
              </motion.div>
            ) : (
              <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-lg font-semibold text-white">{user?.name ?? '—'}</p>
                <p className="text-sm text-white/35 mt-0.5">{user?.email ?? '—'}</p>
                <p className="text-xs text-white/20 mt-1 capitalize flex items-center gap-1.5">
                  <Shield className="w-3 h-3" /> {user?.role ?? 'user'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {defaultStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.04 }}
            className="rounded-[20px] bg-[#0c0c0c] border border-[#2b2b2b]/60 p-4"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center">
                <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
              </div>
              <span className="text-[11px] text-white/25">{stat.label}</span>
            </div>
            <p className="text-lg font-semibold text-white/90 pl-0.5">
              {statsLoading ? '—' : (statsData[stat.key] ?? 0)}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Sign Out */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-5 py-4 rounded-[20px] bg-[#0c0c0c] border border-[#2b2b2b]/60 text-red-400/80 hover:border-red-500/20 hover:bg-red-500/[0.03] transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm font-medium">Sign Out</span>
      </motion.button>
    </div>
  );
}
