import React from 'react';

interface LoginProps {
  submitLogin: (email: string, password: string) => void;
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setIsLogin: (isLogin: boolean) => void;
}

export default function Login({
  submitLogin, 
  email, password, 
  setEmail, setPassword,
  setIsLogin
  }: LoginProps) {

  const handleSubmit = (e: React.FormEvent) =>{
    e.preventDefault();
    submitLogin(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="transition-opacity duration-300">
      <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email address</label>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required
          className="block w-full rounded-md border-0 py-1.5 text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
      </div>

      <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required
          className="block w-full rounded-md border-0 py-1.5 text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
      </div>

      <button type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500">
        Login
      </button>
      <div className="text-sm text-gray-600"> Don&apos;t have an account? <a href="#" onClick={(e)=>{
          e.preventDefault();
          setIsLogin(false);
          }} className="font- leading-6 text-indigo-600 hover:text-indigo-500">
          Register now</a>
      </div>
    </form>
        
  );
}