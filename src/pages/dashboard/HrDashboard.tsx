import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Plus,
  Search,
  Trash2,
  Users,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { toast } from 'sonner';

type ApplicationStatus = 'pending' | 'shortlisted' | 'rejected';

type Application = {
  id: string;
  candidateName: string;
  email: string;
  role: string;
  experience: string;
  appliedOn: string;
  status: ApplicationStatus;
  resumeUrl?: string;
  resumeFileName?: string;
};

type JobOpening = {
  id: string;
  title: string;
  department: string;
  type: 'Full Time' | 'Part Time' | 'Contract' | 'Internship';
  location: string;
  applicants: number;
  active: boolean;
};

const initialApplications: Application[] = [
  {
    id: 'APP-1001',
    candidateName: 'Ananya Sharma',
    email: 'ananya.sharma@email.com',
    role: 'Talent Acquisition Specialist',
    experience: '3 Years',
    appliedOn: '2026-03-01',
    status: 'pending',
    resumeUrl: '/resumes/ananya-sharma-resume.txt',
    resumeFileName: 'ananya-sharma-resume.txt',
  },
  {
    id: 'APP-1002',
    candidateName: 'Karan Mehta',
    email: 'karan.mehta@email.com',
    role: 'Digital Marketing Executive',
    experience: '4 Years',
    appliedOn: '2026-03-03',
    status: 'shortlisted',
    resumeUrl: '/resumes/karan-mehta-resume.txt',
    resumeFileName: 'karan-mehta-resume.txt',
  },
  {
    id: 'APP-1003',
    candidateName: 'Ritika Nair',
    email: 'ritika.nair@email.com',
    role: 'Customer Support Executive',
    experience: '2 Years',
    appliedOn: '2026-03-04',
    status: 'pending',
    resumeUrl: '/resumes/ritika-nair-resume.txt',
    resumeFileName: 'ritika-nair-resume.txt',
  },
  {
    id: 'APP-1004',
    candidateName: 'Devansh Gupta',
    email: 'devansh.gupta@email.com',
    role: 'Operations Coordinator',
    experience: '5 Years',
    appliedOn: '2026-03-05',
    status: 'rejected',
    resumeUrl: '/resumes/devansh-gupta-resume.txt',
    resumeFileName: 'devansh-gupta-resume.txt',
  },
];

const initialJobOpenings: JobOpening[] = [
  {
    id: 'JOB-201',
    title: 'Talent Acquisition Specialist',
    department: 'Human Resources',
    type: 'Full Time',
    location: 'Gurugram / Hybrid',
    applicants: 28,
    active: true,
  },
  {
    id: 'JOB-202',
    title: 'Digital Marketing Executive',
    department: 'Marketing',
    type: 'Full Time',
    location: 'Remote',
    applicants: 34,
    active: true,
  },
  {
    id: 'JOB-203',
    title: 'Wellness Support Associate',
    department: 'Customer Services',
    type: 'Contract',
    location: 'Delhi NCR',
    applicants: 12,
    active: false,
  },
];

function statusBadgeClass(status: ApplicationStatus): string {
  if (status === 'shortlisted') return 'bg-green-500/15 text-green-400 border-green-400/30';
  if (status === 'rejected') return 'bg-red-500/15 text-red-400 border-red-400/30';
  return 'bg-yellow-500/15 text-yellow-400 border-yellow-400/30';
}

export default function HrDashboard() {
  useDocumentTitle('HR Dashboard');

  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>(initialJobOpenings);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all');

  const [newTitle, setNewTitle] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [newType, setNewType] = useState<JobOpening['type']>('Full Time');
  const [newLocation, setNewLocation] = useState('');

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.candidateName.toLowerCase().includes(search.toLowerCase()) ||
        app.email.toLowerCase().includes(search.toLowerCase()) ||
        app.role.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const totalApplications = applications.length;
  const pendingApplications = applications.filter((a) => a.status === 'pending').length;
  const shortlistedApplications = applications.filter((a) => a.status === 'shortlisted').length;
  const activeOpenings = jobOpenings.filter((j) => j.active).length;

  const updateApplicationStatus = (id: string, status: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
    toast.success(`Application marked as ${status}`);
  };

  const toggleOpeningStatus = (id: string) => {
    setJobOpenings((prev) =>
      prev.map((opening) =>
        opening.id === id ? { ...opening, active: !opening.active } : opening
      )
    );
    toast.success('Job opening status updated');
  };

  const removeOpening = (id: string) => {
    setJobOpenings((prev) => prev.filter((opening) => opening.id !== id));
    toast.success('Job opening removed');
  };

  const addOpening = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDepartment.trim() || !newLocation.trim()) {
      toast.error('Please fill title, department and location');
      return;
    }

    const newOpening: JobOpening = {
      id: `JOB-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      department: newDepartment.trim(),
      type: newType,
      location: newLocation.trim(),
      applicants: 0,
      active: true,
    };

    setJobOpenings((prev) => [newOpening, ...prev]);
    setNewTitle('');
    setNewDepartment('');
    setNewType('Full Time');
    setNewLocation('');
    toast.success('Job opening created');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold">HR Dashboard</h1>
              <p className="text-xs text-slate-400">
                Manage applications and job openings
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="w-full justify-center text-slate-300 hover:text-white sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back To Admin
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-400">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplications}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-400">Pending Review</CardTitle>
              <Clock3 className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApplications}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-400">Shortlisted</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shortlistedApplications}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-400">Active Openings</CardTitle>
              <BriefcaseBusiness className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeOpenings}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <label className="relative block w-full max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search candidate, email, role"
                  className="h-10 w-full rounded-md border border-slate-700 bg-slate-800 pl-9 pr-3 text-sm text-white outline-none focus:border-slate-500"
                />
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | ApplicationStatus)}
                className="h-10 rounded-md border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-slate-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="px-3 py-3 font-medium">Candidate</th>
                    <th className="px-3 py-3 font-medium">Role</th>
                    <th className="px-3 py-3 font-medium">Experience</th>
                    <th className="px-3 py-3 font-medium">Applied On</th>
                    <th className="px-3 py-3 font-medium">Resume</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="border-b border-slate-800/70">
                      <td className="px-3 py-4">
                        <div className="font-medium text-white">{app.candidateName}</div>
                        <div className="text-xs text-slate-400">{app.email}</div>
                      </td>
                      <td className="px-3 py-4 text-slate-200">{app.role}</td>
                      <td className="px-3 py-4 text-slate-300">{app.experience}</td>
                      <td className="px-3 py-4 text-slate-300">{app.appliedOn}</td>
                      <td className="px-3 py-4">
                        {app.resumeUrl ? (
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="h-8 border-slate-600 text-xs text-slate-200"
                          >
                            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">
                              View Resume
                            </a>
                          </Button>
                        ) : (
                          <span className="text-xs text-slate-500">Not Uploaded</span>
                        )}
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs capitalize ${statusBadgeClass(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-slate-600 text-xs text-slate-200"
                            onClick={() => updateApplicationStatus(app.id, 'shortlisted')}
                          >
                            Shortlist
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-slate-600 text-xs text-slate-200"
                            onClick={() => updateApplicationStatus(app.id, 'pending')}
                          >
                            Hold
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-red-500/40 text-xs text-red-300 hover:bg-red-500/10"
                            onClick={() => updateApplicationStatus(app.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredApplications.length === 0 && (
                <p className="py-6 text-center text-sm text-slate-400">
                  No applications found for current filters.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <Card className="border-slate-800 bg-slate-900 xl:col-span-2">
            <CardHeader>
              <CardTitle>Create Job Opening</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addOpening} className="space-y-3">
                <label className="block">
                  <span className="mb-1 block text-xs text-slate-400">Title</span>
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-slate-500"
                    placeholder="e.g. HR Executive"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-slate-400">Department</span>
                  <input
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-slate-500"
                    placeholder="e.g. Human Resources"
                  />
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-400">Type</span>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as JobOpening['type'])}
                      className="h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-slate-500"
                    >
                      <option>Full Time</option>
                      <option>Part Time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-400">Location</span>
                    <input
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-slate-500"
                      placeholder="City / Remote"
                    />
                  </label>
                </div>
                <Button type="submit" className="mt-2 w-full bg-white text-black hover:bg-slate-200">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Opening
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900 xl:col-span-3">
            <CardHeader>
              <CardTitle>Manage Openings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {jobOpenings.map((opening) => (
                <div
                  key={opening.id}
                  className="rounded-lg border border-slate-800 bg-slate-800/40 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="font-medium text-white">{opening.title}</h4>
                      <p className="text-xs text-slate-400">
                        {opening.department} • {opening.type} • {opening.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs ${
                          opening.active
                            ? 'bg-green-500/15 text-green-400'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {opening.active ? 'Open' : 'Closed'}
                      </span>
                      <span className="inline-flex rounded-full bg-slate-700 px-2.5 py-1 text-xs text-slate-200">
                        {opening.applicants} applicants
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 border-slate-600 text-xs text-slate-200"
                      onClick={() => toggleOpeningStatus(opening.id)}
                    >
                      {opening.active ? (
                        <>
                          <XCircle className="mr-1 h-3.5 w-3.5" />
                          Close
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                          Reopen
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 border-red-500/40 text-xs text-red-300 hover:bg-red-500/10"
                      onClick={() => removeOpening(opening.id)}
                    >
                      <Trash2 className="mr-1 h-3.5 w-3.5" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
