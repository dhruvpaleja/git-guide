import type { CourseItem } from '../constants/courses.data';

interface CourseCardProps {
  course: CourseItem;
  highlighted?: boolean;
}

export default function CourseCard({ course, highlighted = false }: CourseCardProps) {
  return (
    <div className="mx-auto w-full max-w-[395px]">
      <article
        className={`relative aspect-[395/500] overflow-hidden rounded-[22px] border border-black/20 sm:rounded-[25px] ${
          highlighted ? 'shadow-[0_30px_60px_rgba(0,0,0,0.3)]' : ''
        }`}
      >
        <img src={course.image} alt={course.title} className="h-full w-full object-cover" />

        <img
          src="/images/courses/card-gradient.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-[54%] w-full rounded-b-[22px] sm:rounded-b-[25px]"
        />

        <div className="absolute left-[7.6%] top-[6%] flex h-[6%] min-h-[26px] w-[15.2%] min-w-[58px] items-center justify-center gap-1 rounded-[22px] border border-black/20 bg-white text-[13px] font-semibold tracking-[-0.13px] text-black sm:text-[14px] sm:tracking-[-0.14px]">
          <img src="/images/courses/star.png" alt="" aria-hidden className="h-[13px] w-[13px] sm:h-[14px] sm:w-[14px]" />
          <span>{course.rating}</span>
        </div>

        <h3 className="absolute left-[7.6%] top-[67.2%] w-[84.8%] text-[20px] font-semibold leading-[1.25] tracking-[-0.2px] text-white sm:text-[24px] sm:leading-[30px] sm:tracking-[-0.24px]">
          {course.title}
        </h3>

        <p className="absolute left-[7.6%] top-[82.2%] text-[14px] tracking-[-0.14px] text-white sm:text-[16px] sm:tracking-[-0.16px]">{course.lessons}</p>
        <p className="absolute left-[7.6%] top-[89.2%] text-[14px] tracking-[-0.14px] text-white sm:text-[16px] sm:tracking-[-0.16px]">{course.duration}</p>

        <div className="absolute left-[51.9%] top-[82.2%] h-[12%] min-h-[56px] w-[40.5%] min-w-[152px] rounded-[22px] border border-white/50 px-3 text-white sm:px-[15px]">
          <p className="text-[10px] leading-[26px] tracking-[-0.1px] sm:leading-[30px]">Course Fees</p>
          <p className="-mt-1 text-right text-[22px] font-semibold leading-[28px] tracking-[-0.22px] sm:text-[24px] sm:leading-[30px] sm:tracking-[-0.24px]">{course.price}</p>
        </div>
      </article>

      <button
        type="button"
        className={`mx-auto mt-5 h-[52px] w-full max-w-[220px] rounded-[22px] border text-[14px] font-semibold tracking-[-0.14px] transition-colors sm:mt-[30px] sm:h-[60px] sm:rounded-[25px] sm:text-[16px] sm:tracking-[-0.16px] ${
          highlighted
            ? 'border-white bg-[#080808] text-white shadow-[0_10px_60px_rgba(0,0,0,0.3)] hover:bg-black'
            : 'border-black/20 bg-white text-black hover:bg-black/5'
        }`}
      >
        Enroll Now
      </button>
    </div>
  );
}
