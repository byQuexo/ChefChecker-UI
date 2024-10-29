import SearchBar from "./utils/components/searchBar";
import FilterBar from "./utils/components/filterBar";
import LoginRegister from "./utils/components/LoginRegister";

export default function Home() {
  return (
    <>
    <div className="grid grid-rows-[10px_1fr_0px] items-top justify-items-center min-h-screen p-8 pb-20 sm:p-20">
      <h1> Chef Checker</h1>
      <SearchBar/>
      {/* <FilterBar/> */}
      {/* <LoginRegister />*/}
    </div>
    </>
    
  );
}
