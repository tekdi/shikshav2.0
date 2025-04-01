import * as React from 'react';
import Grid from '@mui/material/Grid2';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Layout from '../component/layout/layout';
import Banner from '../component/Banner';
import { Typography, Box, SvgIcon } from '@mui/material';
import FooterText from '../component/FooterText';
export default function Contactus() {
  return (
    <Layout footerComponent={<FooterText />}>
      <Banner />
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
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
            gap: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
            <SvgIcon
              component="svg"
              sx={{ width: 48, height: 48 }}
              viewBox="0 0 24 24"
            >
              <defs>
                <linearGradient
                  id="gradient1"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#E68907" />
                  <stop offset="100%" stopColor="#FFBD0D" />
                </linearGradient>
              </defs>
              <LocalPhoneOutlinedIcon sx={{ fill: 'url(#gradient1)' }} />
            </SvgIcon>
            <Typography variant="body1" sx={{ color: '#333' }}>
              +91-80-23635555
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SvgIcon
              component="svg"
              sx={{ width: 48, height: 48 }}
              viewBox="0 0 24 24"
            >
              <defs>
                <linearGradient
                  id="gradient1"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#E68907" />
                  <stop offset="100%" stopColor="#FFBD0D" />
                </linearGradient>
              </defs>
              <AlternateEmailOutlinedIcon sx={{ fill: 'url(#gradient1)' }} />
            </SvgIcon>

            <Typography variant="body1" sx={{ color: '#333' }}>
              envedu@atree.org
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
              width: '250px',
            }}
          >
            <SvgIcon
              component="svg"
              sx={{ width: 48, height: 48 }}
              viewBox="0 0 24 24"
            >
              <defs>
                <linearGradient
                  id="gradient1"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#E68907" />
                  <stop offset="100%" stopColor="#FFBD0D" />
                </linearGradient>
              </defs>
              <LocationOnOutlinedIcon sx={{ fill: 'url(#gradient1)' }} />
            </SvgIcon>
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
