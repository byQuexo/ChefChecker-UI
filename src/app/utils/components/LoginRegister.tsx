import React, {useState} from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

export default function LoginRegister() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleRegisterSubmit = (username:string, email:string, password:string) => {
        console.log("Logging in:", { username, email, password });
    };
    const handleLoginSubmit = (email:string, password:string) => {
        console.log("Logging in:", { email, password });
    };

    return (
        <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-md'>
            <div className="flex justify-between cursor-pointer">
                <div className={`p-2 ${isLogin ? 'font-bold' : ''}`} onClick={() => setIsLogin(true)}>Login</div>
                <div className={`p-2 ${!isLogin ? 'font-bold' : ''}`} onClick={() => setIsLogin(false)}>Register</div>
                
            </div>
            {isLogin ? (
                <Login submitLogin={handleLoginSubmit} 
                email={email} password={password} 
                setEmail={setEmail} setPassword={setPassword} 
                setIsLogin={setIsLogin} />
            ) : (
                <Register submitRegister={handleRegisterSubmit} 
                username={username} email={email} password={password} 
                setUsername={setUsername} setEmail={setEmail} setPassword={setPassword} 
                setIsLogin={setIsLogin}/>
            )}
            
        </div>
      
  );
}