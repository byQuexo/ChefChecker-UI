"use client";

import { observer } from 'mobx-react-lite';
import { Filter, ChefHat, BookOpen, Pizza, Soup, Salad, Plus } from 'lucide-react';
import React, { useState } from 'react';
import rootStore from "@/app/utils/stores/globalStore";
import { FilterOptions, RecipeData } from "@/app/utils/stores/types";
import { getHTTP } from "@/app/utils/utils";
import { useRouter } from 'next/navigation';

interface FilterProps {
    onFilterChange: (filter: string) => void;
    currentFilter: string;
    onRecipeDataUpdate: (data: RecipeData) => void;
}

const RecipeFilter: React.FC<FilterProps> = observer(({ onFilterChange, currentFilter, onRecipeDataUpdate }) => {
    const darkMode = rootStore.darkMode;
    const userId = rootStore.userId;
    const router = useRouter();

    const categories = [
        { id: 'all', label: 'All Recipes', icon: BookOpen },
        { id: 'Noodles', label: 'Noodles', icon: Soup },
        { id: 'Pizza', label: 'Pizza', icon: Pizza },
        { id: 'Burger', label: 'Burger', icon: ChefHat },
        { id: 'Asia', label: 'Asia', icon: Salad },
    ];

    const [isOpen, setIsOpen] = useState(false);

    const handleFilterChange = async (filter: string) => {
        const opts: FilterOptions = {
            page: 1
        };

        if (filter === 'my-recipes') {
            opts.userId = userId;
            opts.visibility = 'private';
        } else if (filter !== 'all') {
            opts.category = filter;
            if (userId) {
                opts.userId = userId;
            }
        }

        try {
            let response = null;
            let data = null;
            if (!opts.favorites) {
                response = await getHTTP().post('/api/recipes/search', JSON.stringify({
                    searchTerms: '',
                    opts: opts
                }));
                if (!response?.ok) {
                    throw new Error('Failed to fetch recipes');
                }
                data = await response?.json();
            }

            onFilterChange(filter);
            onRecipeDataUpdate(data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    // Helper function to get the current filter label
    const getCurrentFilterLabel = () => {
        if (currentFilter === 'my-recipes') return 'My Recipes';
        return categories.find(c => c.id === currentFilter)?.label || '';
    };

    const handleCreateRecipe = () => {
        router.push('/recipes/create');
    };

    return (
        <div className={`w-full transition-colors duration-200 
            ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
            <div className="max-w-6xl mx-auto px-8 py-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
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
                                                    handleFilterChange(category.id);
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
                                    onClick={() => handleFilterChange('my-recipes')}
                                    className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200
                                        ${currentFilter === 'my-recipes'
                                        ? (darkMode
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-purple-500 text-white')
                                        : (darkMode
                                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800')}`}
                                    data-testid="myrecipe-button"
                                >
                                    <ChefHat className="w-4 h-4 mr-2" />
                                    My Recipes
                                </button>
                            </div>
                        )}
                    </div>
                    {userId && (

                        <button
                            onClick={handleCreateRecipe}
                            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200
                            ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Recipe
                        </button>
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
                            onClick={() => handleFilterChange('all')}
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
