import React, { useState } from 'react';
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
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  // Filter the search types based on user input
  const filteredSearchTypes = searchTypes.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: '28px', backgroundColor: '#E9E7EF' }, // Apply border radius here
      }}
    >
      <DialogTitle>
        <Box
          display="flex"
          alignItems="center"
          sx={{ borderBottom: '1px solid #ccc', pb: 1 }}
        >
          {/* Back Button */}
          <IconButton onClick={onClose} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>

          {/* Search Input */}
          <InputBase
            placeholder="Search by..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flex: 1,
              width: '100%', // Ensure full width
            }}
          />
          {searchQuery && (
            <IconButton onClick={handleClearSearch} sx={{ ml: 1 }}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      <List>
        {filteredSearchTypes.length > 0 ? (
          filteredSearchTypes.map((item) => (
            <ListItem
              button
              key={item.type}
              onClick={() => onSelect(item.type)}
            >
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: '#CEE5FF', color: '#06164B' }}>
                  {item.icon}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`Search By ${item.label}`}
                secondary="Supporting line text lorem ipsum..."
                primaryTypographyProps={{ fontWeight: 'bold' }}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No results found" />
          </ListItem>
        )}
      </List>
    </Dialog>
  );
};

export default SearchTypeModal;
