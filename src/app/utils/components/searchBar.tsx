'use client'

import React from "react";
import { useState } from "react";

//searching for recipie based on name 
function SearchBar(){

//updating the state when there is a change in the search bar 
const [searchBarResults, setsearchBarResults] = React.useState([]);

//mapping through all of the recipes that meet the current
const allRecipies = searchBarResults.map(recipie =>{
    return <li key={recipie.id}>
        {recipie.title}<br></br>
        {recipie.ingredients}<br></br>

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
async function showRecipies(){
    const response  = await fetch (`http://localhost:3000/api/recipies`) //not sure if this is the right route 
    const allRecipies = await response.json();
    console.log(JSON.stringify(allRecipies))
    setsearchBarResults(allRecipies)
}

}

export default SearchBar;