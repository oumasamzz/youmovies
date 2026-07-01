import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import MovieCarousel from './MovieCarousel';
import Movies from './Movies';
import Profile from './Profile';
import Logout from './Logout';
import MovieCategory from './MovieCategory';
// Assuming you have a Header component to keep the navigation accessible
import Header from './Header'; 

const Homepage = ({ user }) => {
  return (
    <div className="bg-[#141414] min-h-screen text-white">
      {/* Header persists across all homepage sub-routes */}
      <Header />
      
      {/* Carousel persists at the top of the homepage */}
      <MovieCarousel />
    
      <Routes>
        {/* 1. Updated: Redirects the base URL "/" to the main "Movies" feed 
          so the page is never blank on arrival.
        */}
        <Route path="/" element={<Navigate to="/movies" replace />} />
        
        {/* 2. Your main movies feed */}
        <Route path="/movies" element={<Movies />} />
        
        {/* 3. Category viewing */}
        <Route path="/categories/:category" element={<MovieCategory />} />
        
        {/* 4. Protected User Routes */}
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/logout" element={user ? <Logout /> : <Navigate to="/login" />} />
        
        {/* Catch-all to redirect broken links back to the main movie feed */}
        <Route path="*" element={<Navigate to="/movies" replace />} />
      </Routes>
    </div>
  );
};

export default Homepage;