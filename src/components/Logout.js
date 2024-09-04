import React, { useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(auth);
        navigate('/login'); // Redirect to login page after signing out
      } catch (error) {
        console.error('Error signing out:', error.message);
      }
    };

    handleLogout();
  }, [auth, navigate]);

  return <div>Logging out...</div>;
};

export default Logout;

