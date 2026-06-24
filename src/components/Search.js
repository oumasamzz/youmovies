import React from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; 
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'; // Heroicons import

const Search = ({ searchTerm, setSearchTerm, loading, setLoading, setError, navigate }) => {
  const handleSearch = async () => {
    if (!searchTerm.trim()) return; // Ignore empty search

    setLoading(true);
    setError(null); // Reset error state
    const db = getFirestore(); // Initialize Firestore

    try {
      // Search movies collection
      const moviesRef = collection(db, 'movies');

      // Build the query for title search
      const titleQuery = query(
        moviesRef,
        where('title', '>=', searchTerm),
        where('title', '<=', searchTerm + '\uf8ff')
      );

      // Build the query for category search (case-insensitive)
      const categoryQuery = query(
        moviesRef,
        where('category', '>=', searchTerm),
        where('category', '<=', searchTerm + '\uf8ff')
      );

      // Execute both queries (FireStore does not support OR queries directly)
      const titleSnapshot = await getDocs(titleQuery);
      const categorySnapshot = await getDocs(categoryQuery);

      const results = [];

      // Collect results from both queries
      titleSnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      categorySnapshot.forEach((doc) => {
        // Prevent duplicates by checking if the result already exists
        if (!results.find(result => result.id === doc.id)) {
          results.push({ id: doc.id, ...doc.data() });
        }
      });

      // If no results were found
      if (results.length === 0) {
        setError('No movies found for your search.');
      }

      console.log(results);
      navigate('/results', { state: { results } }); // Pass results to the results page
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to fetch movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="flex justify-center items-center w-full">
      <div className="relative w-1/5">
        <input
          type="text"
          placeholder="Search movies e.g action, Ninja..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full p-2 pl-4 pr-10 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring focus:ring-gray-500"
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white focus:outline-none"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
        {loading && <span className="ml-2 text-sm text-gray-500">Loading...</span>}
      </div>
    </div>
  );
};

export default Search;
