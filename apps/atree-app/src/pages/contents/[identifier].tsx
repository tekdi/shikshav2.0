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
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { getContentDetails } from '../../service/content';
import Layout from '../../component/layout/layout';
import landingBanner from '../../../assets/images/landingBanner.png';
import Grid from '@mui/material/Grid2';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import atreeLogo from '../../../assets/images/placeholder.jpg';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import Loader from '../../component/layout/LoaderComponent';
import { AtreeCard, ContentSearch } from '@shared-lib';

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
  description: string;
  publisher: string;
}

export default function Content() {
  const router = useRouter();
  const { identifier } = router.query; // Access dynamic parameter 'identifier'
  const [contentData, setContentData] = useState<ContentItem | null>(null);
  const [contentResultData, setContentResultData] = useState<any>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

      const data = await ContentSearch({
        channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
        filters: {
          topic: localStorage.getItem('category'),
        },
      });
      console.log(data?.result?.content);
      setContentResultData(data?.result?.content || []);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
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
  }, []);

  const fetchFrameworkData = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
      const response = await fetch(url);
      const frameworkData = await response.json();

      const filteredFramework = frameworkData?.result?.framework
        ? {
            ...frameworkData.result.framework,
            categories: frameworkData.result.framework.categories?.filter(
              (category: any) => category.status === 'Live'
            ),
          }
        : { categories: [] }; // Provide a default structure if frameworkData is undefined

      const fdata =
        filteredFramework.categories.find((item: any) => item.code === 'topic')
          ?.terms || [];
    } catch (error) {
      console.error('Error fetching framework data:', error);
    }
  };
  useEffect(() => {
    fetchFrameworkData();
  }, []);

  if (isLoading) return <Loader />;

  const handleCardClick = (content: any) => {
    router.push(`/contents/${content?.identifier}`);
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
      {!isMobile ? (
        // Desktop View (Carousel on Right, Content on Left)
        <>
          <Grid container spacing={2} sx={{ padding: 2 }}>
            {/* Left Side (Content) */}
            <Grid size={{ xs: 12, md: 3 }}>
              {/* {[...Array(4)].map((_, i) => ( */}
              <ImageCard
                image={contentData?.appIcon || landingBanner?.src}
                name={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        {contentData?.name || ''}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {contentData?.publisher || ''}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
              <Stack spacing={2}>
                {/* Keywords */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {displayedKeywords.map((label) => (
                    <Chip
                      key={label}
                      label={label}
                      variant="outlined"
                      sx={{ height: 32, padding: '6px 8px' }}
                    />
                  ))}
                  {showMoreIcon && (
                    <IconButton onClick={() => setOpenPopup(true)} size="small">
                      <MoreVertIcon />
                    </IconButton>
                  )}
                </Box>

                {/* Description */}
                <Typography variant="body1" textAlign="left">
                  {contentData?.description}
                </Typography>

                {/* Know More Button */}
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ borderRadius: '50px', height: '40px', width: '100%' }}
                  onClick={handleOnCLick}
                >
                  Know More
                </Button>

                {/* Year & License */}
                <Typography variant="body1" textAlign="left">
                  <b>Year:</b> {contentData?.year || ''}
                </Typography>
                <Typography variant="body1" textAlign="left">
                  <b>License:</b> {contentData?.license || ''}
                </Typography>
              </Stack>
            </Grid>

            {/* Right Side (Carousel) */}
          </Grid>
          <Box
            sx={{
              width: '100%',
              gap: '16px',
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
            }}
          >
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Typography
                sx={{ fontSize: '22px', fontWeight: 700 }}
                onClick={() => router.push('/contents')}
              >
                Related Content
              </Typography>
              <IconButton onClick={() => router.push('/contents')}>
                <ChevronRightIcon />
              </IconButton>
            </Box>
            <AtreeCard
              contents={
                contentResultData?.length > 4
                  ? contentResultData?.slice(0, 4)
                  : []
              }
              handleCardClick={handleCardClick}
              _grid={{ size: { xs: 6, sm: 6, md: 4, lg: 3 } }}
              _card={{ image: atreeLogo.src }}
            />
          </Box>
        </>
      ) : (
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
            <ImageCard
              image={contentData?.appIcon || landingBanner?.src}
              name={
                <Box display="flex" alignItems="center" gap={1}>
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      {contentData?.name || ''}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {contentData?.publisher || ''}
                    </Typography>
                  </Box>
                </Box>
              }
            />
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

          <Typography variant="body1" sx={{ mt: 0, textAlign: 'left' }}>
            {contentData?.description}
          </Typography>

          <Typography variant="body1" sx={{ mt: 0, textAlign: 'left' }}>
            <b>Year:</b> {contentData?.year || ''}
          </Typography>
          <Typography variant="body1" sx={{ mt: 0, textAlign: 'left' }}>
            <b>License:</b> {contentData?.license || ''}
          </Typography>
        </Box>
      )}
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
