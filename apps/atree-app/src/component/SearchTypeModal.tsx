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
import { ContentSearch, trackEvent } from '@shared-lib';
import { TelemetryEventType } from '../utils/app.constant';
import { telemetryFactory } from '../utils/telemetry';
import { useAppTranslation } from '../utils/i18n.helper';
import { LANGUAGE_KEYS } from '../utils/language.constants';

interface SearchTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: string) => void;
  filterData?: {
    authors: string[];
    publishers: string[];
    languages: string[];
  };
}

const SearchTypeModal: React.FC<SearchTypeModalProps> = ({
  open,
  onClose,
  onSelect,
  filterData = { authors: [], publishers: [], languages: [] },
}) => {
  const { t, ready } = useAppTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<
    'author' | 'publisher' | 'language' | null
  >(null);
  const [filteredResults, setFilteredResults] = useState<string[]>([]);

  const searchTypes: any[] = ready
    ? [
        { type: 'author', label: t(LANGUAGE_KEYS.SEARCH_BY_AUTHOR) },
        { type: 'publisher', label: t(LANGUAGE_KEYS.SEARCH_BY_PUBLISHER) },
        { type: 'language', label: t(LANGUAGE_KEYS.SEARCH_BY_LANGUAGE) },
      ]
    : [
        { type: 'author', label: 'Search By Author' },
        { type: 'publisher', label: 'Search By Publisher' },
        { type: 'language', label: 'Search By Language' },
      ];
  const [searchType, setSearchType] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const router = useRouter();

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setFilteredResults([]);
    // Don't reset selectedType and activeFilter - keep the button selected
    // setSearchType('');
    // setActiveFilter(null);
    // setSelectedType(null);
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    trackEvent({
      action: 'Search by',
      category: 'engagement',
      label: `${query}`,
    });
    const windowUrl = window.location.pathname;
    const cleanedUrl = windowUrl.replace(/^\//, '');
    const env = cleanedUrl.split('/')[0];

    const telemetryInteract = {
      context: {
        env: env,
        cdata: [],
      },
      edata: {
        id: `Search by - ${query}`,
        type: TelemetryEventType.CLICK,
        subtype: '',
        pageid: cleanedUrl,
      },
    };
    telemetryFactory.interact(telemetryInteract);

    // If a filter is active, filter the local data
    if (activeFilter) {
      let dataArray: string[] = [];
      switch (activeFilter) {
        case 'author':
          dataArray = filterData.authors;
          break;
        case 'publisher':
          dataArray = filterData.publishers;
          break;
        case 'language':
          dataArray = filterData.languages;
          break;
      }

      if (query.trim()) {
        const filtered = dataArray.filter((item) =>
          item.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredResults(filtered);
      } else {
        // Don't show all items when query is empty - just clear results
        setFilteredResults([]);
      }
      return;
    }

    // Original search functionality for content
    if (query.trim()) {
      try {
        let filters: any = {
          channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
          contentType: { ne: 'Asset' },
        };
        if (searchType) {
          filters[searchType] = query;
        }
        const data = await ContentSearch({
          channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
          filters,
          query: !activeFilter ? query : undefined, // Add query parameter for default search
          offset: 0,
        });

        // For default search, filter results to only show content that starts with the query
        let filteredContent = data?.result?.content || [];
        if (!activeFilter && query.trim()) {
          filteredContent = filteredContent.filter(
            (item: any) =>
              item.name &&
              item.name.toLowerCase().startsWith(query.toLowerCase())
          );
        }

        setSearchResults(filteredContent);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]);
      setSearchQuery('');
      setSearchType('');
    }
  };

  const handleCategoryClick = async (category: string) => {
    // If clicking the same category that's already selected, deselect it
    if (selectedType === category) {
      setSelectedType(null);
      setSearchType('');
      setActiveFilter(null);
      setFilteredResults([]);
      return;
    }

    // Otherwise, select the new category
    setSelectedType(category);
    setSearchType(category);
    setActiveFilter(category as 'author' | 'publisher' | 'language');

    // Don't show any results immediately - only when user types
    setFilteredResults([]);
  };

  // Filter search types
  const filteredSearchTypes = searchTypes.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Enter Key Press
  const navigateToSearchPage = (queryValue: string) => {
    if (searchQuery.trim()) {
      let url = `/searchpage?query=${queryValue}`;
      if (selectedType) {
        url += `&type=${selectedType}`;
      }
      router.push(url);
      onClose();
    }
  };

  // Handle Enter Key Press
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      trackEvent({
        action: 'Search by',
        category: 'engagement',
        label: `${searchQuery}`,
      });
      const windowUrl = window.location.pathname;
      const cleanedUrl = windowUrl.replace(/^\//, '');
      const env = cleanedUrl.split('/')[0];

      const telemetryInteract = {
        context: {
          env: env,
          cdata: [],
        },
        edata: {
          id: `Search by - ${searchQuery}`,
          type: TelemetryEventType.CLICK,
          subtype: '',
          pageid: cleanedUrl,
        },
      };
      telemetryFactory.interact(telemetryInteract);
      navigateToSearchPage(searchQuery);
    }
  };

  // Handle Search Button Click
  const handleSearch = (queryValue: string) => {
    navigateToSearchPage(queryValue);
    setSearchResults([]);
    setSearchQuery('');
    setSearchType('');
  };

  // Handle filter item click
  const handleFilterItemClick = async (item: string) => {
    try {
      let filters: any = {
        channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
        contentType: { ne: 'Asset' },
      };

      // Set the filter based on active filter type
      if (activeFilter) {
        filters[activeFilter] = item;
      }

      const data = await ContentSearch({
        channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
        filters,
        offset: 0,
      });

      // Navigate to search page with the results
      let url = `/searchpage?query=${encodeURIComponent(item)}`;
      if (activeFilter) {
        url += `&type=${activeFilter}`;
      }
      router.push(url);
      onClose();
    } catch (error) {
      console.error('Error fetching content for filter item:', error);
    }
  };

  useEffect(() => {
    console.log('Updated Search Query:', searchQuery);
  }, [searchQuery, selectedType]);

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const key = `${part}-${i}`; // create a semi-unique key

      return regex.test(part) ? (
        <span key={key} style={{ color: '#0E28AE', fontWeight: 'bold' }}>
          {part}
        </span>
      ) : (
        <span key={key}>{part}</span>
      );
    });
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        setSearchQuery('');
        setSearchResults([]);
        setSearchType('');
        setActiveFilter(null);
        setFilteredResults([]);
        setSelectedType(null);
      }}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '28px',
          backgroundColor: '#E9E7EF',
          mt: { xs: -15, sm: 4 },
          maxHeight: '80vh',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
          },
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
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
            placeholder={ready ? t(LANGUAGE_KEYS.SEARCH_BY) : 'Search by...'}
            value={searchQuery}
            onChange={handleChange}
            onKeyDown={handleKeyPress} // Detect Enter key press
            sx={{
              flex: 1,
              width: '100%',
            }}
          />

          <IconButton
            onClick={() => {
              onClose();
              setSearchQuery('');
              setSearchResults([]);
              setSearchType('');
              setActiveFilter(null);
              setFilteredResults([]);
              setSelectedType(null);
            }}
            sx={{ ml: 1 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <List>
        {/* Filter Results */}
        {activeFilter &&
          filteredResults.length > 0 &&
          filteredResults.map((item) => (
            <ListItem
              key={item}
              sx={{ cursor: 'pointer' }}
              onClick={() => handleFilterItemClick(item)}
            >
              <ListItemText
                primary={<span>{highlightMatch(item, searchQuery)}</span>}
              />
            </ListItem>
          ))}

        {/* Static Search Type List - only show when no search query or no filter active */}
        {(!searchQuery.trim() || activeFilter) &&
          filteredSearchTypes.map((item) => (
            <ListItem
              key={item.type}
              sx={{
                backgroundColor:
                  selectedType === item.type ? '#FFBD0D' : 'transparent',
                opacity: selectedType === item.type ? 1 : 0.6,
                borderRadius: '8px',
                // Remove pointerEvents restriction so selected buttons can be clicked
              }}
            >
              <ListItemText
                primary={item.label}
                secondary={
                  ready
                    ? t(LANGUAGE_KEYS.FIND_CONTENT_BY_CATEGORY)
                    : 'Find content by this category'
                }
                primaryTypographyProps={{ fontWeight: 'bold' }}
                secondaryTypographyProps={{ color: 'text.secondary' }}
                sx={{ cursor: 'pointer' }}
                onClick={() => handleCategoryClick(item.type)}
              />
            </ListItem>
          ))}

        {/* API Search Results - show when no filter is active and there's a search query */}
        {!activeFilter && searchQuery.trim() && searchResults.length > 0
          ? searchResults.map((item) => {
              return (
                <ListItem
                  key={item.name}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleSearch(item.name)}
                >
                  <ListItemText
                    primary={
                      <span>{highlightMatch(item.name, searchQuery)}</span>
                    }
                  />
                </ListItem>
              );
            })
          : !activeFilter &&
            searchQuery.trim() &&
            searchResults.length === 0 && (
              <ListItem>
                <ListItemText
                  primary={
                    ready
                      ? t(LANGUAGE_KEYS.NO_RESULTS_FOUND)
                      : 'No results found'
                  }
                />
              </ListItem>
            )}

        {/* No results for filter */}
        {activeFilter && filteredResults.length === 0 && searchQuery.trim() && (
          <ListItem>
            <ListItemText
              primary={
                ready ? t(LANGUAGE_KEYS.NO_RESULTS_FOUND) : 'No results found'
              }
            />
          </ListItem>
        )}
      </List>
    </Dialog>
  );
};

export default SearchTypeModal;
