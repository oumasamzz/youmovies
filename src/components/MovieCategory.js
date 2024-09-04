// MovieCategory.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase'; // Adjust the path as necessary
import { collection, getDocs } from 'firebase/firestore';

const MovieCategory = () => {
  const { category } = useParams(); // Get the category from the URL
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        console.log('Fetching movies for category:', category); // Debug log
        const moviesCollection = collection(db, 'movies');
        const movieSnapshot = await getDocs(moviesCollection);
        const movieList = movieSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log('Movies fetched:', movieList); // Debug log

        // Filter movies by category
        const filteredMovies = movieList.filter(movie => movie.category && movie.category.toLowerCase() === category.toLowerCase());
        console.log('Filtered movies:', filteredMovies); // Debug log

        setMovies(filteredMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError('Failed to load movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [category]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>{category} Movies</h1>
      {movies.length === 0 ? (
        <p>No movies found in this category.</p>
      ) : (
        <div className="flex overflow-x-auto pb-4 whitespace-nowrap">
          {movies.map((movie) => {
            const videoId = movie.url.split('v=')[1]; // Adjust as necessary
            return (
              <div key={movie.id} className="w-48 sm:w-60 md:w-72 lg:w-80 xl:w-96 p-2 flex-shrink-0">
                <Link to={`/player/${videoId}`} className="block relative">
                  <div className="relative w-[70%] h-full pb-[100%]">
                    <img
                      src={movie.thumbnail}
                      alt={movie.title}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out">
                      <svg
                        className="w-20 h-20 text-red-500 bg-white p-2 rounded-full shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-125"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M10 8l6 4-6 4V8z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-sm mt-2 text-center text-black font-semibold">{movie.title}</h3>
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
