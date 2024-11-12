'use client'
import SearchBar from "./utils/components/searchBar";
import FilterBar from "./utils/components/filterBar";
import LoginRegister from "./utils/components/LoginRegister";
import { useState } from "react";
//import { Recipe } from "../stores/types";


export default function Home() {
  const [selecredFilter, setSelectedFilter] = useState(null)

  //API call to get all the data
  // const filteredSearch = Recipe.filter((recipe: { title: string; }) => {
  //   recipe.title.toLowerCase().indexOf(query.toLowerCase()) !== -1
  //} )

  //Search filter 
  //const [query,setQuery] = useState("")
  // const handleSearchChange = event => {
  //  setQuery(event.target.value)
  // }



  return (
    <>
        {/* Top navigation Bar */}
        <div>
          {/* Logo */}
          <div className="bg-[url('/assets/Logo.png')]" > <div/>
            <SearchBar />
            {/**/}
          </div>
          <FilterBar />
          <br></br>
          <LoginRegister />
        </div>
      </>
      )
}
