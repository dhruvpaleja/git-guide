/**
 * Course Feature Types
 */

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  studentsEnrolled: number;
  modules: CourseModule[];
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: CourseLesson[];
  durationInMinutes: number;
}

export interface CourseLesson {
  id: string;
  moduleId: string;
  title: string;
  duration: number;
  videoUrl?: string;
  content: string;
  attachments?: Attachment[];
  order: number;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completedAt?: Date;
  progress: number;
  lastAccessedAt: Date;
  lessonsCompleted: string[];
}

export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
