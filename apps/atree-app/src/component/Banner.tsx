import * as React from 'react';
import Grid from '@mui/material/Grid2';
import landingBanner from '../../assets/images/landingBanner.png';
import { ImageBanner } from '../component/layout/ImageBanner';
import { Typography, Box } from '@mui/material';
export default function Banner() {
  return (
    <Grid width="100%">
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: { md: '500px' }, // Full height for web
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Fixed Text */}
        <Typography
          sx={{
            position: 'absolute',
            bottom: '10%', // Adjust the position as needed
            zIndex: 2,
            color: 'white', // Adjust text color if needed
            fontSize: { xs: '16px', md: '48px' },
            textAlign: 'center',
            fontWeight: 400,
            width: '100%',
          }}
        >
          A digital hub of Environment Education resources contextual to India
        </Typography>

        <Box
          sx={{
            width: '100%',
            height: { xs: '181px', md: '500px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ImageBanner
            name={''}
            image={landingBanner?.src}
            _image={{ height: { xs: 'auto', md: '500px' } }}
          />
        </Box>
      </Box>
    </Grid>
  );
}
