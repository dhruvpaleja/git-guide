import { Outlet } from 'react-router-dom';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

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
