import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Header from './components/Header';
import Auth from './components/Auth';
import Movies from './components/Movies';
import Profile from './components/Profile';
import Logout from './components/Logout';
import Player from './components/Player'; // Import the Player component
import MovieCarousel from './components/MovieCarousel'
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import MovieCategory from './components/MovieCategory';

 const App = () => {
  const [user, setUser] = useState(null);
  
  // Move getAuth initialization here
  const auth = getAuth();

  useEffect(() => {
    // Ensure auth is properly initialized before usage
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  return (
    <Router>
     
      {user && <MovieCarousel />}
      <Routes>
       <Route path="/" element={<Movies />} />
        <Route path="/categories/:category" element={<MovieCategory />} />
        <Route path="/login" element={user ? <Navigate to="/movies" /> : <Auth />} />
        <Route path="/movies" element={user ? <Movies /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/logout" element={user ? <Logout /> : <Navigate to="/login" />} />
        <Route path="/player/:videoId" element={user ? <Player /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={user ? "/movies" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;



