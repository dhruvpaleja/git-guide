import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Loader2, CheckCheck, AlertTriangle, Sparkles, Users, Heart, Zap, Info, Wifi, WifiOff } from 'lucide-react';
import apiService from '@/services/api.service';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { websocketService } from '@/services/websocket.service';

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

const typeConfig: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  alert: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-white/[0.04]' },
  insight: { icon: Sparkles, color: 'text-accent', bg: 'bg-white/[0.04]' },
  match: { icon: Users, color: 'text-purple-400', bg: 'bg-white/[0.04]' },
  wellness: { icon: Heart, color: 'text-pink-400', bg: 'bg-white/[0.04]' },
  system: { icon: Zap, color: 'text-amber-400', bg: 'bg-white/[0.04]' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-white/[0.04]' },
};

function getConfig(type: string) {
  return typeConfig[type] ?? { icon: Bell, color: 'text-white/40', bg: 'bg-white/[0.04]' };
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? 'yesterday' : `${days}d ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    const res = await apiService.get<{ notifications: Notification[]; unreadCount: number }>('/notifications');
    if (res.success && res.data) {
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  // Real-time WebSocket notifications
  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    if (!token) return;

    // Connect to WebSocket
    websocketService.connect(token);
    setIsConnected(websocketService.isConnected());

    // Listen for new notifications
    const unsubscribe = websocketService.on('notification', (data) => {
      const newNotif = data as Notification;
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);
      
      // Show toast for new notification
      toast(newNotif.title, {
        description: newNotif.body,
        icon: '🔔',
        duration: 4000,
      });
    });

    // Check connection status periodically
    const interval = setInterval(() => {
      setIsConnected(websocketService.isConnected());
    }, 3000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const markAllRead = async () => {
    const res = await apiService.put('/notifications/read-all', {});
    if (res.success) {
      toast.success('All marked as read');
      void load();
    }
  };

  const markRead = async (id: string) => {
    await apiService.put(`/notifications/${id}/read`, {});
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="w-full pb-20">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/[0.05] flex items-center justify-center relative">
            <Bell className="w-5 h-5 text-white/50" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[10px] font-bold text-white flex items-center justify-center"
              >
                {unreadCount}
              </motion.span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-white tracking-tight">Notifications</h1>
              {isConnected ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20"
                >
                  <Wifi className="w-2.5 h-2.5 text-green-400" />
                  <span className="text-[9px] text-green-400 font-medium uppercase tracking-wider">Live</span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10"
                >
                  <WifiOff className="w-2.5 h-2.5 text-white/30" />
                  <span className="text-[9px] text-white/30 font-medium uppercase tracking-wider">Offline</span>
                </motion.div>
              )}
            </div>
            <p className="text-sm text-white/35 mt-0.5">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.06] text-sm font-medium transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-white/40 animate-spin" /></div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20">
          <Bell className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No notifications yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {notifications.map((n, i) => {
              const cfg = getConfig(n.type);
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => !n.isRead && markRead(n.id)}
                  className={cn(
                    'p-4 rounded-[24px] border transition-colors cursor-pointer',
                    n.isRead
                      ? 'bg-[#0c0c0c] border-[#1a1a1a] opacity-60'
                      : 'bg-[#0c0c0c] border-[#2b2b2b]/60 hover:border-white/10',
                  )}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', cfg.bg)}>
                      <Icon className={cn('w-4 h-4', cfg.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm font-medium text-white/80 truncate">{n.title}</span>
                          {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />}
                        </div>
                        <span className="text-xs text-white/30 shrink-0">{timeAgo(n.createdAt)}</span>
                      </div>
                      <p className="text-sm text-white/45 line-clamp-2 mt-0.5">{n.body}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
