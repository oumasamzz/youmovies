import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase'; // Adjust the path as needed
import { collection, getDocs } from 'firebase/firestore';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ref for scrollable containers
  const scrollContainers = useRef({}); // Initialize as an object

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesCollection = collection(db, 'movies');
        const movieSnapshot = await getDocs(moviesCollection);
        const movieList = movieSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMovies(movieList);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Function to handle scrolling
  const scroll = (category, direction) => {
    const container = scrollContainers.current[category]; // Get the ref for the category
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300; // Adjust scroll amount as needed
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const renderMoviesByCategory = (category) => {
    return movies
      .filter((movie) => movie.category === category)
      .map((movie) => {
        const videoId = movie.url.split('v=')[1]; // Adjust as necessary

        return (
          <div key={movie.id} className="w-48 sm:w-60 md:w-72 lg:w-80 xl:w-96 p-2 flex-shrink-0 bg-black">
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
              <h3 className="ml-2 text-sm mt-2 text-left text-white font-semibold">{movie.title}</h3>
            </Link>
          </div>
        );
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 bg-black">
      {['Action', 'Comedy', 'Romance', 'Drama', 'Thriller', 'Sci-fi', 'Anime', 'Kung-fu', 'Short-Films'].map((category) => (
        <div key={category} className="mb-8 relative">
          <h2 className="text-xl font-bold mb-4 text-white">{category}</h2>
          <div className="relative flex items-center">
            <button
              onClick={() => scroll(category, 'left')}
              className="absolute left-0 z-10 bg-gray-600 text-white p-4 rounded-full hover:bg-gray-500 transition-all duration-300 ease-in-out shadow-lg"
            >
              &larr;
            </button>
            <div
              ref={(el) => (scrollContainers.current[category] = el)}
              className="flex overflow-x-auto pb-4 whitespace-nowrap scroll-smooth"
            >
              {renderMoviesByCategory(category)}
            </div>
            <button
              onClick={() => scroll(category, 'right')}
              className="absolute right-0 z-10 bg-gray-600 text-white p-4 rounded-full hover:bg-gray-500 transition-all duration-300 ease-in-out shadow-lg"
            >
              &rarr;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Movies;
