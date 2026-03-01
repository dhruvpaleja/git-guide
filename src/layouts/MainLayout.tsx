import { Outlet, useLocation } from 'react-router-dom';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

export default function MainLayout() {
  const location = useLocation();
  const isLightPage = location.pathname === '/about' || location.pathname === '/business';

  return (
    <div className={`min-h-screen overflow-x-hidden ${isLightPage ? 'bg-white text-black' : 'bg-black text-white'}`}>
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
