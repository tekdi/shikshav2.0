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
  singleImage?: string;
}>;
export default function Banner({ singleImage }: BannerProps) {
  const landingImages = [
    { image: landingBanner1?.src, id: 1 },
    { image: landingBanner2?.src, id: 2 },
    { image: landingBanner3?.src, id: 3 },
    { image: landingBanner4?.src, id: 4 },
    { image: landingBanner5?.src, id: 5 },
    { image: landingBanner6?.src, id: 6 },
  ];
  const commonBoxSx = {
    position: 'relative',
    width: '100%',
    // Use a minHeight to prevent content collapsing completely,
    // but allow height to be auto or determined by content (ImageBanner)
    minHeight: { xs: 'auto', md: '400px' }, // Adjust minimum height as needed
    height: 'auto', // Allow height to expand based on content
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // Crucial to prevent content from spilling out if child overflows
  };
  // Helper for ImageBanner's image styling prop
  const imageBannerImageProp = {
    // Let the image fill its container, which will have auto height
    height: '100%',
    width: '100%', // Ensure width is 100% to fill container
  };
  if (singleImage) {
    return (
      <Grid width="100%" sx={{ marginTop: 0 }}>
        <Box sx={commonBoxSx}>
          <ImageBanner
            name=""
            image={singleImage}
            // _eventClick={false}
            _image={imageBannerImageProp}
          />
        </Box>
      </Grid>
    );
  }
  // Remove duplicate images (if any)
  const uniqueLandingImages = Array.from(
    new Map(landingImages.map((img) => [img.id, img])).values()
  );

  return (
    <Grid width="100%" sx={{ marginTop: 0 }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: { md: '500px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
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
            minHeight: { md: '500px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {uniqueLandingImages.map((image) => (
            <Box key={image.id} sx={commonBoxSx}>
              <ImageBanner
                name=""
                image={image.image}
                 _eventClick={true}
                _image={imageBannerImageProp}
              />
            </Box>
          ))}
        </Carousel>
      </Box>
    </Grid>
  );
}
