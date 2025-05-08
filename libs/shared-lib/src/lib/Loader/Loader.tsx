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
  '/contents/[identifier]': '138px',
  '/contents': '25px',
  '/home': '47px',
  '/': '40px',
  '/quick-access': '132px',
  '/quick-access/[category]': '132px',
};

const DESKTOP_PADDING_MAP: Record<string, string> = {
  '/quick-access': '160px',
  '/quick-access/[category]': '160px',
  '/quick-access/contents/[category]': '60px',
  '/': '90px',
  '/contents': '90px',
};

const getPaddingTop = (isMobile: boolean, router: any): string => {
  const defaultPadding = isMobile ? '40px' : '95px';

  if (isMobile) {
    if (
      typeof window !== 'undefined' &&
      window.location.hash.includes('error=login_required')
    ) {
      return '47px';
    }
    if (router.pathname === '/home' && router.query.category) {
      return '47px';
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
