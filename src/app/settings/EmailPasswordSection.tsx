import React from 'react';
import {Eye, EyeOff} from "lucide-react";

interface EmailPasswordSectionProps {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  handleChangePassword: () => void;
  darkMode: boolean;
  isSaving: boolean;
}

const EmailPasswordSection: React.FC<EmailPasswordSectionProps> = ({
  email,
  password,
  setEmail,
  setPassword,
  showPassword,
  togglePasswordVisibility,
  handleChangePassword,
  darkMode, isSaving
}) => {
  return (
      <div className={`pb-6 mb-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-4
        ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Email and Password
        </h2>

        {/* Email Field */}
        <div className="mb-4">
          <label className={`block mb-2 font-medium
            ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Email
          </label>
          <input
              type="email"
              className={`w-full p-3 rounded-lg border transition-colors duration-200
                ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-400'
                  : 'bg-gray-100 border-gray-300 text-gray-500'} 
                cursor-not-allowed`}
              disabled={true}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Field with Visibility Toggle */}
        <div className="mb-6 space-y-4">
          <label className={`block mb-2 font-medium
            ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Password
          </label>
          <div className="relative">
            <input
                type={showPassword ? 'text' : 'password'}
                className={`w-full p-3 pr-12 rounded-lg border transition-colors duration-200
                    ${darkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                type="button"
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full
                    transition-colors duration-200
                    ${darkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-800'}`}
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                  <EyeOff className="w-5 h-5"/>
              ) : (
                  <Eye className="w-5 h-5"/>
              )}
            </button>
          </div>

          <button
              className={`w-full sm:w-auto px-6 py-2 rounded-lg font-medium 
                transition-colors duration-200
                ${darkMode
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
              onClick={handleChangePassword}
          >
              {isSaving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                </span>
              ) : (
                  'Save Password'
              )}
          </button>
        </div>
      </div>
  );
};

export default EmailPasswordSection;
