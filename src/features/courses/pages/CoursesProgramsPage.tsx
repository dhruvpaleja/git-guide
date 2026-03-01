import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { courseFilters, courseSections } from '../constants/courses.data';

export default function CoursesProgramsPage() {
  return (
    <div className="w-full bg-white text-black">
      <section className="relative mx-auto w-full max-w-[1440px] overflow-hidden px-4 pb-16 pt-6 sm:px-8 sm:pt-10 lg:px-[77px] lg:pb-24 lg:pt-[60px]">
        <img
          src="/images/courses/bg-grey-ellipse.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-0 top-[25px] w-full max-w-none"
        />

        <div className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <p className="text-[13px] font-semibold tracking-[-0.13px] sm:text-[16px] sm:tracking-[-0.16px]">Courses & Programs</p>
          <img src="/images/courses/header-logo.png" alt="Soul Yatri" className="mx-auto h-[38px] w-[46px] object-contain sm:h-[50px] sm:w-[60px]" />
          <Link to="/home" className="justify-self-end text-[13px] tracking-[-0.13px] text-black/50 hover:text-black/80 sm:text-[16px] sm:tracking-[-0.16px]">
            Home
          </Link>
        </div>

        <div className="relative z-10 mt-5 sm:mt-8">
          <Link
            to="/home"
            className="inline-flex h-[30px] w-[30px] items-center justify-center"
            aria-label="Back to home"
          >
            <img src="/images/courses/back-button.svg" alt="Back" className="h-[30px] w-[30px] object-contain" />
          </Link>
        </div>

        <div className="relative z-10 mt-4 text-center sm:mt-5">
          <h1 className="text-[24px] font-semibold tracking-[-0.24px] sm:text-[28px] sm:tracking-[-0.28px] lg:text-[32px] lg:tracking-[-0.32px]">Guided Courses & Programs.</h1>
          <p className="mx-auto mt-3 max-w-[620px] text-[14px] tracking-[-0.14px] text-black/50 sm:mt-4 sm:text-[16px] sm:tracking-[-0.16px]">
            Get the best of courses for your mental and physical health by top worldwide teachers.
          </p>
        </div>

        <div className="relative z-10 mx-auto mt-10 flex h-[52px] w-full max-w-[395px] items-center rounded-[22px] border border-black/20 bg-white px-5 sm:mt-14 sm:h-[60px] sm:rounded-[25px] sm:px-[30px]">
          <input
            className="w-full bg-transparent text-[14px] tracking-[-0.14px] placeholder:text-black/50 focus:outline-none sm:text-[16px] sm:tracking-[-0.16px]"
            placeholder="Search for courses..."
          />
          <img src="/images/courses/search-icon.png" alt="" aria-hidden className="h-[14px] w-[14px] opacity-50 sm:h-[15px] sm:w-[15px]" />
        </div>

        <div className="relative z-10 mt-12 text-center text-[15px] font-semibold tracking-[-0.15px] sm:mt-16 sm:text-[16px] sm:tracking-[-0.16px]">Top Picks</div>

        <div className="relative z-10 mx-auto mt-6 flex w-full max-w-[590px] flex-wrap items-center justify-center gap-2 rounded-[22px] border border-black/20 p-[5px] sm:mt-8 sm:rounded-[25px]">
          {courseFilters.map((label, index) => (
            <button
              key={label}
              type="button"
              className={`h-[42px] rounded-[18px] px-3 text-[13px] tracking-[-0.13px] sm:h-[50px] sm:rounded-[22px] sm:text-[14px] sm:tracking-[-0.14px] ${
                index === 0
                  ? 'min-w-[68px] border border-white bg-[#080808] font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] sm:w-[80px]'
                  : 'min-w-[96px] bg-white text-black/50 sm:w-[120px]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative z-10 mt-14 space-y-14 sm:mt-20 sm:space-y-[88px] lg:mt-[105px] lg:space-y-[105px]">
          {courseSections.map((section, sectionIndex) => (
            <section key={section.key}>
              <div className="mb-4 flex items-center justify-between sm:mb-6">
                <h2 className="text-[18px] font-semibold tracking-[-0.18px] text-black/70 sm:text-xl sm:tracking-[-0.2px]">{section.title}</h2>
                <button type="button" className="text-[13px] tracking-[-0.13px] text-black/50 sm:text-[14px] sm:tracking-[-0.14px]">
                  View All
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 xl:grid-cols-3 xl:gap-[30px]">
                {section.courses.map((course, courseIndex) => (
                  <CourseCard
                    key={`${section.key}-${course.title}`}
                    course={course}
                    highlighted={sectionIndex === 0 && courseIndex === 0}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <footer className="mx-auto w-full max-w-[1440px] rounded-t-[36px] bg-black px-4 pb-9 pt-14 text-white sm:rounded-t-[50px] sm:px-8 sm:pt-16 lg:px-[77px] lg:pt-20">
        <div className="border-t border-white/20 pt-12 sm:pt-16 lg:pt-20">
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:gap-8">
            <div className="max-w-[699px]">
              <div className="mb-6 flex flex-wrap items-center gap-4 text-[13px] sm:gap-6 sm:text-[14px]">
                <img src="/images/courses/footer-logo.png" alt="Soul Yatri" className="h-[36px] w-[170px] object-contain sm:h-[42px] sm:w-[200px]" />
                <img src="/images/courses/header-divider.png" alt="" aria-hidden className="hidden h-[19px] w-px sm:block" />
                <Link to="/login" className="hidden sm:block">Login</Link>
                <Link to="/signup" className="hidden sm:block">Create Account</Link>
              </div>

              <p className="text-[13px] leading-[24px] tracking-[-0.13px] text-white/50 sm:text-[14px] sm:leading-[30px] sm:tracking-[-0.14px]">
                Soul Yatri blends modern psychology with cultural wisdom to offer compassionate, science-backed and culturally-sensitive mental well-being. We help you understand what&apos;s happening inside and give you practical steps—whether you prefer a therapist, a healer, or both.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 sm:gap-[20px]">
                <input
                  className="h-[52px] w-full max-w-[340px] rounded-[22px] border border-white/20 bg-[#080808] px-5 text-[14px] tracking-[-0.14px] text-white placeholder:text-white/50 focus:outline-none sm:h-[60px] sm:rounded-[25px] sm:px-[31px] sm:text-[16px] sm:tracking-[-0.16px]"
                  placeholder="Enter Email Address"
                />
                <button type="button" className="h-[52px] w-full max-w-[220px] rounded-[22px] bg-white text-[14px] font-semibold text-black sm:h-[60px] sm:rounded-[25px] sm:text-[16px]">
                  Book A Therapist
                </button>
              </div>
            </div>

            <div className="space-y-3 text-left text-[13px] tracking-[-0.13px] sm:space-y-4 sm:text-right sm:text-[14px] sm:tracking-[-0.14px]">
              <a href="#overview" className="block">Overview</a>
              <Link to="/careers" className="block">Careers</Link>
              <Link to="/blogs" className="block">Blog</Link>
              <a href="#b2b" className="block">B2B</a>
              <a href="#terms" className="block">Terms & Conditions</a>
              <a href="#privacy" className="block">Privacy Policy</a>
              <Link to="/contact" className="block">Contact</Link>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 text-[12px] tracking-[-0.12px] sm:text-[14px] sm:tracking-[-0.14px] lg:mt-16 lg:flex-row lg:items-center lg:gap-6">
            <p>© 2025 Soul Yatri Pvt. Ltd. | All Rights Reserved</p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span>Follow Our Journey:</span>
              <img src="/images/courses/social-instagram.png" alt="Instagram" className="h-[20px] w-[20px]" />
              <img src="/images/courses/social-facebook.png" alt="Facebook" className="h-[20px] w-[20px]" />
              <img src="/images/courses/social-linkedin.png" alt="LinkedIn" className="h-[20px] w-[20px]" />
              <img src="/images/courses/social-twitter.png" alt="Twitter" className="h-[20px] w-[20px]" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
