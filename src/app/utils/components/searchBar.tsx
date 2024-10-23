'use client'

//importing modules
import React, { useState } from "react";
import { Recipe } from "../stores/types";
import { FaSearch } from "react-icons/fa"

//function to search recipe based on name
function SearchBar() {
    const defaultArray: Recipe[] = []

    //updating the state when there is a change in the search bar
    const [recipeInput, setRecipeInput] = useState("")
    const [searchBarResults, setsearchBarResults] = useState(defaultArray);

    //linking the search route as a GET request to display all results 
    async function showRecipes(): Promise<Recipe[]> {
        const response = await fetch(`/api/recipes`)
        const allRecipes = await response.json();
        console.log(JSON.stringify(allRecipes))
        const listOfRecipes: Recipe[] = []
        return listOfRecipes
    }

    return (
        <div className="max-w-md mx-auto mt-8">
            <div className="relative flex items-center">
                {/* search button */}
                <button
                    onClick={showRecipes}
                    className="absolute left-0 px-4 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <FaSearch id="search-icon" />
                </button>
                {/* search bar */}
                <input
                    type="text"
                    placeholder="e.g. 'Pizza' or 'Noodles'"
                    id="recipeName"
                    value={recipeInput}
                    onChange={(e) => setRecipeInput(e.target.value)}
                    className="w-full px-20 py-2 text-gray-700 bg-white border rounded-full focus:outline-none focus:ring-1 focus:ring-grey-500"/>
                <br/>
            </div>
            <br />
            <br></br>
            {/* this will be worked on with the pagination
            <div id="displayResults">
                {searchBarResults.map((recipe, index) => (
                    <li key={index}>
                        {recipe.title}<br />
                        {recipe.ingredients}<br />
                    </li>
                ))}
            </div>*/}
        </div>
    )

}

export default SearchBar;