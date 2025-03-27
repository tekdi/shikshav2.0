'use client';

import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import atreeLogo from '../../assets/images/placeholder.jpg';
import Layout from '../component/layout/layout';
import dynamic from 'next/dynamic';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ContentSearchResponse } from '@shared-lib';

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
  console.log(selectedType, selectedquery);
  React.useEffect(() => {
    if (selectedType && selectedType !== framework) {
      console.log('Updating framework to:', selectedType); // Debugging

      setFramework(selectedType);
    }
  }, [selectedType]);

  return (
    <Layout>
      <Box display="flex" flexDirection="column" gap="1rem" py="1rem" px="14px">
        <IconButton
          onClick={() => router.back()}
          sx={{ justifyContent: 'flex-start', padding: '0px' }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Grid container spacing={3} justifyContent={'center'}>
          {selectedquery && (
            <Grid item xs={12}>
              <Typography sx={{ fontWeight: 700, mb: 2 }}>
                Showing Results for{' '}
                <span style={{ color: '#FFBD0D' }}>{selectedquery}</span>
              </Typography>
            </Grid>
          )}
          {['Author', 'Publisher', 'Language'].map((frameworkItem) => {
            const isSelected = frameworkItem.toLowerCase() === selectedType;
            return (
              <Grid key={frameworkItem}>
                <Button
                  variant={isSelected ? 'contained' : 'outlined'}
                  sx={{
                    borderRadius: '8px',
                    borderColor: isSelected ? '' : '#CEE5FF',
                    color: isSelected ? '#4D4639' : '#171D1E',
                    margin: '10px',
                    backgroundColor: isSelected
                      ? buttonColors[
                          frameworkItem.toLowerCase() as keyof typeof buttonColors
                        ] || '#FFD500'
                      : '',
                  }}
                  // onClick={() => handleFrameworkClick(frameworkItem)}
                >
                  {frameworkItem.charAt(0).toUpperCase() +
                    frameworkItem.slice(1)}
                </Button>
              </Grid>
            );
          })}
        </Grid>

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
              handleCardClick: (content: ContentSearchResponse) => {
                router.push(`/contents/${content?.identifier}`);
              },
              contentTabs: ['content'],
              filters: {
                filters: {
                  channel: process.env.NEXT_PUBLIC_CHANNEL_ID,
                  ...(selectedType
                    ? { [selectedType]: selectedquery }
                    : { query: selectedquery }),
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
