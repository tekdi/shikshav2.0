import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface LoaderProps {
  size?: number;
  color?: 'primary' | 'secondary' | 'inherit';
  overlayColor?: string;
}

export const Circular: React.FC<LoaderProps> = ({
  size = 40,
  color = 'primary',
  overlayColor = 'rgba(255, 255, 255, 0.9)',
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: overlayColor,
      }}
    >
      <CircularProgress size={size} color={color} />
    </Box>
  );
};
