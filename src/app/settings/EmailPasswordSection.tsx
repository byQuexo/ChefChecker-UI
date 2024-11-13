import React from 'react';

interface EmailPasswordSectionProps {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  handleChangePassword: () => void;
  darkMode: boolean;
}

const EmailPasswordSection: React.FC<EmailPasswordSectionProps> = ({
  email,
  password,
  setEmail,
  setPassword,
  showPassword,
  togglePasswordVisibility,
  handleChangePassword,
  darkMode,
}) => {
  return (
    <div className="pb-4 mb-4">
      <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
        Email and Password
      </h2>

      {/* Email Field */}
      <div className="mb-4">
        <label className={`block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
        <input
          type="email"
          className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
          disabled={true}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password Field with Visibility Toggle */}
      <div className="mb-4 relative">
        <label className={`block mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
        <input
          type={showPassword ? 'text' : 'password'}
          className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? '👁️‍🗨️' : '👁️'}
        </button>
        <button
          className={`px-4 py-2 mt-2 rounded hover:bg-blue-600 ${
            darkMode ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'
          }`}
          onClick={handleChangePassword}
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default EmailPasswordSection;
