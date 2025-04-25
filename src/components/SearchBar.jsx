const SearchBar = ({ setSearchQuery }) => {
  return (
    <input
      type="text"
      placeholder="Search doctor by name..."
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
};

export default SearchBar;
