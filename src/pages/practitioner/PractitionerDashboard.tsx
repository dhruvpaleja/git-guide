import { useAuth } from '@/context/AuthContext';
import { LogOut, Bell, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

// Asset paths
const soulLogo = '/images/practitioner/imgSoulYatriLogo.png';
const profileImage = '/images/practitioner/imgImage.png';

// Mock data
const scheduledSessions = [
  { name: 'Karan Patel', time: '10 AM', type: 'Weekly Therapy' },
  { name: 'Suman C.', time: '12 PM', type: 'Weekly Therapy' },
  { name: 'James Br...', time: '2 PM', type: 'Weekly Therapy' },
  { name: 'Thomas', time: '4 PM', type: 'Counseling' },
  { name: 'Raj Vardh...', time: '6 PM', type: 'Counseling' },
];

const appointments = [
  { name: 'Yash Rathi', type: 'Weekly Therapy', date: 'Fri, 27 Dec | 10 AM' },
  { name: 'Esha Gup...', type: 'Counseling', date: 'Fri, 27 Dec | 12 PM' },
  { name: 'Peter Wa...', type: 'Weekly Therapy', date: 'Fri, 27 Dec | 2 PM' },
  { name: 'Manish S...', type: 'Counseling', date: 'Fri, 27 Dec | 4 PM' },
  { name: 'Vansh Th...', type: 'Counseling', date: 'Fri, 27 Dec | 6 PM' },
];

const completedSessions = [
  { name: 'Suresh C...', type: 'Counseling', date: 'Tue, 24 Dec | 10 AM' },
  { name: 'Alex Seb...', type: 'Counseling', date: 'Tue, 24 Dec | 12 PM' },
  { name: 'Steve Jobs', type: 'Therapy', date: 'Tue, 24 Dec | 2 PM' },
  { name: 'Om Malh...', type: 'Counseling', date: 'Tue, 24 Dec | 4 PM' },
  { name: 'Lalit Shar...', type: 'Therapy', date: 'Tue, 24 Dec | 6 PM' },
];

const pendingApprovals = [
  { name: 'Akshay S...', role: 'For Therapy' },
  { name: 'Kunal Wa...', role: 'For Therapy' },
  { name: 'Lalita Qu...', role: 'For Counseling' },
  { name: 'Parth Vis...', role: 'For Counseling' },
  { name: 'Samarth...', role: 'For Counseling' },
];

const clientIntake = [
  { name: 'Sabrina N...', role: 'For Counseling', date: 'Sat, 28 Dec | 4 PM' },
  { name: 'Zayn Malik', role: 'For Counseling', date: 'Sat, 28 Dec | 2 PM' },
];

// Animated Graph Component
interface GraphDataPoint {
  value: number;
  timestamp: number;
}

function AnimatedLineGraph({
  initialValue,
  color,
  onChange
}: {
  initialValue: number;
  color: string;
  onChange?: (value: number) => void;
}) {
  const [data, setData] = useState<GraphDataPoint[]>([
    { value: initialValue, timestamp: 0 }
  ]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const lastValue = prevData[prevData.length - 1].value;
        // Generate new value with slight variation (stock market like)
        const variance = (Math.random() - 0.5) * (initialValue * 0.3);
        const newValue = Math.max(initialValue * 0.5, lastValue + variance);

        const newData = [
          ...prevData.slice(-9),
          { value: newValue, timestamp: Date.now() }
        ];

        onChange?.(newValue);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 100);

        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [initialValue, onChange]);

  // Create SVG path
  const maxValue = Math.max(initialValue * 1.5, ...data.map(d => d.value));
  const minValue = Math.min(initialValue * 0.5, ...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((point, index) => {
    const x = (index / Math.max(data.length - 1, 1)) * 100;
    const y = 100 - ((point.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative w-full h-16">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="transition-all duration-200"
        />
        {/* Last point indicator - blinking animation */}
        {data.length > 0 && (
          <circle
            cx={(data.length - 1) / Math.max(data.length - 1, 1) * 100}
            cy={100 - ((data[data.length - 1].value - minValue) / range) * 100}
            r="1.5"
            fill={color}
            className={`${isAnimating ? 'animate-pulse' : ''}`}
          />
        )}
      </svg>
    </div>
  );
}

// Stat Card Component
function StatCard({
  label,
  amount,
  currency,
  change,
  changeType,
  graphColor,
  period
}: {
  label: string;
  amount: string;
  currency: string;
  change: string;
  changeType: 'positive' | 'negative';
  graphColor: string;
  period: string;
}) {
  const [displayAmount, setDisplayAmount] = useState(amount);

  return (
    <div className={`rounded-2xl p-5 flex flex-col gap-3 border-2 ${changeType === 'positive'
        ? 'border-green-200 bg-gradient-to-br from-green-50 to-white'
        : 'border-red-200 bg-gradient-to-br from-red-50 to-white'
      }`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-black mt-1">
            {currency}{displayAmount}
          </p>
        </div>
        <span className="text-xs text-gray-500">{period}</span>
      </div>

      <AnimatedLineGraph
        initialValue={parseInt(amount.replace(/[^0-9.]/g, ''))}
        color={graphColor}
        onChange={(val) => setDisplayAmount(val.toFixed(2))}
      />

      <div className={`text-xs font-medium ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'
        }`}>
        {changeType === 'positive' ? '↑' : '↓'} {change}
      </div>
    </div>
  );
}

// Session Card Component
function SessionCard({ name, time, type }: { name: string; time: string; type: string }) {
  const handleStartCall = () => {
    // TODO: Implement call functionality
    // console.log('Start call with', name);
  };

  return (
    <div className="bg-black rounded-2xl p-4 flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-600"></div>
        <div>
          <p className="text-white font-semibold text-sm">{name}</p>
          <p className="text-white/60 text-xs">{type}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-white/60 text-sm bg-white/10 px-3 py-1 rounded-full">{time}</span>
        <button
          onClick={handleStartCall}
          className="bg-green-500 text-white text-xs px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          Start Call
        </button>
      </div>
    </div>
  );
}

// Appointment Row Component
function AppointmentRow({ name, type, date }: { name: string; type: string; date: string }) {
  const handleReschedule = () => {
    // TODO: Implement reschedule functionality
    // console.log('Reschedule', name);
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-black"></div>
          <div>
            <p className="font-semibold text-sm text-black">{name}</p>
            <p className="text-xs text-gray-600">{type}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">{date}</td>
      <td className="py-3 px-4">
        <button
          onClick={handleReschedule}
          className="bg-gray-200 text-black text-xs px-4 py-1.5 rounded-lg hover:bg-gray-300 transition"
        >
          Reschedule
        </button>
      </td>
    </tr>
  );
}

// Approval Card Component
function ApprovalCard({ name, role }: { name: string; role: string }) {
  const handleIgnore = () => {
    // TODO: Implement ignore functionality
    // console.log('Ignore', name);
  };

  const handleAccept = () => {
    // TODO: Implement accept functionality
    // console.log('Accept', name);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-black"></div>
        <div>
          <p className="text-black font-semibold text-sm">{name}</p>
          <p className="text-gray-600 text-xs">{role}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleIgnore}
          className="border border-red-500 text-red-500 text-xs px-4 py-1.5 rounded-lg hover:bg-red-50 transition"
        >
          Ignore
        </button>
        <button
          onClick={handleAccept}
          className="bg-green-500 text-white text-xs px-4 py-1.5 rounded-lg hover:bg-green-600 transition"
        >
          Accept
        </button>
      </div>
    </div>
  );
}

// Client Intake Card Component
function ClientIntakeCard({ name, role, date }: { name: string; role: string; date: string }) {
  const handleIgnoreIntake = () => {
    // TODO: Implement ignore functionality
    // console.log('Ignore', name);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-black"></div>
        <div>
          <p className="text-black font-semibold text-sm">{name}</p>
          <p className="text-gray-600 text-xs">{role}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-gray-600 text-xs">{date.split('|')[0]} <span className="text-gray-400">{date.split('|')[1]}</span></p>
        <button
          onClick={handleIgnoreIntake}
          className="text-red-500 text-xs px-4 py-1.5 mt-2 hover:text-red-700 transition"
        >
          Ignore
        </button>
      </div>
    </div>
  );
}

export default function PractitionerDashboard() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <div className="w-20 bg-black flex flex-col items-center py-6 space-y-6 sticky top-0 h-screen">
        <img src={soulLogo} alt="Soul Yatri" className="w-10 h-10" />

        <nav className="flex flex-col space-y-4">
          <button className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center hover:scale-110 transition">
            <span className="text-black text-lg">🏠</span>
          </button>
          <button className="w-11 h-11 border border-white/20 rounded-2xl flex items-center justify-center hover:bg-white/10 transition text-white">
            <span className="text-lg">👥</span>
          </button>
          <button className="w-11 h-11 border border-white/20 rounded-2xl flex items-center justify-center hover:bg-white/10 transition text-white">
            <span className="text-lg">📊</span>
          </button>
          <button className="w-11 h-11 border border-white/20 rounded-2xl flex items-center justify-center hover:bg-white/10 transition text-white">
            <span className="text-lg">👤</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-11 h-11 hover:bg-white/10 rounded-2xl flex items-center justify-center transition text-white"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-black">Welcome!</h1>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
              <img src={profileImage} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
              <div>
                <p className="text-sm font-medium text-black">{user?.name || 'Swati Agarwal'}</p>
                <p className="text-xs text-gray-500">Counsellor / Therapist</p>
              </div>
            </div>
          </div>

          <div className="flex-1 mx-8">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for what you want..."
                className="w-full bg-gray-100 border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button className="relative w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition shrink-0">
              <Bell size={20} className="text-black" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="text-orange-500 text-sm font-medium hover:text-orange-600 whitespace-nowrap">
              Ignored Clients
            </button>
            <button className="text-gray-600 text-sm font-medium hover:text-black transition whitespace-nowrap">
              Report
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 py-6 space-y-8">
            {/* Your Dashboard Section */}
            <div>
              <h2 className="text-3xl font-bold text-black mb-6">Your Dashboard</h2>

              {/* Stats Cards with Animated Graphs */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <StatCard
                  label="Today's Earning"
                  amount="5.5k"
                  currency="₹"
                  change="65% Today"
                  changeType="positive"
                  graphColor="#22c55e"
                  period="Thurs 11 Dec"
                />
                <StatCard
                  label="Pending Pays"
                  amount="1.3k"
                  currency="₹"
                  change="5B This Month"
                  changeType="negative"
                  graphColor="#ef4444"
                  period="This Month"
                />
                <StatCard
                  label="Monthly Records"
                  amount="18.8k"
                  currency="₹"
                  change="70% This Month"
                  changeType="positive"
                  graphColor="#22c55e"
                  period="December"
                />
              </div>

              {/* Quick Stats Bar */}
              <div className="bg-black rounded-2xl px-6 py-4 flex items-center justify-between text-white mb-8">
                <div className="flex gap-12">
                  <div>
                    <p className="text-xs text-gray-400">Total Earnings</p>
                    <p className="text-xl font-bold">₹48.5k</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Your Rating</p>
                    <p className="text-xl font-bold">4.8 ⭐</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total Sessions</p>
                    <p className="text-xl font-bold">100+</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-3 gap-8 pb-8">
              {/* Left Column */}
              <div className="col-span-2 space-y-8">
                {/* Today's Scheduled Sessions */}
                <div>
                  <h3 className="text-xl font-bold text-black mb-4">Today's Scheduled Sessions</h3>
                  <div className="space-y-2">
                    {scheduledSessions.map((session) => (
                      <SessionCard key={session.name} {...session} />
                    ))}
                  </div>
                </div>

                {/* Appointments & Sessions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-black">Appointments & Sessions</h3>
                    <button className="text-gray-600 text-sm hover:text-black transition">View All</button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-600">Weekly Sessions Records</p>
                      <p className="text-xs text-gray-500 mt-1">Total Week Sessions - 30 | Completed Sessions - 15</p>
                    </div>
                    <table className="w-full">
                      <tbody>
                        {appointments.map((apt) => (
                          <AppointmentRow key={apt.name} {...apt} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Completed Sessions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-black">Completed Sessions</h3>
                    <button className="text-gray-600 text-sm hover:text-black transition">View All</button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-600">Last 5 Sessions Records</p>
                      <p className="text-xs text-gray-500 mt-1">Total Completed Sessions - 100+</p>
                    </div>
                    <table className="w-full">
                      <tbody>
                        {completedSessions.map((session) => (
                          <tr key={session.name} className="border-b border-gray-200 hover:bg-gray-50 transition">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-black"></div>
                                <div>
                                  <p className="font-semibold text-sm text-black">{session.name}</p>
                                  <p className="text-xs text-gray-600">{session.type}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">{session.date}</td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => {
                                  // TODO: Implement see summary functionality
                                  // console.log('See summary', session.name);
                                }}
                                className="text-gray-600 text-xs px-4 py-1.5 hover:text-black transition"
                              >
                                See Summary
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Pending Approvals */}
                <div>
                  <h3 className="text-xl font-bold text-black mb-4">Pending Approvals</h3>
                  <div className="space-y-2">
                    {pendingApprovals.map((approval) => (
                      <ApprovalCard key={approval.name} {...approval} />
                    ))}
                  </div>
                </div>

                {/* Client Intake */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-xl font-bold text-black">Client Intake</h3>
                    <span className="text-xs text-gray-500">(Read Only)</span>
                  </div>
                  <div className="space-y-2">
                    {clientIntake.map((client) => (
                      <ClientIntakeCard key={client.name} {...client} />
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="text-xl font-bold text-black mb-4">Quick Links</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div
                      onClick={() => {
                        // TODO: Implement post therapy functionality
                        // console.log('Post Therapy clicked');
                      }}
                      className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg transition h-40 flex flex-col items-center justify-center gap-3"
                    >
                      <span className="text-4xl">🙏</span>
                      <h4 className="font-bold text-lg">Post Therapy</h4>
                      <p className="text-xs text-center text-white/90">Get all the clients post therapy records.</p>
                    </div>
                    <div
                      onClick={() => {
                        // TODO: Implement support functionality
                        // console.log('Support clicked');
                      }}
                      className="bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg transition h-40 flex flex-col items-center justify-center gap-3"
                    >
                      <span className="text-4xl">👤</span>
                      <h4 className="font-bold text-lg">Support</h4>
                      <p className="text-xs text-center text-white/90">Get support for your better understanding.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
