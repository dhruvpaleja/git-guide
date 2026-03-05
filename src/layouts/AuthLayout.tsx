import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <main id="main-content" className="w-full max-w-md p-8">
        <Outlet />
      </main>
    </div>
  );
}
