export interface CourseItem {
  title: string;
  lessons: string;
  duration: string;
  rating: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  image: string;
  category?: string;
  searchContent?: string;
  badge?: 'popular' | 'bestseller' | 'limited' | 'new';
  studentsEnrolled?: string;
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
        originalPrice: '₹2,999',
        discount: '80% OFF',
        image: '/images/courses/course-anxiety-1.jpg',
        category: 'Anxiety',
        searchContent: 'anxiety understanding mental health stress calm mindfulness',
        badge: 'bestseller',
        studentsEnrolled: '12,450+',
      },
      {
        title: 'Mastering Daily Anxiety Triggers.',
        lessons: '8 Lessons',
        duration: 'Duration: 3 weeks',
        rating: '4.3',
        price: '₹599',
        originalPrice: '₹2,499',
        discount: '76% OFF',
        image: '/images/courses/course-anxiety-2.jpg',
        category: 'Anxiety',
        searchContent: 'anxiety triggers daily stress management coping techniques',
        badge: 'popular',
        studentsEnrolled: '8,920+',
      },
      {
        title: 'Breathwork & Grounding for Rapid Calm.',
        lessons: '5 Lessons',
        duration: 'Duration: 10 days',
        rating: '4.7',
        price: '₹599',
        originalPrice: '₹1,999',
        discount: '70% OFF',
        image: '/images/courses/course-anxiety-3.jpg',
        category: 'Anxiety',
        searchContent: 'breathwork grounding calm relaxation breathing meditation',
        badge: 'limited',
        studentsEnrolled: '5,340+',
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
        originalPrice: '₹2,499',
        discount: '76% OFF',
        image: '/images/courses/course-relationship-1.jpg',
        category: 'Relationship',
        searchContent: 'relationship healthy foundations love connection trust communication',
        studentsEnrolled: '6,780+',
      },
      {
        title: 'Communication Skills for Stronger Bonds.',
        lessons: '8 Lessons',
        duration: 'Duration: 2 weeks',
        rating: '4.6',
        price: '₹599',
        originalPrice: '₹2,799',
        discount: '79% OFF',
        image: '/images/courses/course-relationship-2.jpg',
        category: 'Relationship',
        searchContent: 'communication skills relationship bonds connection listening empathy',
        badge: 'popular',
        studentsEnrolled: '9,120+',
      },
      {
        title: 'Understand Toxic Patterns.',
        lessons: '9 Lessons',
        duration: 'Duration: 2 weeks',
        rating: '4.6',
        price: '₹599',
        originalPrice: '₹2,999',
        discount: '80% OFF',
        image: '/images/courses/course-relationship-3.jpg',
        category: 'Relationship',
        searchContent: 'toxic patterns relationship boundaries red flags unhealthy',
        studentsEnrolled: '7,450+',
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
        originalPrice: '₹2,499',
        discount: '76% OFF',
        image: '/images/courses/course-career-1.jpg',
        category: 'Career',
        searchContent: 'career clarity path purpose goals professional development',
        badge: 'new',
        studentsEnrolled: '4,230+',
      },
      {
        title: 'Mindset Training for Professional Success.',
        lessons: '8 Lessons',
        duration: 'Duration: 3 weeks',
        rating: '4.6',
        price: '₹599',
        originalPrice: '₹2,799',
        discount: '79% OFF',
        image: '/images/courses/course-career-2.jpg',
        category: 'Career',
        searchContent: 'mindset training professional success growth development achievement',
        studentsEnrolled: '8,560+',
      },
      {
        title: 'Communication & Leadership Skills for Growth.',
        lessons: '8 Lessons',
        duration: 'Duration: 4 weeks',
        rating: '4.4',
        price: '₹599',
        originalPrice: '₹3,499',
        discount: '83% OFF',
        image: '/images/courses/course-career-3.jpg',
        category: 'Career',
        searchContent: 'communication leadership skills growth management team building',
        badge: 'bestseller',
        studentsEnrolled: '11,890+',
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
        originalPrice: '₹1,999',
        discount: '75% OFF',
        image: '/images/courses/course-sleep-1.jpg',
        category: 'Sleep',
        searchContent: 'sleep science rest recovery health circadian rhythm',
        studentsEnrolled: '5,670+',
      },
      {
        title: 'Managing Insomnia & Overthinking at Night.',
        lessons: '8 Lessons',
        duration: 'Duration: 3 weeks',
        rating: '4.6',
        price: '₹599',
        originalPrice: '₹2,799',
        discount: '79% OFF',
        image: '/images/courses/course-sleep-2.jpg',
        category: 'Sleep',
        searchContent: 'insomnia overthinking night sleep disorder anxiety relaxation',
        badge: 'popular',
        studentsEnrolled: '10,120+',
      },
      {
        title: 'Lifestyle Habits for Better Sleep.',
        lessons: '6 Lessons',
        duration: 'Duration: 2 weeks',
        rating: '4.4',
        price: '₹699',
        originalPrice: '₹2,999',
        discount: '77% OFF',
        image: '/images/courses/course-sleep-3.jpg',
        category: 'Sleep',
        searchContent: 'lifestyle habits sleep quality routine wellness health',
        studentsEnrolled: '6,340+',
      },
    ],
  },
];
