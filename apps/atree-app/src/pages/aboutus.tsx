import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import landingBanner from '../../assets/images/landingBanner.png';

import Layout from '../component/layout/layout';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
} from '@mui/material';
export default function Aboutus() {
  return (
    <Layout isFooter={true}>
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <CardComponent
          name={
            'A digital hub of Environment Education resources contextual to India'
          }
          image={landingBanner?.src}
          _image={{ height: '181px' }}
        />
        {/* About Us Title */}
        <Typography
          variant="h4"
          sx={{ textAlign: 'center', fontWeight: 400, fontSize: '24px', mt: 2 }}
        >
          About Us
        </Typography>

        {/* About Us Description */}
        <Typography sx={{ textAlign: 'left', pl: 2, pr: 2 }}>
          Jal Jungle Jameen in classrooms is a unique digital repository of
          multi-format, multi-language environment education resources for
          middle and high school level, contextual to India that is curated by
          ATREE. It is designed to support environment educators and children
          with skills and resources needed for place-based action towards
          conservation of India’s key natural resources—Water, Land, and Forests
          (Jal, Jungle, Jameen).
        </Typography>
        <Typography sx={{ textAlign: 'left', pl: 2, pr: 2 }}>
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

export const CardComponent = ({
  image,
  name,
  _image,
  _text,
}: {
  image: string;
  name: string;
  _image?: object;
  _text?: object;
}) => {
  return (
    <Card sx={{ width: '100%' }}>
      <CardActionArea>
        <CardMedia component="img" alt={name} sx={_image} image={image} />
        <CardContent
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100px',
            background:
              'linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5) , rgba(0, 0, 0, 0))',
            zIndex: 1,
            ..._text,
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: 'white',
              zIndex: 2,
              mb: 0,
              fontWeight: 700,
              fontSize: '18px',
              lineHeight: '24px',
            }}
          >
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
