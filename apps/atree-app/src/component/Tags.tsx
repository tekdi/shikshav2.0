'use client';

import { Button, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useRouter } from 'next/navigation';
import React from 'react';

const buttonColors = {
  water: '#0E28AE',
  land: '#8F4A50',
  forest: '#148A00',
  'climate change': '#CF3D03',
  'activity books': '#23005A',
  'reference books': '#FFBD0D',
  general: '#FFBD0D',
};
export const FrameworkFilter = React.memo<{
  frameworkFilter: Array<{ identifier: string; name: string }>;
  framework: string;
  fromSubcategory?: boolean;
  setFramework: (framework: string) => void;
}>(function FrameworkFilter({ frameworkFilter, framework, fromSubcategory }) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const handleItemClick = (item: any) => {
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
      display="flex"
      justifyContent="center"
      sx={{
        ...(isMobile
          ? {}
          : {
              position: 'absolute',
              top: '22px',
              left: '25%',
            }),
      }}
    >
      {frameworkFilter?.map((frameworkItem: any) => (
        <Grid key={frameworkItem.identifier}>
          <Button
            variant={
              framework === frameworkItem.identifier ? 'contained' : 'outlined'
            }
            sx={{
              borderRadius: '8px',
              borderColor:
                framework !== frameworkItem.identifier ? '#CEE5FF' : '',
              color: framework !== frameworkItem.identifier ? '#171D1E' : '',
              backgroundColor:
                framework === frameworkItem.identifier
                  ? frameworkItem?.name?.toLowerCase() in buttonColors
                    ? buttonColors[
                        frameworkItem?.name?.toLowerCase() as keyof typeof buttonColors
                      ]
                    : ''
                  : '#E3E9EA',
            }}
            onClick={() => handleItemClick(frameworkItem)}
          >
            {frameworkItem.name}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
});
