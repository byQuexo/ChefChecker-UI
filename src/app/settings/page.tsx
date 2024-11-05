"use client";
import React, { useState, useRef } from 'react';
import EmailPasswordSection from '../settings/EmailPasswordSection';

export default function Settings() {
  const [name, setName] = useState('Test');
  const [bio, setBio] = useState('This is the Bio');
  const [email, setEmail] = useState('Test@email.ac.uk');
  const [password, setPassword] = useState('12345');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null); // Create a ref for the file input

  // Handlers for input changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  // Handler for file input change
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string); // Store the picture as a base64 URL for display
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file explorer when profile picture is clicked
  const handleProfilePictureClick = () => {
    fileInputRef.current?.click(); // Programmatically click the hidden input
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handlers for button actions
  const handleSaveChanges = () => {
    console.log("Changes saved");
  };

  const handleUpdateEmail = () => {
    console.log("Email updated");
  };

  const handleChangePassword = () => {
    console.log("Password changed");
  };

  const handleGoBack = () => {
    console.log("Back to previous page");
  };

  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg mt-10 p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center text-black">Settings</h1>

        {/* Account Settings Section */}
        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold mb-2 text-black">Account</h2>

          <div className="flex justify-between items-start">
            {/* Left Side: Name and Bio */}
            <div className="flex-1 mr-6">
              {/* Name Field */}
              <div className="mb-4">
                <label className="block mb-1 text-black">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded text-black"
                  value={name}
                  onChange={handleNameChange}
                />
              </div>

              {/* Bio Field */}
              <div className="mb-4">
                <label className="block mb-1 text-black">Bio</label>
                <textarea
                  className="w-full p-2 border rounded text-black"
                  maxLength={200}
                  value={bio}
                  onChange={handleBioChange}
                />
              </div>

              {/* Save Changes Button */}
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleSaveChanges}>
                Save Changes
              </button>
            </div>

            {/* Right Side: Profile Picture */}
            <div className="relative w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden cursor-pointer" onClick={handleProfilePictureClick}>
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500 text-2xl"></span>
              )}

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-sm font-semibold">
                Change Picture
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleProfilePictureChange}
              style={{ display: 'none' }} // Hide the file input
            />
          </div>
        </div>

        {/* Email and Password Section */}
        <EmailPasswordSection
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          handleUpdateEmail={handleUpdateEmail}
          handleChangePassword={handleChangePassword}
        />

        {/* Back Button and Logout Link */}
        <div className="flex justify-between items-center">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleGoBack}>
            Back
          </button>
          <button className="text-red-500" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
