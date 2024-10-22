'use client'
import React, {useState} from  'react';
import FilterBar from "./utils/components/filterBar";
import SearchBar from "./utils/components/searchBar";

export default function Home() {
  const [filterCategory, setFilteredCategory] = useState('')

  const handleFilterChange = (category: string) => {
    setFilteredCategory(category);
    //show results of the filtered category using the gallery
  };

  return (
    <div>
      <h1>Main Page</h1>
      <SearchBar/>
      <FilterBar onFilterChange={handleFilterChange}/>

    </div>
  );
}
