import React, { useEffect, useState } from 'react';
import Layout from '../../../component/layout/layout';
import FolderComponent from '../../../component/FolderComponent';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Chip,
  Switch,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Loader from '../../../component/layout/LoaderComponent';
import dynamic from 'next/dynamic';
import atreeLogo from '../../../../assets/images/atreeLogo.png';
import {
  ContentSearch,
  ContentSearchResponse,
  FilterDialog,
} from '@shared-lib';
import { RESOURCE_TYPES, MIME_TYPES } from '../../../utils/constantData';

const Content = dynamic(() => import('@Content'), { ssr: false });

const MyComponent: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const { category } = router.query;

  const [isLoading, setIsLoading] = useState(true);
  const [subFramework, setSubFramework] = useState('');
  const [filterShow, setFilterShow] = useState(false);
  const [frameworkFilter, setFrameworkFilter] = useState(false);
  const [filters, setFilters] = useState<any>({ limit: 5, offset: 0 });
  const [categories, setCategories] = useState<Array<any>>([]);
  const [framework, setFramework] = useState('');

  const [searchResults, setSearchResults] = useState<
    { subTopic: string; length: number }[]
  >([]);
  const [fullAccess, setFullAccess] = useState(false);

  /** SubFramework Filter Options */
  const subFrameworkFilter = [
    { identifier: '', name: 'All' },
    { identifier: 'video/x-youtube', name: 'Videos' },
    { identifier: 'application/pdf', name: 'PDFs' },
    { identifier: 'video/mp4', name: 'Audiobooks' },
  ];

  /** Fetch Framework Data */
  const fetchFrameworkData = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
      const response = await fetch(url);
      const frameworkData = await response.json();
      setFrameworkFilter(frameworkData?.result?.framework);

      const frameworks = frameworkData?.result?.framework?.categories || [];

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

      setCategories(fdata || []);
      setFramework(fdata[0]?.identifier || '');
    } catch (error) {
      console.error('Error fetching framework data:', error);
    }
  };

  /** Fetch Content Search Results */
  const fetchContentSearch = async () => {
    try {
      const filterParams: any = {
        ...filters,
        subTopic: category || filters.subTopic,
      };

      if (subFramework) {
        filterParams.mimeType = [subFramework];
      }
      const data = await ContentSearch({
        channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
        filters: filterParams,
      });

      if (category) {
        setSearchResults([
          {
            subTopic: String(category),
            length: data?.result?.content?.length || 0,
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching content search:', error);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchFrameworkData();
      await fetchContentSearch();
      setIsLoading(false);
    })();
  }, []);

  /** Handle Category Click */
  const handleClick = (category: any) =>
    router.push(`/contents/${category.name}`);

  /** Handle Filter Application */
  const handleApplyFilters = (selectedValues: any) => {
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...selectedValues,
    }));
  };

  const handleToggleFullAccess = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const accessValue = event.target.checked ? 'Full Access' : 'all'; // Set 'full' or 'all' based on switch state
    setFullAccess(event.target.checked);
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      filters: {
        ...prevFilters.filters, // Preserve existing filters
        access: accessValue === 'all' ? undefined : accessValue, // Remove 'access' key if 'all'
      },
      offset: 0, // Reset pagination on filter change
    }));
  };
  /** Reusable Filter Button */
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

  /** SubFramework Filter Buttons */
  const SubFrameworkButtons = () => (
    <Grid container spacing={1} justifyContent="center">
      {subFrameworkFilter.map((item) => (
        <Grid key={item.identifier}>
          <Button
            onClick={() => setSubFramework(item.identifier)}
            sx={{
              borderRadius: '8px',
              color: subFramework === item.identifier ? '#FFFFFF' : '#001D32',
              backgroundColor:
                subFramework === item.identifier ? '#1976D2' : '#E3E9EA',
              '&:hover': {
                backgroundColor:
                  subFramework === item.identifier ? '#1565C0' : '#D1D9DB',
              },
            }}
          >
            {item.name}
          </Button>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Layout
      _backButton={{ alignItems: 'center' }}
      backTitle={
        <Box
          sx={{
            display: 'flex',
            // alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <Typography sx={{ fontSize: '22px', lineHeight: '28px' }}>
            {category}
          </Typography>
          {isMobile && (
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              // sx={{ justifyContent: 'flex-end' }}
            >
              <FilterChip />
              <Box display="flex" alignItems="center" gap={1} marginLeft="auto">
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: fullAccess ? '400' : '600',
                    color: fullAccess ? '#9E9E9E' : '#000000',
                  }}
                >
                  All
                </Typography>

                <Switch
                  checked={fullAccess} // Controlled state for switch
                  onChange={handleToggleFullAccess}
                  sx={{
                    width: 42,
                    height: 26,
                    padding: 0,
                    '& .MuiSwitch-switchBase': {
                      padding: 0,
                      transitionDuration: '300ms',
                      '&.Mui-checked': {
                        transform: 'translateX(16px)',
                        color: '#fff',
                        '& + .MuiSwitch-track': {
                          background:
                            'linear-gradient(271.8deg, #E68907 1.15%, #FFBD0D 78.68%)',
                          opacity: 1,
                          border: 0,
                        },
                        '&.Mui-disabled + .MuiSwitch-track': {
                          opacity: 0.5,
                        },
                      },
                      '&.Mui-focusVisible .MuiSwitch-thumb': {
                        color: '#33cf4d',
                        border: '6px solid #fff',
                      },
                      '&.Mui-disabled .MuiSwitch-thumb': {
                        color: '#BDBDBD', // Grey thumb when disabled
                      },
                      '&.Mui-disabled + .MuiSwitch-track': {
                        opacity: 0.5,
                        background: '#BDBDBD', // Grey track when disabled
                      },
                    },
                    '& .MuiSwitch-thumb': {
                      boxSizing: 'border-box',
                      width: 25,
                      height: 25,
                    },
                    '& .MuiSwitch-track': {
                      borderRadius: 26 / 2,
                      background: fullAccess
                        ? 'linear-gradient(271.8deg, #E68907 1.15%, #FFBD0D 78.68%)'
                        : '#BDBDBD', // Grey when unchecked
                      opacity: 1,
                    },
                  }}
                />

                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: fullAccess ? '600' : '400',
                    color: fullAccess ? '#000000' : '#9E9E9E',
                  }}
                >
                  Only Full Access
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      }
      showBack
      backIconClick={() => router.push('/quick-access')}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          gap="3rem"
          py="1rem"
          px="8px"
        >
          <Grid container spacing={1}>
            <Grid size={{ xs: 3, md: 3 }}>
              <FilterDialog
                frameworkFilter={frameworkFilter}
                filterValues={filters}
                onApply={handleApplyFilters}
                resources={RESOURCE_TYPES}
                mimeType={MIME_TYPES}
                isMobile={isMobile}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 9 }}>
              <>
                <Box sx={{ display: 'flex' }}>
                  <FolderComponent
                    categories={[{ name: category }]}
                    subLabel="resources"
                    length={searchResults}
                    onClick={handleClick}
                    _title={{ fontWeight: 700, fontSize: '14px' }}
                    _item={{
                      width: '450px',
                      border: 0,
                      justifyContent: 'space-between',
                      py: 2,
                      px: 3,
                      borderRadius: '8px',
                      background: '#ECF2F3',
                      borderBottom: '1px solid  #2B3133',
                      cursor: 'auto',
                    }}
                  />

                  {!isMobile && (
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{ width: '100%', justifyContent: 'center' }}
                    >
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: fullAccess ? '400' : '600',
                          color: fullAccess ? '#9E9E9E' : '#000000',
                        }}
                      >
                        All
                      </Typography>

                      <Switch
                        checked={fullAccess} // Controlled state for switch
                        onChange={handleToggleFullAccess}
                        sx={{
                          width: 42,
                          height: 26,
                          padding: 0,
                          '& .MuiSwitch-switchBase': {
                            padding: 0,
                            transitionDuration: '300ms',
                            '&.Mui-checked': {
                              transform: 'translateX(16px)',
                              color: '#fff',
                              '& + .MuiSwitch-track': {
                                background:
                                  'linear-gradient(271.8deg, #E68907 1.15%, #FFBD0D 78.68%)',
                                opacity: 1,
                                border: 0,
                              },
                              '&.Mui-disabled + .MuiSwitch-track': {
                                opacity: 0.5,
                              },
                            },
                            '&.Mui-focusVisible .MuiSwitch-thumb': {
                              color: '#33cf4d',
                              border: '6px solid #fff',
                            },
                            '&.Mui-disabled .MuiSwitch-thumb': {
                              color: '#BDBDBD', // Grey thumb when disabled
                            },
                            '&.Mui-disabled + .MuiSwitch-track': {
                              opacity: 0.5,
                              background: '#BDBDBD', // Grey track when disabled
                            },
                          },
                          '& .MuiSwitch-thumb': {
                            boxSizing: 'border-box',
                            width: 25,
                            height: 25,
                          },
                          '& .MuiSwitch-track': {
                            borderRadius: 26 / 2,
                            background: fullAccess
                              ? 'linear-gradient(271.8deg, #E68907 1.15%, #FFBD0D 78.68%)'
                              : '#BDBDBD', // Grey when unchecked
                            opacity: 1,
                          },
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: fullAccess ? '600' : '400',
                          color: fullAccess ? '#000000' : '#9E9E9E',
                        }}
                      >
                        Only Full Access
                      </Typography>
                    </Box>
                  )}
                </Box>
                {isMobile && <SubFrameworkButtons />}
                <Content
                  {...{
                    // _grid: { size: { xs: 6, sm: 6, md: 9, lg: 3 } },
                    contentTabs: ['content'],
                    handleCardClick: (content: ContentSearchResponse) => {
                      router.push(`/contents/${content?.identifier}`);
                    },
                    filters: {
                      filters: {
                        channel: process.env.NEXT_PUBLIC_CHANNEL_ID,
                        subTopic: `${category}`,
                        ...(subFramework && { mimeType: [subFramework] }),
                      },
                    },
                    _card: { cardName: 'AtreeCard', image: atreeLogo.src },
                    showSearch: false,
                    showFilter: false,
                    filterBy: false,
                    showFilterRight: false,
                  }}
                />
              </>
            </Grid>
          </Grid>
          {/* </Box> */}
        </Box>
      )}
    </Layout>
  );
};

export default MyComponent;
