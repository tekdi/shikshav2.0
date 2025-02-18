'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import {
  CommonCard,
  Layout,
  Circular,
  ImageBanner,
  ImageCard,
} from '@shared-lib';
import { ContentSearch } from '../services/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FilterDramaOutlinedIcon from '@mui/icons-material/FilterDramaOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';

import Grid from '@mui/material/Grid2';
import { useRouter, useSearchParams } from 'next/navigation';
import { hierarchyAPI } from '../services/Hierarchy';
import { contentReadAPI } from '../services/Read';
import { useTheme } from '@mui/material/styles';

import { trackingData } from '../services/TrackingService';
interface Config {
  type: 'Image' | 'card';
}
interface ContentItem {
  name: string;
  gradeLevel: string[];
  language: string[];
  artifactUrl: string;
  identifier: string;
  appIcon: string;
  contentType: string;
  mimeType: string;
  description: string;
  posterImage: string;
  children: [{}];
}

export default function Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier = searchParams.get('identifier');
  const [searchValue, setSearchValue] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [contentData, setContentData] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [limit, setLimit] = useState(6); // Set default limit
  const [offset, setOffset] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [filterValues, setFilterValues] = useState({});
  const theme = useTheme();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [frameworkFilter, setFrameworkFilter] = useState(false);
  const [trackData, setTrackData] = useState([]);

  const [config, setConfig] = useState<{ type: string } | null>(null);
  const fetchContent = useCallback(
    async (
      type?: string,
      searchValue?: string,
      filterValues?: {},
      limit?: number,
      offset?: number
    ) => {
      setIsLoading(true);
      try {
        //@ts-ignore
        let result;
        if (identifier) {
          result = await hierarchyAPI(identifier);
          //@ts-ignore
          setContentData([result]);
          // if (result) setContentData([result]);
        } else {
          result =
            type &&
            (await ContentSearch(
              type,
              searchValue,
              filterValues,
              limit,
              offset
            ));
          //@ts-ignore
          if (!result || result === undefined || result?.length === 0) {
            setHasMoreData(false); // No more data available
          } else {
            // setContentData(result || []);
            //@ts-ignore
            setContentData((prevData) => [...prevData, ...result]);
            fetchDataTrack(result);
            setHasMoreData(true);
          }
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [identifier]
  );
  const fetchDataTrack = async (resultData: any) => {
    if (!resultData.length) return; // Ensure contentData is available

    try {
      const courseList = resultData.map((item: any) => item.identifier); // Extract all identifiers
      const userId = localStorage.getItem('subId');
      const userIdArray = userId?.split(',');
      if (!userId || !courseList.length) return; // Ensure required values exist
      //@ts-ignore

      const course_track_data = await trackingData(userIdArray, courseList);

      if (course_track_data?.data) {
        //@ts-ignore

        const userTrackData =
          course_track_data.data.find((course: any) => course.userId === userId)
            ?.course || [];
        setTrackData(userTrackData);
      }
    } catch (error) {
      console.error('Error fetching track data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch('http://localhost:3003/api/config') // Fetch from atree-app
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch((error) => console.error('Error fetching config:', error));
  }, []);

  useEffect(() => {
    if (offset > 0) {
      const type = tabValue === 0 ? 'Course' : 'Learning Resource';
      fetchContent(type, searchValue, filterValues, limit, offset);
    }
  }, [offset]);
  useEffect(() => {
    const type = tabValue === 0 ? 'Course' : 'Learning Resource';
    // setContentData([]);
    const cookies = document.cookie.split('; ');
    const subid = cookies
      .find((row) => row.startsWith('subid='))
      ?.split('=')[1];
    //@ts-ignore
    localStorage.setItem('subId', subid);
    fetchContent(type, searchValue, filterValues);
  }, [tabValue, filterValues]);

  const handleLoadMore = (event: React.MouseEvent) => {
    event.preventDefault();
    const newOffset = offset + limit;
    setOffset(newOffset);

    const currentScrollPosition = window.scrollY;

    const type = tabValue === 0 ? 'Course' : 'Learning Resource';

    fetchContent(type, searchValue, filterValues, limit, newOffset).then(() => {
      setTimeout(() => {
        window.scrollTo({ top: currentScrollPosition, behavior: 'auto' });
      }, 0);
    });
  };

  const handleCardClick = async (
    identifier: string,
    contentMimeType: string
  ) => {
    setIsLoading(true);
    try {
      if (
        [
          'application/vnd.ekstep.ecml-archive',
          'application/vnd.ekstep.html-archive',
          'application/vnd.ekstep.h5p-archive',
          'application/pdf',
          'video/mp4',
          'video/webm',
          'application/epub',
          'video/x-youtube',
          'application/vnd.sunbird.questionset',
        ].includes(contentMimeType)
      ) {
        await contentReadAPI(identifier);
        router.push(`/player/${identifier}`);
      } else {
        const result = await hierarchyAPI(identifier);
        //@ts-ignore
        const trackable = result?.trackable;
        setSelectedContent(result);

        router.push(`/content-details/${identifier}`);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setIsLoading(false);
    }
  };
  ``;
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderTabContent = () => (
    <Box sx={{ flexGrow: 1 }}>
      {isLoading ? (
        <Circular />
      ) : (
        <>
          {config?.type === 'card' && (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {contentData?.map((item) => (
                <Grid
                  key={item?.identifier}
                  size={{ xs: 6, sm: 6, md: 3, lg: 3 }}
                >
                  <CommonCard
                    title={item?.name.trim()}
                    image={
                      item?.posterImage && item?.posterImage !== 'undefined'
                        ? item?.posterImage
                        : '/assests/images/image_ver.png'
                    }
                    content={item?.description || '-'}
                    // subheader={item?.contentType}
                    actions={item?.contentType}
                    orientation="horizontal"
                    item={[item]}
                    TrackData={trackData}
                    type={tabValue === 0 ? 'course' : 'content'}
                    onClick={() =>
                      handleCardClick(item?.identifier, item?.mimeType)
                    }
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {config?.type === 'Image' && (
            <>
              <ImageBanner />
              <Box sx={{ textAlign: 'center', padding: '20px' }}>
                <Typography sx={{ fontWeight: 400, marginBottom: '20px' }}>
                  Change stems from local action. Hope stems from children’s
                  empowerment to act upon local environmental problems.
                </Typography>
                <Typography sx={{ fontWeight: 400 }}>
                  Our mission is to empower environment educators with both hope
                  and action in times of climate change.
                </Typography>
              </Box>
              <Box
                sx={{
                  textAlign: 'center',
                  padding: '5px',
                  marginBottom: '20px',
                }}
              >
                <Typography sx={{ fontWeight: 500, fontSize: '24px' }}>
                  01 BOOKS IN 15 CATEGORIES
                </Typography>
                <Typography sx={{ fontWeight: 500, fontSize: '14px' }}>
                  Choose what best fits your interests and needs
                </Typography>
              </Box>
              <ImageCard
                showAvatar={true}
                showIcons={false}
                ContentData={contentData as []}
              />
            </>
          )}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            {hasMoreData ? (
              <Button
                variant="contained"
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </Button>
            ) : (
              <Typography variant="body1" color="textSecondary">
                No more data available
              </Typography>
            )}
          </Box>
          {/*  )} */}
        </>
      )}
    </Box>
  );

  const handleItemClick = (to: string) => {
    router.push(to);
  };

  const drawerItems = [
    { text: 'Logout', icon: <AccountCircleIcon fontSize="small" />, to: '/' },
    {
      text: 'About Us',
      icon: <FilterDramaOutlinedIcon fontSize="small" />,
      to: '/content',
    },
    {
      text: 'Contact Us',
      icon: <AlternateEmailOutlinedIcon fontSize="small" />,
      to: '/content',
    },
    {
      text: 'Help',
      icon: <ContactSupportOutlinedIcon fontSize="small" />,
      to: '/content',
    },
  ];

  //@ts-ignore
  const handleApplyFilters = async (selectedValues) => {
    // setFilterValues(selectedValues);
    setContentData([]);
    const type = tabValue === 0 ? 'Course' : 'Learning Resource';
    let result =
      type &&
      (await ContentSearch(type, searchValue, selectedValues, limit, offset));
    //@ts-ignore
    if (!result || result === undefined || result?.length === 0) {
      setHasMoreData(false); // No more data available
    } else {
      //@ts-ignore
      setContentData(result || []);
      setHasMoreData(true);
    }
    console.log('Filter selectedValues:', selectedValues);
  };

  //get filter framework
  useEffect(() => {
    fetchFramework();
  }, [router]);
  const fetchFramework = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
      const frameworkData = await fetch(url).then((res) => res.json());
      const frameworks = frameworkData?.result?.framework;
      setFrameworkFilter(frameworks);
    } catch (error) {
      console.error('Error fetching board data:', error);
    }
  };

  return (
    <Layout
      type={(config as Config)?.type}
      showTopAppBar={{
        showSearch: true,
        title: 'Jal-Jungle-Jameen ',
        subtitle: 'In Classrooms ',
        showMenuIcon: true,
        actionButtonLabel: 'Action',
      }}
      drawerItems={drawerItems}
      onItemClick={handleItemClick}
      isFooter={false}
      isBottom={true}
      showLogo={true}
      showBack={true}
      //@ts-ignore
      onApply={handleApplyFilters}
      filterValues={filterValues}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          bgcolor: theme.palette.background.default,
          flexDirection: 'column',
          marginTop: '20px',
        }}
      >
        <Box>{renderTabContent()}</Box>
      </Box>
    </Layout>
  );
}
