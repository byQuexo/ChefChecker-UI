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
}

export default function Register ({
  submitRegister,
  username, email, password,
  setUsername, setEmail, setPassword, 
  handleLoginState
  }: RegisterProps){

  const handleSubmit = (e: React.FormEvent) =>{
    e.preventDefault();
    submitRegister(username, email, password)
  }
    return(
      <form onSubmit={handleSubmit} className="transition-opacity duration-300">
      <div className="mb-4">
      <label htmlFor="username" className="block text-sm font-medium text-gray-900">Username</label>
      <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} required
      className="block w-full rounded-md border-0 py-1.5 text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
      </div>

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
      Register
      </button>

      <div className="text-sm text-gray-600">Already have an account? <a href="#" onClick={()=>handleLoginState(true)} className="font- leading-6 text-indigo-600 hover:text-indigo-500">
      Login Here</a>
      </div>
  </form>
          
    );
}
