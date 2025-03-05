import * as React from 'react';
import Grid from '@mui/material/Grid2';
import { Typography, Box } from '@mui/material';
import Image from 'next/image';
import Banner from '../../assets/images/banner.png';
export default function Aboutus() {
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
          style={{ borderRadius: '8px' }}
        />
        <Typography
          variant="h4"
          sx={{
            position: 'absolute',
            top: '80%',
            left: '48%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontWeight: 'bold',
            padding: '10px 20px',
            borderRadius: '8px',
            textAlign: 'left',
            width: '90%',
          }}
        >
          Amplifying Change: Empowering environment educators one resource at a
          time
        </Typography>
      </Box>

      {/* About Us Title */}
      <Typography
        variant="h4"
        sx={{ textAlign: 'center', fontWeight: 400, fontSize: '24px', mt: 2 }}
      >
        About Us
      </Typography>

      {/* About Us Description */}
      <Typography sx={{ textAlign: 'left', maxWidth: '800px', p: 2 }}>
        Jal Jungle Jameen in classrooms is a unique digital repository of
        multi-format, multi-language environment education resources for middle
        and high school level, contextual to India that is curated by ATREE. It
        is designed to support environment educators and children with skills
        and resources needed for place-based action towards conservation of
        India’s key natural resources—Water, Land, and Forests (Jal, Jungle,
        Jameen). By collaborating with schools, teachers, conservation and
        environment NGOs, education NGOs, education government departments,
        NCERT, and environment educators across India, we offer access to a
        variety of engaging, multi-lingual, and multi-format (text and
        multimedia) resources that are peer-reviewed for quality, context, and
        curricula integration. Our aim is to empower educators to foster hope,
        knowledge, and action among school-going children in caring for their
        local environment and communities in times of climate change.
      </Typography>
    </Grid>
  );
}
