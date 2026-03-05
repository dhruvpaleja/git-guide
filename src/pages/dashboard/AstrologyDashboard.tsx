import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  Calendar, 
  Clock, 
  Users, 
  Moon,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AstrologyDashboard() {
  useDocumentTitle('Astrology Dashboard');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 py-3 sm:h-16 sm:py-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Astrologer Dashboard</h1>
                <p className="text-xs text-white/60">Welcome, Test Astrologer</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-white/70 hover:text-white w-full sm:w-auto justify-center sm:justify-start"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Main
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
              >
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
          <Card className="bg-white/10 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/70">
                Today's Consultations
              </CardTitle>
              <Calendar className="w-4 h-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">5</div>
              <p className="text-xs text-white/60">2 completed, 3 upcoming</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/70">
                Total Clients
              </CardTitle>
              <Users className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">128</div>
              <p className="text-xs text-white/60">+12 this month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/70">
                Rating
              </CardTitle>
              <Star className="w-4 h-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">4.8</div>
              <p className="text-xs text-white/60">Based on 96 reviews</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/70">
                Earnings
              </CardTitle>
              <Moon className="w-4 h-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₹24,500</div>
              <p className="text-xs text-white/60">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['overview', 'consultations', 'clients', 'calendar', 'earnings'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab)}
              className={`capitalize ${
                activeTab === tab 
                  ? 'bg-white text-black' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white/10 rounded-lg border border-white/20 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="bg-yellow-500/20 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/30 h-auto py-4">
                  <div className="text-left">
                    <div className="font-semibold">Start Consultation</div>
                    <div className="text-xs opacity-70">Begin a new session</div>
                  </div>
                </Button>
                
                <Button className="bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30 h-auto py-4">
                  <div className="text-left">
                    <div className="font-semibold">View Calendar</div>
                    <div className="text-xs opacity-70">Check appointments</div>
                  </div>
                </Button>
                
                <Button className="bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30 h-auto py-4">
                  <div className="text-left">
                    <div className="font-semibold">Client Reports</div>
                    <div className="text-xs opacity-70">Generate kundali</div>
                  </div>
                </Button>
              </div>

              {/* Upcoming Consultations */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Upcoming Consultations</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Rahul Sharma', time: '2:00 PM', type: 'Birth Chart Reading', status: 'upcoming' },
                    { name: 'Priya Patel', time: '3:30 PM', type: 'Career Guidance', status: 'upcoming' },
                    { name: 'Amit Kumar', time: '5:00 PM', type: 'Marriage Compatibility', status: 'upcoming' },
                  ].map((consultation, index) => (
                    <div 
                      key={index}
                      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {consultation.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{consultation.name}</div>
                          <div className="text-sm text-white/60">{consultation.type}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex items-center gap-2 text-white/70">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{consultation.time}</span>
                        </div>
                        <Button size="sm" className="bg-yellow-500 text-black hover:bg-yellow-400">
                          Start
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && (
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
              </h3>
              <p className="text-white/60">
                This section is under development. Check back soon for updates!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
