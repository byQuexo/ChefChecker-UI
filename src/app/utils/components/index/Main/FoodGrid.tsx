"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import rootStore from "@/app/utils/stores/globalStore";
import { PaginationData, Recipe, RecipeData } from "@/app/utils/stores/types";
import { getHTTP } from "@/app/utils/utils";
import { Heart } from "lucide-react";

interface Props {
    searchTerm?: string;
    filter?: string;
    recipeData: RecipeData | null;
}

const FoodGrid: React.FC<Props> = observer(function FoodGrid({ searchTerm, recipeData }: Props) {
    const router = useRouter();
    const [recipeList, setRecipeList] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationData>({
        currentPage: 1,
        pageSize: 8,
        totalPages: 1,
        totalRecipes: 0,
    });
    const darkMode = rootStore.darkMode;

    // Update local state when recipeData changes
    useEffect(() => {
        if (recipeData) {
            setLoading(true);
            try {
                setRecipeList(recipeData.recipes);
                setPagination(recipeData.pagination);
                setError(null);
            } catch (e) {
                console.error("Error updating recipes:", e);
                setError("Failed to update recipes");
            } finally {
                setLoading(false);
            }
        }
    }, [recipeData]);

    // Handle initial load and search
    useEffect(() => {
        if (!recipeData) {
            getAllRecipes(pagination.currentPage);
        }
    }, [searchTerm, pagination.currentPage]);

    const getAllRecipes = async (page: number = 1) => {
        try {
            setLoading(true);
            const response = searchTerm
                ? await getHTTP().post(
                    "api/recipes/search",
                    JSON.stringify({
                        searchTerms: searchTerm,
                        opts: {
                            page
                        },
                    })
                )
                : await getHTTP().get(`api/recipes/search?page=${page}`);
            const data = await response.json();

            if (!data || !data.recipes) {
                throw new Error("No recipes found");
            }

            setRecipeList(data.recipes);
            setPagination(data.pagination);
            setError(null);
        } catch (e) {
            console.error("Error fetching recipes:", e);
            setError("Failed to load recipes");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination((prev) => ({ ...prev, currentPage: newPage }));
        }
    };

    const handleFavoriteClick = async (recipeId: string) => {
        try {
            // Implement favorite functionality
        } catch (error) {
            console.error('Error favoriting recipe:', error);
            setError("Failed to set favorite");
        }
    };

    const handleCardClick = (recipeId: string) => {
        router.push(`/recipes/${recipeId}`);
    };

    const Pagination = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex justify-center items-center gap-2 py-4">
                <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                        darkMode
                            ? 'bg-gray-700 text-white disabled:bg-gray-600'
                            : 'bg-gray-200 text-gray-800 disabled:bg-gray-100'
                    } disabled:cursor-not-allowed`}
                >
                    Previous
                </button>

                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => handlePageChange(number)}
                        className={`px-3 py-1 rounded-md ${
                            pagination.currentPage === number
                                ? (darkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white')
                                : (darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800')
                        }`}
                    >
                        {number}
                    </button>
                ))}

                <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`px-3 py-1 rounded-md ${
                        darkMode
                            ? 'bg-gray-700 text-white disabled:bg-gray-600'
                            : 'bg-gray-200 text-gray-800 disabled:bg-gray-100'
                    } disabled:cursor-not-allowed`}
                >
                    Next
                </button>
            </div>
        );
    };

    if (loading) {
        return (
            <div className={`flex justify-center items-center h-64 
                ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className={`animate-spin rounded-full h-12 w-12 border-b-2 
                    ${darkMode ? 'border-purple-400' : 'border-purple-500'}`}></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`text-center p-4 
                ${darkMode ? 'text-red-400 bg-gray-900' : 'text-red-500 bg-gray-50'}`}>
                {error}
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-200 
        ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-6xl mx-auto px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-6">
                    {recipeList.map((food, index) => (
                        <div
                            key={index}
                            onClick={() => handleCardClick(food.id)}
                            className={`rounded-xl overflow-hidden transition-all duration-300 relative cursor-pointer
                            ${darkMode
                                ? 'bg-gray-800 shadow-lg shadow-black/20 hover:shadow-purple-500/10'
                                : 'bg-white shadow-md hover:shadow-lg shadow-gray-200/50'}`}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleFavoriteClick(food.id);
                                }}
                                className={`absolute top-2 right-2 z-10 p-2 rounded-full 
                                ${darkMode
                                    ? 'bg-gray-800/80 hover:bg-gray-700/80'
                                    : 'bg-white/80 hover:bg-gray-50/80'}
                                transition-all duration-200 backdrop-blur-sm`}
                                aria-label="Toggle favorite"
                            >
                                <Heart
                                    className={`w-5 h-5 transition-colors
                                    ${darkMode ? 'stroke-white' : 'stroke-gray-600'}
                                    hover:stroke-red-500 hover:fill-red-500`}
                                />
                            </button>

                            <div className="relative aspect-video">
                                <img
                                    src={food.recipeImage}
                                    alt={food.title}
                                    className="w-full h-full object-cover"
                                    width={16}
                                    height={16}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                    }}
                                />
                                <div
                                    className={`absolute inset-0 bg-gradient-to-t 
                                    ${darkMode
                                        ? 'from-gray-900/50 to-transparent'
                                        : 'from-black/20 to-transparent'}`}
                                />
                            </div>
                            <div className="p-4">
                                <h3 className={`text-base font-medium truncate
                                ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                                    {food.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
                {pagination.totalPages > 1 && <Pagination />}
            </div>
        </div>
    );
});

export default FoodGrid;