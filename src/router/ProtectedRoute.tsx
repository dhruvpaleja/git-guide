import { Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // ── TEMP: Auth bypassed for UI testing ──
  // TODO: RESTORE before production
  return <Outlet />;

  /* ORIGINAL AUTH LOGIC — RESTORE THIS:
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
  */
}
