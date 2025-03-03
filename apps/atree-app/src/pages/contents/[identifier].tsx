// pages/content/[identifier].tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { Circular } from '@shared-lib';
import { getContentDetails } from '../../service/content';
import Layout from '../../component/layout/layout';
import landingBanner from '../../../assets/images/landingBanner.png';
import Carousel from 'react-material-ui-carousel';

interface ContentItem {
  name: string;
  gradeLevel: string[];
  language: string[];
  artifactUrl: string;
  identifier: string;
  appIcon: string;
  contentType: string;
  mimeType: string;
}

export default function Content() {
  const router = useRouter();
  const { identifier } = router.query; // Access dynamic parameter 'identifier'
  const [contentData, setContentData] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleOnCLick = () => {
    router.push(`/player/${identifier}`);
  };
  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getContentDetails(identifier as string);
      //@ts-ignore
      if (result) setContentData([result]);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setIsLoading(false);
    }
  }, [identifier]);

  useEffect(() => {
    if (identifier) fetchContent();
  }, [identifier]);

  if (isLoading) return <Circular />;
  if (!contentData.length) return <div>No Content Found</div>;

  return (
    <Layout
      showBack
      backIconClick={() => router.push('/contents')}
      backTitle={
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '22px',
              lineHeight: '28px',
              m: 0,
              textAlign: 'left',
            }}
            gutterBottom
          >
            My Friend, The Sea
          </Typography>
          <Typography
            variant="subtitle1"
            color="textSecondary"
            gutterBottom
            sx={{
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '24px',
              letterSpacing: '0.15px',
              m: 0,
              textAlign: 'left',
            }}
          >
            By Sandhya Rao
          </Typography>
        </Box>
      }
    >
      <Box
        sx={{
          padding: 3,
          maxWidth: 600,
          margin: '0 auto',
          textAlign: 'center',
          border: '1px solid #ccc',
          borderRadius: 2,
          gap: 2.5,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Carousel
          navButtonsAlwaysVisible
          indicators={false}
          animation="slide"
          cycleNavigation={false}
        >
          {[...Array(4)].map((_, i) => (
            <ImageCard
              key={i}
              image={landingBanner?.src || ''}
              name={
                <Box>
                  <Typography variant="body2" gutterBottom>
                    My Friend, The Sea
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Published by PrathamBooks {i + 1}
                  </Typography>
                </Box>
              }
            />
          ))}
        </Carousel>

        <Button
          variant="contained"
          color="secondary"
          sx={{
            borderRadius: '50px',
            height: '40px',
            width: '100%',
          }}
          onClick={handleOnCLick}
        >
          Know More
        </Button>
        <Typography variant="body2" sx={{ mt: 0 }}>
          Sandhya Rao, Tulika Books, naturewriting, naturejournal
        </Typography>
        <Typography variant="body1" sx={{ mt: 0 }}>
          Based on real accounts, this is an imagined story of a boy in the
          aftermath of the 2004 Tsunami that hit several countries. It could
          also be the story of any child whose life is closely linked with
          nature. The narrative follows the feelings of the boy as he tries to
          comprehend the horror and bewilderment of the experience.
        </Typography>
        <Typography variant="body1" sx={{ mt: 0 }}>
          Photographs, not of the devastation but of warmth, present positive
          images that lift the spirit and reinforce the bond between water, sand
          and child.
        </Typography>
        <Typography variant="caption" color="textSecondary" sx={{ mt: 0 }}>
          Year: 2008 | License: ----
        </Typography>
      </Box>
    </Layout>
  );
}

const ImageCard = ({
  image,
  name,
  _image,
  _text,
}: {
  image: string;
  name: React.ReactNode | string;
  _image?: object;
  _text?: object;
}) => {
  return (
    <Card sx={{ width: '100%' }}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt={typeof name === 'string' ? name : ''}
          sx={_image}
          image={image}
        />
        <CardContent
          sx={{
            backgroundColor: '#DDE8FF',
            alignItems: 'flex-start',
            textAlign: 'start',
            padding: '12px 10px',
            ..._text,
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '18px',
              letterSpacing: '0.32px',
            }}
          >
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
