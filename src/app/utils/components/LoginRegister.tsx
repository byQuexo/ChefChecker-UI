import React, {useState} from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import { authStore } from '../stores/authStore';


export default function LoginRegister() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginState = (isLogin: boolean)=>{
        setIsLogin(isLogin); 
    }
    
    
    const handleRegisterSubmit = async ()=>{
        try{
            const user = await authStore.register(username, email, password);
            if(user){
                console.log("Registration successful:", user);
            } else{
                console.log("registration failed");
            }
            
        } catch (error){
            console.error("an error occured during registration:", error);
        }
        
    };

    const handleLoginSubmit = async () =>{
        try{
            const user = await authStore.login(email, password);
            if(user){
                console.log("Login successful:", user);
            } else{
                console.log("login failed");
            }
            
        } catch (error){
            console.error("an error occured during logging in:", error);
        }

    };

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