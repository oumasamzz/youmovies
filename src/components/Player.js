import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Player = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [showBackButton, setShowBackButton] = useState(true);
  let inactivityTimeout = null;

  // Function to show back button on interaction
  const handleInteraction = () => {
    setShowBackButton(true);

    // Clear the existing timeout
    if (inactivityTimeout) {
      clearTimeout(inactivityTimeout);
    }

    // Hide the button after 3 seconds of no interaction
    inactivityTimeout = setTimeout(() => {
      setShowBackButton(false);
    }, 3000);
  };

  useEffect(() => {
    // Add mouse and touch interaction event listeners
    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      if (inactivityTimeout) clearTimeout(inactivityTimeout);
    };
  }, []);

  return (
    <div className="relative flex justify-center items-center h-screen bg-gray-900">
      {/* Back Button - only visible on interaction */}
      {showBackButton && (
        <button
          className="fixed left-5 top-1/2 transform -translate-y-1/2 p-2 bg-red-500 text-white rounded-full transition-opacity duration-300 z-50"
          onClick={() => navigate('/')}
          style={{ zIndex: 1000 }}
        >
          <FaArrowLeft size={30} />
        </button>
      )}

      {/* YouTube Iframe */}
      <div className="relative w-full h-full">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default Player;
