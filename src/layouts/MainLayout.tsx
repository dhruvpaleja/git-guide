import { Outlet } from 'react-router-dom';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
