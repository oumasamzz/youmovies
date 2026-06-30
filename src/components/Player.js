import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Player = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [showBackButton, setShowBackButton] = useState(true);
  
  // Use a ref to persist the timeout ID across re-renders without triggering them
  const inactivityTimeoutRef = useRef(null);

  // Wrap inside useCallback to avoid recreating the function on every render pass
  const handleInteraction = useCallback(() => {
    setShowBackButton(true);

    // Clear the existing timeout using the current ref value
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }

    // Hide the button after 3 seconds of no interaction
    inactivityTimeoutRef.current = setTimeout(() => {
      setShowBackButton(false);
    }, 3000);
  }, []);

  useEffect(() => {
    // Add mouse and touch interaction event listeners
    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    // Initial trigger to start the 3-second countdown when page mounts
    handleInteraction();

    // Clean up event listeners and clear active timers on unmount
    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, [handleInteraction]); // Safely include the memoized callback handler

  return (
    <div className="relative flex justify-center items-center h-screen bg-black">
      {/* Back Button - Premium Floating Controls */}
      <button
        className={`fixed left-6 top-6 p-4 bg-black/60 hover:bg-red-600 text-white rounded-full transition-all duration-300 backdrop-blur-md shadow-2xl ${
          showBackButton ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
        }`}
        onClick={() => navigate('/')}
        style={{ zIndex: 1000 }}
        aria-label="Go Back"
      >
        <FaArrowLeft size={22} />
      </button>

      {/* YouTube Fullscreen Theater Iframe */}
      <div className="w-full h-full bg-black">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
};

export default Player;