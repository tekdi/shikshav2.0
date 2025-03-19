'use client';

import React, { useCallback, useEffect, useState } from 'react';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Chip, Typography } from '@mui/material';
import { CommonSearch, getData, Loader } from '@shared-lib';
import { useRouter } from 'next/navigation';
import BackToTop from '../components/BackToTop';
import RenderTabContent from '../components/ContentTabs';
import HelpDesk from '../components/HelpDesk';
import { hierarchyAPI } from '../services/Hierarchy';
import { ContentSearch, ContentSearchResponse } from '../services/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Switch } from '@mui/material';
import FilterDialog from 'libs/shared-lib/src/lib/Filterdialog/FilterDialog';
export interface ContentProps {
  _grid?: object;
  filters?: object;
  contentTabs?: string[];
  cardName?: string;
  handleCardClick?: (content: ContentSearchResponse) => void | undefined;
  showFilter?: boolean;
  showSearch?: boolean;
  showBackToTop?: boolean;
  showHelpDesk?: boolean;
  filterBy?: boolean;
  showArrowback?: boolean;
}
export default function Content(props: ContentProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [tabValue, setTabValue] = useState<number>();
  const [tabs, setTabs] = useState<any>([]);
  const [contentData, setContentData] = useState<ContentSearchResponse[]>([]);
  const [isPageLoading, setPageIsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [localFilters, setFilters] = useState<any>({ limit: 5, offset: 0 });
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [frameworkFilter, setFrameworkFilter] = useState(false);
  const [trackData, setTrackData] = useState<[]>([]);
  const [filterShow, setFilterShow] = useState(false);
  const [propData, setPropData] = useState<ContentProps>();
  const [filterValue, setFilterValue] = useState(false); // or any other initial value
  const [fullAccess, setFullAccess] = useState(false);

  useEffect(() => {
    const init = async () => {
      const newData = await getData('mfes_content_pages_content');
      setPropData({
        showSearch: true,
        showFilter: true,
        ...(props || newData),
      });
      setTabValue(0);
      setPageIsLoading(false);
    };
    init();
  }, [props]);

  const fetchContent = useCallback(async (filters: any) => {
    try {
      let data: any;
      if (filters.identifier) {
        const result = await hierarchyAPI(filters.identifier);
        data = [result];
      } else {
        data = await ContentSearch(filters);
      }
      return data;
    } catch (error) {
      console.error('Failed to fetch content:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    if (tabValue !== undefined && tabs?.[tabValue]?.type) {
      setFilters((prevFilters: any) => ({
        ...prevFilters,
        type: tabs?.[tabValue]?.type,
      }));
    }
  }, [tabValue, tabs]);

  const handleLoadMore = (event: any) => {
    event.preventDefault();
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      offset: prevFilters.offset + prevFilters.limit,
    }));
  };

  const handleSearchClick = async () => {
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      query: searchValue.trim(),
    }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCardClickLocal = async (content: ContentSearchResponse) => {
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
        ].includes(content?.mimeType as string)
      ) {
        if (propData?.handleCardClick) {
          propData.handleCardClick(content);
        } else {
          router.push(`/player/${content?.identifier}`);
        }
      } else {
        router.push(`/content-details/${content?.identifier}`);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const init = () => {
      const cookies = document.cookie.split('; ');
      const subid = cookies
        .find((row) => row.startsWith('subid='))
        ?.split('=')[1];

      localStorage.setItem('subId', `${subid}`);
      const filteredTabs = [
        // {
        //   label: 'Courses',
        //   type: 'Course',
        // },
        {
          label: 'Content',
          type: 'Learning Resource',
        },
      ].filter((tab) =>
        Array.isArray(propData?.contentTabs) && propData.contentTabs.length > 0
          ? propData?.contentTabs?.includes(tab.label?.toLowerCase())
          : true
      );
      setTabs(filteredTabs);
      setFilters((prevFilters: any) => ({
        ...prevFilters,
        ...(propData?.filters || {}),
      }));
    };
    init();
  }, [propData?.filters, propData?.contentTabs]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        if (
          localFilters.type &&
          localFilters.limit &&
          localFilters.offset !== undefined
        ) {
          const { result } = await fetchContent(localFilters);
          if (localFilters.offset === 0) {
            setContentData(result?.content || []);
          } else {
            setContentData((prevState: any) => [
              ...prevState,
              ...(result?.content || []),
            ]);
          }
          setHasMoreData(
            result?.count > localFilters.offset + result?.content?.length
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [localFilters, fetchContent]);

  const handleApplyFilters = async (selectedValues: any) => {
    if (Object.keys(selectedValues).length === 0) {
      setFilters((prevFilters: any) => ({
        ...prevFilters,
        ...(propData?.filters || {}),
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

  //get filter framework
  useEffect(() => {
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
    fetchFramework();
  }, [router]);
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

  return (
    <Loader isLoading={isPageLoading}>
      <Box sx={{ p: 2 }}>
        {(propData?.showSearch || propData?.showFilter) && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {propData?.showSearch && (
              <CommonSearch
                placeholder={'Search content..'}
                rightIcon={<SearchIcon />}
                onRightIconClick={handleSearchClick}
                inputValue={searchValue || ''}
                onInputChange={handleSearchChange}
                onKeyPress={(ev: any) => {
                  if (ev.key === 'Enter') {
                    handleSearchClick();
                  }
                }}
                sx={{
                  backgroundColor: '#f0f0f0',
                  padding: '4px',
                  borderRadius: '50px',
                  width: '100%',
                  marginLeft: '10px',
                }}
              />
            )}
            {propData?.showFilter && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#ffffff',
                    borderRadius: propData?.filterBy ? '0px' : '12px',
                    // padding: '8px',
                    width: propData?.filterBy ? 'auto' : '56px', // Auto width for Filter By
                    height: propData?.filterBy ? 'auto' : '46px', // Auto height for Filter By
                    padding: propData?.filterBy ? '4px 8px' : '0px',
                    '&:hover': {
                      backgroundColor: propData?.filterBy
                        ? 'transparent'
                        : '#E0E0E0',
                      boxShadow: propData?.filterBy
                        ? 'none'
                        : '0px 4px 8px 3px #00000026',
                    },
                    marginLeft: '4px',
                    marginRight: '7px',

                    boxShadow: propData?.filterBy
                      ? 'none'
                      : '0px 1px 3px 0px #0000004D',
                  }}
                  onClick={() => setFilterShow(true)}
                >
                  {propData?.filterBy ? (
                    <Box display="flex" alignItems="center">
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
                  ) : (
                    <FilterAltOutlinedIcon
                      sx={{ color: '#6750A4', fontSize: '25px' }}
                    />
                  )}
                </Box>

                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  marginLeft="auto"
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

                <FilterDialog
                  open={filterShow}
                  onClose={() => setFilterShow(false)}
                  frameworkFilter={frameworkFilter}
                  filterValues={localFilters}
                  onApply={handleApplyFilters}
                />
              </Box>
            )}
          </Box>
        )}
        <RenderTabContent
          {...propData}
          value={tabValue}
          onChange={handleTabChange}
          contentData={contentData}
          _grid={propData?._grid || {}}
          trackData={trackData || []}
          type={localFilters?.type || ''}
          handleCardClick={handleCardClickLocal}
          hasMoreData={hasMoreData}
          handleLoadMore={handleLoadMore}
          isLodingMoreData={isLoading}
          tabs={tabs}
        />
        {propData?.showHelpDesk && <HelpDesk />}
        {propData?.showBackToTop && showBackToTop && <BackToTop />}
      </Box>
    </Loader>
  );
}
