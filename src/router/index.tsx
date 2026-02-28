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
import ProtectedRoute from './ProtectedRoute';

// ---------------------------------------------------------------------------
// Lazy-loaded pages
// ---------------------------------------------------------------------------
const SplashScreen = lazy(() => import('@/pages/SplashScreen'));
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Auth Pages (Phase 1 MVP)
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));

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
