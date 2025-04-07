import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  InputBase,
  Box,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router';
import { ContentSearch } from '@shared-lib';

interface SearchTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: string) => void;
}

const searchTypes = [
  { type: 'author', label: 'Author', icon: 'A' },
  { type: 'publisher', label: 'Publisher', icon: 'P' },
  { type: 'language', label: 'Language', icon: 'L' },
];

const SearchTypeModal: React.FC<SearchTypeModalProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const router = useRouter();

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchQuery('');
    setSearchType(''); // Clear results when clearing input
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      try {
        const filters: {
          type?: string;
          channel: string;
          query?: string;
          filters?: object;
          limit?: number;
          offset?: number;
        } = {
          channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
          query: query,
        };

        if (searchType) {
          filters.filters = { [searchType]: query }; // Add searchType as a filter
        }

        const data = await ContentSearch(filters);
        setSearchResults(data?.result?.content || []); // Store search results
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]);
      setSearchQuery('');
      setSearchType('');
    }
  };

  // Filter search types
  const filteredSearchTypes = searchTypes.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Handle Enter Key Press
  const navigateToSearchPage = () => {
    if (searchQuery.trim()) {
      const url = searchType
        ? `/searchpage?type=${searchType}&query=${searchQuery}`
        : `/searchpage?query=${searchQuery}`;

      router.push(url);
      onClose();
    }
  };

  // Handle Enter Key Press
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      navigateToSearchPage();
    }
  };

  // Handle Search Button Click
  const handleSearch = () => {
    navigateToSearchPage();
  };
  useEffect(() => {
    console.log('Updated Search Query:', searchQuery);
  }, [searchQuery, selectedType]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: '28px', backgroundColor: '#E9E7EF' },
      }}
    >
      <DialogTitle>
        <Box
          display="flex"
          alignItems="center"
          sx={{ borderBottom: '1px solid #ccc', pb: 1 }}
        >
          {/* Back Button */}
          <IconButton onClick={handleClearSearch} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>

          {/* Search Input */}
          <InputBase
            autoFocus
            placeholder="Search by..."
            value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
            onChange={handleChange}
            onKeyDown={handleKeyPress} // Detect Enter key press
            sx={{
              flex: 1,
              width: '100%',
            }}
          />

          <IconButton onClick={onClose} sx={{ ml: 1 }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <List>
        {/* Static Search Type List */}
        {filteredSearchTypes.map((item) => (
          <ListItem
            key={item.type}
            onClick={() => {
              setSelectedType(item.type);
              setSearchType(item.type);
            }}
            sx={{
              cursor: selectedType === item.type ? 'not-allowed' : 'pointer',
              backgroundColor:
                selectedType === item.type ? '#FFBD0D' : 'transparent',
              opacity: selectedType === item.type ? 1 : 0.6,
              borderRadius: '8px',

              pointerEvents: selectedType === item.type ? 'none' : 'auto',
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ backgroundColor: '#CEE5FF', color: '#06164B' }}>
                {item.icon}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`Search By ${item.label}`}
              secondary="Find content by this category"
              primaryTypographyProps={{ fontWeight: 'bold' }}
              secondaryTypographyProps={{ color: 'text.secondary' }}
            />
          </ListItem>
        ))}

        {/* API Search Results */}
        {searchResults.length > 0
          ? searchResults.map((item) => (
              <ListItem
                key={item.name}
                sx={{ cursor: 'pointer' }}
                onClick={handleSearch}
              >
                <ListItemAvatar>
                  <Avatar sx={{ backgroundColor: '#CEE5FF', color: '#06164B' }}>
                    {item.name ? item.name.charAt(0).toUpperCase() : 'S'}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.name} />
              </ListItem>
            ))
          : searchQuery &&
            filteredSearchTypes.length === 0 && (
              <ListItem>
                <ListItemText primary="No results found" />
              </ListItem>
            )}
      </List>
    </Dialog>
  );
};

export default SearchTypeModal;
