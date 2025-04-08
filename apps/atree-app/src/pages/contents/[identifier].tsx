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
import ShareIcon from '@mui/icons-material/Share';
import atreeLogo from '../../../assets/images/placeholder.jpg';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { AtreeCard, ContentSearch } from '@shared-lib';
import ShareDialog from '../../component/ShareDialog';

interface ContentItem {
  name: string;
  gradeLevel: string[];
  language: string[];
  artifactUrl: string;
  identifier: string;
  posterImage: string;
  contentType: string;
  mimeType: string;
  author: string;
  keywords: string[];
  year: string;
  license: string;
  description: string;
  publisher: string;
  url: string;
  previewUrl: string;
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
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleOnCLick = () => {
    if (contentData?.url) {
      window.open(contentData.url, '_blank');
    }
  };
  const handlePreview = () => {
    router.push(`/player/${identifier}`);
  };
  const handleOnDownload = async () => {
    if (contentData?.previewUrl.endsWith('.pdf')) {
      try {
        const response = await fetch(contentData.previewUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = contentData.name; // Default filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Revoke the blob URL after download to free up memory
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      } catch (error) {
        console.error('Download failed:', error);
      }
    }
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

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Fetches framework data from the API and filters it to include only categories with a status of 'Live'.
   * Constructs a URL using environment variables to specify the base URL and framework identifier.
   * Parses the JSON response to extract the framework data, and applies filtering to keep only live categories.
   * In case the framework data is unavailable, provides a default structure with empty categories.
   * Logs an error message to the console if the fetch operation fails.
   */

  /*******  7ab4bfd8-d767-4480-872d-12d419e51cfb  *******/
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

  const handleCardClick = (content: any) => {
    router.push(`/contents/${content?.identifier}`);
  };
  const selectTagOnClick = (val: any) => {
    router.push(`/searchpage?query=${val}&tags=${true}`);
  };
  return (
    <Layout
      showBack
      isLoadingChildren={isLoading}
      backIconClick={() => router.back()}
      backTitle={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* Left Side - Name and Author */}
          <div style={{ flexGrow: 1 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '22px',
                lineHeight: '28px',
                textAlign: 'left',
              }}
              gutterBottom
            >
              {contentData?.name || ''}
            </Typography>
            {/* <Typography
              variant="subtitle1"
              color="textSecondary"
              sx={{
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '0.15px',
                textAlign: 'left',
              }}
            >
              {contentData?.author || ''}
            </Typography> */}
          </div>

          {/* Right Side - Share Button */}
          {!isMobile && (
            <IconButton
              onClick={handleOpen}
              color="primary"
              style={{ marginLeft: 'auto' }}
            >
              <ShareIcon />
            </IconButton>
          )}
          {/* Share Dialog */}

          <ShareDialog open={open} handleClose={() => setOpen(false)} />
        </div>
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
                image={contentData?.posterImage || landingBanner?.src}
                name={''}
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
                      onClick={() => selectTagOnClick(label.replace('#', ''))}
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
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                      borderRadius: '50px',
                      height: '40px',
                      flex: 0.3,
                    }}
                    onClick={handlePreview}
                  >
                    Preview
                  </Button>
                  {!contentData?.url &&
                    contentData?.previewUrl?.endsWith('.pdf') && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        sx={{
                          borderRadius: '50px',
                          height: '40px',
                          flex: 0.3,
                          color: 'black',
                        }}
                        onClick={handleOnDownload}
                      >
                        Download
                      </Button>
                    )}
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{
                      borderRadius: '50px',
                      height: '40px',
                      flex: 0.3,
                      color: 'black',
                    }}
                    onClick={handleOnCLick}
                  >
                    Resource Link
                  </Button>
                </Box>

                {/* Year & License */}
                <Typography variant="body1" textAlign="left">
                  <b>Author:</b> {contentData?.author || ''}
                </Typography>
                <Typography variant="body1" textAlign="left">
                  <b>Publisher:</b> {contentData?.publisher || ''}
                </Typography>
                <Typography variant="body1" textAlign="left">
                  <b>Year:</b> {contentData?.year || ''}
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
                contentResultData?.length > 0
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
              image={contentData?.posterImage || landingBanner?.src}
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '100%',
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              sx={{ borderRadius: '50px', height: '40px', width: '100%' }}
              onClick={handleOnCLick}
            >
              Know More
            </Button>

            {!contentData?.url && contentData?.previewUrl?.endsWith('.pdf') && (
              <Button
                variant="outlined"
                color="secondary"
                sx={{
                  borderRadius: '50px',
                  height: '40px',
                  width: '100%',
                  backgroundColor: 'white',
                  borderColor: (theme) => theme.palette.secondary.main,
                  color: 'black',
                }}
                onClick={handleOnDownload}
              >
                Download
              </Button>
            )}
          </Box>

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
                onClick={() => selectTagOnClick(label.replace('#', ''))}
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
            <b>Author:</b> {contentData?.author || ''}
          </Typography>
          <Typography variant="body1" sx={{ mt: 0, textAlign: 'left' }}>
            <b>Publisher:</b> {contentData?.publisher || ''}
          </Typography>
          <Typography variant="body1" sx={{ mt: 0, textAlign: 'left' }}>
            <b>Year:</b> {contentData?.year || ''}
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
                onClick={() => selectTagOnClick(label.replace('#', ''))}
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
        {/* <CardContent
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
        </CardContent> */}
      </CardActionArea>
    </Card>
  );
};
