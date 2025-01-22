// pages/content-details/[identifier].tsx

'use client';
import React, { useEffect, useState } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import { Layout } from '@shared-lib';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Grid from '@mui/material/Grid2';

import { useRouter } from 'next/router';
import { fetchContent } from '../../services/Read';
import PlayerPage from '../player/[identifier]';

interface ContentDetailsObject {
  name: string;
  [key: string]: any;
}

const ContentDetails = () => {
  const router = useRouter();
  const { identifier } = router.query;
  const [searchValue, setSearchValue] = useState('');
  const [contentDetails, setContentDetails] =
    useState<ContentDetailsObject | null>(null);
  const handleBackClick = () => {
    router.back(); // Navigate to the previous page
  };
  const handleAccountClick = () => {
    console.log('Account clicked');
  };

  const handleMenuClick = () => {
    console.log('Menu icon clicked');
  };

  const handleSearchClick = () => {
    console.log('Search button clicked');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const fetchContentDetails = async () => {
    try {
      if (identifier) {
        const result = await fetchContent(identifier as string);
        setContentDetails(result);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    }
  };

  useEffect(() => {
    if (identifier) {
      fetchContentDetails();
    }
  }, [identifier]);

  if (!identifier) {
    return <Typography>Loading...</Typography>; // Show loading state while identifier is undefined
  }
  return (
    <Layout
      showTopAppBar={{
        title: 'Shiksha',
        showMenuIcon: true,

        menuIconClick: handleMenuClick,
        actionButtonLabel: 'Action',
        actionIcons: [
          {
            icon: <AccountCircleIcon />,
            ariaLabel: 'Account',
            onClick: handleAccountClick,
          },
        ],
      }}
      showBack={true}
      backTitle="Course Details"
      backIconClick={handleBackClick}
      isFooter={false}
      showLogo={true}
      sx={{ height: '0vh' }}
    >
      <Grid container spacing={2} sx={{ marginTop: '120px' }}>
        <Grid size={{ xs: 12 }} sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              margin: 'auto',
              textAlign: 'center',
            }}
          >
            <Typography fontSize={'22px'} fontWeight={400}>
              {contentDetails?.name}
            </Typography>
            <img
              src={contentDetails?.posterImage || '/default-thumbnail.jpg'}
              alt="Course Thumbnail"
              style={{
                width: '100%',
                borderRadius: '8px',
                marginBottom: '16px',
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Section Header */}
      <Grid container spacing={2} sx={{ marginBottom: '16px' }}>
        <Grid size={{ xs: 12 }}>
          <Typography fontSize={'22px'} fontWeight={400}>
            Description
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography fontSize={'14px'} fontWeight={400}>
            {contentDetails?.description
              ? contentDetails.description
              : 'No description available'}
          </Typography>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography fontSize={'22px'} fontWeight={400}>
              Tags
            </Typography>
            <Grid size={{ xs: 12 }}>
              {contentDetails?.keywords?.map((tag: string) => (
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#49454F1F',
                    color: '#1D1B20',
                    margin: '6px',
                  }}
                >
                  {tag}
                </Button>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider sx={{ marginY: '24px' }} />
      <Button
        variant="contained"
        sx={{
          bgcolor: '#6750A4',
          color: '#FFFFFF',
          margin: '12px',
          borderRadius: '100px',
        }}
        onClick={() => router.push(`/details/${identifier}`)}
      >
        Join Now/Start Course
      </Button>
    </Layout>
  );
};

export default ContentDetails;
