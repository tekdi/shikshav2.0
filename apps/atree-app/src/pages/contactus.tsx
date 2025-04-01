import * as React from 'react';
import Grid from '@mui/material/Grid2';
import landingBanner from '../../assets/images/landingBanner.png';

import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Layout from '../component/layout/layout';
import { ImageBanner } from '../component/layout/ImageBanner';

import { Typography, Box } from '@mui/material';
export default function Contactus() {
  return (
    <Layout
      footerComponent={
        <Grid sx={{ px: 4, py: 1, backgroundColor: 'secondary.main' }}>
          <Typography align="center" gutterBottom sx={{ fontSize: '10px' }}>
            Curated by ATREE: For, Of, and By Environment Educators of India
          </Typography>
        </Grid>
      }
    >
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
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
              A digital hub of Environment Education resources contextual to
              India
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

        {/* Contact Us Title */}
        <Typography
          variant="h4"
          sx={{ textAlign: 'center', fontWeight: 400, fontSize: '24px', mt: 4 }}
        >
          Contact Us
        </Typography>

        {/* Contact Information */}
        <Box
          sx={{
            maxWidth: { xs: '600px', md: '100%' },
            textAlign: 'left',
            p: 2,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocalPhoneOutlinedIcon
              sx={{ color: 'goldenrod', mr: 1, marginLeft: '15px' }}
            />
            <Typography variant="body1" sx={{ color: '#333' }}>
              +91-80-23635555
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AlternateEmailOutlinedIcon
              sx={{ color: 'goldenrod', mr: 1, marginLeft: '15px' }}
            />
            <Typography variant="body1" sx={{ color: '#333' }}>
              envedu@atree.org
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOnOutlinedIcon
              sx={{ color: 'goldenrod', mr: 1, marginLeft: '15px' }}
            />
            <Typography variant="body1" sx={{ color: '#333' }}>
              Royal Enclave, Srirampura, Jakkur, Bengaluru, Karnataka 560064
            </Typography>
          </Box>
        </Box>

        {/* Embedded Map */}
        <Typography variant="body1" sx={{ color: '#000000', fontSize: '24px' }}>
          Reach Us
        </Typography>
        <Box sx={{ width: '100%', textAlign: 'center', mt: 3 }}>
          <iframe
            title="Google Map"
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: '8px' }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Royal+Enclave,+Srirampura,+Jakkur,+Bengaluru,+Karnataka+560064&output=embed"
          ></iframe>
        </Box>
      </Grid>
    </Layout>
  );
}
