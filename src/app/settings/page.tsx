"use client";
import React, { useState, useEffect, useRef } from 'react';
import EmailPasswordSection from '../settings/EmailPasswordSection';
import { getHTTP } from '../utils/utils';

interface SettingsProps {
  userId?: string;
}


const user_Id = "0a4c9961-b2fd-4eb9-a087-2216eb3008ea";

const Settings: React.FC<SettingsProps> = ({ userId = user_Id }) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  // fetching user data
  const fetchUserData = async (userId: string) => {
    try {
      const response = await getHTTP().get(`/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        const userData = data.user;

        // Populate form with fetched user data
        setName(userData.username || '');
        setBio(userData.bio || '');
        setEmail(userData.email || '');
        setPassword(userData.password || '');
        setProfilePicture(userData.profileImage || null);
      } else {
        console.error("Failed to fetch user data", response.status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value);
  const handleProfilePictureClick = () => fileInputRef.current?.click();
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicture(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await getHTTP().post('/api/users/preferences', {
        userId,
        username: name,
        bio,
        email,
        password,
        profileImage: profilePicture || "",
      });

      if (response.ok) {
        console.log("Profile updated successfully");
      } else {
        console.error("Failed to update profile", response.status);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleGoBack = () => console.log("Back to previous page");
  const handleLogout = () => console.log("User logged out");

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-700">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg mt-10 p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center text-black">Settings</h1>

        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold mb-2 text-black">Account</h2>

          <div className="flex justify-between items-start">
            <div className="flex-1 mr-6">
              <div className="mb-4">
                <label className="block mb-1 text-black">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded text-black"
                  value={name}
                  onChange={handleNameChange}
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-black">Bio</label>
                <textarea
                  className="w-full p-2 border rounded text-black"
                  maxLength={200}
                  value={bio}
                  onChange={handleBioChange}
                />
              </div>

              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>

            <div
              className="relative w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={handleProfilePictureClick}
            >
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500 text-2xl"></span>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-sm font-semibold">
                Change Picture
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleProfilePictureChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <EmailPasswordSection
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          handleChangePassword={handleSaveChanges}
        />

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
};

export default Settings;
