import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Layout from '../component/layout/layout';
import { Typography } from '@mui/material';
import Banner from '../component/Banner';
import FooterText from '../component/FooterText';
export default function Aboutus() {
  return (
    <Layout footerComponent={<FooterText />}>
      <Banner />
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justifyContent="center"
        marginBottom={'25px'}
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

        {/* About Us Description */}
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'center' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
          }}
        >
          Jal Jungle Jameen in classrooms is a unique digital repository of
          multi-format, multi-language environment education resources for
          middle and high school level, contextual to India that is curated by
          ATREE. It is designed to support environment educators and children
          with skills and resources needed for place-based action towards
          conservation of India’s key natural resources—Water, Land, and Forests
          (Jal, Jungle, Jameen).
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'center' },
            pl: { xs: 2, md: 10 },
            pr: { xs: 2, md: 10 },
          }}
        >
          By collaborating with schools, teachers, conservation and environment
          NGOs, education NGOs, education government departments, NCERT, and
          environment educators across India, we offer access to a variety of
          engaging, multi-lingual, and multi-format (text and multimedia)
          resources that are peer-reviewed for quality, context, and curricula
          integration. Our aim is to empower educators to foster hope,
          knowledge, and action among school-going children in caring for their
          local environment and communities in times of climate change.
        </Typography>
      </Grid>
    </Layout>
  );
}
