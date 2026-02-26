import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-8">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
