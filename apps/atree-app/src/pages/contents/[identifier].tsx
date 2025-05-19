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

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import { AtreeCard, ContentSearch, trackEvent } from '@shared-lib';
import ShareDialog from '../../component/ShareDialog';
import FooterText from '../../component/FooterText';
import Loader from '../../component/layout/LoaderComponent';
import Footer from '../../component/layout/Footer';

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
  downloadurl: string;
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
  const [relatedContent, setRelatedContent] = useState<any>([]);
  const languageDisplayMap: Record<string, string> = {
    english: 'English',
    hindi: 'हिन्दी',
    marathi: 'मराठी',
    bengali: 'বাংলা',
    assamese: 'অসমীয়া',
    kannada: 'ಕನ್ನಡ',
    tamil: 'தமிழ்',
    malayalam: 'മലയാളം',
  };
  const handleOpen = () => setOpen(true);
  const handleOnCLick = () => {
    trackEvent({
      action: 'resource_open',
      category: 'user',
      label: 'Content Details Page',
    });
    window.open(contentData?.url, '_blank');
  };
  const handlePreview = () => {
    trackEvent({
      action: 'preview_content',
      category: 'user',
      label: 'Content Details Page',
    });
    router.push(`/player/${identifier}`);
  };
  const handleOnDownload = async () => {
    if (contentData?.downloadurl) {
      try {
        const response = await fetch(contentData?.downloadurl);
        const blob = await response?.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = contentData?.name ?? ''; // Default filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        trackEvent({
          action: 'download_content',
          category: 'user',
          label: 'Content Details Page',
        });
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
      if (result && typeof result === 'object') {
        setContentData(result);
      }
      const cleanKeywords = (
        result?.keywords?.filter((item: any) => item) ?? []
      ).slice(0, 4);
      // .map((keyword: any) => `"${keyword}"`); // Remove #
      const queryString = cleanKeywords;

      let relatedContentTemp: ContentItem[] = [];

      try {
        const keywordFilteredResults = await ContentSearch({
          channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
          filters: { keywords: queryString },
        });
        const filtered =
          keywordFilteredResults?.result?.content?.filter(
            (item: any) => item.identifier !== result.identifier
          ) ?? [];

        if (filtered.length > 0) {
          relatedContentTemp = filtered.map((item: any) => ({
            name: item.name ?? '',
            gradeLevel: item.gradeLevel ?? [],
            language: item.language ?? [],
            artifactUrl: item.artifactUrl ?? '',
            identifier: item.identifier ?? '',
            posterImage: item.posterImage ?? '',
            contentType: item.contentType ?? '',
            mimeType: item.mimeType ?? '',
            author: item.author ?? '',
            keywords: item.keywords ?? [],
            year: item.year ?? '',
            license: item.license ?? '',
            description: item.description ?? '',
            publisher: item.publisher ?? '',
            url: item.url ?? '',
            previewUrl: item.previewUrl ?? '',
            downloadurl: item.downloadurl ?? '', // Added missing property
          }));
          // break; // Stop at first successful keyword
        }
      } catch (error) {
        console.error(`Search failed for keyword ${cleanKeywords}:`, error);
        // continue;
      }
      // }

      setRelatedContent(relatedContentTemp);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setIsLoading(false);
    }
  }, [identifier]);

  const keywords = Array.isArray(contentData?.keywords)
    ? contentData.keywords
    : [];
  const showMoreIcon = keywords && keywords.length > 3;
  const capitalizeFirstLetter = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1);

  const displayedKeywords =
    (showMoreIcon ? keywords?.slice(0, 4) : keywords)?.map(
      capitalizeFirstLetter
    ) ?? [];
  const remainingKeywords = keywords.slice(3);
  useEffect(() => {
    if (identifier) {
      fetchContent();
    }
  }, [identifier]);

  const fetchFrameworkData = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
      const response = await fetch(url);
      const frameworkData = await response.json();

      const filteredFramework = frameworkData?.result?.framework
        ? {
            ...frameworkData?.result?.framework,
            categories: Array.isArray(
              frameworkData?.result?.framework?.categories
            )
              ? frameworkData.result.framework.categories.filter(
                  (category: any) => category.status === 'Live'
                )
              : [],
          }
        : { categories: [] }; // Provide a default structure if frameworkData is undefined

      const fdata =
        filteredFramework?.categories?.find(
          (item: any) => item.code === 'topic'
        )?.terms ?? [];
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
  const selectTagOnClick = async (keyword: any) => {
    try {
      setIsLoading(true);
      const keywordFilteredResults = await ContentSearch({
        channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
        query: keyword,
      });

      const filteredContent =
        keywordFilteredResults?.result?.content?.filter(
          (item: any) => item.identifier !== identifier
        ) || [];
        trackEvent({
          action: 'tags_content',
          category: 'user',
          label: 'Content Details Page',
        });
      setRelatedContent(filteredContent);
    } catch (error) {
      console.error(`Search failed for keyword ${keyword}:`, error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {contentData ? (
        <Layout
          showBack
          isFooter={isMobile} // add this when on mobile
          footerComponent={!isMobile ? <FooterText page="" /> : <Footer />}
          isLoadingChildren={isLoading}
          backIconClick={() => router.back()}
          backTitle={contentData?.name || ''}
        >
          {!isMobile ? (
            // Desktop View (Carousel on Right, Content on Left)
            <>
              <Grid
                container
                spacing={2}
                sx={{
                  padding: 2,
                  marginTop: '60px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    border: '1px solid #C2C7CF',
                    padding: '10px',
                    gap: 2,
                    borderRadius: '10px',
                  }}
                >
                  {/* Left Side (Content) */}
                  <Grid size={{ xs: 12, md: 3 }}>
                    {/* {[...Array(4)].map((_, i) => ( */}
                    <ImageCard
                      image={contentData?.posterImage ?? landingBanner?.src}
                      name={''}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 9 }}>
                    <Stack spacing={2}>
                      {/* Keywords */}
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '19px',
                          width: '100%',
                        }}
                      >
                        {displayedKeywords.map((label) => (
                          <Chip
                            key={label}
                            label={label}
                            variant="outlined"
                            sx={{
                              height: 32,
                              padding: '4px 6px',
                              borderRadius: '8px',
                              '& .MuiChip-label': {
                                fontSize: '14px',
                                fontFamily: 'sans-serif',
                                fontWeight: 500,
                                color: '#171D1E',
                              },
                            }}
                            onClick={() =>
                              selectTagOnClick(label.replace('#', ''))
                            }
                          />
                        ))}
                      </Box>

                      {/* Description */}
                      <Typography
                        variant="body1"
                        textAlign="left"
                        fontFamily={'Arial'}
                      >
                        {contentData?.description ?? ''}
                      </Typography>

                      {/* Know More Button */}
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1,
                          width: '100%',
                          '& > button': {
                            flex: 1,
                            minWidth: 0,
                            maxWidth: 152,
                            textTransform: 'none', // Disable default Material-UI uppercase
                            '& .MuiButton-startIcon': {
                              marginRight: '4px', // Adjust icon spacing if needed
                            },
                          },
                        }}
                      >
                        <Button
                          variant="contained"
                          color="secondary"
                          sx={{
                            borderRadius: '50px',
                            height: '40px',
                            padding: '3px',
                            fontSize: '16px',
                            fontWeight: 500,
                          }}
                          onClick={handlePreview}
                          startIcon={<VisibilityOutlinedIcon />}
                        >
                          Preview
                        </Button>

                        <Button
                          variant="outlined"
                          color="secondary"
                          sx={{
                            borderRadius: '50px',
                            height: '40px',
                            color: 'black',
                            padding: '3px',
                            fontSize: '16px',
                            fontWeight: 500,
                          }}
                          startIcon={<FileDownloadOutlinedIcon />}
                          disabled={!contentData?.downloadurl}
                          onClick={handleOnDownload}
                        >
                          Download
                        </Button>

                        <Button
                          variant="outlined"
                          color="secondary"
                          sx={{
                            borderRadius: '50px',
                            height: '40px',
                            color: 'black',
                            padding: '3px',
                            fontSize: '16px',
                            fontWeight: 500,
                          }}
                          startIcon={<LinkOutlinedIcon />}
                          disabled={!contentData?.url}
                          onClick={handleOnCLick}
                        >
                          Resource Link
                        </Button>
                      </Box>

                      {/* Year & License */}
                      <Stack spacing={0.5}>
                        <Typography
                          variant="body1"
                          textAlign="left"
                          fontFamily={'Arial'}
                        >
                          <b>Author:</b> {contentData?.author ?? ''}
                        </Typography>
                        <Typography
                          variant="body1"
                          textAlign="left"
                          fontFamily={'Arial'}
                        >
                          <b>Publisher:</b> {contentData?.publisher ?? ''}
                        </Typography>
                        <Typography
                          variant="body1"
                          textAlign="left"
                          fontFamily={'Arial'}
                        >
                          {contentData?.year ?? ''}
                        </Typography>
                        <Typography
                          variant="body1"
                          textAlign="left"
                          fontFamily={'Arial'}
                        >
                          {(contentData as any)?.language?.[0] && (
                            <Typography
                              variant="body1"
                              textAlign="left"
                              fontFamily="Arial"
                              sx={{
                                display: 'inline-block',
                                backgroundColor: '#FFBD0D', // highlighted yellow
                                padding: '2px 8px',
                                // borderRadius: '8px',
                                fontWeight: 600,
                                fontSize: '1rem',
                                color: '#000',
                              }}
                            >
                              {languageDisplayMap[
                                (
                                  contentData as any
                                ).language[0].toLowerCase?.() ?? ''
                              ] ?? (contentData as any).language[0]}
                            </Typography>
                          )}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                </Box>
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
                    relatedContent?.length > 0
                      ? relatedContent?.slice(0, 12)
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
                pt: '18px',
              }}
            >
              <Box sx={{ px: 2 }}>
                <ImageCard
                  image={contentData?.posterImage ?? landingBanner?.src}
                  name={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          {contentData?.name ?? ''}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          {contentData?.publisher ?? ''}
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
                  textTransform: 'none',
                  alignItems: 'center',
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    borderRadius: '50px',
                    height: '40px',
                    flex: 0.3,
                    width: '100%',
                    fontSize: '14px',
                    fontWeight: 500,
                    textTransform: 'none',
                    maxWidth: '344px',
                  }}
                  startIcon={<VisibilityOutlinedIcon />}
                  onClick={handlePreview}
                >
                  Preview
                </Button>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    width: '100%',
                    maxWidth: '300px',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{
                      borderRadius: '50px',
                      height: '40px',
                      flex: 1,
                      color: 'black',
                      fontSize: '14px',
                      fontWeight: 500,
                      textTransform: 'none',
                      width: '48%',
                    }}
                    startIcon={<FileDownloadOutlinedIcon />}
                    onClick={handleOnDownload}
                    disabled={!contentData?.previewUrl?.endsWith('.pdf')}
                  >
                    Download
                  </Button>

                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{
                      borderRadius: '50px',
                      height: '40px',
                      flex: 1,
                      color: 'black',
                      fontSize: '14px',
                      fontWeight: 500,
                      textTransform: 'none',
                      width: '48%',
                      whiteSpace: 'nowrap',
                    }}
                    startIcon={<LinkOutlinedIcon />}
                    disabled={!contentData?.url}
                    onClick={handleOnCLick}
                  >
                    Resource Link
                  </Button>
                </Box>
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
                      padding: '4px 6px',
                      borderRadius: '8px',
                    }}
                    onClick={() => selectTagOnClick(label.replace('#', ''))}
                  />
                ))}
              </Box>

              <Typography
                variant="body1"
                sx={{ mt: 0, textAlign: 'left', fontFamily: 'Arial' }}
              >
                {contentData?.description ?? ''}
              </Typography>

              <Stack spacing={0.5}>
                <Typography
                  variant="body1"
                  textAlign="left"
                  fontFamily={'Arial'}
                >
                  <b>Author:</b> {contentData?.author || ''}
                </Typography>
                <Typography
                  variant="body1"
                  textAlign="left"
                  fontFamily={'Arial'}
                >
                  <b>Publisher:</b> {contentData?.publisher ?? ''}
                </Typography>
                <Typography
                  variant="body1"
                  textAlign="left"
                  fontFamily={'Arial'}
                >
                  {contentData?.year ?? ''}
                </Typography>
                <Typography
                  variant="body1"
                  textAlign="left"
                  fontFamily={'Arial'}
                >
                  {(contentData as any)?.language?.[0] && (
                    <Typography
                      variant="body1"
                      textAlign="left"
                      fontFamily="Arial"
                      sx={{
                        display: 'inline-block',
                        backgroundColor: '#FFBD0D', // highlighted yellow
                        padding: '2px 8px',
                        // borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: '#000',
                      }}
                    >
                      {languageDisplayMap[
                        (contentData as any).language[0]?.toLowerCase?.() ?? ''
                      ] ?? (contentData as any).language[0]}
                    </Typography>
                  )}
                </Typography>
              </Stack>
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
      ) : (
        <Loader />
      )}
    </>
  );
}

const ImageCard = ({
  image,
  name,
  _image,
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
