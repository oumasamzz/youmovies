import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';


const MovieCarousel = () => {
  const [carouselItems, setCarouselItems] = useState([]);
  const apiKey = process.env.REACT_APP_TMDB_API_KEY; 
  const apiUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(apiUrl);
        const movies = response.data.results.slice(0, 5);
        setCarouselItems(movies);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    fetchMovies();
  }, [apiUrl]);

  return (
    <div className="relative w-full bg-[#141414]">
      {/* Header Container */}
      

      {/* Responsive height mapping for the entire carousel container. 
        It scales from 60vh on phones up to 85vh on 4K desktops for a cinematic feel.
      */}
      <div className="w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh]">
        <Carousel
          showThumbs={false}
          autoPlay={true}
          infiniteLoop={true}
          showStatus={false}
          showIndicators={false} // Hiding dots makes it look more cinematic
          interval={5000}
          transitionTime={700}
          className="w-full h-full"
        >
          {carouselItems.map((item) => (
            /* Note: The slide height MUST perfectly match the parent container height to prevent overlap bugs */
            <div key={item.id} className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh]">
              
              <img
                src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                alt={item.title}
                className="object-cover w-full h-full object-center"
              />

              {/* THE MAGIC FADES: 
                1. Left-to-right fade ensures text is legible.
                2. Bottom-to-top fade blends the bottom edge smoothly into the next component. 
              */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent z-10"></div>

              {/* Text & Button Container */}
              <div className="absolute bottom-[15%] md:bottom-[20%] left-4 sm:left-8 md:left-12 lg:left-16 text-left w-[90%] md:w-[60%] lg:w-[45%] z-20">
                <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-white drop-shadow-lg leading-tight">
                  {item.title}
                </h3>
                
                {/* line-clamp-3 ensures long descriptions cut off cleanly with an ellipsis */}
                <p className="text-sm sm:text-base md:text-lg text-zinc-300 mb-6 md:mb-8 line-clamp-3 drop-shadow-md">
                  {item.overview}
                </p>
                
                {/* Premium Button Layout */}
                <div className="flex gap-3 md:gap-4">
                  <button className="flex items-center gap-2 bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded md:rounded-md font-bold text-sm md:text-base hover:bg-white/80 transition-colors">
                    <svg className="w-5 h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Play Now
                  </button>
                  
                  {/* Added a secondary button for aesthetic balance */}
                  <button className="flex items-center gap-2 bg-zinc-500/70 text-white px-6 md:px-8 py-2 md:py-3 rounded md:rounded-md font-bold text-sm md:text-base hover:bg-zinc-500/90 transition-colors backdrop-blur-sm">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    More Info
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default MovieCarousel;