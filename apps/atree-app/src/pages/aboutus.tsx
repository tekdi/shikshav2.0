import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Layout from '../component/layout/layout';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Banner from '../component/Banner';
import FooterText from '../component/FooterText';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import { commonStyles } from '../utils/commonStyle';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import landingBanner2 from '../../assets/images/png/2.png';

export default function Aboutus() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Layout
      isFooter={isMobile} // add this when on mobile
    >
      <Banner singleImage={landingBanner2.src} />
      <Grid
        container
        spacing={2}
        direction="column"
        justifyContent="center"
        marginBottom={'25px'}
        sx={commonStyles.responsivePadding}
      >
        {/* About Us Title */}
        <Typography
          sx={{
            textAlign: 'center',
            lineHeight: { xs: '30px', md: '64px' },
            fontWeight: { xs: 500, md: 500 },
            fontSize: { xs: '24px', md: '57px' },
            fontFamily: 'Poppins',
            color: '#000000',
            marginTop: { xs: '20px', md: '47px' },
            marginBottom: { xs: '20px', md: '47px' },
          }}
        >
          About Us
        </Typography>
        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 500, md: 400 },
            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            fontFamily: 'Poppins',
          }}
        >
          <b>SNAIL:</b> Slow. Intentional. Transformative.
        </Typography>
        {/* About Us Description */}
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            fontSize: '16px',
            fontFamily: 'Poppins',
            color: '#000000',
            fontWeight: 400,
          }}
        >
          We are a collective of passionate environmental educators based at
          ATREE (Ashoka Trust for Research in Ecology and the Environment) in
          Bengaluru, India. At SNAIL – the School of Nature, Action, Inquiry,
          and Learning, we champion place-based environmental education which is
          hands- on, local, and rooted in real-world experiences.
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
            fontSize: '16px',
            fontWeight: 400,
          }}
        >
          Our mission is to enrich school-level curricula and pedagogy across
          India by helping children engage meaningfully with the natural world
          around them—whether in bustling urban neighborhoods or quiet rural
          landscapes. We believe that such immersive, context-rich learning
          doesn’t just teach children about nature or the links between society
          and the environment—it empowers them to take ecological and civic
          action with hope and passion in our times of extreme climate change.
        </Typography>
        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 400, md: 400 },
            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <b>What We Offer</b>
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
            fontSize: '16px',
            fontWeight: 400,
          }}
        >
          Our Digital Hub of Education Resources is a dynamic space designed for
          educators looking to bring place-based learning into their classrooms.
          It features:
          <br></br>
          Peer-reviewed, multilingual, multi-format teaching learning resources
          <br></br>
          Age- and context-adaptable curricula
          <br></br>
          Real-world activities and case studies
          <br></br>
          Facilitation guides, toolkits, and educator training modules
          <br></br>
          This hub is more than a repository—it&#39;s a growing, collaborative
          space for learning, dialogue, and shared inquiry, inspired by the
          original spirit of what a school can be.
        </Typography>
        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 400, md: 400 },
            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <b> Our Network</b>
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
            fontSize: '16px',
            fontWeight: 400,
          }}
        >
          We are proud to collaborate with over 60 leading environmental
          organizations across India—spanning both public and non-profit
          sectors—as well as an inspiring community of educators and
          conservationists. Together, we’re working to create a future where
          every child can grow up connected to their environment and equipped to
          care for it.
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            fontWeight: { xs: 400, md: 400 },
            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            whiteSpace: 'pre-line',
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          Get in Touch
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
            mb: 1,
            fontFamily: 'Poppins',
            color: '#000000',
            fontSize: '16px',
            fontWeight: 400,
          }}
        >
          We’d love to hear from you!
        </Typography>
        <Box sx={{ pl: { xs: 2, md: 10 }, pr: { xs: 2, md: 10 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AlternateEmailIcon sx={{ mr: 1, fontSize: '18px' }} />
            <Typography
              sx={{
                fontFamily: 'Poppins',
                color: '#000000',
                fontSize: '18px',
                fontWeight: 400,
              }}
            >
              envedu@atree.org
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOnOutlinedIcon sx={{ mr: 1, fontSize: '18px' }} />
            <Typography
              sx={{
                fontFamily: 'Poppins',
                color: '#000000',
                fontSize: '18px',
                fontWeight: 400,
              }}
            >
              ATREE, Royal Enclave, Srirampura, Jakkur, Bengaluru, Karnataka
              560064
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CallOutlinedIcon
              sx={{
                mr: 1,
                fontFamily: 'Poppins',
                color: '#000000',
                fontSize: '18px',
              }}
            />
            <Typography
              sx={{
                fontFamily: 'Poppins',
                color: '#000000',
                fontSize: '18px',
                fontWeight: 400,
              }}
            >
              +91-80-23635555
            </Typography>
          </Box>
        </Box>
      </Grid>
      <FooterText page="" />
    </Layout>
  );
}
