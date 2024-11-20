"use client"

import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import { authStore } from '../stores/authStore';
import { observer } from 'mobx-react-lite';
import rootStore from "@/app/utils/stores/globalStore";
import globalStore from "@/app/utils/stores/globalStore";
import { useRouter } from 'next/navigation';
import {Loader} from 'lucide-react';

const LoginRegister = observer(() => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();
    const darkMode = rootStore.darkMode;

    const handleLoginState = (isLogin: boolean) => {
        setIsLogin(isLogin);
    }

    const handleRegisterSubmit = async () => {
        setIsLoading(true);
        setErrorMessage('');
        setMessage('');
        
        try {
            const response = await authStore.register(username, email, password);
            if (response) {
                globalStore.setUserId(response.user.id);
                globalStore.setDarkMode(response.user.preference.darkMode === "dark")
                setMessage("registration successful");
                setTimeout(() =>{
                    setIsLoading(false);
                    setMessage('');
                    router.push("/");
                    
                }, 3000);
                
            } else {
                setErrorMessage("Registration failed! Please try again later");
                setEmail('');
                setPassword('');
                setIsLoading(false);
                setTimeout(() =>{
                    setErrorMessage('');
                }, 3000);
            }
        } catch (error) {
            console.error("an error occured during registration:", error);
            setErrorMessage("an error occured during Registration");
            setIsLoading(false);
            setEmail('');
            setPassword('');
            router.push("/authentication");;
        } 

    };

    const handleLoginSubmit = async () => {
        setIsLoading(true);
        setErrorMessage('');
        setMessage('');
        try {
            const response = await authStore.login(email, password);
            if (response) {
                console.log(response)
                globalStore.setUserId(response.user.id);
                globalStore.setDarkMode(response.user.preference.darkMode === "dark")
                globalStore.setProfilePicture(response.user.profileImage)
                globalStore.setUserFavorites(String(response.user.favorites))

                localStorage.setItem('isLoggedIn', 'true');
                setMessage("login successful");
                setTimeout(() =>{
                    setIsLoading(false);
                    setMessage('');
                    router.push("/");
                    
                }, 2000);
                
            } else {
                setEmail('');
                setPassword('');
                setErrorMessage("Login failed! please try again later");
                setIsLoading(false);
                setTimeout(() =>{
                    setErrorMessage('');
                }, 3000);
            }
        } catch (error) {
            console.error("an error occured during logging in:", error);
            setErrorMessage("an error occured during logging in");
            setIsLoading(false);
            setEmail('');
            setPassword('');
            router.push("/authentication");
            
        } 

    };

    return (
        <div className={`min-h-screen flex flex-col`}>
        
        { errorMessage && (
        <div className='absolute top-4 right-4 bg-red-600 text-white p-4 rounded shadow-lg z-50'>
            {errorMessage}
        </div>
        )}

        {  message && (
        <div className='absolute top-4 right-4 bg-green-600 text-white p-4 rounded shadow-lg z-50'>
            {message}
        </div>
        )}

       <div className="absolute left-12 top-12">
            <button onClick={() => router.push("/")}
            className={`flex items-center space-x-2 p-6 rounded-lg transition duration-200
            ${darkMode 
            ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-purple-800 hover:bg-purple-300'}`}>
                <House className='w-8 h-8'/>
                
            </button>
        </div>
        
        <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 
            ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            
            <div className={`max-w-md w-full space-y-8 p-8 rounded-xl shadow-2xl 
                ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="text-center">
                    <h2 className={`text-3xl font-extrabold 
                        ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Welcome to ChefChecker
                    </h2>
                    <p className={`mt-2 text-sm 
                        ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {isLogin ? 'Sign in to your account' : 'Create your account'}
                    </p>
                    
                </div>

                <div className="flex justify-center items-center mt-4">
                    {isLoading && 
                    <Loader className="w-10 h-10 ml-2 text-green-500" />}
                        
                </div>
              
               <div className="mt-8 flex justify-center">
                    <div className={`relative flex rounded-lg p-1 
                        ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <button
                            onClick={() => handleLoginState(true)}
                            className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                                ${isLogin
                                ? (darkMode
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-purple-500 text-white')
                                : (darkMode
                                    ? 'text-gray-500 hover:text-white'
                                    : 'text-gray-500 hover:text-gray-900')}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => handleLoginState(false)}
                            className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                                ${!isLogin
                                ? (darkMode
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-purple-500 text-white')
                                : (darkMode
                                    ? 'text-black-300 hover:text-white'
                                    : 'text-gray-700 hover:text-gray-900')}`}
                        >
                            Register
                        </button>
                    </div>
                </div>
                               
                <div className={`mt-6 text-center text-sm 
                    ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                        {isLogin ? (
                        <Login
                            submitLogin={handleLoginSubmit}
                            
                            email={email}
                            password={password}
                            setEmail={setEmail}
                            setPassword={setPassword}
                            handleLoginState={handleLoginState}
                            darkMode={darkMode}
                        />
                    ) : (
                        <Register
                            submitRegister={handleRegisterSubmit}
                            
                            username={username}
                            email={email}
                            password={password}
                            setUsername={setUsername}
                            setEmail={setEmail}
                            setPassword={setPassword}
                            handleLoginState={handleLoginState}
                            darkMode={darkMode}
                        />
                    )}
                </div>
                <div className={`mt-6 text-center text-sm 
                    ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {isLogin ? (
                        <p>
                            Don&#39;t have an account?{' '}
                            <button
                                onClick={() => handleLoginState(false)}
                                className={`font-medium transition-colors 
                                    ${darkMode
                                    ? 'text-purple-400 hover:text-purple-300'
                                    : 'text-purple-600 hover:text-purple-500'}`}
                            >
                                Sign up now
                            </button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{' '}
                            <button
                                onClick={() => handleLoginState(true)}
                                className={`font-medium transition-colors 
                                    ${darkMode
                                    ? 'text-purple-400 hover:text-purple-300'
                                    : 'text-purple-600 hover:text-purple-500'}`}
                            >
                                Sign in
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
        </div>
    );
});

export default LoginRegister;