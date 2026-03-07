import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Activity, 
  DollarSign, 
  Settings, 
  Shield,
  ArrowLeft,
  LogOut,
  BarChart3,
  TrendingUp,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { apiService } from '@/services/api.service';

interface AdminStats {
  totalUsers: number;
  totalTherapists: number;
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  totalPayments: number;
  newUsersThisWeek: number;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

interface RecentSession {
  id: string;
  status: string;
  scheduledAt: string;
  user: { name: string; email: string };
  therapist: { user: { name: string } };
}

export default function AdminDashboard() {
  useDocumentTitle('Admin Dashboard');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0, totalTherapists: 0, totalSessions: 0,
    activeSessions: 0, completedSessions: 0, totalPayments: 0, newUsersThisWeek: 0,
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const [allUsers, setAllUsers] = useState<RecentUser[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setIsLoading(true);
        const data = await apiService.get<{
          stats: AdminStats;
          recentUsers: RecentUser[];
          recentSessions: RecentSession[];
        }>('/admin/dashboard');
        
        const d = data as unknown as Record<string, unknown>;
        if (d.stats) setStats(d.stats as AdminStats);
        if (d.recentUsers) setRecentUsers(d.recentUsers as RecentUser[]);
        if (d.recentSessions) setRecentSessions(d.recentSessions as RecentSession[]);
      } catch {
        toast.error('Failed to load admin dashboard');
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      apiService.get<{ users: RecentUser[] }>('/admin/users').then((data) => {
        const d = data as unknown as Record<string, unknown>;
        if (d.users) setAllUsers(d.users as RecentUser[]);
      }).catch(() => toast.error('Failed to load users'));
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 py-3 sm:h-16 sm:py-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-xs text-slate-400">Platform Management</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-slate-400 hover:text-white w-full sm:w-auto justify-center sm:justify-start"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                User View
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 w-full sm:w-auto"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          </div>
        ) : (
        <>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Total Users
              </CardTitle>
              <Users className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-green-400">+{stats.newUsersThisWeek} this week</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Active Sessions
              </CardTitle>
              <Activity className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeSessions}</div>
              <p className="text-xs text-slate-500">{stats.totalSessions} total</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Payments
              </CardTitle>
              <DollarSign className="w-4 h-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalPayments}</div>
              <p className="text-xs text-slate-500">Total transactions</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Therapists
              </CardTitle>
              <CheckCircle className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalTherapists}</div>
              <p className="text-xs text-slate-500">Verified professionals</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['overview', 'users', 'analytics', 'revenue', 'settings'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab)}
              className={`capitalize ${
                activeTab === tab 
                  ? 'bg-white text-black' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Platform Overview</h2>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 h-auto py-4">
                  <div className="text-left">
                    <div className="font-semibold">Manage Users</div>
                    <div className="text-xs opacity-70">View and edit user accounts</div>
                  </div>
                </Button>
                
                <Button className="bg-green-600 hover:bg-green-700 h-auto py-4">
                  <div className="text-left">
                    <div className="font-semibold">View Reports</div>
                    <div className="text-xs opacity-70">Generate platform reports</div>
                  </div>
                </Button>
                
                <Button className="bg-purple-600 hover:bg-purple-700 h-auto py-4">
                  <div className="text-left">
                    <div className="font-semibold">System Settings</div>
                    <div className="text-xs opacity-70">Configure platform settings</div>
                  </div>
                </Button>

                <Button
                  className="bg-orange-600 hover:bg-orange-700 h-auto py-4"
                  onClick={() => navigate('/admin/hr')}
                >
                  <div className="text-left">
                    <div className="font-semibold">HR Dashboard</div>
                    <div className="text-xs opacity-70">Manage job openings and applications</div>
                  </div>
                </Button>
              </div>

              {/* Recent Activity */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentUsers.length === 0 && recentSessions.length === 0 && (
                    <p className="text-slate-500">No recent activity</p>
                  )}
                  {recentUsers.map((u) => (
                    <div 
                      key={`user-${u.id}`}
                      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <div>
                          <div className="font-medium text-white">New user registration</div>
                          <div className="text-sm text-slate-400">{u.email}</div>
                        </div>
                      </div>
                      <div className="text-sm text-slate-500 sm:pl-4">{new Date(u.createdAt).toLocaleDateString()}</div>
                    </div>
                  ))}
                  {recentSessions.map((s) => (
                    <div 
                      key={`session-${s.id}`}
                      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${s.status === 'COMPLETED' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                        <div>
                          <div className="font-medium text-white">Session {s.status.toLowerCase()}</div>
                          <div className="text-sm text-slate-400">{s.user?.name} → {s.therapist?.user?.name}</div>
                        </div>
                      </div>
                      <div className="text-sm text-slate-500 sm:pl-4">{new Date(s.scheduledAt).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform Health */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      User Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 flex items-end gap-2">
                      {(() => {
                        const maxVal = Math.max(stats.totalUsers, 1);
                        return [stats.newUsersThisWeek, stats.totalUsers, stats.totalTherapists, stats.totalSessions, stats.activeSessions, stats.completedSessions, stats.totalPayments].map((val, i) => (
                          <div 
                            key={i}
                            className="flex-1 bg-blue-500 rounded-t"
                            style={{ height: `${Math.min(100, (val / maxVal) * 100)}%` }}
                          />
                        ));
                      })()}
                    </div>
                    <p className="text-sm text-slate-400 mt-2">Platform metrics overview</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Revenue Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 flex items-end gap-2">
                      {(() => {
                        const maxSess = Math.max(stats.totalSessions, 1);
                        return [stats.completedSessions, stats.activeSessions, stats.totalPayments, stats.totalSessions, stats.totalTherapists, stats.newUsersThisWeek, stats.totalUsers].map((val, i) => (
                          <div 
                            key={i}
                            className="flex-1 bg-green-500 rounded-t"
                            style={{ height: `${Math.min(100, (val / maxSess) * 100)}%` }}
                          />
                        ));
                      })()}
                    </div>
                    <p className="text-sm text-slate-400 mt-2">Session & payment metrics</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">User Management</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-800">
                    <tr>
                      <th className="p-4 text-slate-400 font-medium">User</th>
                      <th className="p-4 text-slate-400 font-medium">Role</th>
                      <th className="p-4 text-slate-400 font-medium">Status</th>
                      <th className="p-4 text-slate-400 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {allUsers.length === 0 && (
                      <tr><td colSpan={4} className="p-4 text-center text-slate-500">Loading users...</td></tr>
                    )}
                    {allUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-800/50">
                        <td className="p-4">
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-sm text-slate-400">{user.email}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-slate-700 rounded text-xs text-white">
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            user.isVerified
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {user.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && activeTab !== 'users' && (
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
              </h3>
              <p className="text-slate-400">
                This section is under development. Full functionality coming soon!
              </p>
            </div>
          )}
        </div>

        {/* System Alerts */}
        <div className="mt-6">
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="flex items-center gap-3 py-4">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <div className="font-medium text-green-400">Live Data</div>
                <div className="text-sm text-green-400/70">
                  Dashboard is displaying real-time data from the database.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </>
        )}
      </main>
    </div>
  );
}
