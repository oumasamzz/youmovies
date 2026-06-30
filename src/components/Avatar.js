// src/components/Avatar.js
import React from 'react';

const Avatar = ({ user, className = "h-10 w-10" }) => {
  // Logic to get initials if no avatar is set
  const getInitials = (user) => {
    return user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase();
  };

  return (
    <div className={`${className} rounded-full overflow-hidden flex items-center justify-center bg-zinc-700 border border-zinc-600`}>
      {user.photoURL ? (
        <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
      ) : (
        <span className="text-white font-bold">{getInitials(user)}</span>
      )}
    </div>
  );
};

export default Avatar;