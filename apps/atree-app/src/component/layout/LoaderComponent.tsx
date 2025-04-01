import React from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
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
      <Image src={loaderGif} alt="Loading..." />

      {/* Loading Text */}
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
  );
};

export default Loader;
