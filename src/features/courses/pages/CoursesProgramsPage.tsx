import CourseCard from '../components/CourseCard';
import { courseFilters, courseSections } from '../constants/courses.data';

export default function CoursesProgramsPage() {
  return (
    <>
      <section className="relative mx-auto w-full max-w-[1440px] overflow-hidden px-4 pb-12 pt-[100px] sm:px-6 sm:pb-16 sm:pt-[120px] lg:px-[77px] lg:pb-20 lg:pt-[140px]">
        <img
          src="/images/courses/bg-grey-ellipse.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-0 top-[25px] w-full max-w-none"
        />

        <div className="relative z-10 text-center">
          <h1 className="text-[28px] font-semibold tracking-[-0.28px] sm:text-[32px] sm:tracking-[-0.32px]">Guided Courses & Programs.</h1>
          <p className="mx-auto mt-1 max-w-[620px] text-[16px] tracking-[-0.16px] text-black/50 sm:mt-2 sm:text-[18px] sm:tracking-[-0.18px]">
            Get the best of courses for your mental and physical health by top worldwide teachers.
          </p>
        </div>

        <div className="relative z-10 mx-auto mt-8 flex h-[50px] w-full items-center rounded-[25px] border border-black/20 bg-white px-4 sm:mt-10 sm:h-[60px] sm:max-w-[395px] sm:px-[30px]">
          <input
            className="w-full bg-transparent text-[14px] tracking-[-0.14px] placeholder:text-black/50 focus:outline-none sm:text-[16px] sm:tracking-[-0.16px]"
            placeholder="Search for courses..."
          />
          <img src="/images/courses/search-icon.png" alt="" aria-hidden className="h-[14px] w-[14px] opacity-50 sm:h-[15px] sm:w-[15px]" />
        </div>

        <div className="relative z-10 mt-10 sm:mt-12 lg:mt-14">
          <h3 className="mb-4 text-center text-[14px] font-semibold tracking-[-0.14px] text-black/70 sm:text-[16px] sm:tracking-[-0.16px]">
            Top Picks
          </h3>
          <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-2 rounded-[25px] border border-black/20 bg-white p-2 sm:p-[5px] sm:max-w-[590px]">
            {courseFilters.map((label, index) => (
              <button
                key={label}
                type="button"
                className={`h-[40px] rounded-[20px] px-3 text-[12px] font-medium tracking-[-0.12px] transition-all duration-300 sm:h-[50px] sm:px-4 sm:text-[14px] sm:tracking-[-0.14px] ${index === 0
                  ? 'w-auto border border-white bg-[#080808] text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)]'
                  : 'w-auto bg-white text-black/50 hover:bg-black/5'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-10 space-y-12 sm:mt-12 lg:mt-14">
          {courseSections.map((section, sectionIndex) => (
            <section key={section.key}>
              <div className="mb-6 flex items-center justify-between sm:mb-8">
                <h2 className="text-[16px] font-semibold tracking-[-0.16px] text-black/70 sm:text-[18px] sm:tracking-[-0.18px]">{section.title}</h2>
                <button type="button" className="text-[13px] tracking-[-0.13px] text-black/50 transition-colors hover:text-black sm:text-[14px] sm:tracking-[-0.14px]">
                  View All
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-[30px] lg:grid-cols-3">
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
