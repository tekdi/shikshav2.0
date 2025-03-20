import React from 'react';
import { Box, Typography } from '@mui/material';
import loaderGif from '../../../assets/images/snail-yellow.gif';

const Loader: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      position="relative"
    >
      {/* Loader GIF */}
      <img src={loaderGif.src} alt="Loading..." />

      {/* Loading Text */}
      <Typography
        variant="body1"
        color="textSecondary"
        position="absolute"
        top="400px" // Moves text slightly up
        zIndex={1} // Ensures text is above the GIF
        bgcolor="rgba(255, 255, 255, 0.5)" // Optional: Adds background for readability
        px={1} // Padding for better visibility
      >
        Loading...
      </Typography>
    </Box>
  );
};

export default Loader;
