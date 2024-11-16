import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import Search from './Search'; // Import the Search component
import Logo from '../images/youmovieslogo-removebg.png';

const Header = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('User object:', user);
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex justify-between items-center p-4 bg-gray-900 text-white h-20 w-full opacity-100">
      <div>
        <Link to="/movies">
          <img src={Logo} alt="logo" className="object-fill h-20 w-25" />
        </Link>
      </div>

      <Search 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        loading={loading} 
        setLoading={setLoading} 
        setError={setError} 
        navigate={navigate} 
      />

      <nav className="hidden md:flex space-x-6">
        <Link to="/" className="hover:text-gray-400">Movies</Link>
        <Link to="/tvshows" className="hover:text-gray-400">TV Shows</Link>
        <div className="relative group">
          <button className="hover:text-gray-400">Categories</button>
          <div className="absolute hidden group-hover:block bg-gray-800 rounded-lg p-2 space-y-2">
            <Link to="/categories/action" className="block px-4 py-2 hover:bg-gray-700 rounded">Action</Link>
            <Link to="/categories/romance" className="block px-4 py-2 hover:bg-gray-700 rounded">Romance</Link>
            <Link to="/categories/thriller" className="block px-4 py-2 hover:bg-gray-700 rounded">Thriller</Link>
            <Link to="/categories/comedy" className="block px-4 py-2 hover:bg-gray-700 rounded">Comedy</Link>
            <Link to="/categories/anime" className="block px-4 py-2 hover:bg-gray-700 rounded">Anime</Link>
            <Link to="/categories/kung-fu" className="block px-4 py-2 hover:bg-gray-700 rounded">Kung-fu</Link>
          </div>
        </div>
        <Link to="/favourites" className="hover:text-gray-400">Favourites</Link>
      </nav>

      <div className="profile flex items-center space-x-5 mr-10 relative">
        {user ? (
          <>
            <img
              src={user.photoURL || 'https://via.placeholder.com/32'}
              alt={`${user.displayName ? user.displayName : 'User'}'s avatar`}
              className="h-8 w-8 rounded-full"
            />
            <div className="relative" ref={dropdownRef}>
              <button
                className="hover:text-gray-400"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {user.displayName || 'Profile'}
              </button>
              <div className={`absolute ${isDropdownOpen ? 'block' : 'hidden'} bg-gray-800 rounded-lg p-2 space-y-2`}>
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-700 rounded">Account Details</Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <Link to="/login" className="hover:text-gray-400">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
