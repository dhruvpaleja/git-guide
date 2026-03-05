import { Outlet, useLocation } from 'react-router-dom';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

export default function MainLayout() {
  const location = useLocation();
  const isLightPage = location.pathname.includes('/about') || location.pathname.includes('/business') || location.pathname.includes('/blog') || location.pathname.includes('/contact') || location.pathname.includes('/careers') || location.pathname.includes('/courses');

  return (
    <div className={`min-h-screen overflow-x-hidden ${isLightPage ? 'bg-white text-black' : 'bg-black text-white'}`}>
      <Navigation />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
