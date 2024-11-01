'use client'
import SearchBar from "./utils/components/searchBar";
import FilterBar from "./utils/components/filterBar";
import LoginRegister from "./utils/components/LoginRegister";

export default function Home() {
  return (
    <>
    <div>
      <h1> Chef Checker </h1>
      <SearchBar/>
      <FilterBar/>
      {/*comment <LoginRegister/> */}
    </div>
    </>
  )
}
