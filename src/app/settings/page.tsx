"use client"
import React, { useState } from 'react';

export default function Settings() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg mt-10 p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">Settings</h1>

        {/* Account settings Section */}
        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Account</h2>

          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Bio Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Bio</label>
            <textarea
              className="w-full p-2 border rounded"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Profile Picture Upload */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Profile Picture</label>
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-2xl">📷</span>
            </div>
          </div>

          {/* Save Changes Button */}
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
        </div>

        {/* Email and Password Section */}
        <div className="pb-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Email and Password</h2>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">Update</button>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">Change Password</button>
          </div>
        </div>

        {/* Back Button and Logout Link */}
        <div className="flex justify-between items-center">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Back</button>
          <button className="text-red-500">Log Out</button>
        </div>
      </div>
    </div>
  );
};

