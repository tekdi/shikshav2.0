import * as React from 'react';
import Grid from '@mui/material/Grid2';
import { ImageBanner } from '../component/layout/ImageBanner';
import { Typography, Box } from '@mui/material';
import landingBanner1 from '../../assets/images/banner/Arunachal ke Saaras.jpg';
import landingBanner2 from '../../assets/images/banner/Bavre Beej.jpg';
import landingBanner3 from '../../assets/images/banner/Current Conservation.jpg';
import landingBanner4 from '../../assets/images/banner/I wonder who that is.jpg';
import landingBanner5 from '../../assets/images/banner/Nisargshala.jpg';
import landingBanner6 from '../../assets/images/banner/The Spring of Life (2).jpg';
import landingBanner7 from '../../assets/images/banner/Travelling Seeds.jpg';
import landingBanner8 from '../../assets/images/banner/Whoop, goes the pufferfish.jpg';
import Carousel from 'react-material-ui-carousel';

export default function Banner() {
  const landingImages = [
    { image: landingBanner1?.src, id: 1 },
    { image: landingBanner2?.src, id: 2 },
    { image: landingBanner3?.src, id: 3 },
    { image: landingBanner4?.src, id: 4 },
    { image: landingBanner5?.src, id: 5 },
    { image: landingBanner6?.src, id: 6 },
    { image: landingBanner7?.src, id: 7 },
    { image: landingBanner8?.src, id: 8 },
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
        <Typography
          sx={{
            position: 'absolute',
            bottom: '10%', // Adjust the position as needed
            zIndex: 2,
            color: 'white', // Adjust text color if needed
            fontSize: { xs: '16px', md: '48px' },
            textAlign: 'left',
            fontWeight: 700,
            width: '100%',
            marginLeft: '77px',
          }}
        >
          A digital hub of Environment Education resources contextual to India
        </Typography>

        {/* Carousel with Images */}
        <Carousel
          navButtonsAlwaysVisible
          indicators={false}
          animation="slide"
          autoPlay={true}
          interval={6000}
          swipe={true}
          duration={4000}
          stopAutoPlayOnHover={false}
          cycleNavigation={true}
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
              key={image.id} // ✅ Ensure this is the only key
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
                _image={{ height: { xs: 'auto', md: '500px' } }}
              />
            </Box>
          ))}
        </Carousel>
      </Box>
    </Grid>
  );
}
