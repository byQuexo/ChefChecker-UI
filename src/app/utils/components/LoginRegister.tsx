import React, {useState} from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

export default function LoginRegister() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginState = (isLogin: boolean)=>{
        setIsLogin(isLogin); 
    }
    
    const handleRegisterSubmit = async (username:string, email:string, password:string) => {
        try{
            const response = await fetch('/api/auth/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRpbUB0aW0uZGUifQ.9UhJy6wUc6RkNWsklp3av5f5hWrqmjbaYMR1tphoDwg`
                },
                body: JSON.stringify({username, email, password})
            });
            const registerData = await response.json();

            if(!response.ok){
                console.log("failed to register", registerData.error);
                //return;
            }
            console.log("register:", registerData.user);
        } catch(error){
            console.log("error in registration:", error);
        }
        
    };
    const handleLoginSubmit = async (email:string, password:string) => {
        try{
            const response = await fetch('/api/auth/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRpbUB0aW0uZGUifQ.9UhJy6wUc6RkNWsklp3av5f5hWrqmjbaYMR1tphoDwg`
                },
                body: JSON.stringify({ email, password})
            });
            const loginData = await response.json();

            if(!response.ok){
                console.log("failed to login", loginData.error);
                return;
            }
            console.log("login:", loginData.user);
        } catch(error){
            console.log("error in logging in:", error);
        }
        
    }

    return (
        <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-md'>
            <div className="flex justify-between cursor-pointer">
                <div className={`p-2 ${isLogin ? 'font-bold' : ''}`} onClick={() => handleLoginState(true)}>Login</div>
                <div className={`p-2 ${!isLogin ? 'font-bold' : ''}`} onClick={() => handleLoginState(false)}>Register</div>
                
            </div>
            {isLogin ? (
                <Login submitLogin={handleLoginSubmit} 
                email={email} password={password} 
                setEmail={setEmail} setPassword={setPassword} 
                handleLoginState={handleLoginState} />
            ) : (
                <Register submitRegister={handleRegisterSubmit} 
                username={username} email={email} password={password} 
                setUsername={setUsername} setEmail={setEmail} setPassword={setPassword} 
                handleLoginState={handleLoginState}/>
            )}
            
        </div>
      
  );
}