import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase'; 
import { collection, getDocs } from 'firebase/firestore';

const CATEGORIES = [
  { id: 'New', title: 'Latest Movies' },
  { id: 'Newish', title: 'Recently Added' },
  { id: 'Action', title: 'Action' },
  { id: 'Cartoon', title: 'Most Watched' }, 
  { id: 'Adventure', title: 'Adventure' },
  { id: 'Romance', title: 'Romance' },
  { id: 'Drama', title: 'Drama' },
  { id: 'Thriller', title: 'Thriller' },
  { id: 'Sci-fi', title: 'Science Fiction' },
  { id: 'Comedy', title: 'Comedy' },
  { id: 'Anime', title: 'Anime' },
  { id: 'Kung-fu', title: 'Kung-Fu' }
];

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainers = useRef({}); 

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

  const groupedMovies = useMemo(() => {
    const groups = {};
    movies.forEach(movie => {
      if (!groups[movie.category]) {
        groups[movie.category] = [];
      }
      groups[movie.category].push(movie);
    });
    return groups;
  }, [movies]);

  const handleScroll = (category, direction) => {
    const container = scrollContainers.current[category];
    if (container) {
      const scrollAmount = direction === 'left' ? -container.offsetWidth * 0.75 : container.offsetWidth * 0.75;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getYouTubeId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-zinc-400">
        <div className="animate-pulse font-medium text-lg">Loading Youmovies...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-6 pb-20 overflow-hidden select-none">
      {CATEGORIES.map(({ id, title }) => {
        const categoryMovies = groupedMovies[id] || [];
        if (categoryMovies.length === 0) return null; 

        return (
          <div key={id} className="relative group mb-10 md:mb-14 pl-4 md:pl-12">
            <h2 className="text-base md:text-2xl font-bold text-[#e5e5e5] mb-2 md:mb-4 transition-colors duration-200 hover:text-white cursor-pointer inline-block">
              {title}
            </h2>

            <div className="relative">
              <button
                onClick={() => handleScroll(id, 'left')}
                className="absolute left-0 top-0 bottom-0 w-10 md:w-14 bg-black/60 hover:bg-black/90 text-white opacity-0 group-hover:opacity-100 z-40 transition-all duration-300 flex items-center justify-center backdrop-blur-sm rounded-r-md"
              >
                <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* INCREASED GAP: gap-3 md:gap-4 lg:gap-5 provides more breathing room between posters */}
              <div
                ref={el => scrollContainers.current[id] = el}
                className="flex gap-3 md:gap-4 lg:gap-5 overflow-x-scroll no-scrollbar scroll-smooth pr-16 py-6 -my-6"
                style={{ scrollbarWidth: 'none' }}
              >
                {categoryMovies.map((movie) => {
                  const videoId = getYouTubeId(movie.url);

                  return (
                    <div 
                      key={movie.id} 
                      /* INCREASED WIDTHS: Stepped up the pixel size for every responsive breakpoint */
                      className="w-[130px] sm:w-[160px] md:w-[190px] lg:w-[220px] xl:w-[250px] flex-shrink-0 relative transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1 hover:z-30 cursor-pointer"
                    >
                      <Link to={`/player/${videoId}`} className="block group/card">
                        
                        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-[#222] shadow-lg transition-shadow duration-300 group-hover/card:shadow-[0_8px_20px_rgba(0,0,0,0.8)]">
                          <img
                            src={movie.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                            alt={movie.title}
                            loading="lazy"
                            onError={(e) => {
                              if (!e.target.src.includes('hqdefault.jpg') && videoId) {
                                e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                              } else {
                                e.target.src = 'https://via.placeholder.com/400x600/222222/666666?text=No+Poster';
                              }
                            }}
                            className="w-full h-full object-cover object-center"
                          />
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="bg-white p-3 md:p-4 rounded-full text-black transform scale-75 group-hover/card:scale-100 transition-transform duration-300 shadow-xl">
                              <svg className="w-6 h-6 md:w-8 md:h-8 fill-current pl-1" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Text size slightly increased to match the larger posters */}
                        <h3 className="mt-2 text-sm md:text-base font-semibold text-[#a3a3a3] group-hover/card:text-white transition-colors line-clamp-1 px-1">
                          {movie.title}
                        </h3>
                      </Link>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => handleScroll(id, 'right')}
                className="absolute right-0 top-0 bottom-0 w-10 md:w-14 bg-black/60 hover:bg-black/90 text-white opacity-0 group-hover:opacity-100 z-40 transition-all duration-300 flex items-center justify-center backdrop-blur-sm rounded-l-md"
              >
                <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Movies;