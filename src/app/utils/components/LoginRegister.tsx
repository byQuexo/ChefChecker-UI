"use client"

import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import { authStore } from '../stores/authStore';
import { observer } from 'mobx-react-lite';
import rootStore from "@/app/utils/stores/globalStore";
import globalStore from "@/app/utils/stores/globalStore";
import { useRouter } from 'next/navigation';

const LoginRegister = observer(() => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const darkMode = rootStore.darkMode;

    const handleLoginState = (isLogin: boolean) => {
        setIsLogin(isLogin);
    }

    const handleRegisterSubmit = async () => {
        try {
            const response = await authStore.register(username, email, password);
            if (response) {
                globalStore.setUserId(response.user.id);
                globalStore.setDarkMode(response.user.preference.darkMode === "dark")
                router.push("/")
            } else {
                console.log("registration failed");
            }
        } catch (error) {
            console.error("an error occured during registration:", error);
        }
    };

    const handleLoginSubmit = async () => {
        try {
            const response = await authStore.login(email, password);
            if (response) {
                console.log(response)
                globalStore.setUserId(response.user.id);
                globalStore.setDarkMode(response.user.preference.darkMode === "dark")
                globalStore.setProfilePicture(response.user.profileImage)
                router.push("/")
            } else {
                console.log("login failed");
            }
        } catch (error) {
            console.error("an error occured during logging in:", error);
        }
    };

    return (
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
                                    ? 'text-gray-300 hover:text-white'
                                    : 'text-gray-700 hover:text-gray-900')}`}
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
                                    ? 'text-gray-300 hover:text-white'
                                    : 'text-gray-700 hover:text-gray-900')}`}
                        >
                            Register
                        </button>
                    </div>
                </div>

                <div className="mt-8">
                    {isLogin ? (
                        <Login
                            submitLogin={handleLoginSubmit}
                            email={email}
                            password={password}
                            setEmail={setEmail}
                            setPassword={setPassword}
                            handleLoginState={handleLoginState}
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
    );
});

export default LoginRegister;