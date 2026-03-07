import { BriefcaseBusiness, IndianRupee, Search, UserRound } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const collageImages = [
  '/images/careers/career-collage-01.jpg',
  '/images/careers/career-collage-02.jpg',
  '/images/careers/career-collage-03.jpg',
  '/images/careers/career-collage-04.jpg',
  '/images/careers/career-collage-05.jpg',
  '/images/careers/career-collage-06.jpg',
  '/images/careers/career-collage-07.jpg',
  '/images/careers/career-collage-08.jpg',
  '/images/careers/career-collage-09.jpg',
  '/images/careers/career-collage-10.jpg',
];

type Job = {
  title: string;
  desc: string;
  type: string;
  salary: string;
  exp: string;
};

type ApplicationFormData = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  coverNote: string;
};

type ApplicationFormErrors = Partial<Record<keyof ApplicationFormData | 'resume', string>>;

const ALLOWED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;

const openingGroups: Array<{ name: string; count: number; jobs: Job[] }> = [
  {
    name: 'Human Resources',
    count: 2,
    jobs: [
      {
        title: 'Human Resource Executive',
        desc: 'Manages employee lifecycle, HR operations, and people-focused initiatives.',
        type: 'Full Time',
        salary: 'INR 3.5 - 5 LPA',
        exp: '2 - 3 Years',
      },
      {
        title: 'Talent Acquisition Specialist',
        desc: 'Drives end-to-end hiring to attract purpose-driven talent.',
        type: 'Full Time',
        salary: 'INR 4.5 - 5.5 LPA',
        exp: '1 - 3 Years',
      },
    ],
  },
  {
    name: 'Sales & Marketing',
    count: 3,
    jobs: [
      {
        title: 'Sales Executive',
        desc: 'Generates leads and converts prospects into long-term customers.',
        type: 'Full Time',
        salary: 'INR 3 - 5 LPA',
        exp: '3 - 5 Years',
      },
      {
        title: 'Business Development Manager',
        desc: 'Builds strategic partnerships and drives sustainable revenue growth.',
        type: 'Full Time',
        salary: 'INR 6 - 10 LPA',
        exp: '3 - 5 Years',
      },
      {
        title: 'Digital Marketing Executive',
        desc: 'Plans and executes digital campaigns to grow brand visibility and engagement.',
        type: 'Full Time',
        salary: 'INR 4 - 6 LPA',
        exp: '2 - 4 Years',
      },
    ],
  },
  {
    name: 'Operations',
    count: 2,
    jobs: [
      {
        title: 'Operations Coordinator',
        desc: 'Ensures smooth day-to-day operations and cross-team coordination.',
        type: 'Full Time',
        salary: 'INR 4 - 6.5 LPA',
        exp: '2 - 3 Years',
      },
      {
        title: 'Process & Quality Analyst',
        desc: 'Improves workflows, efficiency, and service quality standards.',
        type: 'Full Time',
        salary: 'INR 5 - 7 LPA',
        exp: '3 - 5 Years',
      },
    ],
  },
  {
    name: 'Customer Services',
    count: 3,
    jobs: [
      {
        title: 'Customer Support Executive',
        desc: 'Provides timely assistance and resolutions across customer touchpoints.',
        type: 'Full Time',
        salary: 'INR 3 - 4.5 LPA',
        exp: '1 - 3 Years',
      },
      {
        title: 'Client Relationship Manager',
        desc: 'Builds strong client relationships and ensures long-term satisfaction.',
        type: 'Full Time',
        salary: 'INR 4.5 - 7 LPA',
        exp: '2 - 5 Years',
      },
      {
        title: 'Wellness Support Associate',
        desc: 'Supports users with empathy across wellness programs and services.',
        type: 'Full Time',
        salary: 'INR 3 - 5 LPA',
        exp: '1 - 3 Years',
      },
    ],
  },
];

const jobRoleOptions = openingGroups.flatMap((group) =>
  group.jobs.map((job) => job.title)
);

function JobCard({ job }: { job: Job }) {
  return (
    <article className="min-h-[200px] rounded-[25px] border border-white/10 bg-[#080808] px-4 py-5 text-white sm:px-[30px] sm:py-[30px]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h4 className="text-[16px] font-semibold tracking-[-0.16px]">{job.title}</h4>
        <span className="inline-flex items-center gap-1.5 text-[14px] text-white">
          <BriefcaseBusiness size={14} />
          {job.type}
        </span>
      </div>
      <p className="mb-5 text-[14px] leading-[30px] tracking-[-0.14px] text-white/50">{job.desc}</p>
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 text-[14px]">
          <span className="inline-flex items-center gap-1.5">
            <IndianRupee size={14} />
            {job.salary}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <UserRound size={14} />
            {job.exp}
          </span>
        </div>
        <button type="button" className="h-[40px] w-[96px] rounded-[12px] bg-white text-[14px] font-semibold text-black">
          Apply
        </button>
      </div>
    </article>
  );
}

export default function CareerPage() {
  useDocumentTitle('Careers');

  const jobOpeningsRef = useRef<HTMLElement>(null);
  const applicationFormRef = useRef<HTMLElement>(null);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    coverNote: '',
  });
  const [errors, setErrors] = useState<ApplicationFormErrors>({});

  const scrollToJobOpenings = () => {
    jobOpeningsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToApplicationForm = () => {
    applicationFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const setField = <K extends keyof ApplicationFormData>(field: K, value: ApplicationFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsSubmitted(false);
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setResumeFile(file);
    setIsSubmitted(false);
    setErrors((prev) => ({ ...prev, resume: undefined }));
  };

  const validateApplication = (): ApplicationFormErrors => {
    const nextErrors: ApplicationFormErrors = {};

    if (formData.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    const digitsOnlyPhone = formData.phone.replace(/\D/g, '');
    if (digitsOnlyPhone.length < 10 || digitsOnlyPhone.length > 13) {
      nextErrors.phone = 'Please enter a valid phone number.';
    }

    if (formData.role.trim().length < 2) {
      nextErrors.role = 'Please enter the role you are applying for.';
    }

    if (!resumeFile) {
      nextErrors.resume = 'Please upload your resume.';
    } else {
      if (!ALLOWED_RESUME_TYPES.includes(resumeFile.type)) {
        nextErrors.resume = 'Resume must be a PDF, DOC, or DOCX file.';
      }
      if (resumeFile.size > MAX_RESUME_SIZE_BYTES) {
        nextErrors.resume = 'Resume file size must be less than 5MB.';
      }
    }

    if (formData.coverNote.trim().length < 30) {
      nextErrors.coverNote = 'Cover note should be at least 30 characters.';
    }

    return nextErrors;
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateApplication();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix the highlighted form fields.');
      return;
    }

    setIsSubmitted(true);
    toast.success('Application submitted successfully.');
    setFormData({ fullName: '', email: '', phone: '', role: '', coverNote: '' });
    setResumeFile(null);
  };

  return (
    <div className="w-full bg-[#f3f3f3] font-['Manrope',sans-serif] text-black">
      <section className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-[80px] sm:px-6 sm:pt-[100px] md:px-10 md:pt-[120px] lg:px-[82px]">
        <div className="mt-6 text-center">
          <h1 className="text-[34px] font-semibold tracking-[-0.36px] sm:text-[44px] md:text-[56px]">Soul Yatri Career</h1>
          <p className="mt-5 text-[18px] leading-[32px] tracking-[-0.18px] text-black/55 sm:text-[20px]">
            Join a mission-led team creating accessible mental wellness for everyone.
          </p>
        </div>

        <div className="mt-[80px] text-center">
          <h2 className="text-[24px] font-semibold tracking-[-0.3px] sm:text-[28px] md:text-[34px]">About Soul Yatri</h2>
          <p className="mx-auto mt-5 max-w-[980px] text-[15px] leading-[28px] tracking-[-0.14px] text-black/75">
            Soul Yatri blends modern psychology with cultural wisdom to offer compassionate, science-backed and culturally-sensitive mental well-being.
            We help you understand what&apos;s happening inside and give you practical steps whether you prefer a therapist, a healer, or both.
          </p>
          <div className="mt-[20px] flex flex-wrap justify-center gap-[16px] sm:gap-[20px]">
            <button
              type="button"
              onClick={scrollToJobOpenings}
              className="h-[60px] w-full rounded-[25px] border border-white bg-[#080808] text-[16px] font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-0.5 sm:w-[220px]"
            >
              All Positions
            </button>
            <button
              type="button"
              onClick={scrollToApplicationForm}
              className="h-[60px] w-full rounded-[25px] border border-black/10 bg-white text-[16px] transition-all duration-300 hover:-translate-y-0.5 sm:w-[220px]"
            >
              Fill Application Form
            </button>
            <button
              type="button"
              onClick={() => window.open('https://linkedin.com/company/soulyatri', '_blank', 'noopener,noreferrer')}
              className="inline-flex h-[60px] w-full items-center justify-center gap-2 rounded-[25px] border border-black/10 bg-white text-[16px] sm:w-[220px]"
            >
              <img src="/images/linkedin-link.png" alt="LinkedIn" className="h-4 w-4" />
              LinkedIn Posts
            </button>
          </div>
        </div>

        <div className="relative mt-[50px]">
          <div className="grid auto-rows-[170px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-[15px]">
            {collageImages.map((src, idx) => (
              <div key={src} className={`overflow-hidden rounded-[25px] ${idx === 2 || idx === 5 ? 'row-span-2' : ''} ${idx === 8 ? 'col-span-2' : ''}`}>
                <img src={src} alt="Team culture" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-[-10px] h-[220px] bg-gradient-to-b from-transparent to-[#f3f3f3]" />
        </div>

        <section className="mt-[56px]">
          <h3 className="text-center text-[24px] font-semibold tracking-[-0.32px] sm:text-[28px] md:text-[32px]">Why Work With Us?</h3>
          <div className="mt-[30px] grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[30px]">
            <article className="rounded-[25px] border border-white bg-[#080808] px-[30px] py-[30px] text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <h4 className="text-[16px] font-semibold tracking-[-0.16px]">Purpose-Driven Impact</h4>
              <p className="mt-6 text-[14px] leading-[30px] tracking-[-0.14px] text-white/85">Your work directly supports mental well-being, mindfulness, and human growth creating real change beyond business goals.</p>
            </article>
            <article className="rounded-[25px] border border-black/10 bg-white px-[30px] py-[30px]">
              <h4 className="text-[16px] font-semibold tracking-[-0.16px]">People-First Culture</h4>
              <p className="mt-6 text-[14px] leading-[30px] tracking-[-0.14px] text-black/50">We value empathy, balance, and psychological safety in an environment where every voice is respected.</p>
            </article>
            <article className="rounded-[25px] border border-black/10 bg-white px-[30px] py-[30px]">
              <h4 className="text-[16px] font-semibold tracking-[-0.16px]">Growth With Meaning</h4>
              <p className="mt-6 text-[14px] leading-[30px] tracking-[-0.14px] text-black/50">Learn, grow, and evolve through mindful leadership and opportunities that align career success with inner well-being.</p>
            </article>
          </div>
        </section>

        <section id="application-form" ref={applicationFormRef} className="mt-[90px] scroll-mt-28 rounded-[40px] bg-black px-4 py-12 text-white sm:px-6 md:px-10 lg:px-12">
          <h3 className="text-center text-[24px] font-semibold tracking-[-0.32px] sm:text-[28px] md:text-[32px]">Application Form</h3>
          <p className="mx-auto mt-4 max-w-[780px] text-center text-[15px] leading-[28px] tracking-[-0.15px] text-white/50">
            Submit your resume and complete your application below. Our hiring team reviews every profile with care.
          </p>

          <form onSubmit={handleApplicationSubmit} className="mx-auto mt-8 grid max-w-[980px] grid-cols-1 gap-5 rounded-[28px] border border-white/20 bg-[#080808] p-5 text-white sm:p-7 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[14px] text-white/80">Full Name</span>
              <input
                value={formData.fullName}
                onChange={(e) => setField('fullName', e.target.value)}
                aria-invalid={Boolean(errors.fullName)}
                className={`h-[52px] w-full rounded-[20px] border bg-[#101010] px-5 text-[14px] text-white outline-none transition-colors ${errors.fullName ? 'border-red-400/70' : 'border-white/15 focus:border-white/35'}`}
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="mt-1 text-[12px] text-red-300">{errors.fullName}</p>}
            </label>

            <label className="block">
              <span className="mb-2 block text-[14px] text-white/80">Email</span>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setField('email', e.target.value)}
                aria-invalid={Boolean(errors.email)}
                className={`h-[52px] w-full rounded-[20px] border bg-[#101010] px-5 text-[14px] text-white outline-none transition-colors ${errors.email ? 'border-red-400/70' : 'border-white/15 focus:border-white/35'}`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-[12px] text-red-300">{errors.email}</p>}
            </label>

            <label className="block">
              <span className="mb-2 block text-[14px] text-white/80">Phone</span>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setField('phone', e.target.value)}
                aria-invalid={Boolean(errors.phone)}
                className={`h-[52px] w-full rounded-[20px] border bg-[#101010] px-5 text-[14px] text-white outline-none transition-colors ${errors.phone ? 'border-red-400/70' : 'border-white/15 focus:border-white/35'}`}
                placeholder="Enter your mobile number"
              />
              {errors.phone && <p className="mt-1 text-[12px] text-red-300">{errors.phone}</p>}
            </label>

            <label className="block">
              <span className="mb-2 block text-[14px] text-white/80">Role You&apos;re Applying For</span>
              <select
                value={formData.role}
                onChange={(e) => setField('role', e.target.value)}
                aria-invalid={Boolean(errors.role)}
                className={`h-[52px] w-full rounded-[20px] border bg-[#101010] px-5 text-[14px] text-white outline-none transition-colors ${errors.role ? 'border-red-400/70' : 'border-white/15 focus:border-white/35'}`}
              >
                <option value="" className="text-white/60">
                  Select a job opening
                </option>
                {jobRoleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.role && <p className="mt-1 text-[12px] text-red-300">{errors.role}</p>}
            </label>

            <div className="md:col-span-2">
              <span className="mb-2 block text-[14px] text-white/80">Resume</span>
              <label
                htmlFor="career-resume"
                className={`flex h-[58px] w-full cursor-pointer items-center gap-3 rounded-[20px] border bg-[#101010] px-4 transition-colors ${errors.resume ? 'border-red-400/70' : 'border-white/15 hover:border-white/35'}`}
              >
                <span className="inline-flex h-[38px] shrink-0 items-center rounded-[12px] bg-white/10 px-4 text-[13px] font-medium text-white">
                  Choose File
                </span>
                <span className="truncate text-[13px] text-white/70">
                  {resumeFile ? resumeFile.name : 'No file selected (PDF, DOC, DOCX up to 5MB)'}
                </span>
              </label>
              <input id="career-resume" type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} className="sr-only" />
              {errors.resume && <p className="mt-1 text-[12px] text-red-300">{errors.resume}</p>}
            </div>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-[14px] text-white/80">Cover Note</span>
              <textarea
                rows={5}
                value={formData.coverNote}
                onChange={(e) => setField('coverNote', e.target.value)}
                aria-invalid={Boolean(errors.coverNote)}
                className={`w-full rounded-[20px] border bg-[#101010] px-5 py-4 text-[14px] text-white outline-none transition-colors ${errors.coverNote ? 'border-red-400/70' : 'border-white/15 focus:border-white/35'}`}
                placeholder="Tell us briefly why you'd like to join Soul Yatri."
              />
              {errors.coverNote && <p className="mt-1 text-[12px] text-red-300">{errors.coverNote}</p>}
            </label>

            <div className="md:col-span-2 mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" className="h-[52px] w-full rounded-[20px] bg-white px-8 text-[15px] font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90 sm:w-auto">
                Submit Application
              </button>
              <p className="text-[13px] text-white/55">We usually respond within 5-7 business days.</p>
            </div>

            {isSubmitted && (
              <p className="md:col-span-2 rounded-[14px] border border-white/20 bg-white/5 px-4 py-3 text-[13px] text-white/80">
                Thanks. Your application has been received successfully.
              </p>
            )}
          </form>
        </section>

        <section className="mt-[120px]">
          <h3 className="text-center text-[24px] font-semibold tracking-[-0.32px] sm:text-[28px] md:text-[32px]">Meet Our Team Behind Soul Yatri</h3>
          <div className="mt-[30px] grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-[30px]">
            {[
              { name: 'Dhruv Paleja', role: 'Founder | CEO' },
              { name: 'Kanishk Thakur', role: 'Co-Founder | CFO' },
              { name: 'Jonmajoy Bardhan', role: 'Head Of Design' },
            ].map((member) => (
              <div key={member.name}>
                <article className="relative h-[500px] overflow-hidden rounded-[25px]">
                  <img src="/images/careers/career-team-member.png" alt={member.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 h-[320px] bg-gradient-to-t from-black/95 via-black/45 to-transparent" />
                  <div className="absolute inset-x-0 bottom-10 text-center text-white">
                    <h4 className="text-[24px] font-semibold tracking-[-0.24px]">{member.name}</h4>
                    <p className="mt-2 text-[16px] tracking-[-0.16px]">{member.role}</p>
                  </div>
                </article>
                <div className="mt-[24px] flex items-center justify-center gap-7">
                  <span className="flex h-[50px] w-[50px] items-center justify-center rounded-full border border-black/10"><img src="/images/insta-link.png" alt="Instagram" className="h-[22px] w-[22px]" /></span>
                  <span className="flex h-[50px] w-[50px] items-center justify-center rounded-full border border-black/10"><img src="/images/twitter-link.png" alt="X" className="h-[22px] w-[22px]" /></span>
                  <span className="flex h-[50px] w-[50px] items-center justify-center rounded-full border border-black/10"><img src="/images/linkedin-link.png" alt="LinkedIn" className="h-[22px] w-[22px]" /></span>
                </div>
                <button type="button" className="mx-auto mt-[28px] block h-[52px] w-[100px] rounded-[22px] border border-black/10 bg-white text-[14px]">Read Blog</button>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section id="job-openings" ref={jobOpeningsRef} className="mx-auto mt-6 w-full max-w-[1440px] scroll-mt-28 rounded-t-[50px] bg-black px-4 pb-10 pt-20 text-white sm:px-6 md:px-10 lg:px-[82px]">
        <h3 className="text-center text-[24px] font-semibold tracking-[-0.32px] sm:text-[28px] md:text-[32px]">All Current Openings</h3>
        <p className="mx-auto mt-6 max-w-[810px] text-center text-[16px] tracking-[-0.16px] text-white/50">
          Explore open roles where your skills create meaningful impact, support mental well-being, and grow with purpose.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <label className="relative block">
            <input className="h-[60px] w-full rounded-[25px] border border-white bg-white pl-[30px] pr-12 text-[16px] text-black placeholder:text-black/50 focus:outline-none sm:w-[340px]" placeholder="Search for openings" />
            <Search size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-black/50" />
          </label>
          <button type="button" className="inline-flex min-h-[40px] items-center gap-4 px-2 text-[16px]">
            Categories
            <span className="space-y-1.5">
              <span className="block h-[2px] w-[25px] rounded bg-white" />
              <span className="block h-[2px] w-[25px] rounded bg-white" />
              <span className="block h-[2px] w-[25px] rounded bg-white" />
            </span>
          </button>
        </div>

        <div className="mt-12 border-t border-white/20 pt-12">
          {openingGroups.map((group) => (
            <div key={group.name} className="mb-12">
              <div className="mb-5 flex items-center gap-4">
                <h4 className="text-[24px] font-semibold tracking-[-0.24px]">{group.name}</h4>
                <span className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-[30px] border border-white/20 bg-white/5 text-[14px] font-semibold">{group.count}</span>
              </div>
              <div className="grid grid-cols-1 gap-[30px] lg:grid-cols-2 xl:grid-cols-3">
                {group.jobs.map((job) => (
                  <JobCard key={job.title} job={job} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
