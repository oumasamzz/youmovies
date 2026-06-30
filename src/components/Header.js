import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import Search from './Search'; 
import Logo from '../images/youmovieslogo-removebg.png';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Avatar from './Avatar'; // Import the new Avatar component

const Header = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#141414]/95 backdrop-blur-md shadow-lg border-b border-zinc-800/50 transition-all">
      <div className="flex justify-between items-center px-4 md:px-8 lg:px-12 min-h-[80px] py-3 md:py-4">
        
        <div className="flex items-center gap-4 md:gap-12">
          <button 
            className="md:hidden text-zinc-300 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
          </button>

          <Link to="/" className="flex-shrink-0 z-50 ml-2 md:ml-0">
            <img 
              src={Logo} 
              alt="Youmovies Logo" 
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain transform origin-left scale-125 sm:scale-150 transition-transform duration-300 hover:scale-[1.35] sm:hover:scale-[1.60]" 
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm lg:text-base font-medium text-zinc-300 ml-4">
            <Link to="/" className="hover:text-white transition-colors">Movies</Link>
            <Link to="/tvshows" className="hover:text-white transition-colors">TV Shows</Link>
            <div className="relative group py-6">
              <button className="hover:text-white transition-colors flex items-center gap-1">
                Categories
                <svg className="w-4 h-4 mt-0.5 group-hover:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 w-48 bg-black/95 border border-zinc-800 rounded-md shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                <div className="py-2 flex flex-col">
                  {['Action', 'Romance', 'Thriller', 'Comedy', 'Anime', 'Kung-fu'].map((cat) => (
                    <Link key={cat} to={`/categories/${cat.toLowerCase()}`} className="px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">{cat}</Link>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/favourites" className="hover:text-white transition-colors">Favourites</Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 w-full justify-end md:w-auto">
          <div className="flex-1 md:flex-none max-w-[150px] sm:max-w-xs">
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} loading={loading} setLoading={setLoading} setError={setError} navigate={navigate} error={error} />
          </div>

          <div className="relative flex-shrink-0" ref={dropdownRef}>
            {user ? (
              <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                {/* REPLACED OLD IMG TAG WITH NEW AVATAR COMPONENT */}
                <Avatar user={user} className="h-8 w-8 md:h-10 md:w-10 border border-zinc-700 group-hover:border-zinc-400 transition-colors" />
                
                <svg className={`hidden sm:block w-4 h-4 text-zinc-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>

                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-4 w-48 bg-black/95 border border-zinc-800 rounded-md shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-zinc-800 mb-1">
                      <p className="text-xs text-zinc-500">Signed in as</p>
                      <p className="text-sm text-white font-medium truncate">{user.displayName || 'User'}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors" onClick={() => setIsDropdownOpen(false)}>Account Details</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-zinc-800 transition-colors mt-1">Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="bg-red-600 hover:bg-red-700 text-white text-sm md:text-base px-4 py-2 rounded transition-colors whitespace-nowrap font-medium">Sign In</Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu logic remains the same... */}
    </header>
  );
};

export default Header;