/**
 * Application Router
 *
 * Centralized routing with lazy-loaded pages and layout nesting.
 * Designed for scalability — new pages are added by creating a component
 * in src/pages/ and adding a route entry below.
 */

import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout, AuthLayout, DashboardLayout } from '@/layouts';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProtectedRoute from './ProtectedRoute';

// ---------------------------------------------------------------------------
// Lazy-loaded pages – each page is code-split into its own chunk.
// Add new pages here following the same pattern.
// ---------------------------------------------------------------------------
const HomePage = lazy(() => import('@/pages/HomePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// ---------------------------------------------------------------------------
// Loading fallback shown while a lazy page chunk is being fetched.
// ---------------------------------------------------------------------------
function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}

// ---------------------------------------------------------------------------
// Route tree
// ---------------------------------------------------------------------------
const router = createBrowserRouter([
  // Public pages using the main layout (nav + footer)
  {
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <HomePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '*',
        element: (
          <SuspenseWrapper>
            <NotFoundPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },

  // Auth pages (login, signup) – minimal layout
  {
    element: <AuthLayout />,
    children: [
      // Add auth pages here as they are created:
      // { path: 'login', element: <SuspenseWrapper><LoginPage /></SuspenseWrapper> },
      // { path: 'signup', element: <SuspenseWrapper><SignupPage /></SuspenseWrapper> },
    ],
  },

  // Protected dashboard pages
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          // Add protected pages here as they are created:
          // { path: 'dashboard', element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
          // { path: 'profile',   element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper> },
        ],
      },
    ],
  },

  // Protected admin pages
  {
    element: <ProtectedRoute requiredRoles={['admin']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          // Add admin pages here as they are created:
          // { path: 'admin', element: <SuspenseWrapper><AdminPage /></SuspenseWrapper> },
        ],
      },
    ],
  },
]);

// ---------------------------------------------------------------------------
// Router component to be rendered in the app tree
// ---------------------------------------------------------------------------
export default function AppRouter() {
  return <RouterProvider router={router} />;
}
