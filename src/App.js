import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Auth from './components/Auth';
import Homepage from './components/Homepage';  // Import the Homepage component
import Player from './components/Player';

const App = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <Router>
      <Routes>
        {/* If user is not logged in, show Auth screen */}
        <Route path="/login" element={!user ? <Auth /> : <Navigate to="/" />} />

        {/* If user is logged in, show the Homepage */}
        <Route path="/*" element={user ? <Homepage user={user} /> : <Navigate to="/login" />} />

        {/* Handle the player route separately */}
        <Route path="/player/:videoId" element={user ? <Player /> : <Navigate to="/login" />} />

        {/* Redirect any unknown paths to homepage or login */}
        <Route path="*" element={user ? <Navigate to="/" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
