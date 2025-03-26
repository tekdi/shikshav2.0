// pages/content-details/[identifier].tsx

'use client';
import React, { useEffect, useState } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import { Layout } from '@shared-lib';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useRouter } from 'next/router';
import { fetchContent } from '../../services/Read';
import AppConst from '../../utils/AppConst/AppConst';
import Image from 'next/image';

interface ContentDetailsObject {
  name: string;
  [key: string]: any;
}

const ContentDetails = () => {
  const router = useRouter();
  const { identifier } = router.query;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [contentDetails, setContentDetails] =
    useState<ContentDetailsObject | null>(null);
  const theme = useTheme();
  const handleBackClick = () => {
    router.back(); // Navigate to the previous page
  };
  const handleAccountClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log('Account clicked');
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    router.push(`${process.env.NEXT_PUBLIC_LOGIN}`);
  };

  const handleMenuClick = () => {
    console.log('Menu icon clicked');
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
  const handleLogout = () => {
    setAnchorEl(null);
    localStorage.removeItem('accToken');
    localStorage.removeItem('refToken');
    const LOGIN = process.env.NEXT_PUBLIC_LOGIN;
    //@ts-ignore
    window.location.href = LOGIN;
  };
  return (
    <Layout
      showTopAppBar={{
        title: 'Shiksha',
        showMenuIcon: true,

        menuIconClick: handleMenuClick,
        actionButtonLabel: 'Action',
        profileIcon: [
          {
            icon: <AccountCircleIcon />,
            ariaLabel: 'Account',
            onLogoutClick: (e: any) => handleAccountClick(e),
            anchorEl: anchorEl,
          },
        ],
        actionIcons: [
          {
            icon: <AccountCircleIcon />,
            ariaLabel: 'Profile',
            onOptionClick: handleClose,
          },
          {
            icon: <DashboardIcon />,
            ariaLabel: 'Admin dashboard',
            onOptionClick: handleClose,
          },
          {
            icon: <BorderColorIcon />,
            ariaLabel: 'Workspace',
            onOptionClick: handleClose,
          },
          {
            icon: <HelpOutlineIcon />,
            ariaLabel: 'Help',
            onOptionClick: handleClose,
          },
          {
            icon: <LogoutIcon />,
            ariaLabel: 'Logout',
            onOptionClick: handleLogout,
          },
        ],
        onMenuClose: handleClose,
      }}
      showBack={true}
      backTitle="Course Details"
      backIconClick={handleBackClick}
      isFooter={false}
      showLogo={true}
      sx={{ height: '0vh' }}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }} sx={{ textAlign: 'center' }}>
          <Typography fontSize={'22px'} fontWeight={400}>
            {contentDetails?.name}
          </Typography>
          <Box
            sx={{
              margin: 'auto',
              textAlign: 'center',
              width: { xs: '100%', sm: '100%', md: '500px', lg: '500px' },
              // height: { xs: 'auto', md: 'auto', lg: '100vh' },
            }}
          >
            <Image
              src={
                contentDetails?.posterImage &&
                contentDetails?.posterImage !== 'undefined'
                  ? contentDetails?.posterImage
                  : `${AppConst.BASEPATH}/assests/images/default_hori.png`
              }
              alt="Course Thumbnail"
              style={{
                width: '80%',
                borderRadius: '8px',
                marginBottom: '16px',
              }}
              width={'100'}
              height={'100'}
              layout="responsive"
              objectFit="contain"
            />
          </Box>
        </Grid>
      </Grid>

      {/* Section Header */}
      <Grid sx={{ p: '16px' }} size={{ xs: 12 }}>
        <Typography fontSize={'22px'} fontWeight={400}>
          Description
        </Typography>
        <Typography fontSize={'14px'} fontWeight={400}>
          {contentDetails?.description
            ? contentDetails.description
            : 'No description available'}
        </Typography>
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{ p: '16px' }}
        size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4 }}
      >
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4 }}>
          <Typography fontSize={'22px'} fontWeight={400}>
            Language
          </Typography>
          <Typography fontSize={'14px'} fontWeight={400}>
            {contentDetails?.language?.join(', ') || 'No language available'}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4 }}>
          <Typography fontSize={'22px'} fontWeight={400}>
            Author
          </Typography>
          <Typography fontSize={'14px'} fontWeight={400}>
            {contentDetails?.author || 'No author available'}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4 }}>
          <Typography fontSize={'22px'} fontWeight={400}>
            License
          </Typography>
          <Typography fontSize={'14px'} fontWeight={400}>
            {contentDetails?.license || 'No license available'}
          </Typography>
        </Grid>

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
                key={tag}
                variant="contained"
                sx={{
                  bgcolor: '#49454F1F',
                  color: '#1D1B20',
                  margin: '3px',
                  fontSize: '12px',
                  backgroundColor: '#E9E9EA',
                  borderRadius: '5px',
                  boxShadow: 'none',
                  textTransform: 'none',
                }}
              >
                {tag}
              </Button>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Divider sx={{ borderWidth: '1px', width: '100%', marginTop: '16px' }} />
      <Grid container justifyContent="center" sx={{ marginBottom: '16px' }}>
        <Button
          variant="contained"
          sx={{
            // bgcolor: '#6750A4',

            bgcolor: theme.palette.primary.main,
            color: theme.palette.text.secondary,
            margin: '12px',
            borderRadius: '100px',
            textTransform: 'none',
            boxShadow: 'none',
          }}
          onClick={() => router.push(`/details/${identifier}`)}
        >
          Join Now/Start Course
        </Button>
      </Grid>
    </Layout>
  );
};

export default ContentDetails;
