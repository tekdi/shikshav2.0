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
    const noHeightRoutes = [
      '/aboutus',
      '/termsandcondition',
      '/contents',
      '/searchpage',
      '/quick-access/contents/[category]',
      '/contents/[identifier]',
      '/home',
      'home?category=*',
      '/',
    ];
    const noPaddingRoutes = ['/quick-access/contents/[category]'];
    const paddingQuickAccess = [
      '/quick-access',
      '/quick-access/[category]',
      '/contents/[identifier]',
    ];
    const contentPagePadding = ['/contents'];
    const paddingPlayer = ['/player/[identifier]'];
    const shouldUnsetHeight = noHeightRoutes.includes(router.pathname);
    const shouldUnsetPadding = noPaddingRoutes.includes(router.pathname);
    const shouldAddPadding = paddingQuickAccess.includes(router.pathname);
    const shouldSkipPadding = router.asPath === '/searchpage';
    const addPaddincontent = contentPagePadding.includes(router.asPath);
    const addPaddingPlayer = paddingPlayer.includes(router.asPath);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    let paddingTop = isMobile ? '40px' : '95px';
    if (isMobile) {
      if (router.pathname === '/contents/[identifier]') {
        paddingTop = '138px';
      }
      if (router.pathname === '/contents') {
        paddingTop = '25px';
      }
      if (router.pathname === '/home' && router.query.category) {
        paddingTop = '47px';
      }
      if (router.pathname === '/home') {
        paddingTop = '47px';
      }
      if (router.pathname === '/') {
        paddingTop = '40px';
      }
      if (
        typeof window !== 'undefined' &&
        window.location.hash.includes('error=login_required')
      ) {
        paddingTop = '47px'; // You can tweak these values
      }
      if (router.pathname === '/quick-access') {
        paddingTop = '132px';
      }
      if (router.pathname === '/quick-access/[category]') {
        paddingTop = '132px';
      }
    } else if (!isMobile) {
      if (router.pathname === '/quick-access') {
        paddingTop = '160px';
      }
      if (router.pathname === '/quick-access/[category]') {
        paddingTop = '160px';
      }
      if (router.pathname === '/quick-access/contents/[category]') {
        paddingTop = '60px';
      }
      if (router.pathname === '/') {
        paddingTop = '90px';
      }
      if (router.pathname === '/contents') {
        paddingTop = '90px';
      }
    }
    // if (isMobile) {
    //   if (shouldSkipPadding) {
    //     paddingTop = '96px';
    //   } else if (shouldUnsetPadding) {
    //     paddingTop = '34px';
    //   } else if (shouldAddPadding) {
    //     paddingTop = '70px';
    //   } else if (addPaddingPlayer) {
    //     paddingTop = '140px';
    //   } else {
    //     paddingTop = '146px';
    //   }
    // } else {
    //   if (shouldSkipPadding) {
    //     paddingTop = '40px';
    //   } else if (shouldAddPadding) {
    //     paddingTop = '80px';
    //   } else if (shouldUnsetPadding) {
    //     paddingTop = '54px';
    //   } else if (shouldUnsetHeight) {
    //     paddingTop = '50px';
    //   }else if(addPaddincontent){
    //     paddingTop = '50px';
    //   }
    // }

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
          </Box>
        )}
        <Box
          style={{
            width: '100%',
            overflowY: 'auto',
            display: isLoading ? 'none' : 'block',
            height:
              !isMobile && shouldUnsetHeight
                ? 'unset'
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
