import { useState } from 'react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  useDocumentTitle('Page Not Found');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center px-4 pt-20">
      
      {/* 404 Section with Happy Face */}
      <div className="relative mb-8">
        <div className="relative inline-block">
          {/* 404 Text with Red Gradient */}
          <div 
            className="text-center font-bold font-['Manrope'] leading-none select-none"
            style={{
              fontSize: 'clamp(180px, 25vw, 320px)',
              backgroundImage: `linear-gradient(to right, 
                #D93025 0%, 
                #A3241C 20%,
                #6D1813 40%,
                #51120E 55%,
                #360C09 70%,
                #4D1612 90%,
                #6D1813 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
            }}
          >
            404
          </div>
          
          {/* Happy Face perfectly centered in the 0 - smaller size */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              width: 'clamp(50px, 6vw, 75px)',
              height: 'clamp(50px, 6vw, 75px)',
            }}
          >
            <img 
              src="https://www.figma.com/api/mcp/asset/2a3be53c-efb9-4fcd-8c4a-7daa7c26be4d" 
              alt="Page not found" 
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Oops Message */}
      <h1 className="text-2xl md:text-4xl font-semibold font-['Manrope'] text-white text-center mb-10 tracking-tight px-4 max-w-2xl">
        Oops! Page Not Found...
      </h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="w-full max-w-xl mb-16 px-4">
        <div className="relative bg-white/95 backdrop-blur-sm rounded-full px-6 md:px-8 py-3.5 md:py-4 flex items-center gap-4 shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-[1.02]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search what you want..."
            className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none font-['Manrope'] text-sm md:text-base"
          />
          <button 
            type="submit" 
            className="text-gray-400 hover:text-gray-700 flex-shrink-0 transition-colors duration-200"
            aria-label="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>

      {/* Down Arrow - Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
}
