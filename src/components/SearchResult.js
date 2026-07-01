import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const SearchResult = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get search term from navigation state
  const searchTerm = location.state?.searchTerm || '';

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        if (!searchTerm) return;

        const moviesRef = collection(db, 'movies');
        
        // IMPORTANT: Ensure your Firestore documents have a 'titleLower' field.
        // If they don't, change 'titleLower' to 'title' below.
        const q = query(
          moviesRef, 
          where('titleLower', '>=', searchTerm), 
          where('titleLower', '<=', searchTerm + '\uf8ff')
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchTerm]);

  const getYouTubeId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  if (loading) return <div className="p-10 text-white">Searching...</div>;

  return (
    <div className="p-4 bg-black text-white min-h-screen">
      <h1 className="text-2xl mb-6">Results for "{searchTerm}"</h1>
      
      {results.length === 0 ? (
        <p>No movies found matching "{searchTerm}".</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {results.map((movie) => {
            const videoId = getYouTubeId(movie.url);
            return (
              <div key={movie.id} className="bg-[#141414] rounded-lg overflow-hidden transition-transform hover:scale-105">
                <Link to={`/player/${videoId}`}>
                  <img src={movie.thumbnail} alt={movie.title} className="w-full h-40 object-cover" />
                  <div className="p-3">
                    <h3 className="text-sm font-semibold truncate">{movie.title}</h3>
                    <p className="text-xs text-zinc-400 mt-1">{movie.category}</p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchResult;