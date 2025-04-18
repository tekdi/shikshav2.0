import Box from '@mui/material/Box';
import React, { memo } from 'react';
import { ReactNode } from 'react';
import Image from 'next/image';
import loaderGif from '../../assets/images/snail-yellow.gif';
import { Typography, useTheme, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
interface LoaderProps {
  isLoading: boolean;
  layoutHeight?: number;
  children: ReactNode;
}

export const Loader: React.FC<LoaderProps> = memo(
  ({ isLoading, layoutHeight, children }) => {
    const router = useRouter();
    const noHeightRoutesMobile = [
      '/',
      // '/aboutus',
      // '/termsandcondition',
      // '/home',
      // '/contents',
      // '/searchpage',
      // '/quick-access/contents/[category]',
      // '/contents/[identifier]',
    ];
    const noHeightRoutes = [
      '/',
      '/aboutus',
      '/termsandcondition',
      '/home',
      '/contents',
      '/searchpage',
      '/quick-access/contents/[category]',
      '/contents/[identifier]',
    ];
    const noPaddingRoutes = ['/contents', '/quick-access/contents/[category]'];
    const paddingQuickAccess = [
      '/quick-access',
      '/quick-access/[category]',
      '/contents/[identifier]',
    ];
    const shouldUnsetHeightForMobile = noHeightRoutesMobile.includes(
      router.pathname
    );

    const shouldUnsetHeight = noHeightRoutes.includes(router.pathname);
    const shouldUnsetPadding = noPaddingRoutes.includes(router.pathname);
    const shouldAddPadding = paddingQuickAccess.includes(router.pathname);
    const shouldSkipPadding = router.asPath === '/searchpage';
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    let paddingTop = '96px';
    console.log('isMobile', isMobile && !shouldUnsetPadding);
    // if (shouldSkipPadding) {
    //   paddingTop = '96px';
    // } else if (shouldAddPadding && !isMobile) {
    //   paddingTop = '160px';
    // } else if (shouldUnsetPadding && !isMobile) {
    //   paddingTop = '54px';
    // } else if (isMobile && !shouldUnsetPadding) {
    //   paddingTop = '76px';
    // } else if (isMobile && shouldUnsetPadding) {
    //   paddingTop = '34px';
    // } else {
    //   paddingTop = '96px';
    // }
    if (isMobile) {
      if (shouldSkipPadding) {
        paddingTop = '96px';
      } else if (shouldUnsetPadding) {
        paddingTop = '34px';
      } else if (shouldUnsetHeight) {
        paddingTop = '64px';
      } else if (shouldAddPadding) {
        paddingTop = '130px';
      } else {
        paddingTop = '76px';
      }
    } else {
      if (shouldSkipPadding) {
        paddingTop = '96px';
      } else if (shouldAddPadding) {
        paddingTop = '160px';
      } else if (shouldUnsetPadding) {
        paddingTop = '54px';
      }
    }

    return (
      <Box>
        {isLoading && (
          <Box
            sx={{
              width: '100%',
              height: `calc(100vh - ${layoutHeight || 0}px)`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              zIndex: 9999,
              backgroundColor: 'white',
            }}
          >
            <Image src={loaderGif} alt="Loading..." />
            <Typography
              variant="body1"
              color="textSecondary"
              fontSize={'1.5rem'}
              sx={{
                position: 'absolute',
                top: { xs: '400px', md: '550px' }, // Responsive positioning
                zIndex: 1,
                bgcolor: 'rgba(255, 255, 255, 0.5)', // Optional: Background for readability
                px: 1, // Padding for visibility
              }}
            >
              Loading...
            </Typography>
          </Box>
        )}
        <Box
          style={{
            width: '100%',
            overflowY: 'auto',
            display: isLoading ? 'none' : 'block',
            height:
              shouldUnsetHeight && !isMobile
                ? 'auto'
                : `calc(100vh - ${layoutHeight}px)`,
            paddingTop: paddingTop,
          }}
        >
          {children}
        </Box>
      </Box>
    );
  }
);
