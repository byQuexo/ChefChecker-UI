'use client'
import SearchBar from "./utils/components/searchBar";
import FilterBar from "./utils/components/filterBar";
import LoginRegister from "./utils/components/LoginRegister";

export default function Home() {
  return (
    <>
    <div>
      {/* Top navigation Bar */}
      <div className="flex justify-center">
      <img src={require("./utils/assets/Logo.png")} className="text-left" alt="ChefCheckerLogo" height="200" />
      <SearchBar/>
      {/**/}
      </div>
      <FilterBar/>
      {/*comment <LoginRegister/> */}
    </div>
    </>
  )
}
