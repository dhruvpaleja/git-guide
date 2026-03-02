import { useState } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CourseItem } from '../constants/courses.data';

interface CourseCardProps {
  course: CourseItem;
  highlighted?: boolean;
}

export default function CourseCard({ course, highlighted = false }: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="mx-auto w-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article
        className={`relative aspect-[395/500] overflow-hidden rounded-[22px] border border-black/20 transition-all duration-500 ease-out sm:rounded-[25px] ${highlighted
            ? 'shadow-[0_30px_60px_rgba(0,0,0,0.3)]'
            : 'hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]'
          }`}
        style={{
          transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        }}
      >
        <img
          src={course.image}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out"
          style={{
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
          }}
        />

        <img
          src="/images/courses/card-gradient.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-[54%] w-full rounded-b-[22px] sm:rounded-b-[25px]"
        />

        {/* Rating Badge - Responsive positioning */}
        <div className="absolute left-[5%] top-[4%] flex h-auto min-h-[24px] w-auto items-center justify-center gap-1 rounded-[18px] border border-black/20 bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold tracking-[-0.11px] text-black transition-all duration-300 sm:left-[7.6%] sm:top-[6%] sm:min-h-[26px] sm:rounded-[22px] sm:px-3 sm:text-[13px] sm:tracking-[-0.13px] md:text-[14px] md:tracking-[-0.14px]"
          style={{
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          <Star className="h-[11px] w-[11px] fill-yellow-400 text-yellow-400 sm:h-[13px] sm:w-[13px] md:h-[14px] md:w-[14px]" />
          <span>{course.rating}</span>
        </div>

        {/* Discount Badge - Top Right - Responsive */}
        {course.discount && (
          <div className="absolute right-[5%] top-[4%] flex h-auto min-h-[24px] items-center justify-center rounded-full border border-white/20 bg-gradient-to-r from-green-500 to-green-600 px-2.5 py-1 text-[10px] font-bold tracking-tight text-white shadow-lg backdrop-blur-sm transition-all duration-300 sm:right-[7.6%] sm:top-[6%] sm:min-h-[26px] sm:px-3 sm:text-[11px] md:px-4 md:text-[12px]"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {course.discount}
          </div>
        )}

        {/* Urgency Badge - Below Rating - Responsive */}
        {course.badge && (
          <div className={`absolute left-[5%] top-[11%] flex h-auto min-h-[20px] items-center justify-center rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide transition-all duration-300 sm:left-[7.6%] sm:top-[13%] sm:min-h-[22px] sm:px-3 sm:text-[10px] md:px-3.5 md:text-[11px] ${course.badge === 'bestseller' ? 'bg-amber-500/95 text-white' :
              course.badge === 'popular' ? 'bg-purple-500/95 text-white' :
                course.badge === 'limited' ? 'bg-red-500/95 text-white' :
                  'bg-blue-500/95 text-white'
            }`}
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {course.badge}
          </div>
        )}

        {/* Title - Responsive sizing and positioning */}
        <h3 className="absolute left-[5%] top-[67%] w-[90%] text-[17px] font-semibold leading-[1.2] tracking-[-0.17px] text-white transition-all duration-300 sm:left-[7.6%] sm:top-[67.2%] sm:w-[84.8%] sm:text-[20px] sm:leading-[1.25] sm:tracking-[-0.2px] md:text-[22px] md:tracking-[-0.22px] lg:text-[24px] lg:leading-[30px] lg:tracking-[-0.24px]"
          style={{
            transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          }}
        >
          {course.title}
        </h3>

        {/* Lessons - Responsive */}
        <p className="absolute left-[5%] top-[82%] text-[12px] tracking-[-0.12px] text-white/90 transition-opacity duration-300 sm:left-[7.6%] sm:top-[82.2%] sm:text-[13px] sm:tracking-[-0.13px] md:text-[14px] md:tracking-[-0.14px] lg:text-[16px] lg:tracking-[-0.16px]"
          style={{
            opacity: isHovered ? 1 : 0.85,
          }}
        >{course.lessons}</p>

        {/* Duration - Responsive */}
        <p className="absolute left-[5%] top-[88%] text-[12px] tracking-[-0.12px] text-white/90 transition-opacity duration-300 sm:left-[7.6%] sm:top-[89.2%] sm:text-[13px] sm:tracking-[-0.13px] md:text-[14px] md:tracking-[-0.14px] lg:text-[16px] lg:tracking-[-0.16px]"
          style={{
            opacity: isHovered ? 1 : 0.85,
          }}
        >{course.duration}</p>

        {/* Enhanced Pricing Box with Value Psychology - Fully Responsive */}
        <div className="absolute right-[5%] top-[78%] h-auto min-h-[70px] w-[42%] min-w-[140px] rounded-[18px] border border-white/50 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 text-white transition-all duration-300 sm:right-[7.6%] sm:left-auto sm:w-[40.5%] sm:min-w-[152px] sm:rounded-[22px] sm:px-3 sm:py-2 md:px-[15px] md:py-3"
          style={{
            transform: isHovered ? 'scale(1.03)' : 'scale(1)',
            backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Original Price with Strikethrough */}
          {course.originalPrice && (
            <p className="text-[10px] leading-tight tracking-tight text-white/50 line-through sm:text-[11px] md:text-[12px]">
              {course.originalPrice}
            </p>
          )}

          {/* Current Price - Large & Bold */}
          <p className="text-[22px] font-bold leading-tight tracking-tight sm:text-[26px] md:text-[28px] lg:text-[30px]">{course.price}</p>

          {/* Course Fees Label */}
          <p className="mt-0.5 text-[8px] leading-tight tracking-tight text-white/70 sm:text-[9px] md:text-[10px]">Course Fees</p>

          {/* Social Proof - Students Enrolled */}
          {course.studentsEnrolled && (
            <p className="mt-0.5 text-[8px] leading-tight tracking-tight text-white/80 sm:mt-1 sm:text-[9px] md:text-[10px]">
              {course.studentsEnrolled} enrolled
            </p>
          )}
        </div>
      </article>

      {/* Enroll Button - Fully Responsive */}
      <Link to={`/courses/${course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`}>
        <button
          type="button"
          className={`mx-auto mt-4 h-[48px] w-full max-w-[200px] flex items-center justify-center rounded-[20px] border text-[13px] font-semibold tracking-[-0.13px] transition-all duration-300 sm:mt-5 sm:h-[52px] sm:max-w-[220px] sm:rounded-[22px] sm:text-[14px] sm:tracking-[-0.14px] md:mt-[30px] md:h-[60px] md:rounded-[25px] md:text-[16px] md:tracking-[-0.16px] ${highlighted
              ? 'border-white bg-[#080808] text-white shadow-[0_10px_60px_rgba(0,0,0,0.3)] hover:bg-black hover:shadow-[0_15px_80px_rgba(0,0,0,0.4)] hover:scale-[1.02]'
              : 'border-black/20 bg-white text-black hover:bg-black/5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:border-black/30 hover:scale-[1.02]'
            }`}
        >
          Enroll Now
        </button>
      </Link>
    </div>
  );
}
