import * as React from 'react';
import Grid from '@mui/material/Grid2';
import { ImageBanner } from '../component/layout/ImageBanner';
import { Typography, Box } from '@mui/material';

import landingBanner1 from '../../assets/images/png/Banner-2.png';
import landingBanner2 from '../../assets/images/png/Set-1.png';

import Carousel from 'react-material-ui-carousel';
type BannerProps = Readonly<{
  text: string;
}>;
export default function Banner() {
  const landingImages = [
    { image: landingBanner1?.src, id: 1 },
    { image: landingBanner2?.src, id: 2 },
  ];

  // Remove duplicate images (if any)
  const uniqueLandingImages = Array.from(
    new Map(landingImages.map((img) => [img.id, img])).values()
  );

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

        {/* Carousel with Images */}
        <Carousel
          indicators={false}
          animation="fade"
          autoPlay={true}
          interval={3000}
          swipe={true}
          duration={1000}
          stopAutoPlayOnHover={false}
          cycleNavigation={true}
          navButtonsAlwaysInvisible={true}
          sx={{
            width: '100%',
            minHeight: { md: '500px' }, // Full height for web
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {uniqueLandingImages.map((image) => (
            <Box
              key={image.id}
              sx={{
                width: '100%',
                height: { xs: '181px', md: '500px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ImageBanner
                name=""
                image={image.image}
                _eventClick={true}
                _image={{ height: { xs: 'auto', md: '500px' } }}
              />
            </Box>
          ))}
        </Carousel>
      </Box>
    </Grid>
  );
}
