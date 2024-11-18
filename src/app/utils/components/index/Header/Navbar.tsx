"use client"

import SearchBar from "@/app/utils/components/index/Header/SearchBar";
import React, {useState} from 'react';
import { Moon, Sun, LogIn } from 'lucide-react';
import rootStore from "@/app/utils/stores/globalStore";
import { observer } from "mobx-react-lite";
import FoodGrid from "@/app/utils/components/index/Main/FoodGrid";
import { useRouter } from 'next/navigation';
import globalStore from "@/app/utils/stores/globalStore";
import ProfileButton from "@/app/utils/components/index/Header/ProfileButton";
import RecipeFilter from "@/app/utils/components/index/Main/Filter";
import { NavProps } from "@/app/utils/stores/types";

const NavBar: React.FC <NavProps>= observer(function NavBar({isLoginPage, showRecipeFilter, showFoodGrid}) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentFilter, setCurrentFilter] = useState("all");

    const userId = globalStore.userId;

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    }

    const handleFilterChange = (filter: string) => {
        setCurrentFilter(filter);
    };

    const darkMode = rootStore.darkMode;

    const toggleDarkMode = async () => {
        if (isUpdating) return;

        try {
            setIsUpdating(true);
            await rootStore.updatePreferences({darkMode: !darkMode});
        } catch (error) {
            console.error('Failed to toggle dark mode:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLogin = () => {
        router.push('/authentication');
    };

    const handlePreferences = () => {
        router.push('/settings')
    }

    const handleHome = () =>{
        router.push('/');
    }

    return (
        <>
            <nav className={`flex items-center justify-between p-4 transition-colors duration-200
                ${darkMode
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-800'}`}>
                {isLoginPage ? (
                    <><div className="flex items-center">
                        <span className="text-xl font-bold flex items-center">
                            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M16 6v2m-4-2v2m-4-2v2M4 10h16M5 14h14l1 7H4l1-7z" />

                            </svg>
                           ChefChecker
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleDarkMode}    
                        disabled={isUpdating}
                        className={`p-2 rounded-full transition-colors duration-200
                        ${darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                        aria-label="Toggle dark mode">

                        {darkMode ? (
                            <Sun className="w-5 h-5" />
                            ) : (
                            <Moon className="w-5 h-5" />
                            )}
                        </button>

                        <button onClick={handleHome}
                                className=" w-10 h-10">
                                <svg className="w-8 h-8" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                >
                                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                                <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                </svg>
                        </button>

                    </div>
                        
                    </>
                ): (

                <>
                <div className="flex items-center">
                    <span className="text-xl font-bold flex items-center">
                        <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 6v2m-4-2v2m-4-2v2M4 10h16M5 14h14l1 7H4l1-7z" />
                        </svg>
                        ChefChecker
                    </span>
                </div>
                <SearchBar onSearch={handleSearch} /><div className="flex items-center gap-4">
                    <button onClick={toggleDarkMode}
                        disabled={isUpdating}
                        className={`p-2 rounded-full transition-colors duration-200
                        ${darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                        aria-label="Toggle dark mode">
                        {darkMode ? (
                            <Sun className="w-5 h-5" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </button>
                    {userId ? (
                        <ProfileButton userId={userId} darkMode={darkMode} handlePreferences={handlePreferences} />) : (

                        <button onClick={handleLogin}
                            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200
                            ${darkMode
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : 'bg-purple-500 hover:bg-purple-600 text-white'}`}>
                            <LogIn className="w-4 h-4 mr-2" />
                            Login
                         </button>
                    )}

                </div>
            </>
        )
                
        }
        </nav>
            {userId && !isLoginPage && showRecipeFilter && <RecipeFilter
                onFilterChange={handleFilterChange}
                currentFilter={currentFilter} />}
            {userId && !isLoginPage && showFoodGrid && <FoodGrid searchTerm={searchTerm} filter={currentFilter}/>}
</>
) 
    ;
});

export default NavBar;