import React from 'react';
import Header from './Header';
import MovieCarousel from './MovieCarousel';
import Movies from './Movies';
import Profile from './Profile';
import Logout from './Logout';
import MovieCategory from './MovieCategory';
import { Route, Routes, Navigate } from 'react-router-dom';

const Homepage = ({ user }) => {
  return (
    <div>
     
      <MovieCarousel />
      <Routes>
        <Route path="/" element={<Movies />} />
        <Route path="/categories/:category" element={<MovieCategory />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/logout" element={user ? <Logout /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default Homepage;
