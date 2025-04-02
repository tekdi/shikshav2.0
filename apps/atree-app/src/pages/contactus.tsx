import * as React from 'react';
import Grid from '@mui/material/Grid';
import { Typography, Box, SvgIcon } from '@mui/material';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Layout from '../component/layout/layout';
import Banner from '../component/Banner';
import FooterText from '../component/FooterText';

const contactDetails = [
  {
    icon: LocalPhoneOutlinedIcon,
    text: '+91-80-23635555',
  },
  {
    icon: AlternateEmailOutlinedIcon,
    text: 'envedu@atree.org',
  },
  {
    icon: LocationOnOutlinedIcon,
    text: 'Royal Enclave, Srirampura, Jakkur, Bengaluru, Karnataka 560064',
  },
];

const ContactInfo = ({ Icon, text }: any) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, maxWidth: '400px' }}>
    <SvgIcon
      viewBox="0 0 24 24"
      sx={{
        width: { xs: '18px', md: '37.33px' },
        height: { xs: '18px', md: '53.33px' },
      }}
    >
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E68907" />
          <stop offset="100%" stopColor="#FFBD0D" />
        </linearGradient>
      </defs>
      <Icon sx={{ fill: 'url(#gradient1)' }} />
    </SvgIcon>
    <Typography
      variant="body1"
      sx={{
        color: '#333',
        fontWeight: 400,
        fontSize: { xs: '15px', md: '24px' },
        marginLeft: '10px',
      }}
    >
      {text}
    </Typography>
  </Box>
);

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
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '24px', md: '64px' },
            textAlign: 'center',
            fontWeight: { xs: 400, md: 500 },
            mt: 4,
          }}
        >
          Contact Us
        </Typography>

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
          {contactDetails.map(({ icon, text }, index) => (
            <ContactInfo key={index} Icon={icon} text={text} />
          ))}
        </Box>

        <Typography
          variant="body1"
          sx={{
            color: '#000000',
            fontWeight: { xs: 400, md: 500 },
            fontSize: { xs: '24px', md: '57px' },
          }}
        >
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
