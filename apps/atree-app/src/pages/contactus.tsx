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
    <Layout isFooter={true}>
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <ImageBanner
          name={
            'A digital hub of Environment Education resources contextual to India'
          }
          image={landingBanner?.src}
          _image={{ height: '181px' }}
        />
        {/* Contact Us Title */}
        <Typography
          variant="h4"
          sx={{ textAlign: 'center', fontWeight: 400, fontSize: '24px', mt: 4 }}
        >
          Contact Us
        </Typography>

        {/* Contact Information */}
        <Box sx={{ maxWidth: '600px', textAlign: 'left', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocalPhoneOutlinedIcon sx={{ color: 'goldenrod', mr: 1 }} />
            <Typography variant="body1" sx={{ color: '#333' }}>
              +91-80-23635555
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AlternateEmailOutlinedIcon sx={{ color: 'goldenrod', mr: 1 }} />
            <Typography variant="body1" sx={{ color: '#333' }}>
              envedu@atree.org
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOnOutlinedIcon sx={{ color: 'goldenrod', mr: 1 }} />
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.031764934963!2d77.5881258!3d13.0826805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1902dd777cd7%3A0x508173348b3c3ec2!2sATREE%20-%20Ashoka%20Trust%20for%20Research%20in%20Ecology%20and%20the%20Environment!5e0!3m2!1sen!2sin!4v1648718055280!5m2!1sen!2sin"
          ></iframe>
        </Box>
      </Grid>
    </Layout>
  );
}
