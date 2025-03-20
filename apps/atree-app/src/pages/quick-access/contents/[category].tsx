import React, { useEffect, useState } from 'react';
import Layout from '../../../component/layout/layout';
import FolderComponent from '../../../component/FolderComponent';
import { useRouter } from 'next/router';
import { Box, Button, Chip, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Loader from '../../../component/layout/LoaderComponent';
import dynamic from 'next/dynamic';
import atreeLogo from '../../../../assets/images/atreeLogo.png';
import { ContentSearch, ContentSearchResponse } from '@shared-lib';
import FilterDialog from 'libs/shared-lib/src/lib/Filterdialog/FilterDialog';

const Content = dynamic(() => import('@Content'), { ssr: false });

const MyComponent: React.FC = () => {
  const router = useRouter();
  const { category } = router.query;

  const [isLoading, setIsLoading] = useState(true);
  const [subFramework, setSubFramework] = useState('');
  const [filterShow, setFilterShow] = useState(false);
  const [frameworkFilter, setFrameworkFilter] = useState(false);
  const [filters, setFilters] = useState<any>({ limit: 5, offset: 0 });
  const [searchResults, setSearchResults] = useState<
    { subTopic: string; length: number }[]
  >([]);

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
      const categoryData =
        frameworks
          .find((item: any) => item.code === 'topic')
          ?.terms?.find((e: any) => e.name === category)?.associations || [];
    } catch (error) {
      console.error('Error fetching framework data:', error);
    }
  };

  /** Fetch Content Search Results */
  const fetchContentSearch = async () => {
    try {
      const filterParams =
        Object.keys(filters).length > 0 ? filters : { subTopic: category };
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
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <Typography sx={{ fontSize: '22px', lineHeight: '28px' }}>
            {category}
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            sx={{ justifyContent: 'flex-end' }}
          >
            <FilterChip />
          </Box>
        </Box>
      }
      showBack
      backIconClick={() => router.push('/quick-access')}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <Box>
          <FolderComponent
            categories={[{ name: category }]}
            subLabel="resources"
            length={searchResults}
            onClick={handleClick}
            _title={{ fontWeight: 700, fontSize: '14px' }}
            _item={{
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
          <SubFrameworkButtons />
          <FilterDialog
            open={filterShow}
            onClose={() => setFilterShow(false)}
            frameworkFilter={frameworkFilter}
            filterValues={filters}
            onApply={handleApplyFilters}
          />
          <Box
            sx={{
              width: '100%',
              gap: '16px',
              display: 'flex',
              flexDirection: 'column',
              padding: '16px',
            }}
          >
            <Content
              {...{
                _grid: { size: { xs: 6, sm: 6, md: 4, lg: 3 } },
                contentTabs: ['content'],
                handleCardClick: (content: ContentSearchResponse) => {
                  router.push(`/contents/${content?.identifier}`);
                },
                filters: {
                  filters: {
                    channel: process.env.NEXT_PUBLIC_CHANNEL_ID,
                    subTopic: `${category}`,
                  },
                },
                _card: { cardName: 'AtreeCard', image: atreeLogo.src },
                showSearch: false,
                showFilter: false,
                filterBy: true,
                showFilterRight: false,
              }}
            />
          </Box>
        </Box>
      )}
    </Layout>
  );
};

export default MyComponent;
