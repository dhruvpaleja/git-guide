import { useState } from 'react';
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
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

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
              <div className="text-2xl font-bold text-white">1,284</div>
              <p className="text-xs text-green-400">+24 this week</p>
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
              <div className="text-2xl font-bold text-white">156</div>
              <p className="text-xs text-slate-500">Currently online</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Revenue
              </CardTitle>
              <DollarSign className="w-4 h-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₹4.2L</div>
              <p className="text-xs text-green-400">+12% this month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                System Status
              </CardTitle>
              <CheckCircle className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Healthy</div>
              <p className="text-xs text-slate-500">All systems operational</p>
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
              </div>

              {/* Recent Activity */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: 'New user registration', user: 'rahul@example.com', time: '2 min ago', type: 'user' },
                    { action: 'Therapist verified', user: 'dr.sarah@example.com', time: '15 min ago', type: 'success' },
                    { action: 'Payment received', user: 'Order #1234', time: '1 hour ago', type: 'payment' },
                    { action: 'System backup completed', user: 'Automated', time: '2 hours ago', type: 'system' },
                  ].map((activity, index) => (
                    <div 
                      key={index}
                      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'user' ? 'bg-blue-400' :
                          activity.type === 'success' ? 'bg-green-400' :
                          activity.type === 'payment' ? 'bg-yellow-400' :
                          'bg-slate-400'
                        }`} />
                        <div>
                          <div className="font-medium text-white">{activity.action}</div>
                          <div className="text-sm text-slate-400">{activity.user}</div>
                        </div>
                      </div>
                      <div className="text-sm text-slate-500 sm:pl-4">{activity.time}</div>
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
                      {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                        <div 
                          key={i}
                          className="flex-1 bg-blue-500 rounded-t"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-slate-400 mt-2">Weekly user registrations</p>
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
                      {[30, 50, 40, 70, 60, 85, 75].map((height, i) => (
                        <div 
                          key={i}
                          className="flex-1 bg-green-500 rounded-t"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-slate-400 mt-2">Weekly revenue in thousands</p>
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
                      <th className="p-4 text-slate-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {[
                      { name: 'Rahul Sharma', email: 'rahul@example.com', role: 'User', status: 'Active' },
                      { name: 'Dr. Sarah', email: 'sarah@example.com', role: 'Therapist', status: 'Active' },
                      { name: 'Priya Patel', email: 'priya@example.com', role: 'User', status: 'Pending' },
                    ].map((user, index) => (
                      <tr key={index} className="hover:bg-slate-800/50">
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
                            user.status === 'Active' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                            Edit
                          </Button>
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
          <Card className="bg-yellow-500/10 border-yellow-500/30">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="font-medium text-yellow-400">System Notice</div>
                <div className="text-sm text-yellow-400/70">
                  This is a test admin dashboard. Some features are simulated for demonstration purposes.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
