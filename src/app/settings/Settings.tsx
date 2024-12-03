"use client";
import React, { useState, useEffect, useRef } from 'react';
import EmailPasswordSection from '../settings/EmailPasswordSection';
import { getHTTP } from '../utils/utils';
import rootStore from "@/app/utils/stores/globalStore";
import {useRouter} from "next/navigation";
import {observer} from "mobx-react-lite";
import globalStore from "@/app/utils/stores/globalStore";

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
  const [isSaving, setIsSaving] = useState(false);
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
    if (isSaving) return;
    const file = e.target.files?.[0];
    if (file) {
      setIsSaving(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePicture(result);
        rootStore.setProfilePicture(result);
      };
      reader.readAsDataURL(file);
    }

    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const darkMode = rootStore.darkMode;

  const handleSaveChanges = async () => {
    try {
      if (isSaving) return;
      if (!userId) {
        console.error("User  ID is required");
        return;
      }

      setIsSaving(true);

      console.log({
          userId,
          username: name,
          bio,
          password,
          profileImage: profilePicture || ""
      })

      const response = await getHTTP().post('/api/users/preferences', {
        userId,
        username: name,
        bio,
        password,
        profileImage: profilePicture || "",
      });

      console.log(response)

      if (profilePicture) {
        globalStore.setProfilePicture(profilePicture);
      }

      if (response.ok) {
        console.log("Profile updated successfully");
        fetchUserData(userId);
      } else {
        console.error("Failed to update profile", response.status);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    }
  };

  const handleGoBack = () => {
    router.push('/');
  };

  const handleLogout = () => {
    rootStore.clearStore()
    router.push('/');
  };

  return (
      <div className={`flex flex-col items-center min-h-screen relative transition-colors duration-300 
    ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
        <div className={`w-full max-w-2xl shadow-xl rounded-xl mt-10 p-8 transition-colors duration-200
        ${darkMode ? 'bg-gray-800 shadow-black/20' : 'bg-white shadow-gray-200/50'}`}>

          <h1 className={`text-2xl font-semibold mb-6 text-center
            ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Settings
          </h1>

          <div className={`border-b mb-6 pb-6
            ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-xl font-semibold mb-4
                ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Account
            </h2>

            <div className="flex justify-between items-start">
              <div className="flex-1 mr-6">
                <div className="mb-4">
                  <label className={`block mb-2 font-medium
                            ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Name
                  </label>
                  <input
                      type="text"
                      className={`w-full p-3 rounded-lg border transition-colors duration-200
                                ${darkMode
                          ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'}`}
                      value={name}
                      name="username"
                      onChange={handleNameChange}
                  />
                </div>

                <div className="mb-4">
                  <label className={`block mb-2 font-medium
                            ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Bio
                  </label>
                  <textarea
                      className={`w-full p-3 rounded-lg border transition-colors duration-200 min-h-[100px]
                                ${darkMode
                          ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'}`}
                      maxLength={200}
                      name="bio"
                      value={bio}
                      onChange={handleBioChange}
                  />
                </div>

              </div>

              <div
                  className={`relative w-32 h-32 rounded-full overflow-hidden cursor-pointer
                        ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                  onClick={handleProfilePictureClick}
              >
                {profilePicture ? (
                    <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className={`text-4xl absolute inset-0 flex items-center justify-center
                            ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            +
                        </span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100
                        transition-opacity duration-200 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                            Change Picture
                        </span>
                </div>
              </div>
              <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
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
              isSaving={isSaving}
              darkMode={darkMode}
          />

          <div className="flex justify-between items-center mt-6">
            <button
                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200
                    ${darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}
                onClick={handleGoBack}
            >
              Back
            </button>
            <button
                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200
                    ${darkMode
                    ? 'bg-red-600/10 text-red-400 hover:bg-red-600/20'
                    : 'text-red-600 hover:text-red-700'}`}
                onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
  );
});

export default Settings;
