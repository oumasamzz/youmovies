import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase'; 
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

const MovieCategory = () => {
  const { category } = useParams(); 
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const moviesRef = collection(db, 'movies');
        let q;

        // Using your exact field name 'time' from your sample document
        if (category.toLowerCase() === 'latest') {
          q = query(moviesRef, orderBy('time', 'desc'), limit(20));
        } else {
          q = query(moviesRef, where('category', '==', category));
        }

        const snapshot = await getDocs(q);
        const movieList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMovies(movieList);
      } catch (error) {
        console.error('Error fetching movies:', error);
        // This often happens if an index is missing. Check the console!
        setError('Failed to load movies. Make sure to click the link in the console to build your Firestore index.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [category]);

  if (loading) return <div className="text-white p-10">Loading movies...</div>;
  if (error) return <div className="text-red-500 p-10">{error}</div>;

  return (
    <div className="p-6 md:p-12 bg-[#141414] min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8 capitalize">{category} Movies</h1>
      
      {movies.length === 0 ? (
        <p className="text-zinc-400">No movies found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => {
            // Your sample URL: "https://www.youtube.com/watch?v=aPeUeBb669s"
            const videoId = movie.url?.split('v=')[1]?.split('&')[0];
            
            return (
              <div key={movie.id} className="bg-[#1f1f1f] rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
                <Link to={`/player/${videoId}`} className="block">
                  <div className="relative pt-[56.25%]">
                    <img
                      src={movie.thumbnail}
                      alt={movie.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold truncate">{movie.title}</h3>
                    <p className="text-zinc-400 text-xs mt-1">{movie.category}</p>
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

export default MovieCategory;