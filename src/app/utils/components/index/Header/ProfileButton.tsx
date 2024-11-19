"use client"

import React, { useState, useEffect } from 'react';
import rootStore from '@/app/utils/stores/globalStore';
import { User } from 'lucide-react';

interface Props {
    userId: string,
    darkMode: boolean,
    handlePreferences: () => void;
}

const ProfileButton = ({ userId, darkMode, handlePreferences }: Props) => {
    const [profilePic, setProfilePic] = useState<string | null>('');
    const [isLoading, setIsLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadProfilePic = async () => {
            if (!userId) return;

            try {
                setIsLoading(true);
                setError(false);
                const pic = rootStore.profilePicture;
                setProfilePic(pic);
            } catch (e) {
                setError(true);
                console.error('Error loading profile picture:', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadProfilePic();
    }, [userId]);

    return (
        <button
            onClick={handlePreferences}
            className={`relative flex items-center justify-center w-10 h-10 rounded-full 
                overflow-hidden transition-all duration-200 group
                ${darkMode
                ? 'bg-gray-700 hover:bg-gray-600 ring-gray-600'
                : 'bg-gray-100 hover:bg-gray-200 ring-gray-200'} 
                hover:ring-2 focus:outline-none focus:ring-2 focus:ring-purple-500`}
            aria-label="User profile"
        >
            {isLoading ? (
                <div className="absolute inset-0 animate-pulse bg-gray-300 dark:bg-gray-600" />
            ) : profilePic ? (
                <>
                    <div className="relative w-full h-full">
                        <img
                            src={profilePic}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10
                            transition-opacity duration-200"
                        />
                    </div>
                </>
            ) : (
                <div className={`flex items-center justify-center w-full h-full
                    ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                >
                    <User className="w-5 h-5" />
                </div>
            )}
        </button>
    );
};

export default ProfileButton;