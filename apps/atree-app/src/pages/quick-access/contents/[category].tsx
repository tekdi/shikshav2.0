import React, { useEffect, useState } from 'react';
import Layout from '../../../component/layout/layout';
import FolderComponent from '../../../component/FolderComponent';
import { useRouter } from 'next/router';
import { Box, Button, Chip, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Loader from '../../../component/layout/LoaderComponent';
interface Term {
  name: string;
  associations: any[];
}
import dynamic from 'next/dynamic';
import atreeLogo from '../../../../assets/images/atreeLogo.png';
import { ContentSearch, ContentSearchResponse } from '@shared-lib';

import FilterDialog from 'libs/shared-lib/src/lib/Filterdialog/FilterDialog';

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});

const MyComponent: React.FC = () => {
  const [categories, setCategories] = useState<Array<any>>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(true);
  const router = useRouter();

  const { category } = router.query; // Access the identifier from the URL
  const [subFramework, setSubFramework] = useState('');
  const [filterShow, setFilterShow] = useState(false);
  const [frameworkFilter, setFrameworkFilter] = useState(false);
  const [localFilters, setFilters] = useState<any>({ limit: 5, offset: 0 });

  const [searchResults, setSearchResults] = useState<
    { subTopic: string; length: number }[]
  >([]);
  useEffect(() => {
    const init = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
        const frameworkData = await fetch(url).then((res) => res.json());
        const frameworks = frameworkData?.result?.framework?.categories;
        setFrameworkFilter(frameworkData?.result?.framework);
        const fdata =
          frameworks
            .find((item: any) => item.code === 'topic')
            ?.terms?.find((e: Term) => e.name === category)?.associations || [];
        setCategories(fdata || []);
        const filtersToSend =
          localFilters && Object.keys(localFilters).length > 0
            ? localFilters
            : { subTopic: category };
        const data = await ContentSearch({
          channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
          filters: filtersToSend,
        });

        if (category) {
          setSearchResults([
            {
              subTopic: Array.isArray(category) ? category[0] : category,
              length: data?.result?.content?.length || 0,
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingChildren(false);
      }
    };
    init();
  }, []);
  const subFrameworkFilter = [
    { identifier: '', name: 'All' },
    { identifier: 'video/x-youtube', name: 'Videos' },
    { identifier: 'application/pdf', name: 'PDFs' },
    { identifier: 'video/mp4', name: 'Audiobooks' },
  ];
  const handleClick = (category: any) => {
    router.push(`/contents/${category.name}`);
  };
  const handleCardClick = (content: any) => {
    router.push(`/contents/${content?.identifier}`);
  };
  const handleApplyFilters = async (selectedValues: any) => {
    if (Object.keys(selectedValues).length === 0) {
      setFilters((prevFilters: any) => ({
        ...prevFilters,
        ...(localFilters || {}),
      }));
    } else {
      const { limit, offset, ...selectedValuesWithoutLimitOffset } =
        selectedValues;
      setFilters((prevFilters: any) => ({
        ...prevFilters,
        filters: {
          ...prevFilters.filters,
          ...selectedValuesWithoutLimitOffset,
        },
      }));
    }
  };
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
          {/* Back Button Title */}
          <Typography
            sx={{
              fontSize: '22px',
              lineHeight: '28px',
              letterSpacing: 0,
            }}
          >
            {category}
          </Typography>

          {/* Filter Chips inside the same row */}
          <Box
            display="flex"
            alignItems="center"
            sx={{ justifyContent: 'flex-end' }}
          >
            <Chip
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <span>Filter By</span>
                  <ArrowDropDownIcon
                    sx={{ color: '#42474E', fontSize: '20px' }}
                  />
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
          </Box>
        </Box>
      }
      showBack
      backIconClick={() => router.push('/quick-access')}
    >
      {isLoadingChildren ? (
        <Loader />
      ) : (
        <Box>
          <Box
            sx={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          ></Box>
          <FolderComponent
            categories={[{ name: category }]}
            subLabel="resources"
            length={searchResults}
            onClick={handleClick}
            _title={{
              fontWeight: 700,
              fontSize: '14px',
            }}
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

          <Grid container spacing={1} justifyContent={'center'}>
            {subFrameworkFilter?.map((subFrameworkItem: any) => (
              <Grid key={subFrameworkItem.identifier}>
                <Button
                  onClick={() => setSubFramework(subFrameworkItem.identifier)}
                  sx={{
                    borderRadius: '8px',
                    color: '#001D32',
                    backgroundColor: '#E3E9EA',
                  }}
                >
                  {subFrameworkItem.name}
                </Button>
              </Grid>
            ))}
          </Grid>
          <FilterDialog
            open={filterShow}
            onClose={() => setFilterShow(false)}
            frameworkFilter={frameworkFilter}
            filterValues={localFilters}
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
            {/* <AtreeCard
          contents={
            contentData.length > 6 ? contentData.slice(4, 10) : contentData
          }
          handleCardClick={handleCardClick}
          _grid={{ size: { xs: 6, sm: 6, md: 4, lg: 3 } }}
          _card={{ image: atreeLogo.src }}
        /> */}
            <Content
              {...{
                _grid: {
                  size: { xs: 6, sm: 6, md: 4, lg: 3 },
                },
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
                _card: {
                  cardName: 'AtreeCard',
                  image: atreeLogo.src,
                },
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
