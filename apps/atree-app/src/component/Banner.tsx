import * as React from 'react';
import Grid from '@mui/material/Grid2';
import { ImageBanner } from '../component/layout/ImageBanner';
import { Box } from '@mui/material';

import landingBanner1 from '../../assets/images/png/1.png';
import landingBanner2 from '../../assets/images/png/2.png';
import landingBanner3 from '../../assets/images/png/3.png';
import landingBanner4 from '../../assets/images/png/4.png';
import landingBanner5 from '../../assets/images/png/5.png';
import landingBanner6 from '../../assets/images/png/6.png';

import Carousel from 'react-material-ui-carousel';
type BannerProps = Readonly<{
  text: string;
}>;
export default function Banner() {
  const landingImages = [
    { image: landingBanner1?.src, id: 1 },
    { image: landingBanner2?.src, id: 2 },
    { image: landingBanner3?.src, id: 3 },
    { image: landingBanner4?.src, id: 4 },
    { image: landingBanner5?.src, id: 5 },
    { image: landingBanner6?.src, id: 6 },
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
