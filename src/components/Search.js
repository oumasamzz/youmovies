import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase'; 
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

const Search = ({ searchTerm, setSearchTerm, loading, setLoading, setError, navigate }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // 1. Debounced Auto-Complete Fetching
  useEffect(() => {
    const fetchSuggestions = async () => {
      const term = searchTerm.trim().toLowerCase(); // Enforce case-insensitivity
      if (!term) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      try {
        const moviesRef = collection(db, 'movies');
        
        // Note: Your Firestore documents MUST contain a 'titleLower' field for this to work
        const titleQuery = query(
          moviesRef,
          where('titleLower', '>=', term),
          where('titleLower', '<=', term + '\uf8ff'),
          limit(5) // Keep the dropdown snappy by limiting results
        );

        const snapshot = await getDocs(titleQuery);
        const results = [];
        
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });

        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    };

    // Debounce the API call by 300ms to save Firestore read quotas
    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // 2. Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 3. Final Execution Routine
  const executeSearch = (targetMovie = null) => {
    if (!searchTerm.trim() && !targetMovie) return;
    
    setShowDropdown(false);
    
    // If a user clicks a specific auto-complete result, route them directly to the player
    if (targetMovie) {
      const videoId = getYouTubeId(targetMovie.url);
      navigate(`/player/${videoId}`);
      return;
    }

    // Otherwise, execute the standard full search page route
    navigate('/results', { state: { searchTerm: searchTerm.toLowerCase() } });
  };

  // Helper function for YouTube IDs
  const getYouTubeId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  return (
    <div className="flex justify-center items-center w-full my-4 z-50">
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md group" ref={dropdownRef}>
        
        {/* Search Input Bar */}
        <input
          type="text"
          placeholder="Titles, genres, keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
          className="w-full py-2 pl-4 pr-12 rounded-md bg-[#141414] text-white text-sm border border-zinc-700 transition-all duration-300 placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white focus:bg-black/80"
          autoComplete="off"
        />
        
        {/* Execute Button */}
        <button
          onClick={() => executeSearch()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-white transition-colors focus:outline-none"
          aria-label="Execute Search"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>

        {/* Auto-Complete Dropdown Menu */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#181818] border border-zinc-800 rounded-md shadow-2xl overflow-hidden flex flex-col z-50">
            {suggestions.map((movie) => (
              <div
                key={movie.id}
                onClick={() => executeSearch(movie)}
                className="flex items-center gap-3 p-3 hover:bg-[#2b2b2b] cursor-pointer transition-colors border-b border-zinc-800/50 last:border-none"
              >
                {/* Micro-Thumbnail */}
                <div className="w-12 h-8 flex-shrink-0 bg-zinc-900 rounded overflow-hidden">
                  <img 
                    src={movie.thumbnail || `https://img.youtube.com/vi/${getYouTubeId(movie.url)}/default.jpg`} 
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Title & Metadata */}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white line-clamp-1">{movie.title}</span>
                  <span className="text-xs text-zinc-500">{movie.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;