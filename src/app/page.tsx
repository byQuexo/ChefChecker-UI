import SearchBar from "./utils/components/searchBar";
import FilterBar from "./utils/components/filterBar";

export default function Home() {
  return (
    <>
      <div className=" items-top justify-items-center min-h-screen p-2">
        <h1> Chef Checker</h1>
        <SearchBar /> 
        <FilterBar />
      </div>
    </>

  );
}