/**
 * Application Router
 *
 * HOW TO ADD A NEW PAGE:
 * 1. Create a React component in src/pages/ (e.g. src/pages/AboutPage.tsx)
 * 2. Lazy-import it below:  const AboutPage = lazy(() => import('@/pages/AboutPage'));
 * 3. Add a route entry inside the children array of the appropriate layout:
 *    - Standalone pages (no nav/footer) → top-level route
 *    - Public pages (with nav/footer)   → MainLayout children
 *    - Login/Signup                     → AuthLayout children
 *    - Dashboard pages                  → wrap with ProtectedRoute + DashboardLayout
 *    Example: { path: 'about', element: <Lazy><AboutPage /></Lazy> }
 *
 * Each lazy-loaded page becomes its own JS chunk for fast page loads.
 */

import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { DashboardLayout, MainLayout } from '@/layouts';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProtectedRoute from './ProtectedRoute.tsx';

// ---------------------------------------------------------------------------
// Lazy-loaded pages
// ---------------------------------------------------------------------------
const SplashScreen = lazy(() => import('@/pages/SplashScreen'));
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const BusinessPage = lazy(() => import('@/pages/BusinessPage'));
const CorporatePage = lazy(() => import('@/pages/CorporatePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const CareerPage = lazy(() => import('@/pages/CareerPage'));
const BlogsPage = lazy(() => import('@/pages/BlogsPage'));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'));
const CoursesPage = lazy(() => import('@/pages/CoursesPage'));
const StudentCounsellingPage = lazy(() => import('@/pages/StudentCounsellingPage'));
const WorkshopDemoPage = lazy(() => import('@/pages/WorkshopDemoPage'));
const StudentCounsellingDemoPage = lazy(() => import('@/pages/StudentCounsellingDemoPage'));

// Auth Pages (Phase 1 MVP)
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));

// Journey Preparation Page - shown after login before dashboard
const JourneyPreparationPage = lazy(() =>
  import('@/features/journey-preparation/pages/JourneyPreparationPage')
);

// ---------------------------------------------------------------------------
// Suspense wrapper for lazy pages
// ---------------------------------------------------------------------------
function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}

// ---------------------------------------------------------------------------
// Route tree
// ---------------------------------------------------------------------------
const router = createBrowserRouter([
  // Splash screen — standalone, no layout
  {
    path: '/',
    element: (
      <Lazy>
        <SplashScreen />
      </Lazy>
    ),
  },

  // Auth pages
  {
    path: '/login',
    element: (
      <Lazy>
        <LoginPage />
      </Lazy>
    ),
  },
  {
    path: '/signup',
    element: (
      <Lazy>
        <SignupPage />
      </Lazy>
    ),
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/journey-preparation',
        element: (
          <Lazy>
            <JourneyPreparationPage />
          </Lazy>
        ),
      },
      {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: (
              <Lazy>
                <DashboardPage />
              </Lazy>
            ),
          },
        ],
      },
    ],
  },

  // Public pages with nav + footer
  {
    element: <MainLayout />,
    children: [
      {
        path: 'home',
        element: (
          <Lazy>
            <LandingPage />
          </Lazy>
        ),
      },
      {
        path: 'about',
        element: (
          <Lazy>
            <AboutPage />
          </Lazy>
        ),
      },
      {
        path: 'business',
        element: (
          <Lazy>
            <BusinessPage />
          </Lazy>
        ),
      },
      {
        path: 'business/corporate',
        element: (
          <Lazy>
            <CorporatePage />
          </Lazy>
        ),
      },
      {
        path: 'blogs',
        element: (
          <Lazy>
            <BlogsPage />
          </Lazy>
        ),
      },
      {
        path: 'blog/:id',
        element: (
          <Lazy>
            <BlogPostPage />
          </Lazy>
        ),
      },
      {
        path: 'careers',
        element: (
          <Lazy>
            <CareerPage />
          </Lazy>
        ),
      },
      {
        path: 'courses',
        element: (
          <Lazy>
            <CoursesPage />
          </Lazy>
        ),
      },
      {
        path: 'contact',
        element: (
          <Lazy>
            <ContactPage />
          </Lazy>
        ),
      },
      {
        path: 'blog',
        element: (
          <Lazy>
            <BlogsPage />
          </Lazy>
        ),
      },
      {
        path: 'student-counselling',
        element: (
          <Lazy>
            <StudentCounsellingPage />
          </Lazy>
        ),
      },
      {
        path: 'business/workshop-demo',
        element: (
          <Lazy>
            <WorkshopDemoPage />
          </Lazy>
        ),
      },
      {
        path: 'business/student-counselling-demo',
        element: (
          <Lazy>
            <StudentCounsellingDemoPage />
          </Lazy>
        ),
      },
      {
        path: '*',
        element: (
          <Lazy>
            <NotFoundPage />
          </Lazy>
        ),
      },
    ],
  },
]);

// ---------------------------------------------------------------------------
// Router component rendered in the app tree
// ---------------------------------------------------------------------------
export default function AppRouter() {
  return <RouterProvider router={router} />;
}
