// src/components/VideoPlayer.js
import React from 'react';
import { useParams } from 'react-router-dom';

const Player = () => {
  const { videoId } = useParams();

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
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
