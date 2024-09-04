import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import the carousel styles
import Header from './Header';

const MovieCarousel = () => {
  const [carouselItems, setCarouselItems] = useState([]);
  const apiKey = process.env.REACT_APP_TMDB_API_KEY ; // Replace with your TMDb API key
  const apiUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(apiUrl);
        const movies = response.data.results.slice(0, 5); // Get top 5 movies
        setCarouselItems(movies);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    fetchMovies();
  }, [apiUrl]);

  return (
    <div className="relative">
      <div className="sticky top-0 z-40">
        <Header />
      </div>
      <div className=" h-[50vh]">
        <Carousel
        showThumbs={false}
        autoPlay={true}
        infiniteLoop={true}
        showStatus={false}
        interval={4000}
        className=" " // Adjust height for better responsiveness
        
       
      >
        {carouselItems.map((item) => (
          <div key={item.id} className="relative flex items-center justify-center h-[50%]">
            <img
              src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
              alt={item.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute ml-10 bottom-20 left-0 p-6 bg-opacity-50 w-[30%]">
              <div className="flex flex-col items-start justify ">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-white">{item.title}</h3>
                <p className=" text-left text-sm md:text-base lg:text-lg text-white mb-4">{item.overview}</p>
                <button className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition-colors">
                  Play Now
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
