import { useState, useCallback, useEffect } from 'react';
import { Bell, Loader2, CheckCheck } from 'lucide-react';
import apiService from '@/services/api.service';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Notifications</h1>
          <p className="text-sm text-white/40 mt-1">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-white/60 hover:text-white text-sm font-medium transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-white/40 animate-spin" /></div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20">
          <Bell className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No notifications yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => !n.isRead && markRead(n.id)}
              className={`p-4 rounded-2xl border transition-colors cursor-pointer ${n.isRead ? 'bg-[#0c0c0c] border-[#2b2b2b]/40 opacity-60' : 'bg-[#0c0c0c] border-[#2b2b2b]/80 hover:border-white/15'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.isRead ? 'bg-white/20' : 'bg-accent animate-pulse'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-sm font-medium text-white/80">{n.title}</span>
                    <span className="text-xs text-white/30 shrink-0">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-white/50">{n.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
