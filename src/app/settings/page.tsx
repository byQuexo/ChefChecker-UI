"use client";
import React, { useState, useEffect, useRef } from 'react';
import EmailPasswordSection from '../settings/EmailPasswordSection';
import { getHTTP } from '../utils/utils';
import rootStore from "@/app/utils/stores/globalStore";
import { Moon, Sun } from "lucide-react";
import {useRouter} from "next/navigation";
import {observer} from "mobx-react-lite";

interface SettingsProps {
  userId: string;
}

const Settings: React.FC<SettingsProps> = observer(function Settings({ userId }:SettingsProps) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userId) {
      setName('');
      setBio('');
      setEmail('');
      setPassword('');
      setProfilePicture('');

      fetchUserData(userId);
    }
  }, [userId]);

  const fetchUserData = async (userId: string) => {
    try {
      const response = await getHTTP().get(`/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        const userData = data.user;

        setName(userData.username || '');
        setBio(userData.bio || '');
        setEmail(userData.email || '');
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
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePicture(result);
        rootStore.setProfilePicture(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const darkMode = rootStore.darkMode;

  const toggleDarkMode = async () => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      await rootStore.updatePreferences({darkMode: !darkMode});
    } catch (error) {
      console.error('Failed to toggle dark mode:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (!userId) {
        console.error("User  ID is required");
        return;
      }

      const response = await getHTTP().post('/api/users/preferences', {
        userId,
        username: name,
        bio,
        password,
        profileImage: profilePicture || "",
        preferences: JSON.stringify({darkMode: rootStore.darkMode}), // Convert to string
      });

      if (response.ok) {
        console.log("Profile updated successfully");
        fetchUserData(userId);
      } else {
        console.error("Failed to update profile", response.status);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleGoBack = () => {
    router.push('/');
  };

  const handleLogout = () => {
    router.push('/');
    rootStore.clearStore()
  };

  return (
      <div className={`flex flex-col items-center min-h-screen relative transition-colors duration-300 ${
          darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'
      }`}>
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-10 p-6 relative">
          <button
              onClick={toggleDarkMode}
              disabled={isUpdating}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 ${
                  darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              aria-label="Toggle dark mode"
          >
            {darkMode ? (
                <Sun className="w-5 h-5"/>
            ) : (
                <Moon className="w-5 h-5"/>
            )}
          </button>

          <h1 className={`text-2xl font-semibold mb-4 text-center ${darkMode ? 'text-white' : 'text-black'}`}>Settings</h1>

          <div className="border-b pb-4 mb-4">
            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>Account</h2>
            <div className="flex items-center gap-4"></div>
            <div className="flex justify-between items-start">
              <div className="flex-1 mr-6">
                <div className="mb-4">
                  <label className={`block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                  <input
                      type="text"
                      className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                      value={name}
                      onChange={handleNameChange}
                  />
                </div>

                <div className="mb-4">
                  <label className={`block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bio</label>
                  <textarea
                      className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                      maxLength={200}
                      value={bio}
                      onChange={handleBioChange}
                  />
                </div>

                <button
                    className={`px-4 py-2 mt-2 rounded hover:bg-blue-600 ${
                        darkMode ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'
                    }`}
                    onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>

              <div
                  className={`relative w-32 h-32 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full flex items-center justify-center overflow-hidden cursor-pointer`}
                  onClick={handleProfilePictureClick}
              >
                {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="w-full h-full object-cover"/>
                ) : (
                    <span className={`text-2xl ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>+</span>
                )}
                <div
                    className={`absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-sm font-semibold`}>
                  Change Picture
                </div>
              </div>
              <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  style={{display: 'none'}}
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
              darkMode={darkMode}
          />


          <div className="flex justify-between items-center">
            <button className={`px-4 py-2 mt-2 rounded hover:bg-blue-600 ${
                darkMode ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'
            }`}
                    onClick={handleGoBack}>
              Back
            </button>
            <button className="text-red-500" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
      </div>
  );
});

export default Settings;
