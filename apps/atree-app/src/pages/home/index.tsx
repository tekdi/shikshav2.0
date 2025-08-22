/* eslint-disable no-constant-binary-expression */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
'use client';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Switch,
  Typography,
  useMediaQuery,
  useTheme,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  AtreeCard,
  ContentSearch,
  FilterDialog,
  RESOURCE_TYPES,
  MIME_TYPES,
  trackEvent,
} from '@shared-lib';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import atreeLogo from '../../../assets/images/placeholder.jpg';
import Layout from '../../component/layout/layout';
import { useAppTranslation } from '../../utils/i18n.helper';
import { useSearchParams } from 'next/navigation';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Loader from '../../component/layout/LoaderComponent';
import dynamic from 'next/dynamic';
import FooterText from '../../component/FooterText';
import Footer from '../../component/layout/Footer';
import Link from 'next/link';
import { TelemetryEventType } from '../../utils/app.constant';
import { telemetryFactory } from '../../utils/telemetry';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { LANGUAGE_KEYS } from '../../utils/language.constants';
import { readBookmark } from '../../service/content';
import { useAuthPopup } from '../../hooks/useAuthPopup';
import { useKeycloakManager } from '../../hooks/useKeycloakManager';

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

// Function to get translated MIME types
const getTranslatedMimeTypes = (t: any) => [
  { label: t('VIDEOS'), value: 'video/x-youtube' },
  { label: t('PDF'), value: 'application/pdf' },
];

// Function to get translated category names (English values for API, translated labels for display)
const getTranslatedCategoryNames = (t: any) => [
  // Main categories
  { label: t('WATER'), value: 'Water' },
  { label: t('LAND'), value: 'Land' },
  { label: t('FOREST'), value: 'Forest' },
  { label: t('CLIMATE_CHANGE'), value: 'Climate Change' },
  { label: t('ACTIVITY_BOOKS'), value: 'Activity Books' },
  { label: t('REFERENCE_BOOKS'), value: 'Reference Books' },
  { label: t('GENERAL'), value: 'General' },
  { label: t('POTPOURRI'), value: 'Potpourri' },
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
const Content = dynamic(() => import('@Content'), { ssr: false });

interface ContentSectionProps {
  contentData: ContentType[];
  handleCardClick: (content: ContentType) => void;
}

// Helper to get user telemetry info
function getUserTelemetryInfo() {
  const userId =
    typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const isLoggedIn = !!userId && userId !== 'Anonymous';
  return {
    userId: isLoggedIn ? userId : 'Anonymous',
    isLoggedIn,
    subtype: isLoggedIn ? 'login-user' : 'non-login-user',
  };
}

export default function Index() {
  const { t, i18n, ready } = useAppTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const [contentData, setContentData] = useState<any>([]);
  const { showLoginPopup, checkAndRedirectAfterLogin } = useAuthPopup();
  const { disableSSO } = useKeycloakManager();

  const [consumedContent, setConsumedContent] = useState<string[]>([]);
  const [frameworkFilter, setFrameworkFilter] = useState();
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const [framework, setFramework] = useState('');
  const [subFrameworkFilter, setSubFrameworkFilter] = useState<any[]>([]);
  const [subFramework, setSubFramework] = useState('');
  const [filterCategory, SetFilterCategory] = useState<string>('');
  const [isLoadingChildren, setIsLoadingChildren] = useState(true);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [fullAccess, setFullAccess] = useState(false);
  const [filters, setFilters] = useState<any>({
    request: {
      filters: {},
      offset: 0,
      limit: 5,
    },
  });
  const [filterData, setFilterData] = useState();
  const searchParams = useSearchParams();
  console.log('searchParams', searchParams);
  const frameworkName = searchParams.get('category')?.toLocaleUpperCase();
  const bookmark = searchParams.get('bookmark');
  console.log('bookmark', bookmark);
  // **Handle API Calls with Updated Filters**
  useEffect(() => {
    // Scroll to top when framework or filterCategory changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [framework, filterCategory, subFramework]);
  const fetchContentData = async (updatedFilters: any) => {
    try {
      // Only show loading for initial loads, not for filter changes
      if (!contentData.length) {
        setIsLoadingChildren(true);
      }

      let finalFilters = { ...updatedFilters };

      // If bookmark is true, fetch bookmarked content IDs and filter by them
      if (bookmark === 'true') {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (token && userId) {
          try {
            const bookmarkResponse = await readBookmark(
              {
                userId: userId,
                entityType: 'content',
                doId: '',
              },
              token
            );

            if (bookmarkResponse?.result?.bookmarks?.length > 0) {
              const bookmarkedIds = bookmarkResponse.result.bookmarks.map(
                (bookmark: any) => bookmark.doId
              );

              // For bookmarks, merge identifier filter with other filters (like resource type)
              finalFilters = {
                ...finalFilters, // Keep existing filters (like resource type)
                identifier: bookmarkedIds,
              };

              console.log(
                'Bookmark mode - finalFilters after merging:',
                finalFilters
              );

              // Remove topic filter for bookmarks
              delete finalFilters.topic;
            } else {
              // If no bookmarks found, set empty content
              setContentData([]);
              setIsLoadingChildren(false);
              return;
            }
          } catch (bookmarkError) {
            console.error('Error fetching bookmarks:', bookmarkError);
            setContentData([]);
            setIsLoadingChildren(false);
            return;
          }
        } else {
          // If no token or userId, set empty content for bookmark view
          setContentData([]);
          setIsLoadingChildren(false);
          return;
        }
      }

      console.log(
        'Home page - ContentSearch API call with filters:',
        finalFilters
      );
      const data = await ContentSearch({
        channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
        filters: finalFilters,
      });

      // Update content data smoothly without causing full page reload
      setContentData(data?.result?.content ?? []);
    } catch (error) {
      console.error('Error fetching content data:', error);
    } finally {
      setIsLoadingChildren(false);
    }
  };

  // **Update Filters and Trigger API Call in One Step**
  const handleApplyFilters = async (selectedValues: any) => {
    console.log('Home page - handleApplyFilters received:', selectedValues);
    trackEvent({
      action: 'filter_apply',
      category: 'user',
      label: 'Home Page',
    });
    const { offset, limit, ...filters } = selectedValues;

    // Create a new filters object, preserving previous filters
    let cleanedFilters = {
      ...filters.request?.filters,
      ...Object.fromEntries(
        Object.entries(filters).filter(
          ([key, value]) => Array.isArray(value) && value.length > 0
        )
      ),
    };

    // Ensure topic is set correctly (only if not in bookmark mode)
    if (bookmark !== 'true') {
      if (filterCategory) {
        cleanedFilters.topic = [filterCategory];
      }
    }

    // Explicitly remove mimeType if it's empty OR if it's inherited from prevFilters
    if (!filters.mimeType || filters.mimeType.length === 0) {
      delete cleanedFilters.mimeType;
    }
    if (!filters.resource || filters.resource.length === 0) {
      delete cleanedFilters.resource;
    }

    const newFilters = {
      request: {
        filters: cleanedFilters,
        offset: offset ?? 0,
        limit: limit ?? 5,
      },
    };

    // Set flag to prevent duplicate API calls
    setIsFilterApplied(true);

    // Update filters state and fetch content in parallel for better performance
    setFilters(newFilters);
    fetchContentData(cleanedFilters);
  };
  useEffect(() => {
    trackEvent({
      action: 'view_home_page',
      category: 'Home Page',
    });
  }, []);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId');
      const isLoggedIn = !!userId && userId !== 'Anonymous';
      telemetryFactory.impression({
        edata: {
          type: TelemetryEventType.VIEW,
          pageid: 'home-page',
          uri: window.location.pathname,
          subtype: isLoggedIn ? 'login-user' : 'non-login-user',
        },
        context: {
          env: 'home',
          cdata: [{ id: isLoggedIn ? userId : 'Anonymous', type: 'User' }],
        },
      });
    }
  }, []);
  // **Initial Data Fetch Based on frameworkName**
  useEffect(() => {
    const init = async () => {
      try {
        //Framework URL
        const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
        //response from API
        const frameworkData = await fetch(url).then((res) => res.json());
        //category data
        const frameworks = frameworkData?.result?.framework?.categories;
        //Framework topic wise data

        const fdata =
          frameworks.find((item: any) => item.code === 'topic')?.terms || [];

        setFrameworkFilter(fdata);

        // Filter live categories
        setFilterData({
          ...frameworkData?.result?.framework,
          categories: frameworkData?.result?.framework.categories.filter(
            (category: any) => category.status === 'Live'
          ),
        });

        // If bookmark is true, show all bookmarked content without category restrictions
        if (bookmark === 'true') {
          const newFilters = {};
          setFilters({
            request: {
              filters: newFilters,
              offset: 0,
              limit: 5,
            },
          });
          fetchContentData(newFilters);
          return;
        }

        // Check if we're on the landing page
        const isLandingPage =
          router.pathname === '/' || router.pathname === '/index';

        if (isLandingPage) {
          // On landing page, don't set any framework or category (empty selection)
          setFramework('');
          SetFilterCategory('');
          setSubFrameworkFilter([]);

          // On landing page, don't set any framework or category (empty selection)
          setFramework('');
          SetFilterCategory('');
          setSubFrameworkFilter([]);

          // Set empty filters for landing page
          const newFilters = {
            request: {
              filters: {},
              offset: 0,
              limit: 5,
            },
          };
          setFilters(newFilters);
          fetchContentData({});

          return;
        } else {
          // On other pages, apply saved selection or default to first item
          let selectedFramework = fdata[0];

          // Check if there's already a selected framework in localStorage
          const savedCategory = localStorage.getItem('category');

          if (savedCategory) {
            // Try to find the saved category in the framework data
            const foundFramework = fdata.find(
              (item: any) =>
                item.name.toLowerCase() === savedCategory.toLowerCase()
            );
            if (foundFramework) {
              selectedFramework = foundFramework;
            }
          }

          //condition if category from URL
          if (frameworkName) {
            const foundFramework = fdata.find(
              (item: any) =>
                item.name.toLowerCase() === frameworkName.toLowerCase()
            );
            if (foundFramework) {
              selectedFramework = foundFramework;
            }
          }

          const selectedCategory = selectedFramework?.name;
          const selectedIdentifier = selectedFramework?.identifier;

          setFramework(selectedIdentifier);
          SetFilterCategory(selectedCategory);
          localStorage.setItem('category', selectedCategory);

          const newFilters = {
            topic: [selectedCategory],
          };

          setFilters({
            request: {
              filters: newFilters,
              offset: 0,
              limit: 5,
            },
          });

          fetchContentData(newFilters);
        }
      } catch (error) {
        console.error('Error fetching board data:', error);
      } finally {
        setIsLoadingChildren(false);
      }
    };

    init();
  }, [frameworkName, bookmark]);

  // **Update FilterCategory When Framework Changes**
  useEffect(() => {
    // Check if we're on the landing page
    const isLandingPage =
      router.pathname === '/' || router.pathname === '/index';

    if (isLandingPage) {
      // On landing page, don't update categories or subcategories
      return;
    }

    if (framework && frameworkFilter) {
      //@ts-check
      const subFrameworkData = frameworkFilter?.find(
        (item: any) => item.identifier === framework
      );

      const categoryName = subFrameworkData?.name
        ? subFrameworkData.name.charAt(0).toUpperCase() +
          subFrameworkData.name.slice(1).toLowerCase()
        : '';

      SetFilterCategory(categoryName);
      localStorage.setItem('category', categoryName);
      setFullAccess(false);
      const uniqueAssociations = Array.from(
        new Map(
          subFrameworkData?.associations?.map((item: any) => [item?.name, item])
        ).values()
      );

      setSubFrameworkFilter(uniqueAssociations);

      if (filterCategory !== categoryName) {
        setFilters({
          request: { filters: { topic: [categoryName] }, offset: 0, limit: 5 },
        });
      }
    }
  }, [framework, frameworkFilter, frameworkName]);

  // **Listen for Filter Changes and Fetch Content**
  useEffect(() => {
    // Skip if filters were just applied directly to prevent duplicate API calls
    if (isFilterApplied) {
      setIsFilterApplied(false);
      return;
    }

    if (
      filters.request.filters &&
      Object.keys(filters.request.filters).length
    ) {
      fetchContentData(filters.request.filters);
    }
  }, [filters, isFilterApplied]); // ✅ Fetch only when `filters` change

  // **Handle Content Click**
  const handleCardClick = (content: any) => {
    trackEvent({
      action: `${filterCategory} - ${content?.name}`,
      category: 'user',
      label: 'Home Page',
    });
    const { userId, subtype } = getUserTelemetryInfo();
    telemetryFactory.interact({
      edata: {
        id: `${filterCategory} - ${content?.name}`,
        type: TelemetryEventType.CLICK,
        subtype,
        pageid: 'home-page',
      },
      context: {
        env: 'home',
        cdata: [{ id: userId, type: 'User' }],
      },
    });
    console.log('deviceId', localStorage.getItem('deviceId'));

    const deviceId = localStorage.getItem('deviceId');
    const currentContentId = content?.identifier;

    let existingMap = JSON.parse(
      localStorage.getItem('deviceContentMap') || '{}'
    );

    // Initialize if missing
    if (!existingMap[deviceId]) {
      existingMap[deviceId] = [];
    }

    // Only push currentContentId if not already present
    if (!existingMap[deviceId].includes(currentContentId)) {
      existingMap[deviceId].push(currentContentId);
      localStorage.setItem('deviceContentMap', JSON.stringify(existingMap));
    }

    // Now check if the device has already accessed 3 DO IDs
    if (existingMap[deviceId].length < 4) {
      router.push(`/contents/${currentContentId}`);

      setConsumedContent((prev) => {
        const updatedContent = [...(prev || []), currentContentId];
        localStorage.setItem('consumedContent', JSON.stringify(updatedContent));
        return updatedContent;
      });
    } else if (!localStorage.getItem('token')) {
      // Show login dialog for 4th content access
      setOpenMessageDialog(true);
      localStorage.setItem('pendingContentRedirect', currentContentId);
    } else {
      router.push(`/contents/${currentContentId}`);
    }
  };
  const handleToggleFullAccess = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const accessValue = event.target.checked ? 'Full Access' : 'all'; // Set 'full' or 'all' based on switch state
    setFullAccess(event.target.checked);
    if (accessValue === 'Full Access') {
      localStorage.setItem('access', accessValue);
    } else {
      localStorage.removeItem('access'); // Remove when unchecked
    }
    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters.request.filters, // Preserve existing filters
        ...(filterCategory && { topic: [filterCategory] }),
      };

      if (accessValue === 'Full Access') {
        updatedFilters.access = 'Full Access';
      } else {
        delete updatedFilters.access;
      }

      const newFilters = {
        request: {
          filters: updatedFilters,
          offset: prevFilters.request.offset ?? 0,
          limit: prevFilters.request.limit ?? 5,
        },
      };

      fetchContentData(newFilters.request.filters);
      return newFilters;
    });
  };
  // **Restore Consumed Content from LocalStorage**
  useEffect(() => {
    const storedContent = localStorage.getItem('consumedContent');
    if (storedContent) {
      setConsumedContent(JSON.parse(storedContent));
    }
  }, [frameworkName]);

  // Disable SSO check for public browsing
  useEffect(() => {
    disableSSO();
  }, [disableSSO]);

  // Check for redirect after successful login
  useEffect(() => {
    checkAndRedirectAfterLogin();
  }, [checkAndRedirectAfterLogin]);

  // **Handle Dialog Close**
  const handleCloseMessage = () => {
    setOpenMessageDialog(false);
    router.push('/signin');
  };

  console.log('Filters:', frameworkName);
  console.log('Filters filters:', filters);

  console.log('Content Data:', contentData);
  const hasFilter =
    (filters?.request?.filters?.mimeType?.length ?? 0) > 0 ||
    (filters?.request?.filters?.resource?.length ?? 0) > 0 ||
    (filters?.request?.filters?.access?.length ?? 0) > 0;
  const renderFooterComponent = () => {
    if (!isMobile) {
      return <FooterText page="" />;
    }
    return undefined;
  };
  useEffect(() => {
    if (subFramework) {
      const selectedSubFramework = subFrameworkFilter.find(
        (item) => item.identifier === subFramework
      );

      if (selectedSubFramework) {
        const newFilters = {
          ...filters.request.filters,
          ...(filterCategory && { topic: [filterCategory] }),
          subTopic: [selectedSubFramework.name], // Add subTopic filter
        };

        setFilters({
          request: {
            filters: newFilters,
            offset: 0,
            limit: 5,
          },
        });

        fetchContentData(newFilters);
      }
    }
  }, [subFramework, subFrameworkFilter]);

  useEffect(() => {
    if (framework && frameworkFilter) {
      // Reset subFramework when framework changes
      setSubFramework(''); // Add this line

      const subFrameworkData = frameworkFilter?.find(
        (item: any) => item.identifier === framework
      );
      // ... rest of your code
    }
  }, [framework, frameworkFilter, frameworkName]);
  const transformDisplayName = (name: string) => {
    // Get translated subcategory names
    const translatedSubcategories = getTranslatedSubcategoryNames(t);
    const translatedSubcategory = translatedSubcategories.find(
      (subcat) => subcat.value.toLowerCase() === name.toLowerCase()
    );

    // Use translated label for display, but keep original name for API calls
    return translatedSubcategory ? translatedSubcategory.label : name;
  };

  // Don't render until translations are ready
  if (!ready) {
    return <Loader />;
  }

  return (
    <Layout
      isLoadingChildren={isLoadingChildren}
      footerComponent={renderFooterComponent()}
    >
      <Box display="flex" flexDirection="column" gap="1rem" py="1rem">
        {!isMobile ? (
          <Grid container spacing={2} sx={{ padding: '25px' }}>
            <Grid size={{ xs: 3 }}>
              <Box>
                <FilterDialog
                  frameworkFilter={filterData}
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
                />
              </Box>
            </Grid>

            {hasFilter ? (
              <Grid size={{ xs: 9 }}>
                <Box
                  sx={{
                    width: '100%',
                    gap: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '12px',
                  }}
                >
                  <ContentSection
                    contents={contentData.length > 0 ? contentData : []}
                    title={!hasFilter ? '' : undefined}
                    onTitleClick={() => {
                      localStorage.removeItem('subcategory');
                      router.push('/contents');
                    }}
                    handleCardClick={handleCardClick}
                  />
                </Box>
              </Grid>
            ) : (
              <Grid size={{ xs: 9 }}>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '9px 0px',
                  }}
                >
                  {/* Header section - show for both bookmark and regular views */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: bookmark === 'true' ? '16px' : '0px',
                    }}
                  >
                    {bookmark === 'true' ? (
                      <Title>{LANGUAGE_KEYS.BOOKMARKED_CONTENT}</Title>
                    ) : (
                      subFrameworkFilter &&
                      subFrameworkFilter.length > 0 && (
                        <Title>{LANGUAGE_KEYS.BROWSE_SUBCATEGORIES}</Title>
                      )
                    )}
                  </Box>

                  {/* SubFrameworkFilter - only show when not in bookmark mode */}
                  {bookmark !== 'true' && (
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
                        subFramework={
                          router.pathname === '/' ||
                          router.pathname === '/index'
                            ? ''
                            : subFramework
                        }
                        setSubFramework={setSubFramework}
                        lastButton={true}
                        subFrameworkFilter={subFrameworkFilter || []}
                      />
                    </Box>
                  )}

                  <ContentSection
                    contents={contentData.length > 0 ? contentData : []}
                    title=""
                    onTitleClick={() => {
                      localStorage.removeItem('subcategory');
                      router.push('/contents');
                    }}
                    handleCardClick={handleCardClick}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        ) : (
          <Box sx={{ marginTop: '1rem', marginBottom: '2rem' }}>
            <FrameworkFilter
              frameworkFilter={frameworkFilter || []}
              framework={framework}
              setFramework={setFramework}
              fromSubcategory={false}
              onClick={() => {
                setFramework(item.identifier);
                setSubFramework('');
              }}
            />

            {bookmark !== 'true' &&
              subFrameworkFilter &&
              subFrameworkFilter.length > 0 && (
                <Box
                  sx={{
                    paddingTop: '5%',
                    width: '80%',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <FormControl fullWidth sx={{ maxWidth: 400 }}>
                    <Select
                      value={subFramework || ''}
                      displayEmpty
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        setSubFramework(selectedValue);
                      }}
                      renderValue={(selected) => {
                        if (!selected || selected === '') {
                          return (
                            <span style={{ color: '#999' }}>
                              {bookmark === 'true'
                                ? t(LANGUAGE_KEYS.BOOKMARKED_CONTENT)
                                : t(LANGUAGE_KEYS.BROWSE_BY_SUB_CATEGORIES)}
                            </span>
                          );
                        }
                        const selectedItem = subFrameworkFilter.find(
                          (item) => item.identifier === selected
                        );
                        return selectedItem
                          ? transformDisplayName(selectedItem.name)
                          : selected;
                      }}
                      sx={{
                        borderRadius: '50px',
                        fontSize: '14px',
                        height: 40,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid #000',
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            borderRadius: '16px',
                            fontSize: '14px',
                          },
                        },
                      }}
                    >
                      {subFrameworkFilter
                        ?.filter(
                          (item) =>
                            item.name !== 'Magazines, Newspapers and Websities'
                        )
                        .map((item) => (
                          <MenuItem
                            key={item.identifier}
                            value={item.identifier}
                          >
                            {transformDisplayName(item.name)}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Box>
              )}

            {bookmark === 'true' && !localStorage.getItem('token') && (
              <Box
                sx={{
                  paddingTop: '5%',
                  width: '80%',
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontSize: '16px',
                    fontWeight: '500',
                    textAlign: 'center',
                    color: '#666',
                    mb: 2,
                  }}
                >
                  {t(LANGUAGE_KEYS.LOGIN_REQUIRED)}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => router.push('/signin')}
                  sx={{
                    borderRadius: '50px',
                    height: '40px',
                    backgroundColor: '#fcd804',
                    color: '#000000',
                    fontFamily: 'Poppins',
                    fontSize: '16px',
                    fontWeight: '500',
                    textTransform: 'none',
                    px: 3,
                  }}
                >
                  {t(LANGUAGE_KEYS.PROCEED)}
                </Button>
              </Box>
            )}

            <Box
              sx={{
                flexDirection: 'column',
                width: '100%',
                gap: '16px',
                padding: '15px',
                display: 'flex',
              }}
            >
              <ContentSection
                title={t('')}
                handleCardClick={handleCardClick}
                onTitleClick={() => {
                  localStorage.removeItem('subcategory');
                  router.push('/contents');
                }}
                contents={contentData.length > 0 ? contentData : []}
              />
            </Box>
          </Box>
        )}
      </Box>

      <Dialog
        open={openMessageDialog}
        onClose={(event, reason) => {
          if (reason === 'backdropClick') return;
          setOpenMessageDialog(false);
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
            <Typography sx={{ fontSize: '22px' }}>{t('MESSAGE')}</Typography>
            <IconButton
              aria-label="close"
              onClick={handleCloseMessage}
              sx={{ ml: 2 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{ fontFamily: 'Poppins', fontSize: '16px', fontWeight: '500' }}
          >
            {t(LANGUAGE_KEYS.LOGIN_REQUIRED)}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', py: 2, px: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseMessage}
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
            {t(LANGUAGE_KEYS.PROCEED)}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

// Update getServerSideProps to handle locale properly
export async function getServerSideProps({ req }) {
  try {
    // Get the language from localStorage on the server side
    const language = req.cookies?.selectedLanguage || 'en';
    console.log('Loading translations for language:', language);

    // Load translations
    const translations = await serverSideTranslations(language, ['common']);
    console.log('Translations loaded:', translations);

    return {
      props: {
        ...translations,
      },
    };
  } catch (error) {
    console.error('Error loading translations:', error);
    // Fallback to English if there's an error
    const translations = await serverSideTranslations('en', ['common']);
    return {
      props: {
        ...translations,
      },
    };
  }
}
const SwitchAccess = ({ fullAccess, handleToggleFullAccess }: any) => {
  const { t } = useAppTranslation();
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      marginLeft="auto"
      width={'28%'}
    >
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: fullAccess ? '400' : '600',
          color: fullAccess ? '#9E9E9E' : '#000000',
        }}
      >
        {t(LANGUAGE_KEYS.ALL_ACCESS)}
      </Typography>

      <Switch
        checked={fullAccess}
        onChange={handleToggleFullAccess}
        sx={{
          height: 26,
          padding: 0,
          width: 42,
          '& .MuiSwitch-switchBase': {
            transitionDuration: '300ms',
            padding: 0,
            '&.Mui-checked': {
              color: '#fff',
              transform: 'translateX(16px)',
              '& + .MuiSwitch-track': {
                background: '#fcd804',
                opacity: 1,
                border: 0,
              },
              '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
              },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
              border: '6px solid #fff',
              color: '#33cf4d',
            },

            '&.Mui-disabled + .MuiSwitch-track': {
              background: '#BDBDBD',
              opacity: 0.5,
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
              color: '#BDBDBD',
            },
          },
          '& .MuiSwitch-thumb': {
            height: 25,
            boxSizing: 'border-box',
            width: 25,
          },
          '& .MuiSwitch-track': {
            background: fullAccess ? '#fcd804' : '#BDBDBD',
            opacity: 1,
            borderRadius: 26 / 2,
          },
        }}
      />

      <Typography
        sx={{
          color: fullAccess ? '#000000' : '#9E9E9E',
          fontSize: '14px',
          fontWeight: fullAccess ? '600' : '400',
        }}
      >
        {t(LANGUAGE_KEYS.FULL_ACCESS)}
      </Typography>
    </Box>
  );
};
const ContentSection = ({ title, contents, onTitleClick, handleCardClick }) => {
  const { t } = useAppTranslation();

  return (
    <Box
      sx={{
        width: '100%',
        gap: '16px',
        display: 'flex',
        flexDirection: 'column',
        padding: '0px',
      }}
    >
      {title && <Title onClick={onTitleClick}>{title}</Title>}

      {contents && contents.length > 0 ? (
        <AtreeCard
          contents={contents}
          handleCardClick={handleCardClick}
          _grid={{ size: { xs: 6, sm: 6, md: 4, lg: 3 } }}
          _card={{ image: atreeLogo.src }}
          noResourcesText={t(LANGUAGE_KEYS.NO_RESOURCES)}
          recommendHereText={t(LANGUAGE_KEYS.RECOMMEND_HERE)}
        />
      ) : (
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            width: '100%',
            fontWeight: 500,
            color: 'text.secondary',
            mt: 2,
          }}
        >
          {t(LANGUAGE_KEYS.NO_RESOURCES)}{' '}
          <Link
            href="https://docs.google.com/forms/d/1r4wxm2a2kKH2Veq9_AYIfmWNYJJh5u-nw_SweHC5ydQ/viewform?edit_requested=true"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0037B9', textDecoration: 'underline' }}
          >
            {t(LANGUAGE_KEYS.RECOMMEND_HERE)}
          </Link>
        </Typography>
      )}
    </Box>
  );
};

const FilterSection = ({ frameworkFilter, framework, setFramework }) => {
  const { t } = useAppTranslation();

  return (
    <FrameworkFilter
      frameworkFilter={frameworkFilter || []}
      framework={framework}
      setFramework={setFramework}
      fromSubcategory={false}
    />
  );
};

const FrameworkFilter = React.memo<{
  frameworkFilter: Array<{ identifier: string; name: string }>;
  framework: string;
  fromSubcategory?: boolean;
  setFramework: (framework: string) => void;
}>(({ frameworkFilter, framework, setFramework, fromSubcategory }) => {
  const router = useRouter();
  const theme = useTheme();
  const { t, ready } = useAppTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showForwardArrow, setShowForwardArrow] = useState(true);
  const hasMultipleItems = frameworkFilter?.length > 1;
  const showArrow = hasMultipleItems && frameworkFilter?.length > 0;

  const getTranslatedSubcategoryName = (name: string) => {
    // If translations are not ready, return the original name to avoid flash
    if (!ready) {
      return name;
    }

    // Get translated category names (includes both main categories and subcategories)
    const translatedCategories = getTranslatedCategoryNames(t);
    const translatedCategory = translatedCategories.find(
      (cat) => cat.value.toLowerCase() === name.toLowerCase()
    );

    // Use translated label for display, but keep original name for API calls
    return translatedCategory ? translatedCategory.label : name;
  };

  const handleItemClick = (item: any) => {
    if (fromSubcategory) {
      localStorage.setItem('subcategory', item.name);
      router.push(`/contents`);
    } else {
      setFramework(item.identifier);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });

      // Check if we've reached the end after scrolling
      setTimeout(() => {
        if (scrollRef.current) {
          const { scrollWidth, scrollLeft, clientWidth } = scrollRef.current;
          const isAtEnd = Math.abs(scrollWidth - scrollLeft - clientWidth) < 1;
          setShowForwardArrow(!isAtEnd);
        }
      }, 300); // Wait for the scroll to complete
    }
  };

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });

      // Check if we've reached the start after scrolling
      setTimeout(() => {
        if (scrollRef.current) {
          const { scrollLeft } = scrollRef.current;
          const isAtStart = scrollLeft <= 1;
          setShowForwardArrow(isAtStart);
        }
      }, 300); // Wait for the scroll to complete
    }
  };

  // Initial check for scroll position
  useEffect(() => {
    const checkScrollPosition = () => {
      if (scrollRef.current) {
        const { scrollWidth, scrollLeft, clientWidth } = scrollRef.current;
        const isAtEnd = Math.abs(scrollWidth - scrollLeft - clientWidth) < 1;
        setShowForwardArrow(!isAtEnd);
      }
    };

    checkScrollPosition();

    // Add event listener for scroll
    const currentRef = scrollRef.current;
    currentRef?.addEventListener('scroll', checkScrollPosition);

    return () => {
      currentRef?.removeEventListener('scroll', checkScrollPosition);
    };
  }, [frameworkFilter]);

  return (
    <>
      {!isMobile ? (
        <Grid
          container
          spacing={1}
          sx={{
            justifyContent: 'flex-start',
            paddingX: 2,
            marginTop: 1,
          }}
        >
          {frameworkFilter?.map((frameworkItem: any, index: number) => (
            <Grid key={frameworkItem.identifier} item xs={3} sm={2}>
              <Button
                variant="text"
                fullWidth
                disableRipple
                onClick={() => handleItemClick(frameworkItem)}
                sx={{
                  fontFamily: 'Poppins',
                  fontSize: '14px',
                  fontWeight:
                    framework === frameworkItem.identifier ? 'bold' : 500,
                  textTransform: 'none',
                  color:
                    framework !== frameworkItem.identifier ? '#4D4C4C' : '#000',
                  border:
                    framework === frameworkItem.identifier
                      ? '2px solid #e8f0fa'
                      : '2px solid #e8f0fa',
                  borderRadius: 2,
                  paddingY: 1,
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                {getTranslatedSubcategoryName(frameworkItem.name)}
              </Button>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#fcd804',
            padding: '2px 16px',
            overflow: 'hidden',
          }}
        >
          <Box
            ref={scrollRef}
            sx={{
              display: 'flex',
              overflowX: 'auto',
              flex: 1,
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {frameworkFilter?.map((frameworkItem) => (
              <Box
                key={frameworkItem.identifier}
                onClick={() => handleItemClick(frameworkItem)}
                sx={{
                  cursor: 'pointer',
                  fontFamily: 'Poppins',
                  fontSize: { xs: '14px', sm: '16px' },
                  fontWeight:
                    framework === frameworkItem.identifier ? 700 : 500,
                  color:
                    framework === frameworkItem.identifier
                      ? 'black'
                      : '#5E5E5E',
                  whiteSpace: 'nowrap',
                  minWidth: 'fit-content',
                  px: 1,
                  backgroundColor: 'transparent',
                  '&:hover': {
                    color: '#000',
                  },
                }}
              >
                {getTranslatedSubcategoryName(frameworkItem.name)}
              </Box>
            ))}
          </Box>

          {showArrow && (
            <IconButton
              onClick={showForwardArrow ? handleScrollRight : handleScrollLeft}
              sx={{ ml: 1 }}
            >
              {showForwardArrow ? (
                <ArrowForwardIosIcon fontSize="small" />
              ) : (
                <ArrowBackIosIcon fontSize="small" />
              )}
            </IconButton>
          )}
        </Box>
      )}
    </>
  );
});

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
  const { t, ready } = useAppTranslation();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [filterItems, setFilterItems] = useState<
    Array<{ identifier: string; name: string }>
  >([]);

  const maxItems = isMobile ? 3 : 5;

  useEffect(() => {
    if (subFrameworkFilter) {
      setFilterItems(subFrameworkFilter.slice(0, maxItems));
    }
  }, [subFrameworkFilter, maxItems]);
  const handleItemClick = (item: any) => {
    localStorage.setItem('subcategory', item.name);
    trackEvent({
      action: 'tags_click',
      category: 'engagement',
      label: `Subcategory -${item.name}`,
    });
    const { userId, subtype } = getUserTelemetryInfo();
    telemetryFactory.interact({
      edata: {
        id: `Subcategory -${item.name}`,
        type: TelemetryEventType.CLICK,
        subtype,
        pageid: 'home-page',
      },
      context: {
        env: 'home',
        cdata: [{ id: userId, type: 'User' }],
      },
    });
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    router.push(`/contents`);
  };
  const getTranslatedSubcategoryName = (name: string) => {
    // If translations are not ready, return the original name to avoid flash
    if (!ready) {
      return name;
    }

    // Get translated category names (includes both main categories and subcategories)
    const translatedCategories = getTranslatedCategoryNames(t);
    const translatedCategory = translatedCategories.find(
      (cat) => cat.value.toLowerCase() === name.toLowerCase()
    );

    // Use translated label for display, but keep original name for API calls
    return translatedCategory ? translatedCategory.label : name;
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
                <Typography>{t(LANGUAGE_KEYS.LOADING_TRANSLATIONS)}</Typography>
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

const Title: React.FC<{
  children: React.ReactNode | string;
  onClick?: () => void;
}> = ({ children, onClick }) => {
  const { t } = useAppTranslation();

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
          fontSize: { xs: '20px', md: '18px' },
          lineHeight: '28px',
          color: '#000000',
        }}
      >
        {typeof children === 'string'
          ? t(children as keyof typeof LANGUAGE_KEYS)
          : children}
      </Typography>
      {onClick && (
        <IconButton onClick={onClick}>
          <ChevronRightIcon />
        </IconButton>
      )}
    </Box>
  );
};
