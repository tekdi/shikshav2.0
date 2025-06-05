import Box from '@mui/material/Box';
import React, { memo } from 'react';
import { ReactNode } from 'react';
import Image from 'next/image';
import loaderGif from '../../assets/images/snail-yellow.gif';
import { useTheme, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
interface LoaderProps {
  isLoading: boolean;
  layoutHeight?: number;
  children: ReactNode;
}
const MOBILE_PADDING_MAP: Record<string, string> = {
  '/contents/[identifier]': '68px',
  '/contents': '60px',
  '/home': '47px',
  '/': '40px',
  '/quick-access': '132px',
  '/quick-access/[category]': '132px',
  '/quick-access/contents/[category]': '132px',
  '/termsandcondition': '76px',
  '/aboutus': '76px',
  '/register': '52px',
  '/searchpage': '65px',
  '/signin': '48px',
};

const DESKTOP_PADDING_MAP: Record<string, string> = {
  '/home': '120px',
  '/quick-access': '195px',
  '/quick-access/[category]': '195px',
  '/quick-access/contents/[category]': '105px',
  '/': '132px',
  '/contents': '132px',
  '/contents/[identifier]': '126px',
  '/searchpage': '118px',
};

const getPaddingTop = (isMobile: boolean, router: any): string => {
  const defaultPadding = isMobile ? '40px' : '95px';

  // Remove padding for root path "/"
  // if (router.pathname === '/') {
  //   return '0px';
  // }

  if (isMobile) {
    if (
      router.pathname === '/register' &&
      window.location.hash.includes('error=login_required')
    ) {
      return '47px';
    }
    if (
      router.pathname === '/quick-access' &&
      window.location.hash.includes('error=login_required')
    ) {
      return '132px';
    }

    const hasLoginError = window.location.hash.includes('error=login_required');
    if (hasLoginError && !router.pathname.includes('searchpage')) {
      return '76px';
    }
    if (router.pathname === '/searchpage' && hasLoginError) {
      return '97px';
    }
    if (router.pathname === '/home' && router.query.category) {
      return '47px';
    }
    if (
      router.pathname === '/home' &&
      window.location.hash.includes('error=login_required')
    ) {
      return '47px';
    }
    if (
      router.pathname === '/termsandcondition' &&
      window.location.hash.includes('error=login_required')
    ) {
      return '76px';
    }
    if (
      router.pathname === '/about' &&
      window.location.hash.includes('error=login_required')
    ) {
      return '76px';
    }

    return MOBILE_PADDING_MAP[router.pathname] || defaultPadding;
  }

  return DESKTOP_PADDING_MAP[router.pathname] || defaultPadding;
};

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

    const shouldUnsetHeight = noHeightRoutes.includes(router.pathname);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const paddingTop = getPaddingTop(isMobile, router);

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
            overflowX: 'hidden',
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
