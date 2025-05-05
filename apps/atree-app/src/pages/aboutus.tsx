import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Layout from '../component/layout/layout';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import Banner from '../component/Banner';
import FooterText from '../component/FooterText';
export default function Aboutus() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Layout
      isFooter={isMobile} // add this when on mobile
      footerComponent={  <FooterText page="" />}
    >
      <Banner />
      <Grid
        container
        spacing={2}
        direction="column"
        // alignItems="center"
        justifyContent="center"
        marginBottom={'25px'}
        sx={{
          pl: { xs: 2, md: 10 },
          pr: { xs: 2, md: 10 },
        }}
      >
        {/* About Us Title */}
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            fontWeight: { xs: 400, md: 500 },
            fontSize: { xs: '24px', md: '64px' },
            mt: 2,
          }}
        >
          About Us
        </Typography>
        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 400, md: 500 },
            fontSize: { xs: '14px', md: '24px' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
          }}
        >
          SNAIL: Slow. Intentional. Transformative.
        </Typography>
        {/* About Us Description */}
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
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
            fontWeight: { xs: 400, md: 500 },
            fontSize: { xs: '14px', md: '24px' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
          }}
        >
          What We Offer
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
          }}
        >
          Our Digital Hub of Education Resources is a dynamic space designed for
          educators looking to bring place-based learning into their classrooms.
          It features:
          <li>
            Peer-reviewed, multilingual, multi-format teaching learning
            resources
          </li>
          <li>Age- and context-adaptable curricula</li>
          <li> Real-world activities and case studies</li>
          <li> Facilitation guides, toolkits, and educator training modules</li>
          This hub is more than a repository—it&#39;s a growing, collaborative
          space for learning, dialogue, and shared inquiry, inspired by the
          original spirit of what a school can be.
        </Typography>
        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 400, md: 500 },
            fontSize: { xs: '14px', md: '24px' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
          }}
        >
          Our Network
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
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
            textAlign: 'left',
            fontWeight: { xs: 400, md: 500 },
            fontSize: { xs: '14px', md: '24px' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
          }}
        >
          Get in Touch
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
          }}
        >
          We’d love to hear from you! �� Email: envedu@atree.org �� Address:
          ATREE, Royal Enclave, Sriramapura, Jakkur Post, Bangalore 560 064,
          Karnataka �� Phone: +91-80-23635555 (EPABX)
        </Typography>
      </Grid>
    </Layout>
  );
}
