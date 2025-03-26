import Box from '@mui/material/Box';
import React, { memo } from 'react';
import { ReactNode } from 'react';
import loaderGif from '../../assets/images/snail-yellow.gif';
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
            <img src={loaderGif} alt="Loading..." />
          </Box>
        )}
        <Box
          style={{
            width: '100%',
            overflowY: 'auto',
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
