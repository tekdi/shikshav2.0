'use client';
import React, { useEffect, useState } from 'react';
import {
  ContentSearchResponse,
  RESOURCE_TYPES,
  MIME_TYPES,
  trackEvent,
} from '@shared-lib';
import Layout from '../../component/layout/layout';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import atreeLogo from '../../../assets/images/placeholder.jpg';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import FooterText from '../../component/FooterText';
import Footer from '../../component/layout/Footer';
import Grid from '@mui/material/Grid2';
import FilterDialog from 'libs/shared-lib/src/lib/Filterdialog/FilterDialog';
import { useAppTranslation } from '../../utils/i18n.helper';

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
  const router = useRouter();

  const subCategory = getLocalStorageItem('subcategory');
  const storedCategory = getLocalStorageItem('category');

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
      setIsLoadingChildren(false);
    };
    init();
  }, [mfe_content]);
  useEffect(() => {
    trackEvent({
      action: 'view_content_page',
      category: 'Content Page',
    });
  }, []);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchFrameworkData = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
        const response = await fetch(url);
        const frameworkData = await response.json();
        setFrameworkFilter(frameworkData?.result?.framework);
      } catch (error) {
        console.error('Error fetching framework data:', error);
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
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      request: {
        ...prevFilters.request,
        filters: {
          ...prevFilters.request.filters,
          ...(selectedValues.request?.filters ?? selectedValues),
        },
      },
    }));
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
            <Box sx={boxStyles}>
              <Content {...contentProps} />
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Box sx={boxStyles}>
          <Content {...contentProps} />
        </Box>
      )}
      {/* {!isMobile ? <FooterText page="" /> : <Footer />} */}
    </Layout>
  );
};

export default List;
