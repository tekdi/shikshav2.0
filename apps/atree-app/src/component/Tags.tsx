'use client';
import { Button, Stack, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const buttonColors: Record<string, string> = {
  water: '#0E28AE',
  land: '#8F4A50',
  forest: '#148A00',
  'climate change': '#CF3D03',
  'activity books': '#B0049F',
  'reference books': '#FFBD0D',
  general: '#FFBD0D',
  potpourri: '#FFBD0D',
};

interface FrameworkFilterProps {
  frameworkFilter: Array<{ identifier: string; name: string }>;
  framework: string;
  fromSubcategory?: boolean;
  setFramework: (framework: string) => void;
}

export const FrameworkFilter = ({
  frameworkFilter,
  framework,
  fromSubcategory,
  setFramework,
}: FrameworkFilterProps) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedFramework, setSelectedFramework] = useState<string | null>(
    null
  );
  const syncCategoryFromStorage = () => {
    const storedCategory = localStorage.getItem('category')?.toLowerCase();
    setSelectedFramework(storedCategory ?? '');
  };
  useEffect(() => {
    syncCategoryFromStorage();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      syncCategoryFromStorage();
    }, 500); // Check every 500ms

    return () => clearInterval(interval); // Cleanup
  }, []);
  useEffect(() => {
    // Get stored category from localStorage
    if (window.location.pathname === '/') {
      localStorage.removeItem('category');
    }
    syncCategoryFromStorage();
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'category') {
        syncCategoryFromStorage();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  useEffect(() => {
    console.log('Selected Framework:', selectedFramework);
  }, [selectedFramework]);
  const handleItemClick = (item: { identifier: string; name: string }) => {
    const selectedCategory = item.name.toLowerCase();
    setFramework(item.identifier);
    setSelectedFramework(selectedCategory);
    localStorage.removeItem('selectedFilters');
    localStorage.removeItem('language');
    localStorage.removeItem('access');

    localStorage.setItem('category', selectedCategory);
    if (fromSubcategory) {
      localStorage.setItem('subcategory', selectedCategory);
      router.push(`/contents`);
    } else {
      router.push(`/home?category=${encodeURIComponent(selectedCategory)}`);
    }
  };

  return (
    <Grid
      container
      spacing={1}
      justifyContent="center"
      sx={
        !isMobile
          ? {
              position: 'relative',
              left: '38%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '100px',
              marginTop: { md: '1px' },
            }
          : {
              display: 'flex',
              flexDirection: 'row', // Explicit row direction
              flexWrap: 'nowrap', // Prevent wrapping
              gap: 1, // Space between items
              overflowX: 'auto', // Horizontal scroll if needed
            }
      }
    >
      <Stack direction="row" spacing={3}>
        {frameworkFilter.map(({ identifier, name }) => {
          const isSelected = selectedFramework === name.toLowerCase();
          const lowerCaseName = name.toLowerCase();
          const isPotpourri = lowerCaseName === 'potpourri';

          return (
            <Button
              key={identifier}
              variant="text"
              disableRipple
              sx={{
                padding: 0,
                minWidth: 'auto',
                fontFamily: 'sans-serif',
                fontWeight: isSelected ? 'bold' : 500,
                textTransform: 'none',
                fontSize: '16px',
                color: isSelected ? 'black' : 'gray',
                backgroundColor: 'transparent',
                border: 'none',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
              onClick={() => handleItemClick({ identifier, name })}
            >
              {name}
            </Button>
          );
        })}
      </Stack>
    </Grid>
  );
};
