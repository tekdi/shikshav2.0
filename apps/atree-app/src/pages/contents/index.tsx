'use client';

import React, { useEffect, useState } from 'react';
import { ContentSearchResponse, RESOURCE_TYPES, MIME_TYPES } from '@shared-lib';
import Layout from '../../component/layout/layout';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import atreeLogo from '../../../assets/images/placeholder.jpg';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import FooterText from '../../component/FooterText';
import Footer from '../../component/layout/Footer';
import Grid from '@mui/material/Grid2';
import FilterDialog from 'libs/shared-lib/src/lib/Filterdialog/FilterDialog';
interface ListProps {}

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});
const selectedLanguage =
  typeof window !== 'undefined' ? localStorage.getItem('language') : null;
const List: React.FC<ListProps> = () => {
  const [frameworkFilter, setFrameworkFilter] = useState(false);

  const mfe_content = process.env.NEXT_PUBLIC_CONTENT;
  const [isLoadingChildren, setIsLoadingChildren] = React.useState(true);
  const router = useRouter();
  const subCategory =
    typeof window !== 'undefined' ? localStorage.getItem('subcategory') : null;
  const storedCategory =
    typeof window !== 'undefined' ? localStorage.getItem('category') : null;
  const selectedLanguage =
    typeof window !== 'undefined' ? localStorage.getItem('language') : null;
  const selectedAccess =
    typeof window !== 'undefined' ? localStorage.getItem('access') : null;
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
    setFilters((prevFilters: any) => {
      // Get the actual filters from the selected values
      const incomingFilters = selectedValues.request?.filters ?? selectedValues;

      return {
        ...prevFilters,
        request: {
          ...prevFilters.request,
          filters: {
            ...prevFilters.request.filters,
            ...incomingFilters,
          },
        },
      };
    });
  };
  return (
    <Layout
      isLoadingChildren={isLoadingChildren}
      isFooter={isMobile} // add this when on mobile
      footerComponent={!isMobile ? <FooterText page="" /> : <Footer />}
    >
      {!isMobile ? (
        <Grid container spacing={2}>
          <Grid size={{ xs: 3 }}>
            <Box>
              <FilterDialog
                frameworkFilter={frameworkFilter}
                filterValues={filters}
                onApply={handleApplyFilters}
                isMobile={isMobile}
                resources={RESOURCE_TYPES}
                mimeType={MIME_TYPES}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 9 }}>
            <Box
              sx={{
                padding: 0,
                minHeight: '100vh', // Ensures full screen height even if the parent has constraints
                width: '100%',
                overflow: { md: 'hidden', xs: 'auto' }, // Prevents unwanted scrolling on desktop
                display: 'flex', // Helps in full-height layout
                flexDirection: 'column',
                // marginTop: { xs: '20px', md: '-60px' },
              }}
            >
              <Content
                {...{
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
                }}
              />
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Box
          sx={{
            padding: 0,
            minHeight: '100vh', // Ensures full screen height even if the parent has constraints
            width: '100%',
            overflow: { md: 'hidden', xs: 'auto' }, // Prevents unwanted scrolling on desktop
            display: 'flex', // Helps in full-height layout
            flexDirection: 'column',
            // marginTop: { xs: '20px', md: '-60px' },
          }}
        >
          <Content
            {...{
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
            }}
          />
        </Box>
      )}
    </Layout>
  );
};

export default List;
