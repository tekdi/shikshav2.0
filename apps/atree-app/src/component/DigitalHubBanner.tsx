import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const DigitalHubBanner = () => {
  return (
    <Box
      sx={{
        width: '100%', // Full width on mobile, fixed 1440px on desktop
        height: { xs: 'auto', sm: '160px' }, // Auto height on mobile
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '24px',
        // padding: { xs: '16px', sm: '5' }, // Add padding on mobile
        margin: '0 auto', // Center the container
        backgroundColor: '#fcd804', // Change as needed
      }}
    >
      <Typography
        sx={{
          fontFamily: 'Poppins',
          fontWeight: 'Bold',
          fontSize: { xs: '14px', sm: '60px' }, // Smaller on mobile
          // lineHeight: '20px', // Adjusted for mobile
          letterSpacing: '0px',
          textAlign: 'center',
          color: '#2B3133',
          width: '100%',
          maxWidth: '1440px',
          padding: { xs: '8px 16px', sm: '10px', md: '10px' }, // Padding on mobile
        }}
      >
        A digital hub of Environment Education resources contextual to India
      </Typography>
    </Box>
  );
};

export default DigitalHubBanner;
