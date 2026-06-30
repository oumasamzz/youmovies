import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Added for navigation
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { updateProfile } from 'firebase/auth';
import Avatar from './Avatar'; 
import { AVATAR_OPTIONS } from '../utils/avatarAssets';

const Profile = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate(); // 2. Hook for manual navigation
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState(''); // 3. Local state for instant UI updates
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  // 4. Update the avatar locally in state, but NOT in Firebase until "Save" is clicked
  const handleAvatarSelect = (path) => {
    setPhotoURL(path); 
  };

  const handleSaveAndExit = async () => {
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, { 
        displayName, 
        photoURL 
      });
      // 5. Navigate back to the main page after successful save
      navigate('/'); 
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-white p-10">Please log in to view your profile.</div>;

  return (
    <div className="min-h-screen bg-[#141414] text-white p-6 md:p-12">
      {/* 6. Added Exit Button */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Account Details</h2>
        <button onClick={() => navigate('/')} className="text-zinc-400 hover:text-white underline">
          Cancel & Exit
        </button>
      </div>

      <div className="max-w-2xl bg-[#1f1f1f] p-8 rounded-lg border border-zinc-800">
        <div className="flex items-center gap-6 mb-8">
          {/* Use local state photoURL instead of user.photoURL for live preview */}
          <Avatar user={{...user, photoURL}} className="h-24 w-24 border-4 border-zinc-700" />
          <div>
            <h3 className="text-lg font-semibold">Change your character</h3>
            <p className="text-zinc-400 text-sm">Select a character and click Save</p>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 mb-8">
          {AVATAR_OPTIONS.map((path) => (
            <button 
              key={path} 
              onClick={() => handleAvatarSelect(path)}
              className={`rounded-full overflow-hidden border-2 transition-all ${photoURL === path ? 'border-red-600 scale-105' : 'border-transparent hover:border-zinc-500'}`}
            >
              <img src={path} alt="Avatar option" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        <div className="space-y-6 border-t border-zinc-800 pt-8">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Email</label>
            <p className="bg-black/40 p-3 rounded text-zinc-300 border border-zinc-800">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Display Name</label>
            <input 
              type="text" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-black/40 p-3 rounded border border-zinc-700 focus:border-red-600 outline-none transition-colors"
            />
          </div>

          <button 
            onClick={handleSaveAndExit}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded transition-colors"
          >
            {loading ? 'Saving...' : 'Save Changes & Exit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;