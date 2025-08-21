'use client';
import React, { useEffect, useState } from 'react';
import {
  ContentSearchResponse,
  RESOURCE_TYPES,
  MIME_TYPES,
  trackEvent,
} from '@shared-lib';
import Layout from '../../component/layout/layout';
import { Box, useMediaQuery, useTheme, Typography } from '@mui/material';
import atreeLogo from '../../../assets/images/placeholder.jpg';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import FooterText from '../../component/FooterText';
import Footer from '../../component/layout/Footer';
import Grid from '@mui/material/Grid2';
import FilterDialog from 'libs/shared-lib/src/lib/Filterdialog/FilterDialog';
import { useAppTranslation } from '../../utils/i18n.helper';
import { LANGUAGE_KEYS } from '../../utils/language.constants';

// Function to get translated resource types
const getTranslatedResourceTypes = (t: any) => [
  { label: t('FICTION'), value: 'Fiction' },
  { label: t('NON_FICTION'), value: 'Non-Fiction' },
  { label: t('PICTURE_BOOK'), value: 'Picture Book' },
  { label: t('TEXTBOOK_CHAPTER'), value: 'Textbook Chapter' },
  { label: t('FIELD_GUIDE'), value: 'Field Guide' },
  { label: t('ACTIVITY_BOOK'), value: 'Activity Book' },
  { label: t('COMIC_BOOK'), value: 'Comic Book' },
  { label: t('REFERENCE_BOOK'), value: 'Reference Book' },
  { label: t('WEBSITE'), value: 'Website' },
  { label: t('MAGAZINE'), value: 'Magazine' },
  { label: t('POSTER'), value: 'Poster' },
  { label: t('BOARD_GAME'), value: 'Board Game' },
  { label: t('VIDEO'), value: 'video/x-youtube' },
];

interface ListProps {}

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});

const getLocalStorageItem = (key: string) => {
  return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
};

const List: React.FC<ListProps> = () => {
  const { t } = useAppTranslation();
  const [frameworkFilter, setFrameworkFilter] = useState(false);
  const mfe_content = process.env.NEXT_PUBLIC_CONTENT;
  const [isLoadingChildren, setIsLoadingChildren] = React.useState(true);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const router = useRouter();

  const subCategory = getLocalStorageItem('subcategory');
  const storedCategory = getLocalStorageItem('category');

  // Get translated category and subcategory names
  const getTranslatedCategoryName = (name: string) => {
    if (!name) return '';

    // Map API values to translation keys
    const categoryMap: Record<string, string> = {
      Water: 'WATER',
      Land: 'LAND',
      Forest: 'FOREST',
      Potpourri: 'POTPOURRI',
      'Activity Book': 'ACTIVITY_BOOK',
      'Water Basic Concepts': 'WATER_BASIC_CONCEPTS',
      'Water Biodiversity': 'WATER_BIODIVERSITY',
      'Water Conservation': 'WATER_CONSERVATION',
      'Water and Sanitation': 'WATER_AND_SANITATION',
      'Water Crisis': 'WATER_CRISIS',
      'Fresh water ecosystem': 'FRESH_WATER_ECOSYSTEM',
      'Coastal ecosystem': 'COASTAL_ECOSYSTEM',
      'Water based STEM and STEM Activities':
        'WATER_BASED_STEM_AND_STEM_ACTIVITIES',
      Seed: 'SEED',
      'Plants and Vegetables': 'PLANTS_AND_VEGETABLES',
      Agriculture: 'AGRICULTURE',
      'Food and Waste': 'FOOD_AND_WASTE',
      Soil: 'SOIL',
      'Land Biodiversity': 'LAND_BIODIVERSITY',
      'Activity Book on Kitchen Gardens': 'ACTIVITY_BOOK_ON_KITCHEN_GARDENS',
      Trees: 'TREES',
      Grassland: 'GRASSLAND',
      People: 'PEOPLE',
      Wildlife: 'WILDLIFE',
      'Forest Biodiversity': 'FOREST_BIODIVERSITY',
      'Forest Management': 'FOREST_MANAGEMENT',
      'Fiction and Non Fiction': 'FICTION_AND_NON_FICTION',
      'Magazines, Newspapers and Websities':
        'MAGAZINES_NEWSPAPERS_AND_WEBSITIES',
      'Reference Materials': 'REFERENCE_MATERIALS',
      'Climate Change': 'CLIMATE_CHANGE',
      'Lesson Plan': 'LESSON_PLAN',
      Curriculum: 'CURRICULUM',
    };

    const translationKey = categoryMap[name];
    // Type guard to check if the key exists in LANGUAGE_KEYS
    const isValidTranslationKey = (
      key: string
    ): key is keyof typeof LANGUAGE_KEYS => {
      return key in LANGUAGE_KEYS;
    };
    return translationKey && isValidTranslationKey(translationKey)
      ? t(translationKey)
      : name;
  };

  const translatedCategory = storedCategory
    ? getTranslatedCategoryName(storedCategory)
    : '';
  const translatedSubCategory = subCategory
    ? getTranslatedCategoryName(subCategory)
    : '';
  const translatedCategoryLabel = translatedSubCategory
    ? `${translatedCategory} : ${translatedSubCategory}`
    : translatedCategory;

  const [filters, setFilters] = useState<any>({
    request: {
      filters: {
        topic: storedCategory ? [storedCategory] : [],
        subTopic: subCategory ? [subCategory] : [],
        mimeType: [] as string[],
        resource: [] as string[],
      },
      limit: 5,
      offset: 0,
    },
  });

  useEffect(() => {
    const init = async () => {
      // Set loading to true when page loads
      setIsLoadingChildren(true);
    };
    init();
  }, [mfe_content]);
  useEffect(() => {
    trackEvent({
      action: 'view_content_page',
      category: 'Content Page',
    });
  }, []);

  // Set loading to false when framework data is loaded
  useEffect(() => {
    if (frameworkFilter) {
      setIsLoadingChildren(false);
    }
  }, [frameworkFilter]);

  // Handle filter changes and prevent duplicate API calls
  useEffect(() => {
    // Skip if filters were just applied directly to prevent duplicate API calls
    if (isFilterApplied) {
      setIsFilterApplied(false);
      return;
    }

    // Scroll to top when filters change
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [filters, isFilterApplied]);

  // Reset content loading when filters are stable
  useEffect(() => {
    if (!isFilterApplied && isContentLoading) {
      const timer = setTimeout(() => {
        setIsContentLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [filters, isFilterApplied, isContentLoading]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchFrameworkData = async () => {
      try {
        setIsLoadingChildren(true);
        const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
        const response = await fetch(url);
        const frameworkData = await response.json();
        setFrameworkFilter(frameworkData?.result?.framework);
      } catch (error) {
        console.error('Error fetching framework data:', error);
      } finally {
        setIsLoadingChildren(false);
      }
    };
    fetchFrameworkData();
  }, []);

  const handleApplyFilters = (selectedValues: any) => {
    trackEvent({
      action: 'filter_apply',
      category: 'user',
      label: 'Content Page',
    });

    // Set flag to prevent duplicate API calls
    setIsFilterApplied(true);

    // Show content loading for filter changes
    setIsContentLoading(true);

    // Create new filters object
    const newFilters = {
      ...filters,
      request: {
        ...filters.request,
        filters: {
          ...filters.request.filters,
          ...(selectedValues.request?.filters ?? selectedValues),
        },
      },
    };

    // Update filters state directly for better performance
    setFilters(newFilters);

    // Hide content loading after a short delay
    setTimeout(() => {
      setIsContentLoading(false);
    }, 300);
  };

  const contentProps = {
    _grid: {
      size: { xs: 6, sm: 6, md: 4, lg: 3 },
    },
    handleCardClick: (content: ContentSearchResponse) =>
      router.push(`/contents/${content?.identifier}`),
    contentTabs: ['content'],
    filters: {
      filters: {
        channel: process.env.NEXT_PUBLIC_CHANNEL_ID,
        ...filters.request.filters,
      },
    },
    _card: {
      cardName: 'AtreeCard',
      image: atreeLogo.src,
    },
    showSearch: false,
    filterBy: isMobile,
    showArrowback: true,
    showContent: true,
    categoryLabel: translatedCategoryLabel,
  };

  const boxStyles = {
    padding: 0,
    minHeight: '100vh',
    width: '100%',
    overflow: { md: 'hidden', xs: 'auto' },
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <Layout isLoadingChildren={isLoadingChildren} isFooter={isMobile}>
      {!isMobile ? (
        <Grid container spacing={2}>
          <Grid size={{ xs: 3 }}>
            <Box>
              <FilterDialog
                frameworkFilter={frameworkFilter}
                filterValues={filters}
                onApply={handleApplyFilters}
                isMobile={isMobile}
                resources={getTranslatedResourceTypes(t)}
                translations={{
                  resourceType: t('RESOURCE_TYPE'),
                  apply: t('APPLY'),
                  reset: t('RESET'),
                  subject: t('SUBJECT'),
                  contentType: t('CONTENT_TYPE'),
                }}
                // mimeType={MIME_TYPES}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 9 }}>
            <Box sx={boxStyles} position="relative">
              {isContentLoading && (
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
                      Updating content...
                    </Typography>
                  </Box>
                </Box>
              )}
              <Content {...contentProps} />
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Box sx={boxStyles} position="relative">
          {isContentLoading && (
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
                  Updating content...
                </Typography>
              </Box>
            </Box>
          )}
          <Content {...contentProps} />
        </Box>
      )}
      {/* {!isMobile ? <FooterText page="" /> : <Footer />} */}
    </Layout>
  );
};

export default List;
