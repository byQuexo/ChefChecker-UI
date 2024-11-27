'use client'
import React, { useState } from 'react';

interface UserPreferenceProps {
    initialPreference: string;
}

const UserPreference: React.FC<UserPreferenceProps> = ({ initialPreference }) => {
    const [preference, setPreference] = useState(initialPreference);

    const handlePreferenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPreference(event.target.value);
    };

    return (
        <div>
            <h2>User Preference</h2>
            <input
                type="text"
                value={preference}
                onChange={handlePreferenceChange}
            />
            <p>Current Preference: {preference}</p>
        </div>
    );
};

export default UserPreference;