import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import { courseFilters, courseSections } from '../constants/courses.data';

export default function CoursesProgramsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Flatten all courses from sections for filtering
  const allCourses = useMemo(() => {
    return courseSections.flatMap((section) =>
      section.courses.map((course) => ({ ...course, sectionKey: section.key, sectionTitle: section.title }))
    );
  }, []);

  // Filter courses based on search term and selected filter
  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const filterMatch =
        selectedFilter === 'All' || course.category === selectedFilter;

      const searchMatch =
        searchTerm === '' ||
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.lessons.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.searchContent && course.searchContent.toLowerCase().includes(searchTerm.toLowerCase()));

      return filterMatch && searchMatch;
    });
  }, [searchTerm, selectedFilter, allCourses]);

  // Group filtered courses back by section
  const filteredSections = useMemo(() => {
    const sections = new Map<string, typeof courseSections[0] & { courses: typeof filteredCourses }>();
    
    filteredCourses.forEach((course) => {
      if (!sections.has(course.sectionKey)) {
        sections.set(course.sectionKey, {
          key: course.sectionKey,
          title: course.sectionTitle,
          courses: [],
        });
      }
      sections.get(course.sectionKey)!.courses.push(course);
    });

    return Array.from(sections.values());
  }, [filteredCourses]);
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
          <h1 className="text-[28px] font-semibold tracking-[-0.28px] sm:text-[32px] sm:tracking-[-0.32px]">
            Guided Courses & Programs.
          </h1>
          <p className="mx-auto mt-1 max-w-[620px] text-[16px] tracking-[-0.16px] text-black/50 sm:mt-2 sm:text-[18px] sm:tracking-[-0.18px]">
            Get the best of courses for your mental and physical health by top worldwide teachers.
          </p>
        </div>

        <div className="relative z-10 mx-auto mt-8 flex h-[50px] w-full items-center rounded-[25px] border border-black/20 bg-white px-4 sm:mt-10 sm:h-[60px] sm:max-w-[395px] sm:px-[30px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-[14px] tracking-[-0.14px] placeholder:text-black/50 focus:outline-none sm:text-[16px] sm:tracking-[-0.16px]"
            placeholder="Search for courses..."
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="ml-2 p-1 hover:bg-black/5 rounded transition-colors"
              aria-label="Clear search"
            >
              <X size={16} className="text-black/50" />
            </button>
          )}
          {!searchTerm && <Search size={16} className="text-black/50" />}
        </div>

        <div className="relative z-10 mt-10 sm:mt-12 lg:mt-14">
          <h3 className="mb-4 text-center text-[14px] font-semibold tracking-[-0.14px] text-black/70 sm:text-[16px] sm:tracking-[-0.16px]">
            Top Picks
          </h3>
          <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-2 rounded-[25px] border border-black/20 bg-white p-2 sm:p-[5px] sm:max-w-[590px]">
            {courseFilters.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setSelectedFilter(label)}
                className={`h-[40px] rounded-[20px] px-3 text-[12px] font-medium tracking-[-0.12px] transition-all duration-300 sm:h-[50px] sm:px-4 sm:text-[14px] sm:tracking-[-0.14px] ${
                  selectedFilter === label
                    ? 'w-auto border border-white bg-[#080808] text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)]'
                    : 'w-auto bg-white text-black/50 hover:bg-black/5'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="relative z-10 mt-8 text-center">
          <p className="text-[13px] tracking-[-0.13px] text-black/60 sm:text-[14px] sm:tracking-[-0.14px]">
            {filteredCourses.length === 0
              ? 'No courses found. Try a different search or filter.'
              : `Found ${filteredCourses.length} course${filteredCourses.length !== 1 ? 's' : ''}`}
            {searchTerm && ` for "${searchTerm}"`}
            {selectedFilter !== 'All' && ` in ${selectedFilter}`}
          </p>
        </div>

        <div className="relative z-10 mt-10 sm:mt-12 lg:mt-14">
          {filteredCourses.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-[16px] text-black/50 mb-2">No courses match your search or filters.</p>
              <p className="text-[14px] text-black/40 mb-6">Try adjusting your search or browse all courses</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedFilter('All');
                }}
                className="rounded-[25px] bg-black px-6 py-3 text-[14px] font-semibold text-white hover:bg-black/90 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-12 sm:space-y-16">
              {filteredSections.map((section, sectionIndex) => (
                <section key={section.key}>
                  <div className="mb-6 flex items-center justify-between sm:mb-8">
                    <h2 className="text-[16px] font-semibold tracking-[-0.16px] text-black/70 sm:text-[18px] sm:tracking-[-0.18px]">
                      {section.title}
                    </h2>
                    <button 
                      type="button" 
                      className="text-[13px] tracking-[-0.13px] text-black/50 transition-all duration-300 hover:text-black hover:translate-x-1 sm:text-[14px] sm:tracking-[-0.14px]"
                    >
                      View All →
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
          )}
        </div>
      </section>
    </>
  );
}
