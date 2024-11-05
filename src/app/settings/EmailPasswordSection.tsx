import React from 'react';

interface EmailPasswordSectionProps {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  handleUpdateEmail: () => void;
  handleChangePassword: () => void;
}

const EmailPasswordSection: React.FC<EmailPasswordSectionProps> = ({
  email,
  password,
  setEmail,
  setPassword,
  showPassword,
  togglePasswordVisibility,
  handleUpdateEmail,
  handleChangePassword,
}) => {
  return (
    <div className="pb-4 mb-4">
      <h2 className="text-xl font-semibold mb-2 text-black">Email and Password</h2>

      {/* Email Field */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600" onClick={handleUpdateEmail}>
          Update
        </button>
      </div>

      {/* Password Field with Visibility Toggle */}
      <div className="mb-4 relative">
        <label className="block text-gray-700 mb-1">Password</label>
        <input
          type={showPassword ? 'text' : 'password'}
          className="w-full p-2 border rounded text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="absolute right-2 top-1/2 transform -translate-y-1/2" onClick={togglePasswordVisibility}>
          {showPassword ? '👁️‍🗨️' : '👁️'}
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600" onClick={handleChangePassword}>
          Change Password
        </button>
      </div>
    </div>
  );
};

export default EmailPasswordSection;
