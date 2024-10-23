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
        <div>
            <div>
                <button onClick={showRecipes}> <FaSearch id="search-icon" /> </button>
                <input placeholder="  e.g.'Pizza' or 'Noodle' "
                    id="recipeName"
                    value={recipeInput}
                    onChange={(e) => setRecipeInput(e.target.value)} />
            </div>
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