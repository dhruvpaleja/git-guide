import { CoursesProgramsPage } from '@/features/courses';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function CoursesPage() {
  useDocumentTitle('Courses & Programs');
  return <CoursesProgramsPage />;
}
