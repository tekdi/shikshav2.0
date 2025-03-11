import { useState } from 'react';
import { TextField, IconButton, Button, Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const SearchComponent = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('author');

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterSelect = (type: string) => {
    setSearchType(type);
    setAnchorEl(null);
  };

  const handleSearch = () => {
    console.log('Searching for:', query, 'by', searchType);
    // Call API here
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* Search Icon */}
      <IconButton onClick={handleSearchClick}>
        <SearchIcon />
      </IconButton>

      {/* Search Input */}
      {showSearch && (
        <TextField
          placeholder="Search..."
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}

      {/* Filter Button */}
      <Button
        variant="contained"
        onClick={handleFilterClick}
        startIcon={<FilterListIcon />}
      >
        {searchType.charAt(0).toUpperCase() + searchType.slice(1)}
      </Button>

      {/* Filter Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {['author', 'publisher', 'language'].map((type) => (
          <MenuItem key={type} onClick={() => handleFilterSelect(type)}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </MenuItem>
        ))}
      </Menu>

      {/* Search Button */}
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>
    </div>
  );
};

export default SearchComponent;
