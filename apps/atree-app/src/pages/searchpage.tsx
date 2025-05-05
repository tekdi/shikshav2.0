'use client';

import {
  Box,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import atreeLogo from '../../assets/images/placeholder.jpg';
import Layout from '../component/layout/layout';
import dynamic from 'next/dynamic';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ContentSearchResponse } from '@shared-lib';
import FooterText from '../component/FooterText';

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});

export default function Searchpage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedType = searchParams.get('type')?.toLowerCase();
  // Get type from URL
  const selectedquery = searchParams.get('query')?.toLowerCase();
  const tags = searchParams.get('tags');
  const [framework, setFramework] = useState(selectedType || ''); // Default to selectedType if available
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  React.useEffect(() => {
    if (selectedType && selectedType !== framework) {
      console.log('Updating framework to:', selectedType); // Debugging

      setFramework(selectedType);
    }
  }, [selectedType]);

  return (
    <Layout
      isFooter={isMobile} // add this when on mobile
      footerComponent={!isMobile ? <FooterText page="" /> : undefined}
    >
      <Box
        display="flex"
        flexDirection="column"
        gap="1rem"
        py="1rem"
        px="14px"
        sx={{ width: 'fit-content', marginTop: '1rem' }}
      >
        <IconButton
          onClick={(e) => {
            e.stopPropagation(); // prevent bubbling to parent
            router.back();
          }}
          sx={{
            width: 'fit-content',
            height: 'fit-content',
            padding: '4px',
            alignSelf: 'flex-start',
            backgroundColor: 'transparent',
            borderRadius: '50%',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.04)', // Optional: subtle feedback
            },
            '&:focus': {
              outline: 'none',
            },
          }}
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
        </Grid>

        <Box
          sx={{
            width: '100%',
            gap: '16px',
            display: 'flex',
            flexDirection: 'column',
            marginTop: isMobile ? '-90px' : '-127px',
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
