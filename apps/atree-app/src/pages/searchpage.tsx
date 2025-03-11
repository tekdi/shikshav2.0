'use client';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import atreeLogo from '../../assets/images/atreeLogo.png';
import Layout from '../component/layout/layout';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});

const buttonColors = {
  water: '#0E28AE',
  land: '#8F4A50',
  forest: '#148A00',
  'climate change': '#CF3D03',
  'activity books': '#23005A',
  'reference books': '#FFBD0D',
  general: '#FFBD0D',
};

export default function Searchpage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedType = searchParams.get('type')?.toLowerCase();
  // Get type from URL
  const selectedquery = searchParams.get('query')?.toLowerCase();
  const [framework, setFramework] = useState(selectedType || ''); // Default to selectedType if available

  const handleItemClick = (to: string) => {
    router.push(to);
  };

  return (
    <Layout onItemClick={handleItemClick}>
      <Box display="flex" flexDirection="column" gap="3rem" py="3rem" px="14px">
        {selectedType && (
          <FrameworkFilter framework={framework} setFramework={setFramework} />
        )}

        <Box
          sx={{
            width: '100%',
            gap: '16px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Content
            {...{
              _grid: {
                size: { xs: 6, sm: 6, md: 4, lg: 3 },
              },
              contentTabs: ['content'],
              filters: {
                filters: {
                  channel: process.env.NEXT_PUBLIC_CHANNEL_ID,

                  // query: selectedquery,
                  query: `${selectedquery}`,
                },
              },
              _card: {
                cardName: 'AtreeCard',
                image: atreeLogo.src,
              },
              showSearch: false,
              showFilter: false,
            }}
          />
        </Box>
      </Box>
    </Layout>
  );
}

const FrameworkFilter = React.memo<{
  framework: string;
  setFramework: (framework: string) => void;
}>(function FrameworkFilter({ framework, setFramework }) {
  const searchParams = useSearchParams();
  const selectedType = searchParams.get('type')?.toLowerCase();
  const queryFromUrl = searchParams.get('query');
  const router = useRouter();
  React.useEffect(() => {
    if (selectedType) {
      setFramework(selectedType);
    }
  }, [selectedType]);
  const handleFrameworkClick = (frameworkItem: string) => {
    // Keep the existing query when updating type
    const newQuery = queryFromUrl
      ? `?type=${frameworkItem}&query=${queryFromUrl}`
      : `?type=${frameworkItem}`;
    router.push(newQuery, { scroll: false }); // Update URL without refreshing
  };

  return (
    <Grid container spacing={3} justifyContent={'center'}>
      {queryFromUrl && (
        <Grid item xs={12}>
          <Typography sx={{ fontWeight: 700, mb: 2 }}>
            Showing Results for{' '}
            <span style={{ color: '#FFBD0D' }}>{queryFromUrl}</span>
          </Typography>
        </Grid>
      )}
      {['Author', 'Publisher', 'Language'].map((frameworkItem) => {
        const isSelected =
          frameworkItem.toLowerCase() === framework ||
          frameworkItem.toLowerCase() === selectedType;

        return (
          <Grid key={frameworkItem}>
            <Button
              variant={isSelected ? 'contained' : 'outlined'}
              sx={{
                borderRadius: '8px',
                borderColor: isSelected ? '' : '#CEE5FF',
                color: isSelected ? '#4D4639' : '#171D1E',
                margin: '8px',
                backgroundColor: isSelected
                  ? buttonColors[
                      frameworkItem.toLowerCase() as keyof typeof buttonColors
                    ] || '#FFD500'
                  : '',
              }}
              onClick={() => setFramework(frameworkItem.toLowerCase())}
            >
              {frameworkItem}
            </Button>
            <Content
              {...{
                _grid: {
                  size: { xs: 6, sm: 6, md: 4, lg: 3 },
                },
                contentTabs: ['content'],
                filters: {
                  filters: {
                    channel: process.env.NEXT_PUBLIC_CHANNEL_ID,
                    query: `${queryFromUrl}`,
                  },
                },
                _card: {
                  cardName: 'AtreeCard',
                  image: atreeLogo.src,
                },
                showSearch: false,
                showFilter: false,
              }}
            />
          </Grid>
        );
      })}
    </Grid>
  );
});
