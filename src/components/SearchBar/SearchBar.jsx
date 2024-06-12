import { useState } from "react";
import PropTypes from "prop-types";

/**
 * @param {{onSearch: (term: string) => void}} props
 */
const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          className="input input-bordered w-full"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search..."
        />
        <button onClick={handleSearch} className="btn btn-warning">
        Search
        </button>
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired
};

export default SearchBar;