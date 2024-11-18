"use client"

import { observer } from 'mobx-react-lite';
import {Filter, Heart, ChefHat, BookOpen, Pizza, Soup, Salad} from 'lucide-react';
import React, { useState } from 'react';
import rootStore from "@/app/utils/stores/globalStore";

interface FilterProps {
    onFilterChange: (filter: string) => void;
    currentFilter: string;
}

const RecipeFilter: React.FC<FilterProps> = observer(({ onFilterChange, currentFilter }) => {
    const darkMode = rootStore.darkMode;
    const userId = rootStore.userId;

    const categories = [
        { id: 'all', label: 'All Recipes', icon: BookOpen },
        { id: 'Noodles', label: 'Noodles', icon: Soup },
        { id: 'Pizza', label: 'Pizza', icon: Pizza },
        { id: 'Burger', label: 'Burger', icon: ChefHat },
        { id: 'Asia', label: 'Asia', icon: Salad },
    ];

    const [isOpen, setIsOpen] = useState(false);

    // Helper function to get the current filter label
    const getCurrentFilterLabel = () => {
        if (currentFilter === 'my-recipes') return 'My Recipes';
        if (currentFilter === 'favorites') return 'Favorites';
        return categories.find(c => c.id === currentFilter)?.label || '';
    };

    return (
        <div className={`w-full transition-colors duration-200 
            ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
            <div className="max-w-6xl mx-auto px-8 py-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200
                                ${darkMode
                                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Categories
                        </button>

                        {isOpen && (
                            <div className={`absolute z-10 mt-2 w-48 rounded-md shadow-lg 
                                ${darkMode
                                ? 'bg-gray-700 border border-gray-600'
                                : 'bg-white border border-gray-200'}`}
                            >
                                <div className="py-1">
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => {
                                                onFilterChange(category.id);
                                                setIsOpen(false);
                                            }}
                                            className={`flex items-center w-full px-4 py-2 text-sm transition-colors
                                                ${darkMode
                                                ? 'text-gray-200 hover:bg-gray-600'
                                                : 'text-gray-700 hover:bg-gray-100'}
                                                ${currentFilter === category.id
                                                ? (darkMode ? 'bg-gray-600' : 'bg-gray-100')
                                                : ''}`}
                                        >
                                            <category.icon className="w-4 h-4 mr-2" />
                                            {category.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {userId && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => onFilterChange('my-recipes')}
                                className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200
                                    ${currentFilter === 'my-recipes'
                                    ? (darkMode
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-purple-500 text-white')
                                    : (darkMode
                                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800')}`}
                            >
                                <ChefHat className="w-4 h-4 mr-2" />
                                My Recipes
                            </button>

                            <button
                                onClick={() => onFilterChange('favorites')}
                                className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200
                                    ${currentFilter === 'favorites'
                                    ? (darkMode
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-purple-500 text-white')
                                    : (darkMode
                                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800')}`}
                            >
                                <Heart className="w-4 h-4 mr-2" />
                                Favorites
                            </button>
                        </div>
                    )}
                </div>

                {currentFilter !== 'all' && (
                    <div className="mt-4 flex items-center gap-2">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Active Filter:
                        </span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {getCurrentFilterLabel()}
                        </span>
                        <button
                            onClick={() => onFilterChange('all')}
                            className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}
                        >
                            Clear
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
});

export default RecipeFilter;