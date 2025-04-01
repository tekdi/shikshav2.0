import Box from '@mui/material/Box';
import React, { memo } from 'react';
import { ReactNode } from 'react';
import Image from 'next/image';
import loaderGif from '../../assets/images/snail-yellow.gif';
import { Typography } from '@mui/material';
interface LoaderProps {
  isLoading: boolean;
  layoutHeight?: number;
  children: ReactNode;
}

export const Loader: React.FC<LoaderProps> = memo(
  ({ isLoading, layoutHeight, children }) => {
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
            height: `calc(100vh - ${layoutHeight}px)`,
          }}
        >
          {children}
        </Box>
      </Box>
    );
  }
);
