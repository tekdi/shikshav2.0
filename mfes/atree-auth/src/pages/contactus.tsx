import * as React from 'react';
import Grid from '@mui/material/Grid';
import { Typography, Box } from '@mui/material';
import Image from 'next/image';
import Banner from '../../assets/images/banner.png';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function Contactus() {
  return (
    <Grid
      container
      spacing={2}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      {/* Image Banner */}
      <Box sx={{ position: 'relative', width: '100%', textAlign: 'center' }}>
        <Image
          src={Banner}
          alt="About Us Banner"
          style={{ borderRadius: '8px', width: '100%' }}
        />
        <Typography
          variant="h4"
          sx={{
            position: 'absolute',
            top: '80%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontWeight: 'bold',
            padding: '10px 20px',
            borderRadius: '8px',
            textAlign: 'center',
            width: '90%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          Amplifying Change: Empowering environment educators one resource at a
          time
        </Typography>
      </Box>

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
          <PhoneIcon sx={{ color: 'goldenrod', mr: 1 }} />
          <Typography variant="body1" sx={{ color: '#333' }}>
            +91-80-23635555
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EmailIcon sx={{ color: 'goldenrod', mr: 1 }} />
          <Typography variant="body1" sx={{ color: '#333' }}>
            envedu@atree.org
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOnIcon sx={{ color: 'goldenrod', mr: 1 }} />
          <Typography variant="body1" sx={{ color: '#333' }}>
            Royal Enclave, Srirampura, Jakkur, Bengaluru, Karnataka 560064
          </Typography>
        </Box>
      </Box>

      {/* Embedded Map */}
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
  );
}
