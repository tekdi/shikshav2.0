import React, { useEffect, useState } from 'react';
import Layout from '../../../component/layout/layout';
import FolderComponent from '../../../component/FolderComponent';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Chip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Loader from '../../../component/layout/LoaderComponent';
import dynamic from 'next/dynamic';
import atreeLogo from '../../../../assets/images/placeholder.jpg';
import {
  ContentSearch,
  ContentSearchResponse,
  FilterDialog,
} from '@shared-lib';
import { RESOURCE_TYPES, MIME_TYPES } from '../../../utils/constantData';
import CustomSwitch from '../../../component/CustomSwitch';
import LoginDialog from '../../../component/LoginDialog';
import useHandleCardClick from '../../../utils/useHandleCardClick';
const Content = dynamic(() => import('@Content'), { ssr: false });

const MyComponent: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const { category, isTopic } = router.query;

  const [isLoading, setIsLoading] = useState(true);
  const [subFramework, setSubFramework] = useState('');
  const [filterShow, setFilterShow] = useState(false);
  const [frameworkFilter, setFrameworkFilter] = useState(false);
  const [filters, setFilters] = useState<any>({
    limit: 5,
    offset: 0,
    channel: process.env.NEXT_PUBLIC_CHANNEL_ID,
    topic: isTopic ? category : undefined, // Initialize topic if isTopic=true
    subTopic: !isTopic ? category : undefined,
  });

  const [searchResults, setSearchResults] = useState<
    { subTopic: string; length: number }[]
  >([]);
  const [fullAccess, setFullAccess] = useState(false);

  const { handleCardClick, openMessageDialog, setOpenMessageDialog } =
    useHandleCardClick();
  /** SubFramework Filter Options */
  const subFrameworkFilter = [
    { identifier: '', name: 'All' },
    { identifier: 'video/x-youtube', name: 'Videos' },
    { identifier: 'application/pdf', name: 'PDFs' },
    { identifier: 'video/mp4', name: 'Audiobooks' },
  ];
  const customFontStyle = {
    fontSize: '14px', //font
    color: fullAccess ? '#9E9E9E' : '#000000',
    //color
    fontWeight: fullAccess ? '400' : '600',
  };

  /** Fetch Framework Data */
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

  /** Fetch Content Search Results */
  const fetchContentSearch = async () => {
    try {
      const isTopicValid = typeof isTopic === 'string' && isTopic.trim() !== '';
      setFilters((prevFilters: any) => ({
        ...prevFilters,
        ...(isTopicValid
          ? { topic: category, subTopic: undefined }
          : { subTopic: category }),
      }));
      const filterParams: any = {
        ...filters,
        ...(isTopicValid
          ? { topic: category, subTopic: undefined }
          : { subTopic: category }),
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
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      topic: isTopic ? category : undefined,
      subTopic: !isTopic ? category : undefined,
    }));
  }, [isTopic, category]);
  useEffect(() => {
    (async () => {
      await fetchFrameworkData();
      await fetchContentSearch();
      setIsLoading(false);
    })();
  }, []);
  const handleCloseMessage = () => {
    //close
    setOpenMessageDialog(false);
    //rout
    router.push('/signin');
  };
  /** Handle Category Click */
  const handleClick = (category: any) =>
    router.push(`/contents/${category.name}`);

  /** Handle Filter Application */
  const handleApplyFilters = (selectedValues: any) => {
    const isEmpty = Object.keys(selectedValues).length === 0;

    if (selectedValues) {
      // Remove `isTopic` from the URL
      const { isTopic, ...updatedQuery } = router.query;
      router.replace(
        {
          pathname: router.pathname,
          query: updatedQuery,
        },
        undefined,
        { shallow: true } // Prevents full page reload
      );

      // Update filters correctly
      setFilters((prevFilters: any) => {
        const newFilters = {
          ...prevFilters,
          ...selectedValues,
          ...(isEmpty ? { subTopic: category } : {}),
          ...(isEmpty ? { topic: undefined } : {}),
          ...(isEmpty ? { resource: undefined } : {}),
          ...(isEmpty ? { mimeType: undefined } : {}),
        };
        console.log('Updated Filters (inside setState callback)==', newFilters);
        return newFilters;
      });
    }
  };

  useEffect(() => {
    console.log('Updated Filters (inside useEffect)==', filters);
  }, [filters]);

  const handleToggleFullAccess = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const accessValue = event.target.checked ? 'Full Access' : 'all'; // Set 'full' or 'all' based on switch state
    setFullAccess(event.target.checked);
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...prevFilters.filters, // Preserve existing filters
      access: accessValue === 'all' ? undefined : accessValue, // Remove 'access' key if 'all'
      offset: 0,
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
        </Box>
      }
      showBack
      backIconClick={() => router.back()}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          py="1rem"
          px="8px"
          gap="1rem"
        >
          {isMobile && (
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              // sx={{ justifyContent: 'flex-end' }}
            >
              <FilterChip />
              <FilterDialog
                open={filterShow}
                onClose={() => setFilterShow(false)}
                frameworkFilter={frameworkFilter}
                filterValues={filters}
                onApply={handleApplyFilters}
                isMobile={isMobile}
              />
              <Box display="flex" alignItems="center" gap={1} marginLeft="auto">
                <CustomSwitch
                  fullAccess={fullAccess}
                  handleToggleFullAccess={handleToggleFullAccess}
                  customFontStyle={customFontStyle}
                />
              </Box>
            </Box>
          )}
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
                      width: { xs: '335px', md: '445px' },
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
                      <CustomSwitch
                        fullAccess={fullAccess}
                        handleToggleFullAccess={handleToggleFullAccess}
                        customFontStyle={customFontStyle}
                      />
                    </Box>
                  )}
                </Box>
                {isMobile && <SubFrameworkButtons />}
                <Content
                  {...{
                    // _grid: { size: { xs: 6, sm: 6, md: 9, lg: 3 } },
                    contentTabs: ['content'],
                    handleCardClick: (content: ContentSearchResponse) => {
                      if (content.identifier) {
                        handleCardClick({ identifier: content.identifier });
                      } else {
                        console.warn('Content identifier is missing:', content);
                      }
                    },
                    filters: {
                      filters: {
                        channel: process.env.NEXT_PUBLIC_CHANNEL_ID,
                        ...(filters.topic?.length
                          ? { topic: filters.topic }
                          : {}),

                        ...(filters.access === 'Full Access' && {
                          access: 'Full Access',
                        }),
                        ...(subFramework && { mimeType: [subFramework] }),
                        ...(filters.mimeType?.length
                          ? { mimeType: filters.mimeType }
                          : {}),
                        ...(filters.resource?.length
                          ? { resource: filters.resource }
                          : {}),

                        ...(filters.subTopic?.length
                          ? { subTopic: filters.subTopic }
                          : {}),
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
      <LoginDialog
        open={openMessageDialog}
        onClose={handleCloseMessage}
        title="Alert"
        message="You need to log in to continue."
        buttonText="Login"
        onButtonClick={handleCloseMessage}
      />
    </Layout>
  );
};

export default MyComponent;
