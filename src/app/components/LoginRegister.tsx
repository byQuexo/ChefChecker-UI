import React, {useState} from 'react';


export default function LoginRegister() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    //handleSlide function to handle changes in an input element(radio button)
    //update state variable(isLogin) based on 'id' of input element that trigger the event
    //'setIsLogin': manage the component state allowing UI to react to change in the input
    const handleSlide = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsLogin(e.target.id === 'login');
    };
    
    // Handle form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (isLogin) {
            console.log("Logging in:", { email, password });
        } else {
            console.log("Registering:", { username, email, password });
        }
    };

    return (
        <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-md'>
            <div className="flex justify-between cursor-pointer">
            <div className={`py-2 font-bold ${isLogin}? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`} 
            onClick={() => setIsLogin(true)}>Login</div>
            <div className={`py-2 font-bold ${isLogin}? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`} 
            onClick={() => setIsLogin(false)}>Register</div>
            </div>
          
            <form onSubmit={handleSubmit} className={`transition-opacity duration-300 ${isLogin ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email address</label>
                    <input type="text" placeholder='' onChange={(e)=>setEmail(e.target.value)} required
                    className="block w-full rounded-md border-0 py-1.5 text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>
                
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
                    <input type="password" placeholder='' onChange={(e)=>setPassword(e.target.value)} required
                    className="block w-full rounded-md border-0 py-1.5 text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>

                <button type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500">
                   Login
                </button>
                <div className="text-sm text-gray-600">Don't have an account? <a href="#" onClick={(e)=>{setIsLogin(false)}} className="font-leading-6 text-indigo-600 hover:text-indigo-500">
                    Register now</a>
                </div>
            </form>

            <form onSubmit={handleSubmit} className={`transition-opacity duration-300 ${!isLogin ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-900">Username</label>
                <input type="text" placeholder='' onChange={(e)=>setUsername(e.target.value)} required
                className="block w-full rounded-md border-0 py-1.5 text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>

                <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email address</label>
                <input type="text" placeholder='' onChange={(e)=>setEmail(e.target.value)} required
                className="block w-full rounded-md border-0 py-1.5 text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>

                <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
                <input type="passsword" placeholder='' onChange={(e)=>setPassword(e.target.value)} required
                className="block w-full rounded-md border-0 py-1.5 text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                </div>

                <button type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500">
                Register
                </button>

                <div className="text-sm text-gray-600">Already have an account? <a href="#" onClick={(e)=>{setIsLogin(true)}} className="font- leading-6 text-indigo-600 hover:text-indigo-500">
                Login Here</a>
                </div>
            </form>
        </div>
      
  );
}