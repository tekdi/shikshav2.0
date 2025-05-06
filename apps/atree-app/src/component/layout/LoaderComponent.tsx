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
    </Box>
  );
};

export default Loader;
