import CourseCard from '../components/CourseCard';
import { courseFilters, courseSections } from '../constants/courses.data';

export default function CoursesProgramsPage() {
  return (
    <>
      <section className="relative mx-auto w-full max-w-[1440px] overflow-hidden px-4 pb-16 pt-[120px] sm:px-8 lg:px-[77px] lg:pb-24">
        <img
          src="/images/courses/bg-grey-ellipse.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-0 top-[25px] w-full max-w-none"
        />

        <div className="relative z-10 text-center sm:mt-5">
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
              className={`h-[42px] rounded-[18px] px-3 text-[13px] tracking-[-0.13px] sm:h-[50px] sm:rounded-[22px] sm:text-[14px] sm:tracking-[-0.14px] ${index === 0
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

    </>
  );
}
