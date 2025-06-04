import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

const DigitalHubBanner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#fcd804',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 1,
        py: isMobile ? 1 : 1.5,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontFamily: 'Poppins',
          fontWeight: 700,
          fontSize: {
            xs: 'clamp(14px, 2vw, 18px)',
            sm: 'clamp(18px, 3vw, 24px)',
            md: 'clamp(20px, 2vw, 32px)',
            lg: '36px',
          },
          lineHeight: 1.2,
          color: '#2B3133',
        }}
      >
        A digital hub of Environment Education resources contextual to India
      </Typography>
    </Box>
  );
};

export default DigitalHubBanner;
