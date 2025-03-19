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
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { Circular } from '@shared-lib';
import { getContentDetails } from '../../service/content';
import Layout from '../../component/layout/layout';
import landingBanner from '../../../assets/images/landingBanner.png';
import Carousel from 'react-material-ui-carousel';
import ShareIcon from '@mui/icons-material/Share';
import ShareDialog from '../../component/ShareDialog';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Loader from '../../component/layout/LoaderComponent';

interface ContentItem {
  name: string;
  gradeLevel: string[];
  language: string[];
  artifactUrl: string;
  identifier: string;
  appIcon: string;
  contentType: string;
  mimeType: string;
  author: string;
  keywords: string[];
  year: string;
  license: string;
}

export default function Content() {
  const router = useRouter();
  const { identifier } = router.query; // Access dynamic parameter 'identifier'
  const [contentData, setContentData] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [openPopup, setOpenPopup] = useState<boolean>(false);

  const handleOnCLick = () => {
    router.push(`/player/${identifier}`);
  };
  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        result: { content: result },
      } = await getContentDetails(identifier as string);
      if (result) {
        setContentData(result);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setIsLoading(false);
    }
  }, [identifier]);
  const keywords = contentData?.keywords || [];
  const showMoreIcon = keywords.length > 3;
  const capitalizeFirstLetter = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1);

  const displayedKeywords = (
    showMoreIcon ? keywords.slice(0, 4) : keywords
  ).map(capitalizeFirstLetter);
  const remainingKeywords = keywords.slice(3);
  useEffect(() => {
    if (identifier) fetchContent();
  }, [identifier]);

  if (isLoading) return <Loader />;

  const handleItemClick = (to: string) => {
    router.push(to);
  };
  const handleShareClick = (event: React.MouseEvent) => {
    // event.stopPropagation(); // Prevent Card click event
    console.log('click');
    setOpenShareDialog(true);
  };
  return (
    <Layout
      showBack
      backIconClick={() => router.back()}
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
            {contentData?.name || ''}
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
            {contentData?.author || ''}
          </Typography>
        </Box>
      }
    >
      <Box
        sx={{
          padding: 2,
          margin: '0 auto',
          textAlign: 'center',
          borderRadius: 2,
          gap: 2.5,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ px: 2 }}>
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
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        {contentData?.name || ''}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        Published by PrathamBooks {i + 1}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            ))}
          </Carousel>
        </Box>
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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {displayedKeywords?.map((label: any, index: any) => (
            <Chip
              key={index}
              label={label}
              variant="outlined"
              sx={{
                height: '32px',
                gap: '2px',
                padding: '6px 8px',
                borderRadius: '0px',
              }}
            />
          ))}
          {showMoreIcon && (
            <IconButton onClick={() => setOpenPopup(true)} size="small">
              <MoreVertIcon />
            </IconButton>
          )}
        </Box>
        <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
          <DialogTitle>More Keywords</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {remainingKeywords.map((label: any) => (
                <Chip
                  key={label}
                  label={label.charAt(0).toUpperCase() + label.slice(1)}
                  variant="outlined"
                  sx={{
                    height: '32px',
                    gap: '8px',
                    padding: '6px 8px',
                    borderRadius: '0px',
                  }}
                />
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenPopup(false)}
              variant="contained"
              color="secondary"
              sx={{
                borderRadius: '50px',
                height: '40px',
                width: '100%',
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Typography variant="body1" sx={{ mt: 0, textAlign: 'left' }}>
          Based on real accounts, this is an imagined story of a boy in the
          aftermath of the 2004 Tsunami that hit several countries. It could
          also be the story of any child whose life is closely linked with
          nature. The narrative follows the feelings of the boy as he tries to
          comprehend the horror and bewilderment of the experience.
        </Typography>
        <Typography variant="body1" sx={{ mt: 0, textAlign: 'left' }}>
          Photographs, not of the devastation but of warmth, present positive
          images that lift the spirit and reinforce the bond between water, sand
          and child.
        </Typography>
        <Typography variant="body1" sx={{ mt: 0, textAlign: 'left' }}>
          <b>Year:</b> {contentData?.year || ''}
        </Typography>
        <Typography variant="body1" sx={{ mt: 0, textAlign: 'left' }}>
          <b>License:</b> {contentData?.license || ''}
        </Typography>
      </Box>
      <ShareDialog
        open={openShareDialog}
        handleClose={() => setOpenShareDialog(false)}
      />
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
