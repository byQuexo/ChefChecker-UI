'use client'
import React, { useEffect, useState } from "react";

interface FilterBarProps {
    onFilterChange: (selectedCategory: string) => void;
}

function FilterBar({onFilterChange}: FilterBarProps){
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const fetchCategories = async () => {
        try {
            const response = await fetch (`http://localhost:3000/api/recipies/search`)
            return response.formData;
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const fetchCategoriesFromDB = async () => {
            const categoriesFromDB = await fetchCategories();
            setCategories(categoriesFromDB);
        };
        fetchCategoriesFromDB();
    }, []);

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
        onFilterChange(category);
    };

    return(
        <div>
            <h2>Filter by Category</h2>
            <div>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default FilterBar