'use client';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const buttonColors: Record<string, string> = {
  water: '#0E28AE',
  land: '#8F4A50',
  forest: '#148A00',
  'climate change': '#CF3D03',
  'activity books': '#23005A',
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
  const [selectedFramework, setSelectedFramework] = useState<string>('');
  useEffect(() => {
    // Get stored category from localStorage
    if (window.location.pathname === '/') {
      localStorage.removeItem('category');
    }
    const storedCategory = localStorage.getItem('category');
    localStorage.removeItem('selectedFilters');
    if (storedCategory) {
      setSelectedFramework(storedCategory);
    }
  }, []);
  const handleItemClick = (item: { identifier: string; name: string }) => {
    setFramework(item.identifier);
    setSelectedFramework(item.name);
    localStorage.removeItem('selectedFilters');
    localStorage.setItem('category', item.name);
    if (fromSubcategory) {
      localStorage.setItem('subcategory', item.name);
      router.push(`/contents`);
    } else {
      router.push(`/home?category=${encodeURIComponent(item.name)}`);
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
              position: 'absolute',
              top: '22px',
              left: '25%',
            }
          : {}
      }
    >
      {frameworkFilter.map(({ identifier, name }) => {
        const isSelected = selectedFramework === name;
        const lowerCaseName = name.toLowerCase();
        return (
          <Grid key={identifier}>
            <Button
              variant={isSelected ? 'contained' : 'outlined'}
              sx={{
                borderRadius: '8px',
                borderColor: isSelected ? undefined : '#CEE5FF',
                color: isSelected ? undefined : '#171D1E',
                backgroundColor: isSelected
                  ? buttonColors[lowerCaseName] || undefined
                  : '#E3E9EA',
              }}
              onClick={() => handleItemClick({ identifier, name })}
            >
              {name}
            </Button>
          </Grid>
        );
      })}
    </Grid>
  );
};
