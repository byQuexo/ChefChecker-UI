'use client'

import React ,{ useState } from "react";
import { Recipe } from "../stores/types";

//searching for recipie based on name 
function SearchBar(){
    const defaultArray: Recipe[] =[]

//updating the state when there is a change in the search bar 
const [searchBarResults, setsearchBarResults] = useState(defaultArray);

//mapping through all of the recipes
const allRecipies = searchBarResults.map((value, index) =>{
    return <li key={index}>
        {value.title}<br></br>
        {value.ingredients}<br></br>
    </li>
})

return [
    <div>
        <input placeholder="Recipie.." id="recipieName"/>
        <button onClick={showRecipies}>Search</button>
        <br></br>
        <div id="displayResults">
            {allRecipies}
        </div>
    </div>
]

//linking the search route as a GET request to display all results 
async function showRecipies():Promise<Recipe[]>{
    const response  = await fetch (`/api/recipies`) //not sure if this is the right route 
    const allRecipies = await response.json();
    console.log(JSON.stringify(allRecipies))
    setsearchBarResults(allRecipies)
    const listOfRecipies: Recipe[] =[]
    return listOfRecipies
}

}

export default SearchBar;