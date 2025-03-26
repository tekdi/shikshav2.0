import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';
import { Layout } from '@shared-lib';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Grid from '@mui/material/Grid2';
import CommonCollapse from '../../components/CommonCollapse'; // Adjust the import based on your folder structure
import { hierarchyAPI } from '../../services/Hierarchy';
import { trackingData } from '../../services/TrackingService';

interface DetailsProps {
  details: any;
}

export default function Details({ details }: DetailsProps) {
  const router = useRouter();
  const { identifier } = router.query; // Fetch the 'id' from the URL
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [trackData, setTrackData] = useState([]);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleAccountClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    router.push(`${process.env.NEXT_PUBLIC_LOGIN}`);
  };

  const handleMenuClick = () => {
    console.log('Menu icon clicked');
  };

  const handleLogout = () => {
    setAnchorEl(null);
    localStorage.removeItem('accToken');
    localStorage.removeItem('refToken');
    let LOGIN = process.env.NEXT_PUBLIC_LOGIN;
    //@ts-ignore
    window.location.href = LOGIN;
  };
  useEffect(() => {
    const getDetails = async (identifier: string) => {
      try {
        const result = await hierarchyAPI(identifier);
        //@ts-ignore
        setSelectedContent(result);
        setLoading(false);
        try {
          const courseList = result?.childNodes ?? []; // Extract all identifiers
          const userId = localStorage.getItem('subId');
          const userIdArray = userId?.split(',');
          if (!userId || !courseList.length) return; // Ensure required values exist
          //@ts-ignore
          const course_track_data = await trackingData(userIdArray, courseList);
          if (course_track_data?.data) {
            //@ts-ignore
            const userTrackData =
              course_track_data.data.find(
                (course: any) => course.userId === userId
              )?.course || [];
            setTrackData(userTrackData);
          }
        } catch (error) {
          console.error('Error fetching track data:', error);
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
      }
    };
    if (identifier) getDetails(identifier as string);
  }, [identifier]);

  const renderNestedChildren = (children: any) => {
    if (!Array.isArray(children)) {
      return null;
    }
    return children?.map((item: any) => (
      <CommonCollapse
        key={item.id}
        identifier={item.identifier as string}
        title={item.name}
        data={item?.children}
        TrackData={trackData}
      />
    ));
  };
  const onBackClick = () => {
    router.back();
  };
  return (
    <Layout
      isLoadingChildren={loading}
      showTopAppBar={{
        title: 'Shiksha',
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
      isFooter={false}
      showLogo={true}
      showBack={true}
      backTitle="Course Details "
      backIconClick={onBackClick}
      sx={{ height: '0vh' }}
    >
      <Box sx={{ p: '8px' }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="h6"
              sx={{ marginTop: '60px', fontWeight: 'bold' }}
            >
              {selectedContent?.name}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            {selectedContent?.children?.length > 0 &&
              renderNestedChildren(selectedContent.children)}
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
