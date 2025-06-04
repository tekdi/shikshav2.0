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
import { ContentSearchResponse, trackEvent } from '@shared-lib';
import FooterText from '../component/FooterText';
import { TelemetryEventType } from '../utils/app.constant';
import { telemetryFactory } from '../utils/telemetry';
import Footer from '../component/layout/Footer';

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});

export default function Searchpage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedType = searchParams.get('type')?.toLowerCase();
  // Get type from URL
  const selectedquery = searchParams.get('query')?.toLowerCase();
  const [framework, setFramework] = useState(selectedType || ''); // Default to selectedType if available
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  React.useEffect(() => {
    trackEvent({
      action: 'Search query',
      category: 'engagement',
      label: `${selectedquery}`,
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
        id: `Search query - ${selectedquery}`,
        type: TelemetryEventType.CLICK,
        subtype: '',
        pageid: cleanedUrl,
      },
    };
    telemetryFactory.interact(telemetryInteract);
    if (selectedType && selectedType !== framework) {
      console.log('Updating framework to:', selectedType); // Debugging

      setFramework(selectedType);
    }
  }, [selectedType]);

  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh', // Make sure the container takes at least full viewport height
        }}
      >
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          gap="1rem"
          paddingTop="2rem"
          // py={!isMobile ? '2rem' : '0rem'}
          // px="14px"
          sx={{ width: '100%' }}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            sx={{ width: '100%' }}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                router.push('/home');
              }}
              sx={{
                padding: '4px',
                backgroundColor: 'transparent',
                color: '#000000',
                borderRadius: '50%',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
                '&:focus': {
                  outline: 'none',
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            {selectedquery && (
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  fontFamily: 'Poppins',
                }}
              >
                Showing Results for{' '}
                <span
                  style={{
                    color: '#000000',
                    backgroundColor: '#fcd804',
                    padding: '5px',
                  }}
                >
                  {selectedquery}
                </span>
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: '100%',
              gap: '16px',
              display: 'flex',
              flexDirection: 'column',
              marginTop: isMobile ? '10px' : '55px',
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
          <Box sx={{ width: '100%' }}>
            {!isMobile ? <FooterText page="" /> : <Footer />}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
