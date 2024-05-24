import { useState } from "react";

const SearchBar = () => {
const [searchTerm, setSearchTerm] = useState('');

//TODO:Edit
const handleSearch = () => {
    onSearch(searchTerm);
};

return (
    <div>
    <div className="flex gap-2">
        <input
        type="text"
        className="input input-bordered w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        />
        <button onClick={handleSearch} className="btn btn-warning">
        Search
        </button>
    </div>
    <div className="mockup-browser border border-base-300">
        <div className="mockup-browser-toolbar">
        <div className="input border border-base-300">https://FitTrackr.com</div>
        </div>
    </div>
    </div>
  );
};

export default SearchBar;