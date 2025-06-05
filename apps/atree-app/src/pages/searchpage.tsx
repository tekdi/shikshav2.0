'use client';

import {
  Box,
  Chip,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import atreeLogo from '../../assets/images/placeholder.jpg';
import Layout from '../component/layout/layout';
import dynamic from 'next/dynamic';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ContentSearchResponse, trackEvent, RESOURCE_TYPES } from '@shared-lib';
import FooterText from '../component/FooterText';
import { TelemetryEventType } from '../utils/app.constant';
import { telemetryFactory } from '../utils/telemetry';
import Footer from '../component/layout/Footer';
import FilterDialog from 'libs/shared-lib/src/lib/Filterdialog/FilterDialog';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
const Content = dynamic(() => import('@Content'), {
  ssr: false,
});

export default function Searchpage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedType = searchParams.get('type')?.toLowerCase();
  const [frameworkFilter, setFrameworkFilter] = useState();
  const [filterData, setFilterData] = useState();

  const [subFrameworkFilter, setSubFrameworkFilter] = useState<any[]>([]);
  // Get type from URL
  const selectedquery = searchParams.get('query')?.toLowerCase();
  const [framework, setFramework] = useState(selectedType || ''); // Default to selectedType if available
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [filterShow, setFilterShow] = useState(false);
  const [filters, setFilters] = useState<any>({
    request: {
      filters: {},
      offset: 0,
      limit: 5,
    },
  });
  React.useEffect(() => {
    trackEvent({
      action: 'Search query',
      category: 'engagement',
      label: `${selectedquery}`,
    });
    const windowUrl = window.location.pathname;
    const cleanedUrl = windowUrl.replace(/^\//, '');
    const env = cleanedUrl.split('/')[0];

    const telemetryInteract = {
      context: {
        env: env,
        cdata: [],
      },
      edata: {
        id: `Search query - ${selectedquery}`,
        type: TelemetryEventType.CLICK,
        subtype: '',
        pageid: cleanedUrl,
      },
    };
    telemetryFactory.interact(telemetryInteract);
    if (selectedType && selectedType !== framework) {
      console.log('Updating framework to:', selectedType); // Debugging

      setFramework(selectedType);
    }
  }, [selectedType]);
  React.useEffect(() => {
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
        setFramework(fdata[0]?.identifier || '');
        setFrameworkFilter(fdata);

        // Filter live categories
        setFilterData({
          ...frameworkData?.result?.framework,
          categories: frameworkData?.result?.framework.categories.filter(
            (category: any) => category.status === 'Live'
          ),
        });
        //condition if category from URL
        let selectedFramework = fdata[0];

        const selectedCategory = selectedFramework?.name;
        const selectedIdentifier = selectedFramework?.identifier;

        setFramework(selectedIdentifier);
        localStorage.setItem('category', selectedCategory);
      } catch (error) {
        console.error('Error fetching board data:', error);
      } finally {
      }
    };

    init();
  }, []);

  const handleApplyFilters = async (selectedValues: any) => {
    trackEvent({
      action: 'filter_apply',
      category: 'user',
      label: 'Home Page',
    });
    const { offset, limit, ...filters } = selectedValues;
    setFilters((prevFilters: any) => {
      // Create a new filters object, preserving previous filters
      let cleanedFilters = {
        ...prevFilters.request.filters,
        ...Object.fromEntries(
          Object.entries(filters).filter(
            ([key, value]) => Array.isArray(value) && value.length > 0
          )
        ),
      };

      // Ensure topic is set correctly

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
          offset: offset ?? prevFilters.request.offset ?? 0,
          limit: limit ?? prevFilters.request.limit ?? 5,
        },
      };

      return newFilters;
    });
  };
  const FilterChip = () => (
    <Chip
      label={
        <Box display="flex" alignItems="center" gap={1}>
          <span>Filter By</span>
          <ArrowDropDownIcon sx={{ color: '#42474E', fontSize: '20px' }} />
        </Box>
      }
      onClick={() => setFilterShow(true)}
      sx={{
        color: '#000000',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        backgroundColor: '#FFFFFF',
        border: '1px solid #C2C7CF',
        paddingX: '8px',
      }}
    />
  );
  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh', // Make sure the container takes at least full viewport height
          // padding: '0 1rem',
        }}
      >
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          gap="1rem"
          paddingTop={!isMobile ? '2rem' : '0rem'}
          // py={!isMobile ? '2rem' : '0rem'}
          // px="14px"
          sx={{ width: '100%' }}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            sx={{ width: '100%' }}
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

            {selectedquery && (
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: '24px',
                  fontFamily: 'Poppins',
                }}
              >
                Showing Results for{' '}
                <span
                  style={{
                    color: '#000000',
                    backgroundColor: '#fcd804',
                    padding: '5px',
                  }}
                >
                  {selectedquery}
                </span>
              </Typography>
            )}
          </Box>

          <Grid
            container
            spacing={2}
            sx={{
              width: '100%',
              // marginTop: isMobile ? '10px' : '55px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}
          >
            {!isMobile ? (
              <>
                <Grid item xs={12} sm={4} md={3}>
                  <FilterDialog
                    frameworkFilter={filterData}
                    filterValues={filters}
                    onApply={handleApplyFilters}
                    isMobile={isMobile}
                    resources={RESOURCE_TYPES}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={9} sx={{ marginTop: '1.8rem' }}>
                  <Content
                    {...{
                      _grid: {
                        size: { xs: 6, sm: 6, md: 4, lg: 3 },
                      },
                      handleCardClick: (content: ContentSearchResponse) => {
                        router.push(`/contents/${content?.identifier}`);
                      },
                      contentTabs: ['content'],
                      filters: {
                        filters: {
                          channel: process.env.NEXT_PUBLIC_CHANNEL_ID,
                          ...(selectedType
                            ? { [selectedType]: selectedquery }
                            : { query: selectedquery }),
                          ...filters.request.filters,
                        },
                      },
                      _card: {
                        cardName: 'AtreeCard',
                        image: atreeLogo.src,
                      },
                      showSearch: false,
                      showFilter: false,
                    }}
                  />
                </Grid>
              </>
            ) : (
              <Grid item xs={12} sm={4} md={12}>
                {/* <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  marginLeft={'1rem'}
                  marginBottom={'2rem'}
                >
                  <FilterChip />
                  <FilterDialog
                    open={filterShow}
                    onClose={() => setFilterShow(false)}
                    frameworkFilter={filterData}
                    filterValues={filters}
                    onApply={handleApplyFilters}
                    isMobile={isMobile}
                    resources={RESOURCE_TYPES}
                  />
                </Box> */}
                <Content
                  {...{
                    _grid: {
                      size: { xs: 6, sm: 6, md: 4, lg: 3 },
                    },
                    handleCardClick: (content: ContentSearchResponse) => {
                      router.push(`/contents/${content?.identifier}`);
                    },
                    contentTabs: ['content'],
                    filters: {
                      filters: {
                        channel: process.env.NEXT_PUBLIC_CHANNEL_ID,
                        ...(selectedType
                          ? { [selectedType]: selectedquery }
                          : { query: selectedquery }),
                        ...filters.request.filters,
                      },
                    },
                    _card: {
                      cardName: 'AtreeCard',
                      image: atreeLogo.src,
                    },
                    showSearch: false,
                    showFilter: false,
                  }}
                />
              </Grid>
            )}
          </Grid>
          <Box sx={{ width: '100%' }}>
            {!isMobile ? <FooterText page="" /> : <Footer />}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
