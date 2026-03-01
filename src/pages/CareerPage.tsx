import { BriefcaseBusiness, Search, IndianRupee, UserRound } from 'lucide-react';

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

const openingGroups: Array<{ name: string; count: number; jobs: Job[] }> = [
  {
    name: 'Human Resources',
    count: 2,
    jobs: [
      {
        title: 'Human Resource Executive',
        desc: 'Manages employee lifecycle, HR operations, and people-focused initiatives.',
        type: 'Full Time',
        salary: '₹3.5 - ₹5 LPA',
        exp: '2 - 3 Years',
      },
      {
        title: 'Talent Acquisition Specialist',
        desc: 'Drives end-to-end hiring to attract purpose-driven talent.',
        type: 'Full Time',
        salary: '₹4.5 - ₹5.5 LPA',
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
        salary: '₹3 - ₹5 LPA',
        exp: '3 - 5 Years',
      },
      {
        title: 'Business Development Manager',
        desc: 'Builds strategic partnerships and drives sustainable revenue growth.',
        type: 'Full Time',
        salary: '₹6 - ₹10 LPA',
        exp: '3 - 5 Years',
      },
      {
        title: 'Digital Marketing Executive',
        desc: 'Plans and executes digital campaigns to grow brand visibility and engagement.',
        type: 'Full Time',
        salary: '₹4 - ₹6 LPA',
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
        salary: '₹4 - ₹6.5 LPA',
        exp: '2 - 3 Years',
      },
      {
        title: 'Process & Quality Analyst',
        desc: 'Improves workflows, efficiency, and service quality standards.',
        type: 'Full Time',
        salary: '₹5 - ₹7 LPA',
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
        salary: '₹3 - ₹4.5 LPA',
        exp: '1 - 3 Years',
      },
      {
        title: 'Client Relationship Manager',
        desc: 'Builds strong client relationships and ensures long-term satisfaction.',
        type: 'Full Time',
        salary: '₹4.5 - ₹7 LPA',
        exp: '2 - 5 Years',
      },
      {
        title: 'Wellness Support Associate',
        desc: 'Supports users with empathy across wellness programs and services.',
        type: 'Full Time',
        salary: '₹3 - ₹5 LPA',
        exp: '1 - 3 Years',
      },
    ],
  },
];

function JobCard({ job }: { job: Job }) {
  return (
    <article className="h-[200px] rounded-[25px] border border-white/10 bg-[#080808] px-[30px] py-[30px] text-white">
      <div className="mb-5 flex items-center justify-between">
        <h4 className="text-[16px] font-semibold tracking-[-0.16px]">{job.title}</h4>
        <span className="inline-flex items-center gap-1.5 text-[14px] text-white">
          <BriefcaseBusiness size={14} />
          {job.type}
        </span>
      </div>
      <p className="mb-5 text-[14px] leading-[30px] tracking-[-0.14px] text-white/50">{job.desc}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5 text-[14px]">
          <span className="inline-flex items-center gap-1.5"><IndianRupee size={14} />{job.salary}</span>
          <span className="inline-flex items-center gap-1.5"><UserRound size={14} />{job.exp}</span>
        </div>
        <button type="button" className="h-[30px] w-[80px] rounded-[12px] bg-white text-[14px] font-semibold text-black">Apply</button>
      </div>
    </article>
  );
}

export default function CareerPage() {
  return (
    <div className="w-full bg-[#f3f3f3] font-['Manrope',sans-serif] text-black">
      <section className="mx-auto w-full max-w-[1440px] px-6 pb-16 pt-[120px] sm:px-10 lg:px-[82px]">
        <div className="mt-6 text-center">
          <h1 className="text-[32px] font-semibold tracking-[-0.32px]">Soul Yatri Career</h1>
          <p className="mt-4 text-[16px] tracking-[-0.16px] text-black/50">Join a mission-led team creating accessible mental wellness for everyone.</p>
        </div>

        <div className="mt-[80px] text-center">
          <h2 className="text-[42px] font-semibold tracking-[-0.42px]">About Soul Yatri</h2>
          <p className="mx-auto mt-6 max-w-[1016px] text-[16px] leading-[30px] tracking-[-0.16px] text-black/80">
            Soul Yatri blends modern psychology with cultural wisdom to offer compassionate, science-backed and culturally-sensitive mental well-being.
            We help you understand what&apos;s happening inside and give you practical steps—whether you prefer a therapist, a healer, or both.
          </p>
          <div className="mt-[20px] flex flex-wrap justify-center gap-[30px]">
            <button type="button" className="h-[60px] w-[220px] rounded-[25px] border border-white bg-[#080808] text-[16px] font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)]">All Positions</button>
            <button type="button" className="inline-flex h-[60px] w-[220px] items-center justify-center gap-2 rounded-[25px] border border-black/10 bg-white text-[16px]">
              <img src="/images/linkedin-link.png" alt="LinkedIn" className="h-4 w-4" />
              LinkedIn Posts
            </button>
          </div>
        </div>

        <div className="relative mt-[50px]">
          <div className="grid auto-rows-[170px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-[15px]">
            {collageImages.map((src, idx) => (
              <div key={idx} className={`overflow-hidden rounded-[25px] ${idx === 2 || idx === 5 ? 'row-span-2' : ''} ${idx === 8 ? 'col-span-2' : ''}`}>
                <img src={src} alt="Team culture" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-[-10px] h-[220px] bg-gradient-to-b from-transparent to-[#f3f3f3]" />
        </div>

        <section className="mt-[56px]">
          <h3 className="text-center text-[32px] font-semibold tracking-[-0.32px]">Why Work With Us?</h3>
          <div className="mt-[30px] grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-[30px]">
            <article className="rounded-[25px] border border-white bg-[#080808] px-[30px] py-[30px] text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <h4 className="text-[16px] font-semibold tracking-[-0.16px]">Purpose-Driven Impact</h4>
              <p className="mt-6 text-[14px] leading-[30px] tracking-[-0.14px] text-white/85">Your work directly supports mental well-being, mindfulness, and human growth—creating real change beyond just business goals.</p>
            </article>
            <article className="rounded-[25px] border border-black/10 bg-white px-[30px] py-[30px]">
              <h4 className="text-[16px] font-semibold tracking-[-0.16px]">People-First Culture</h4>
              <p className="mt-6 text-[14px] leading-[30px] tracking-[-0.14px] text-black/50">We value empathy, balance, and psychological safety, fostering a supportive environment where every voice is respected.</p>
            </article>
            <article className="rounded-[25px] border border-black/10 bg-white px-[30px] py-[30px]">
              <h4 className="text-[16px] font-semibold tracking-[-0.16px]">Growth With Meaning</h4>
              <p className="mt-6 text-[14px] leading-[30px] tracking-[-0.14px] text-black/50">Learn, grow, and evolve through mindful leadership, skill development, and opportunities that align career success with inner well-being.</p>
            </article>
          </div>
        </section>

        <section className="mt-[120px]">
          <h3 className="text-center text-[32px] font-semibold tracking-[-0.32px]">Meet Our Team Behind Soul Yatri</h3>
          <div className="mt-[30px] grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-[30px]">
            {[
              { name: 'Dhruv Paleja', role: 'Founder  |  CEO' },
              { name: 'Kanishk Thakur', role: 'Co-Founder  |  CFO' },
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

      <section className="mx-auto mt-6 w-full max-w-[1440px] rounded-t-[50px] bg-black px-6 pb-10 pt-20 text-white sm:px-10 lg:px-[82px]">
        <h3 className="text-center text-[32px] font-semibold tracking-[-0.32px]">All Current Openings</h3>
        <p className="mx-auto mt-6 max-w-[810px] text-center text-[16px] tracking-[-0.16px] text-white/50">Explore open roles where your skills create meaningful impact, support mental well-being, and grow with purpose.</p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <label className="relative block">
            <input className="h-[60px] w-[340px] rounded-[25px] border border-white bg-white pl-[30px] pr-12 text-[16px] text-black placeholder:text-black/50 focus:outline-none" placeholder="Search for openings" />
            <Search size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-black/50" />
          </label>
          <button type="button" className="inline-flex items-center gap-4 text-[16px]">Categories <span className="space-y-1.5"><span className="block h-[2px] w-[25px] rounded bg-white" /><span className="block h-[2px] w-[25px] rounded bg-white" /><span className="block h-[2px] w-[25px] rounded bg-white" /></span></button>
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
