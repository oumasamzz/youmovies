import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AnimatePresence } from 'framer-motion';

import Auth from './components/Auth';
import Homepage from './components/Homepage';
import Player from './components/Player';
import Results from './components/SearchResult';
import SplashScreen from './components/SplashScreen';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(false);
  const auth = getAuth();

  // 1. Handle Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User logged in: Show the animation
        setUser(currentUser);
        setShowSplash(true); 
      } else {
        // User logged out: Don't show animation
        setUser(null);
        setShowSplash(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  // 2. Control animation timer
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 6000); // 6-second duration
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  if (loading) return null;

  return (
    <Router>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" />
        ) : (
          <Routes key="app-routes">
            <Route path="/login" element={!user ? <Auth /> : <Navigate to="/" />} />
            <Route path="/player/:videoId" element={user ? <Player /> : <Navigate to="/login" />} />
            <Route path="/results" element={user ? <Results /> : <Navigate to="/login" />} />
            <Route path="/*" element={user ? <Homepage user={user} /> : <Navigate to="/login" />} />
          </Routes>
        )}
      </AnimatePresence>
    </Router>
  );
};

export default App;