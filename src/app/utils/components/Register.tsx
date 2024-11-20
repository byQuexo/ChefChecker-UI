import React from "react" ;

interface RegisterProps {
  submitRegister: (username: string, email: string, password: string) => void;
  email: string;
  username: string;
  password: string;
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleLoginState: (isLogin: boolean) => void;
  darkMode: boolean;
}

export default function Register ({
  submitRegister,
  username, email, password,
  setUsername, setEmail, setPassword, 
  darkMode
  }: RegisterProps){

  const handleSubmit = (e: React.FormEvent) =>{
    e.preventDefault();
    submitRegister(username, email, password)
  }
    return(
      <form onSubmit={handleSubmit} className="transition-opacity duration-300">
      <div className="mb-4">
      <label htmlFor="username" className={`mt-2 text-sm 
         ${darkMode ? 'text-white' : 'text-gray-600'}`}>Username</label>
      <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} required
      className="block w-full rounded-md border-0 py-2 pl-3 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
      </div>

      <div className="mb-4">
      <label htmlFor="email" className={`mt-2 text-sm 
        ${darkMode ? 'text-white' : 'text-gray-600'}`}>Email address</label>
      <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required
      className="block w-full rounded-md border-0 py-2 pl-3 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
      </div>

      <div className="mb-4">
      <label htmlFor="password" className={`mt-2 text-sm 
        ${darkMode ? 'text-white' : 'text-gray-600'}`}>Password</label>
      <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required
      className="block w-full rounded-md border-0 py-2 pl-3 text-black- shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
      </div>

      <button type="submit"
      className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500">
      Register
      </button>

  </form>
          
    );
}
