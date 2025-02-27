'use client';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import HelpIcon from '@mui/icons-material/Help';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import {
  CommonDialog,
  CommonSearch,
  CommonTextField,
  getData,
  Loader,
} from '@shared-lib';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ChangeEvent } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import FilterDialog from '../components/contentFilter';
import RenderTabContent from '../components/ContentTabs';
import { hierarchyAPI } from '../services/Hierarchy';
import { contentReadAPI } from '../services/Read';
import { ContentSearch, ContentSearchResponse } from '../services/Search';

export default function Content({
  showFilter = true,
  showSearch = true,
  limit = 5,
  filters = {},
  _grid = {},
}: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier = searchParams.get('identifier');
  const [searchValue, setSearchValue] = useState('');
  const [tabValue, setTabValue] = useState<number>();
  const [tabs, setTabs] = useState<any>([]);
  const [contentData, setContentData] = useState<ContentSearchResponse[]>([]);
  const [isPageLoading, setPageIsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [localFilters, setFilters] = useState<any>({ limit: 5, offset: 0 });
  const theme = useTheme();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [frameworkFilter, setFrameworkFilter] = useState(false);
  const [trackData, setTrackData] = useState<[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [issueData, setIssueData] = useState({
    subject: '',
    description: '',
    status: '',
    priority: '',
  });
  const [filterShow, setFilterShow] = useState(false);
  const [propData, setPropData] = useState<{
    _grid: object;
    filters: object;
    contentTabs: string[];
    cardName?: string;
  }>({
    _grid: {},
    filters: {},
    contentTabs: [],
    cardName: '',
  });

  useEffect(() => {
    const init = async () => {
      const newData = await getData('mfes_content_pages_content');
      setPropData(newData);
      setTabValue(0);
      setPageIsLoading(false);
    };
    init();
  }, []);

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

  const handleCardClick = async (
    identifier: string,
    contentMimeType: string
  ) => {
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
        router.push(`/content-details/${identifier}`);
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

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const init = () => {
      const cookies = document.cookie.split('; ');
      const subid = cookies
        .find((row) => row.startsWith('subid='))
        ?.split('=')[1];

      localStorage.setItem('subId', `${subid}`);
      const filteredTabs = [
        {
          label: 'Courses',
          type: 'Course',
        },
        {
          label: 'Content',
          type: 'Learning Resource',
        },
      ].filter((tab) =>
        propData?.contentTabs?.length > 0
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

  const handleHelpClick = () => {
    // alert('Contact Help Desk at help@shiksha.com');
    setIsDialogOpen(true);
  };
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  const handleChange =
    (field: string) =>
    (
      event:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<string>
    ) => {
      const value = event.target.value;
      setIssueData({
        ...issueData,
        [field]: value,
      });
    };
  const handleOtpSubmit = async () => {
    const queryString = new URLSearchParams(issueData).toString();
    const frappeDeskUrl = `http://localhost:8000/helpdesk/tickets/new?${queryString}`;
    router.push(frappeDeskUrl);
  };

  return (
    <Loader isLoading={isPageLoading}>
      <Box sx={{ p: 2 }}>
        {showSearch && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
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
            {showFilter && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#ECE6F0',
                    borderRadius: '12px',
                    // padding: '8px',
                    width: '56px',
                    height: '46px',
                    '&:hover': {
                      backgroundColor: '#E0E0E0',
                      boxShadow: '0px 4px 8px 3px #00000026',
                    },
                    marginLeft: '4px',
                    marginRight: '7px',

                    boxShadow: '0px 1px 3px 0px #0000004D',
                  }}
                  onClick={() => setFilterShow(true)}
                >
                  <FilterAltOutlinedIcon
                    sx={{ color: '#6750A4', fontSize: '25px' }}
                  />
                </Box>
                <FilterDialog
                  open={filterShow}
                  onClose={() => setFilterShow(false)}
                  frameworkFilter={frameworkFilter}
                  filterValues={localFilters}
                  onApply={handleApplyFilters}
                />

                <CommonDialog
                  isOpen={isDialogOpen}
                  onClose={handleDialogClose}
                  header="Help desk"
                  content={
                    <Grid container spacing={2}>
                      <Typography>
                        We’ve sent an your issue to help desk
                      </Typography>
                      <Grid
                        size={{ xs: 12, sm: 6, md: 12, lg: 12 }}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                          borderRadius: '20px 20px 0 0',
                          padding: '15px',
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        <CommonTextField
                          label="Subject"
                          value={issueData.subject}
                          type="text"
                          variant="outlined"
                          onChange={handleChange('subject')}
                        />
                        <CommonTextField
                          label="Description"
                          type="text"
                          variant="outlined"
                          multiline
                          rows={4}
                          value={issueData.description}
                          onChange={handleChange('description')}
                        />
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Status
                          </InputLabel>
                          <Select
                            fullWidth
                            value={issueData.status}
                            onChange={handleChange('status')}
                          >
                            <MenuItem value="Open">Open</MenuItem>
                            <MenuItem value="Closed">Closed</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Priority
                          </InputLabel>

                          <Select
                            fullWidth
                            value={issueData.priority}
                            onChange={handleChange('priority')}
                            sx={{ mt: 2 }}
                          >
                            <MenuItem value="High">High</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Low">Low</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  }
                  actions={
                    <Button
                      onClick={handleOtpSubmit}
                      sx={{
                        color: '#FFFFFF',
                        width: '20%',
                        height: '40px',
                        bgcolor: '#6750A4',
                        borderRadius: '50px',
                        fontSize: '14px',
                        fontWeight: 500,
                      }}
                    >
                      Submit
                    </Button>
                  }
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
          _grid={{ ..._grid, ...propData?._grid }}
          trackData={trackData || []}
          type={localFilters?.type || ''}
          handleCardClick={handleCardClick}
          hasMoreData={hasMoreData}
          handleLoadMore={handleLoadMore}
          isLodingMoreData={isLoading}
          tabs={tabs}
        />
        <HelpDesk onClick={handleHelpClick} theme={theme} />
        {showBackToTop && <BackToTop onClick={handleBackToTop} theme={theme} />}
      </Box>
    </Loader>
  );
}

const HelpDesk = ({ onClick, theme }: any) => {
  return (
    <Fab
      color="primary"
      aria-label="help"
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
          bgcolor: theme.palette.primary.dark,
        },
      }}
      onClick={onClick}
    >
      <HelpIcon />
    </Fab>
  );
};

const BackToTop = ({ onClick, theme }: any) => {
  return (
    <Fab
      color="secondary"
      aria-label="back to top"
      sx={{
        position: 'fixed',
        display: 'table-column',
        bottom: 80,
        right: 16,
        height: '75px',
        borderRadius: '100px',
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
          bgcolor: theme.palette.primary.dark,
        },
      }}
      onClick={onClick}
    >
      <ArrowUpwardIcon />
      <Typography fontSize={'10px'}>Back to Top</Typography>
    </Fab>
  );
};
