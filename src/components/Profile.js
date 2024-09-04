import React from 'react';

const Profile = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Account Details</h2>
      <div className="mt-4">
        <label className="block">Email:</label>
        <p>user@example.com</p>
      </div>
      <div className="mt-4">
        <label className="block">Username:</label>
        <input type="text" className="w-full p-2 border border-gray-300 rounded" />
      </div>
      <div className="mt-4">
        <label className="block">Password:</label>
        <input type="password" className="w-full p-2 border border-gray-300 rounded" />
      </div>
      <button className="bg-blue-600 text-white p-2 rounded mt-4">Save Changes</button>
    </div>
  );
};

export default Profile;
