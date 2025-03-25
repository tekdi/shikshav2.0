import * as React from 'react';
import Grid from '@mui/material/Grid2';
import landingBanner from '../../assets/images/landingBanner.png';
import Layout from '../component/layout/layout';
import { Typography } from '@mui/material';
import { ImageBanner } from '../component/layout/ImageBanner';
export default function Aboutus() {
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
        marginBottom={'25px'}
      >
        <ImageBanner
          name={
            'A digital hub of Environment Education resources contextual to India'
          }
          image={landingBanner?.src}
          _image={{ height: 'auto' }}
        />
        {/* About Us Title */}
        <Typography
          variant="h4"
          sx={{ textAlign: 'center', fontWeight: 400, fontSize: '24px', mt: 2 }}
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
