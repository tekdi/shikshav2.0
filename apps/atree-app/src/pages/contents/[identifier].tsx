// pages/content/[identifier].tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Alert,
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
import Layout from '../../component/layout/layout';
import landingBanner from '../../../assets/images/landingBanner.png';
import Grid from '@mui/material/Grid2';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ShareIcon from '@mui/icons-material/Share';
import atreeLogo from '../../../assets/images/placeholder.jpg';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import {
  AtreeCard,
  ContentSearch,
  trackEvent,
  CommonDialog,
} from '@shared-lib';
import ShareDialog from '../../component/ShareDialog';
import FooterText from '../../component/FooterText';
import Loader from '../../component/layout/LoaderComponent';
import Footer from '../../component/layout/Footer';
import { TelemetryEventType } from '../../utils/app.constant';
import { telemetryFactory } from '../../utils/telemetry';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useAppTranslation } from '../../utils/i18n.helper';
import { LANGUAGE_KEYS } from '../../utils/language.constants';
import GlobalAlert from '../../component/GlobalAlert';
import { cleanupAuthErrorFromUrl } from '../../utils/urlCleanup';
import { ContentHeader } from '../../component/ContentHeader';
import { ContentActions } from '../../component/ContentActions';
import { ContentMetadata } from '../../component/ContentMetadata';
import { useBookmark } from '../../hooks/useBookmark';
import { useContentActions } from '../../hooks/useContentActions';
import { useContentData } from '../../hooks/useContentData';
import { useFrameworkData } from '../../hooks/useFrameworkData';
import { useKeywords } from '../../hooks/useKeywords';
import { useFilters } from '../../hooks/useFilters';

// Function to get translated subcategory names (English values for API, translated labels for display)
const getTranslatedSubcategoryNames = (t: any) => [
  // Water subcategories
  {
    label: t('WATER_BASIC_CONCEPTS'),
    value: 'Water Basic Concepts',
  },
  {
    label: t('WATER_BIODIVERSITY'),
    value: 'Water Biodiversity',
  },
  {
    label: t('WATER_CONSERVATION'),
    value: 'Water Conservation',
  },
  {
    label: t('WATER_AND_SANITATION'),
    value: 'Water and Sanitation',
  },
  {
    label: t('WATER_CRISIS'),
    value: 'Water Crisis',
  },
  {
    label: t('FRESH_WATER_ECOSYSTEM'),
    value: 'Fresh water ecosystem',
  },
  {
    label: t('COASTAL_ECOSYSTEM'),
    value: 'Coastal ecosystem',
  },
  {
    label: t('WATER_BASED_STEM_ACTIVITIES'),
    value: 'Water based STEM and STEM Activities',
  },
  // Land subcategories
  { label: t('SEED'), value: 'Seed' },
  { label: t('PLANTS_AND_VEGETABLES'), value: 'Plants and Vegetables' },
  { label: t('AGRICULTURE'), value: 'Agriculture' },
  { label: t('FOOD_AND_WASTE'), value: 'Food and Waste' },
  { label: t('SOIL'), value: 'Soil' },
  { label: t('LAND_BIODIVERSITY'), value: 'Land Biodiversity' },
  {
    label: t('ACTIVITY_BOOK_ON_KITCHEN_GARDENS'),
    value: 'Activity Book on Kitchen Gardens',
  },
  { label: t('TREES'), value: 'Trees' },
  { label: t('GRASSLANDS'), value: 'Grassland' },
  // Forest subcategories
  { label: t('PEOPLE'), value: 'People' },
  { label: t('WILDLIFE'), value: 'Wildlife' },
  { label: t('FOREST_BIODIVERSITY'), value: 'Forest Biodiversity' },
  { label: t('FOREST_MANAGEMENT'), value: 'Forest Management' },
  { label: t('FOREST_ECOSYSTEMS'), value: 'Forest Ecosystems' },
  // Potpourri subcategories
  { label: t('FICTION_AND_NON_FICTION'), value: 'Fiction and Non Fiction' },
  {
    label: t('MAGAZINES_NEWSPAPERS_WEBSITES'),
    value: 'Magazines, Newspapers and Websities',
  },
  { label: t('REFERENCE_MATERIALS'), value: 'Reference Materials' },
  // Climate Change subcategories
  { label: t('CLIMATE_IMPACTS'), value: 'Climate Impacts' },
  // Activity Book subcategories
  { label: t('LESSON_PLAN'), value: 'Lesson Plan' },
  { label: t('CURRICULUM'), value: 'Curriculum' },
  { label: t('ACTIVITY_WORKBOOKS'), value: 'Activity Workbooks' },
  // General subcategories
  { label: t('GENERAL_TOPICS'), value: 'General Topics' },
  { label: t('MIXED_CONTENT'), value: 'Mixed Content' },
];
const buttonColors = {
  water: '#0E28AE',
  land: '#8F4A50',
  forest: '#148A00',
  'climate change': '#CF3D03',
  'activity books': '#23005A',
  'reference books': '#FFBD0D',
  general: '#FFBD0D',
  potpourri: '#FFBD0D',
};
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
  image?: string; // Added the 'image' property
  appicon?: string; // Added the 'appicon' property
  access?: string; // Added the 'access' property
}

export default function Content() {
  const { t } = useAppTranslation();

  // Clean up authentication error fragments from URL on page load
  useEffect(() => {
    cleanupAuthErrorFromUrl();
  }, []);

  const router = useRouter();
  const { identifier } = router.query; // Access dynamic parameter 'identifier'

  const [isRelatedContentLoading, setIsRelatedContentLoading] = useState(false);
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [homeCategory, setHomeCategory] = useState('');
  const [alert, setAlert] = useState({
    message: '',
    severity: 'info' as 'success' | 'error' | 'warning' | 'info',
  });

  // Use custom hooks
  const bookmarkHook = useBookmark({
    identifier: identifier as string,
    contentData: null, // Will be updated below
  });

  const {
    contentData,
    isLoading,
    relatedContent,
    fetchContent,
    updateRelatedContent,
  } = useContentData({
    identifier: identifier as string,
    onBookmarkStatusCheck: bookmarkHook.checkBookmarkStatus,
  });

  const frameworkData = useFrameworkData();
  const keywordsData = useKeywords({ contentData });
  const { filters, handleApplyFilters } = useFilters(fetchContent);

  const contentActions = useContentActions({
    identifier: identifier as string,
    contentData,
  });

  // Update bookmark hook with contentData
  if (bookmarkHook && contentData) {
    (bookmarkHook as any).contentData = contentData;
  }

  const handleOpen = () => setOpen(true);

  useEffect(() => {
    const storedCategory = localStorage.getItem('category') || '';
    setHomeCategory(storedCategory);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setHasToken(!!token);
  }, []);

  useEffect(() => {
    if (identifier) {
      fetchContent(filters.request.filters);
    }
  }, [identifier, fetchContent, filters.request.filters]);

  const handleCardClick = (content: any) => {
    router.push(`/contents/${content?.identifier}`);
  };

  const selectTagOnClick = async (keyword: any) => {
    try {
      setIsRelatedContentLoading(true);

      trackEvent({
        action: 'tags_content',
        category: 'user',
        label: 'Content Details Page',
      });

      await updateRelatedContent(keyword);
    } catch (error) {
      console.error(`Search failed for keyword ${keyword}:`, error);
    } finally {
      setIsRelatedContentLoading(false);
    }
  };

  // Helper functions to reduce cognitive complexity
  const renderDesktopView = () => (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          padding: '25px',
        }}
      >
        <Grid size={{ xs: 12 }}>
          <ContentHeader
            homeCategory={homeCategory}
            subFrameworkFilter={frameworkData.subFrameworkFilter}
            hasToken={hasToken}
            isBookmarked={bookmarkHook.isBookmarked}
            isBookmarkLoading={bookmarkHook.isBookmarkLoading}
            onBookmarkToggle={bookmarkHook.handleBookmarkToggle}
            onShareClick={handleOpen}
          />

          <Box
            sx={{
              display: 'flex',
              border: '1px solid #C2C7CF',
              padding: '10px',
              gap: 2,
              borderRadius: '10px',
            }}
          >
            {/* Content Image */}
            <Grid size={{ xs: 12, md: 3 }}>
              <ImageCard
                image={contentData?.appicon ?? landingBanner?.src}
                name={''}
              />
            </Grid>

            {/* Content Details */}
            <Grid size={{ xs: 12, md: 9 }}>
              <Stack spacing={2}>
                <Typography
                  textAlign="left"
                  sx={{
                    fontFamily: 'Poppins',
                    fontSize: '24px',
                    fontWeight: 400,
                    color: '#000000',
                  }}
                >
                  {contentData?.name ?? ''}
                </Typography>

                {/* Keywords */}
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '19px',
                    width: '100%',
                  }}
                >
                  {keywordsData.displayedKeywords.map((label: string) => (
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
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          color: '#000000',
                        },
                      }}
                      onClick={() => selectTagOnClick(label.replace('#', ''))}
                    />
                  ))}
                </Box>

                {/* Description */}
                <Typography
                  textAlign="left"
                  sx={{
                    fontFamily: 'Poppins',
                    fontSize: '16px',
                    fontWeight: 400,
                    color: '#000000',
                    width: '84%',
                    textAlign: 'left',
                  }}
                >
                  {contentData?.description ?? ''}
                </Typography>

                {/* Action Buttons */}
                <ContentActions
                  contentData={contentData}
                  onPreview={contentActions.handlePreview}
                  onDownload={contentActions.handleOnDownload}
                  onResourceLink={contentActions.handleOnCLick}
                />

                {/* Metadata */}
                <ContentMetadata contentData={contentData} />
              </Stack>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* Related Content Section */}
      <Box
        sx={{
          width: '100%',
          gap: '16px',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          position: 'relative',
        }}
      >
        {isRelatedContentLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              borderRadius: '8px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #fcd804',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Loading related content...
              </Typography>
            </Box>
          </Box>
        )}
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 700,
              fontFamily: 'Poppins',
              color: '#000000',
            }}
          >
            {t('RELATED_CONTENT')}
          </Typography>
        </Box>
        <AtreeCard
          contents={
            relatedContent?.length > 0 ? relatedContent?.slice(0, 12) : []
          }
          handleCardClick={handleCardClick}
          _grid={{ size: { xs: 6, sm: 6, md: 3, lg: 2 } }}
          _card={{ image: atreeLogo.src, paddingBottom: '40px' }}
          noResourcesText={t(LANGUAGE_KEYS.NO_RESOURCES)}
          recommendHereText={t(LANGUAGE_KEYS.RECOMMEND_HERE)}
        />
      </Box>
    </>
  );

  const renderMobileView = () => (
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              router.push('/home');
            }}
            sx={{
              padding: '4px',
              backgroundColor: 'transparent',
              color: '#000000',
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
              },
              '&:focus': {
                outline: 'none',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <IconButton
              color="primary"
              disabled={bookmarkHook.isBookmarkLoading}
              sx={{
                backgroundColor: 'white',
                color:
                  hasToken && bookmarkHook.isBookmarked ? '#FCD905' : '#2B3133',
                opacity: bookmarkHook.isBookmarkLoading ? 0.6 : 1,
                boxShadow:
                  '-0.73px 0.73px 0.73px -1.46px rgba(255, 255, 255, 0.35) inset, 0px 8px 10px rgba(0, 0, 0, 0.05)',
              }}
              onClick={bookmarkHook.handleBookmarkToggle}
            >
              {hasToken && bookmarkHook.isBookmarked ? (
                <BookmarkIcon />
              ) : (
                <BookmarkBorderIcon />
              )}
            </IconButton>

            <IconButton
              onClick={handleOpen}
              color="primary"
              style={{
                backgroundColor: 'white',
                color: '#2B3133',
                boxShadow:
                  '-0.73px 0.73px 0.73px -1.46px rgba(255, 255, 255, 0.35) inset, 0px 8px 10px rgba(0, 0, 0, 0.05)',
              }}
            >
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <ImageCard
        image={contentData?.appicon ?? landingBanner?.src}
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

      <ContentActions
        contentData={contentData}
        onPreview={contentActions.handlePreview}
        onDownload={contentActions.handleOnDownload}
        onResourceLink={contentActions.handleOnCLick}
        isMobile={true}
      />

      <Typography
        variant="body1"
        sx={{
          mt: 0,
          textAlign: 'left',
          fontFamily: 'Arial',
          lineHeight: '18px',
          fontWeight: '800',
          fontSize: '18px',
        }}
      >
        {contentData?.name ?? ''}
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {keywordsData.displayedKeywords?.map((label: string, index: number) => (
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
        sx={{
          mt: 0,
          textAlign: 'left',
          fontWeight: 400,
          fontFamily: 'Poppins',
          fontSize: '14px',
          lineHeight: '20px',
          color: '#000000',
        }}
      >
        {contentData?.description ?? ''}
      </Typography>

      <ContentMetadata contentData={contentData} isMobile={true} />
    </Box>
  );
  return (
    <>
      {contentData ? (
        <Layout
          // showBack
          // isFooter={isMobile} // add this when on mobile
          // footerComponent={!isMobile ? <FooterText page="" /> : <Footer />}
          isLoadingChildren={isLoading}
          // backIconClick={() => router.back()}
          // backTitle={contentData?.name || ''}
        >
          {!isMobile ? (
            // Desktop View (Carousel on Right, Content on Left)
            <>
              <Grid
                container
                spacing={2}
                sx={{
                  padding: '25px',
                  // marginTop: '60px',
                }}
              >
                {/* Right Side (Content) */}

                <Grid size={{ xs: 12 }}>
                  <ContentHeader
                    homeCategory={homeCategory}
                    subFrameworkFilter={frameworkData.subFrameworkFilter}
                    hasToken={hasToken}
                    isBookmarked={bookmarkHook.isBookmarked}
                    isBookmarkLoading={bookmarkHook.isBookmarkLoading}
                    onBookmarkToggle={bookmarkHook.handleBookmarkToggle}
                    onShareClick={handleOpen}
                  />
                  {/* Share Dialog */}
                  <ShareDialog open={open} handleClose={() => setOpen(false)} />
                  <Box
                    sx={{
                      width: '100%',
                      padding: '12px 0px',
                      gap: '16px',
                      flexDirection: 'column',
                      display: 'flex',
                    }}
                  >
                    <SubFrameworkFilter
                      subFramework={frameworkData.subFramework}
                      setSubFramework={frameworkData.setSubFramework}
                      lastButton={true}
                      subFrameworkFilter={
                        frameworkData.subFrameworkFilter || []
                      }
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      border: '1px solid #C2C7CF',
                      padding: '10px',
                      gap: 2,
                      borderRadius: '10px',
                      // ml: 4,
                    }}
                  >
                    {/* Content Image */}
                    <Grid size={{ xs: 12, md: 3 }}>
                      <ImageCard
                        image={contentData?.appicon ?? landingBanner?.src}
                        name={''}
                      />
                    </Grid>

                    {/* Content Details */}
                    <Grid size={{ xs: 12, md: 9 }}>
                      <Stack spacing={2}>
                        <Typography
                          textAlign="left"
                          sx={{
                            fontFamily: 'Poppins',
                            fontSize: '24px',
                            fontWeight: 400,
                            color: '#000000',
                          }}
                        >
                          {contentData?.name ?? ''}
                        </Typography>
                        {/* Keywords */}
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '19px',
                            width: '100%',
                          }}
                        >
                          {keywordsData.displayedKeywords.map(
                            (label: string) => (
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
                                    fontFamily: 'Poppins',
                                    fontWeight: 500,
                                    color: '#000000',
                                  },
                                }}
                                onClick={() =>
                                  selectTagOnClick(label.replace('#', ''))
                                }
                              />
                            )
                          )}
                        </Box>

                        {/* Description */}
                        <Typography
                          textAlign="left"
                          sx={{
                            fontFamily: 'Poppins',
                            fontSize: '16px',
                            fontWeight: 400,
                            color: '#000000',
                            width: '84%',
                            textAlign: 'left',
                          }}
                        >
                          {contentData?.description ?? ''}
                        </Typography>

                        {/* Action Buttons */}
                        <ContentActions
                          contentData={contentData}
                          onPreview={contentActions.handlePreview}
                          onDownload={contentActions.handleOnDownload}
                          onResourceLink={contentActions.handleOnCLick}
                        />

                        {/* Metadata */}
                        <ContentMetadata contentData={contentData} />
                      </Stack>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>

              {/* Related Content Section */}
              <Box
                sx={{
                  width: '100%',
                  gap: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '20px',
                  position: 'relative',
                  // ml: 4,
                }}
              >
                {isRelatedContentLoading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 1000,
                      borderRadius: '8px',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          border: '4px solid #f3f3f3',
                          borderTop: '4px solid #fcd804',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' },
                          },
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Loading related content...
                      </Typography>
                    </Box>
                  </Box>
                )}
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  <Typography
                    sx={{
                      fontSize: '18px',
                      fontWeight: 700,
                      fontFamily: 'Poppins',
                      color: '#000000',
                    }}
                    onClick={() => router.push('/contents')}
                  >
                    {t('RELATED_CONTENT')}
                  </Typography>
                </Box>
                <AtreeCard
                  contents={
                    relatedContent?.length > 0
                      ? relatedContent?.slice(0, 12)
                      : []
                  }
                  handleCardClick={handleCardClick}
                  _grid={{ size: { xs: 6, sm: 6, md: 3, lg: 2 } }}
                  _card={{ image: atreeLogo.src, paddingBottom: '40px' }}
                  noResourcesText={t(LANGUAGE_KEYS.NO_RESOURCES)}
                  recommendHereText={t(LANGUAGE_KEYS.RECOMMEND_HERE)}
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
                // marginBottom: '15%',
              }}
            >
              <Box sx={{ px: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push('/home');
                    }}
                    sx={{
                      padding: '4px',
                      backgroundColor: 'transparent',
                      color: '#000000',
                      borderRadius: '50%',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.04)',
                      },
                      '&:focus': {
                        outline: 'none',
                      },
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <IconButton
                      color="primary"
                      disabled={bookmarkHook.isBookmarkLoading}
                      sx={{
                        backgroundColor: 'white',
                        color:
                          hasToken && bookmarkHook.isBookmarked
                            ? '#FCD905'
                            : '#2B3133',
                        opacity: bookmarkHook.isBookmarkLoading ? 0.6 : 1,
                        boxShadow:
                          '-0.73px 0.73px 0.73px -1.46px rgba(255, 255, 255, 0.35) inset, 0px 8px 10px rgba(0, 0, 0, 0.05)',
                      }}
                      onClick={bookmarkHook.handleBookmarkToggle}
                    >
                      {hasToken && bookmarkHook.isBookmarked ? (
                        <BookmarkIcon />
                      ) : (
                        <BookmarkBorderIcon />
                      )}
                    </IconButton>

                    <IconButton
                      onClick={handleOpen}
                      color="primary"
                      style={{
                        backgroundColor: 'white',
                        color: '#2B3133',
                        boxShadow:
                          '-0.73px 0.73px 0.73px -1.46px rgba(255, 255, 255, 0.35) inset, 0px 8px 10px rgba(0, 0, 0, 0.05)',
                      }}
                    >
                      <ShareIcon />
                    </IconButton>
                  </Box>

                  {/* Share Dialog */}

                  <ShareDialog open={open} handleClose={() => setOpen(false)} />
                  {/* {subFrameworkFilter && subFrameworkFilter.length > 0 && (
                    <Title>Browse by Sub Categories</Title>
                  )} */}
                </Box>
                {/* <Box
                  sx={{
                    width: '100%',
                    padding: '12px 0px',
                    gap: '16px',
                    flexDirection: 'column',
                    display: 'flex',
                  }}
                >
                  <SubFrameworkFilter
                    subFramework={subFramework}
                    setSubFramework={setSubFramework}
                    lastButton={true}
                    subFrameworkFilter={subFrameworkFilter || []}
                  />
                </Box> */}
                <br></br>
                <ImageCard
                  image={contentData?.appicon ?? landingBanner?.src}
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
              <ContentActions
                contentData={contentData}
                onPreview={contentActions.handlePreview}
                onDownload={contentActions.handleOnDownload}
                onResourceLink={contentActions.handleOnCLick}
                isMobile={true}
              />

              <Typography
                variant="body1"
                sx={{
                  mt: 0,
                  textAlign: 'left',
                  fontFamily: 'Arial',
                  lineHeight: '18px',
                  fontWeight: '800',
                  fontSize: '18px',
                }}
              >
                {contentData?.name ?? ''}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {keywordsData.displayedKeywords?.map(
                  (label: string, index: number) => (
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
                  )
                )}
              </Box>

              <Typography
                variant="body1"
                sx={{
                  mt: 0,
                  textAlign: 'left',
                  fontWeight: 400,
                  fontFamily: 'Poppins',
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#000000',
                }}
              >
                {contentData?.description ?? ''}
              </Typography>

              <ContentMetadata contentData={contentData} isMobile={true} />
            </Box>
          )}
          <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
            <DialogTitle>{t('MORE_KEYWORDS')}</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {keywordsData.remainingKeywords.map((label: string) => (
                  <Chip
                    key={label}
                    label={keywordsData.capitalizeFirstLetter(label)}
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
                {t('CLOSE')}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Alert Message */}
          {bookmarkHook.showAlertMsg && (
            <Alert
              variant="filled"
              severity={bookmarkHook.alertSeverity}
              sx={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 9999,
                pointerEvents: 'auto',
                width: 'auto',
                minWidth: '300px',
                '&:hover': {
                  cursor: 'default',
                },
              }}
              onClose={bookmarkHook.closeAlert}
              onClick={(e) => e.stopPropagation()}
            >
              {bookmarkHook.showAlertMsg}
            </Alert>
          )}

          {/* Bookmark Login Required Dialog */}
          <Dialog
            open={bookmarkHook.openBookmarkDialog}
            onClose={(event, reason) => {
              if (reason === 'backdropClick') return;
              bookmarkHook.closeBookmarkDialog();
            }}
            disableEscapeKeyDown
            PaperProps={{
              style: {
                maxWidth: '600px',
                maxHeight: 'calc(100vh - 64px)',
                overflow: 'auto',
              },
            }}
          >
            <DialogTitle sx={{ m: 0, p: 2 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography sx={{ fontSize: '22px' }}>
                  {t('MESSAGE')}
                </Typography>
                <IconButton
                  aria-label="close"
                  onClick={bookmarkHook.closeBookmarkDialog}
                  sx={{ ml: 2 }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontSize: '16px',
                  fontWeight: '500',
                }}
              >
                {t('LOGIN_REQUIRED_FOR_BOOKMARK')}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', py: 2, px: 3 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  bookmarkHook.closeBookmarkDialog();
                  router.push('/signin');
                }}
                sx={{
                  borderRadius: '50px',
                  height: '40px',
                  width: '30%',
                  backgroundColor: '#fcd804',
                  color: '#000000',
                  fontFamily: 'Poppins',
                  fontSize: '16px',
                  fontWeight: '500',
                  textTransform: 'none',
                }}
              >
                {t('PROCEED')}
              </Button>
            </DialogActions>
          </Dialog>

          <GlobalAlert
            message={alert.message}
            severity={alert.severity}
            onClose={() => setAlert({ message: '', severity: 'info' })}
            autoHide={true}
            autoHideDuration={3000}
          />

          <FooterText page="" />
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
      </CardActionArea>
    </Card>
  );
};
const Title: React.FC<{
  children: React.ReactNode | string;
  onClick?: () => void;
}> = ({ children, onClick }) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
    >
      <Typography
        sx={{
          fontFamily: 'Poppins',
          fontWeight: 600,
          fontSize: { xs: '16px', md: '18px' },
          lineHeight: '28px',
          color: '#000000',
        }}
      >
        {children}
      </Typography>
      {onClick && (
        <IconButton onClick={onClick}>
          <ChevronRightIcon />
        </IconButton>
      )}
    </Box>
  );
};
const SubFrameworkFilter = React.memo<{
  subFrameworkFilter: Array<{ identifier: string; name: string }>;
  subFramework: string;
  setSubFramework: (subFramework: string) => void;
  lastButton: boolean;
}>(function SubFrameworkFilter({
  subFrameworkFilter,
  subFramework,
  setSubFramework,
}) {
  const router = useRouter();
  const { t, ready } = useAppTranslation();

  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [filterItems, setFilterItems] = useState<
    Array<{ identifier: string; name: string }>
  >([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const maxItems = isMobile ? 3 : 5;
  useEffect(() => {
    if (subFrameworkFilter) {
      setFilterItems(subFrameworkFilter.slice(0, maxItems));
    }
  }, [subFrameworkFilter]);
  const handleItemClick = (item: any) => {
    localStorage.setItem('subcategory', item.name);
    router.push(`/contents`);
  };
  const getTranslatedSubcategoryName = (name: string) => {
    // Get translated subcategory names
    const translatedSubcategories = getTranslatedSubcategoryNames(t);
    const translatedSubcategory = translatedSubcategories.find(
      (subcat) => subcat.value.toLowerCase() === name.toLowerCase()
    );

    // Use translated label for display, but keep original name for API calls
    return translatedSubcategory ? translatedSubcategory.label : name;
  };
  return (
    <Grid container spacing={1}>
      {filterItems
        ?.filter((item) => item.name !== 'Magazines, Newspapers and Websities')
        ?.map((subFrameworkItem: any) => (
          <Grid key={subFrameworkItem.identifier}>
            <Chip
              key={subFrameworkItem.name}
              label={getTranslatedSubcategoryName(subFrameworkItem.name)}
              variant="outlined"
              sx={{
                height: 32,
                padding: '4px 6px',
                borderRadius: '8px',
                '& .MuiChip-label': {
                  fontSize: '14px',
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  color: '#000000',
                },
              }}
              onClick={() => {
                trackEvent({
                  action: 'subcategory_click',
                  category: 'user',
                  label: 'Home Page',
                });
                handleItemClick(subFrameworkItem);
              }}
            />
          </Grid>
        ))}
      {subFrameworkFilter?.length > (isMobile ? 3 : 6) && (
        <Chip
          label={
            <MoreVertIcon
              fontSize="medium"
              sx={{ width: '11px', height: '11px' }}
            />
          }
          variant="outlined"
          sx={{
            height: 32,
            padding: '4px 6px',
            borderRadius: '8px',
            '& .MuiChip-label': {
              fontSize: '14px',
              fontFamily: 'Poppins',
              fontWeight: 500,
              color: '#000000',
            },
          }}
          onClick={() => {
            trackEvent({
              action: 'subcategory_click',
              category: 'user',
              label: 'Home Page',
            });
            setOpenPopup(true);
          }}
        />
      )}
      {subFrameworkFilter?.length > (isMobile ? 3 : 6) && openPopup && (
        <Dialog
          open={openPopup}
          onClose={() => setOpenPopup(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            style: {
              maxHeight: '80vh',
              overflow: 'hidden',
            },
          }}
        >
          {/* <DialogTitle>Remaining Data</DialogTitle> */}
          <IconButton
            aria-label="close"
            onClick={() => {
              trackEvent({
                action: 'subcategory_click',
                category: 'user',
                label: 'Home Page',
              });
              setOpenPopup(false);
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#484848',
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent sx={{ padding: '45px 30px' }}>
            {!ready ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '100px',
                }}
              >
                <Typography>{t('LOADING_TRANSLATIONS')}</Typography>
              </Box>
            ) : (
              <FrameworkFilter
                frameworkFilter={subFrameworkFilter}
                framework={subFramework}
                setFramework={setSubFramework}
                fromSubcategory={true}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </Grid>
  );
});
const FrameworkFilter = React.memo<{
  frameworkFilter: Array<{ identifier: string; name: string }>;
  framework: string;
  fromSubcategory?: boolean;
  setFramework: (framework: string) => void;
}>(function FrameworkFilter({
  frameworkFilter,
  framework,
  setFramework,
  fromSubcategory,
}) {
  const router = useRouter();
  const theme = useTheme();
  const { t, ready } = useAppTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getTranslatedSubcategoryName = (name: string) => {
    // If translations are not ready, return the original name to avoid flash
    if (!ready) {
      return name;
    }

    // Get translated subcategory names
    const translatedSubcategories = getTranslatedSubcategoryNames(t);
    const translatedSubcategory = translatedSubcategories.find(
      (subcat) => subcat.value.toLowerCase() === name.toLowerCase()
    );

    // Use translated label for display, but keep original name for API calls
    return translatedSubcategory ? translatedSubcategory.label : name;
  };
  const handleItemClick = (item: any) => {
    if (fromSubcategory) {
      localStorage.setItem('subcategory', item.name);
      router.push(`/contents`);
    } else {
      setFramework(item.identifier);
    }
  };
  return (
    <Grid container spacing={1} display="flex" justifyContent="center">
      {frameworkFilter?.map((frameworkItem: any) => (
        <Grid key={frameworkItem.identifier}>
          <Button
            variant={
              framework === frameworkItem.identifier ? 'contained' : 'outlined'
            }
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 500,
              color: '#000000',
              borderRadius: '8px',
              borderColor:
                framework !== frameworkItem.identifier ? '#CEE5FF' : '',
              backgroundColor:
                framework === frameworkItem.identifier
                  ? frameworkItem?.name?.toLowerCase() in buttonColors
                    ? buttonColors[
                        frameworkItem?.name?.toLowerCase() as keyof typeof buttonColors
                      ]
                    : ''
                  : '',
            }}
            onClick={() => handleItemClick(frameworkItem)}
          >
            {getTranslatedSubcategoryName(frameworkItem.name)}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
});
