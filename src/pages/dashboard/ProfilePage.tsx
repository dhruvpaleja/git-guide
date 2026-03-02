import { useAuth } from '@/context/AuthContext';
import { User, Mail, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="w-full pb-20 max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Profile</h1>
        <p className="text-sm text-white/40 mt-1">Your account information</p>
      </div>

      <div className="p-6 rounded-[24px] bg-[#0c0c0c] border border-[#2b2b2b]/80 mb-6">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-[#2b2b2b]/60">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shadow-inner shrink-0">
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{user?.name ?? '—'}</p>
            <p className="text-sm text-white/40 capitalize">{user?.role ?? 'user'}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-white/50" />
            </div>
            <div>
              <p className="text-xs text-white/30 uppercase tracking-widest mb-0.5">Name</p>
              <p className="text-sm text-white/80 font-medium">{user?.name ?? '—'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-white/50" />
            </div>
            <div>
              <p className="text-xs text-white/30 uppercase tracking-widest mb-0.5">Email</p>
              <p className="text-sm text-white/80 font-medium">{user?.email ?? '—'}</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl bg-[#0c0c0c] border border-[#2b2b2b]/80 text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm font-medium">Sign Out</span>
      </button>
    </div>
  );
}
