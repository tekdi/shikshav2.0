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
              position="absolute"
              fontSize={'1.5rem'}
              top="4  00px" // Moves text slightly up
              zIndex={1} // Ensures text is above the GIF
              bgcolor="rgba(255, 255, 255, 0.5)" // Optional: Adds background for readability
              px={1} // Padding for better visibility
            >
              Loading...
            </Typography>
          </Box>
        )}
        <Box
          style={{
            width: '100%',
            // overflowY: 'auto',
            display: isLoading ? 'none' : 'block',
            height: `calc(100vh - ${layoutHeight || 100}px)`,
          }}
        >
          {children}
        </Box>
      </Box>
    );
  }
);
