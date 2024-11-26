"use client"

import React from "react";
import { observer } from "mobx-react-lite";
import rootStore from "@/app/utils/stores/globalStore";

const FooterComponent = observer(() => {
    const darkMode = rootStore.darkMode;

    return (
        <footer className={`flex flex-col items-center justify-between p-4 transition-colors duration-200
                ${darkMode
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-800'}`}>

            <div className="mb-4">
                <span className="text-xl font-bold flex items-center">
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 6v2m-4-2v2m-4-2v2M4 10h16M5 14h14l1 7H4l1-7z"
                        />
                    </svg>
                    ChefChecker
                </span>
            </div>

            <div className="flex space-x-4 mb-4">
                <a className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tim Guehnemann
                </a>
                <a className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Hannah-Ann Nana-Hackman
                </a>
                <a className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Manita Tamang
                </a>
                <a className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Kacper Janas
                </a>
                <a className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    David Werner
                </a>
            </div>

            <div className="text-sm">
                <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    © {new Date().getFullYear()} ChefChecker. All rights reserved.
                </p>
            </div>
        </footer>
    );
});

export default FooterComponent;