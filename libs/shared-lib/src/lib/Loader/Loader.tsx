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
      '/',
      '/aboutus',
      '/termsandcondition',
      '/home',
      '/contents',
      '/searchpage',
      '/quick-access/contents/[category]',
    ];
    const noPaddingRoutes = ['/contents', '/quick-access/contents/[category]'];
    const paddingQuickAccess = [
      '/quick-access',
      '/quick-access/[category]',
      '/contents/[identifier]',
    ];

    const paddingPlayer = ['/player/[identifier]'];
    const shouldUnsetHeight = noHeightRoutes.includes(router.pathname);
    const shouldUnsetPadding = noPaddingRoutes.includes(router.pathname);
    const shouldAddPadding = paddingQuickAccess.includes(router.pathname);
    const shouldSkipPadding = router.asPath === '/searchpage';
    const addPaddingPlayer = paddingPlayer.includes(router.asPath);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    let paddingTop = '97px';

    if (isMobile) {
      if (shouldSkipPadding) {
        paddingTop = '96px';
      } else if (shouldUnsetPadding) {
        paddingTop = '34px';
      } else if (shouldAddPadding) {
        paddingTop = '160px';
      } else if (addPaddingPlayer) {
        paddingTop = '140px';
      } else {
        paddingTop = '146px';
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
