export interface CourseItem {
  title: string;
  lessons: string;
  duration: string;
  rating: string;
  price: string;
  image: string;
}

export interface CourseSection {
  key: string;
  title: string;
  courses: CourseItem[];
}

export const courseFilters = ['All', 'Anxiety', 'Relationship', 'Career', 'Sleep'];

export const courseSections: CourseSection[] = [
  {
    key: 'top-picks',
    title: 'Top Picks',
    courses: [
      {
        title: 'Understanding Anxiety From the Inside Out.',
        lessons: '6 Lessons',
        duration: 'Duration: 3 weeks',
        rating: '4.5',
        price: '₹599',
        image: '/images/courses/course-anxiety-1.jpg',
      },
      {
        title: 'Mastering Daily Anxiety Triggers.',
        lessons: '8 Lessons',
        duration: 'Duration: 3 weeks',
        rating: '4.3',
        price: '₹599',
        image: '/images/courses/course-anxiety-2.jpg',
      },
      {
        title: 'Breathwork & Grounding for Rapid Calm.',
        lessons: '5 Lessons',
        duration: 'Duration: 10 days',
        rating: '4.7',
        price: '₹599',
        image: '/images/courses/course-anxiety-3.jpg',
      },
    ],
  },
  {
    key: 'relationship',
    title: 'Relationship',
    courses: [
      {
        title: 'Building Healthy Relationship Foundations.',
        lessons: '6 Lessons',
        duration: 'Duration: 3 weeks',
        rating: '4.3',
        price: '₹599',
        image: '/images/courses/course-relationship-1.jpg',
      },
      {
        title: 'Communication Skills for Stronger Bonds.',
        lessons: '8 Lessons',
        duration: 'Duration: 2 weeks',
        rating: '4.6',
        price: '₹599',
        image: '/images/courses/course-relationship-2.jpg',
      },
      {
        title: 'Understand Toxic Patterns.',
        lessons: '9 Lessons',
        duration: 'Duration: 2 weeks',
        rating: '4.6',
        price: '₹599',
        image: '/images/courses/course-relationship-3.jpg',
      },
    ],
  },
  {
    key: 'career',
    title: 'Career',
    courses: [
      {
        title: 'Finding Clarity In Your Career Path.',
        lessons: '6 Lessons',
        duration: 'Duration: 2 weeks',
        rating: '4.6',
        price: '₹599',
        image: '/images/courses/course-career-1.jpg',
      },
      {
        title: 'Mindset Training for Professional Success.',
        lessons: '8 Lessons',
        duration: 'Duration: 3 weeks',
        rating: '4.6',
        price: '₹599',
        image: '/images/courses/course-career-2.jpg',
      },
      {
        title: 'Communication & Leadership Skills for Growth.',
        lessons: '8 Lessons',
        duration: 'Duration: 4 weeks',
        rating: '4.4',
        price: '₹599',
        image: '/images/courses/course-career-3.jpg',
      },
    ],
  },
  {
    key: 'sleep',
    title: 'Sleep',
    courses: [
      {
        title: 'Understand the Science of Sleep.',
        lessons: '4 Lessons',
        duration: 'Duration: 1 weeks',
        rating: '4.4',
        price: '₹499',
        image: '/images/courses/course-sleep-1.jpg',
      },
      {
        title: 'Managing Insomnia & Overthinking at Night.',
        lessons: '8 Lessons',
        duration: 'Duration: 3 weeks',
        rating: '4.6',
        price: '₹599',
        image: '/images/courses/course-sleep-2.jpg',
      },
      {
        title: 'Lifestyle Habits for Better Sleep.',
        lessons: '6 Lessons',
        duration: 'Duration: 2 weeks',
        rating: '4.4',
        price: '₹699',
        image: '/images/courses/course-sleep-3.jpg',
      },
    ],
  },
];
