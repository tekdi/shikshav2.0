/* eslint-disable no-constant-binary-expression */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
'use client';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Switch,
  Typography,
  useMediaQuery,
  useTheme,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  AtreeCard,
  ContentSearch,
  FilterDialog,
  RESOURCE_TYPES,
  MIME_TYPES,
  trackEvent,
} from '@shared-lib';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import atreeLogo from '../../../assets/images/placeholder.jpg';
import Layout from '../../component/layout/layout';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';
import Loader from '../../component/layout/LoaderComponent';
import dynamic from 'next/dynamic';
import FooterText from '../../component/FooterText';
import Footer from '../../component/layout/Footer';
import Link from 'next/link';
import { TelemetryEventType } from '../../utils/app.constant';
import { telemetryFactory } from '../../utils/telemetry';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
const buttonColors = {
  water: '#0E28AE',
  land: '#8F4A50',
  forest: '#148A00',
  'climate change': '#CF3D03',
  'activity books': '#23005A',
  'reference books': '#FFBD0D',
  general: '#FFBD0D',
  potpourri: '#FFBD0D',
};
const Content = dynamic(() => import('@Content'), { ssr: false });

interface ContentSectionProps {
  contentData: ContentType[];
  handleCardClick: (content: ContentType) => void;
}

export default function Index() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const [contentData, setContentData] = useState<any>([]);

  const [consumedContent, setConsumedContent] = useState<string[]>([]);
  const [frameworkFilter, setFrameworkFilter] = useState();

  const [framework, setFramework] = useState('');
  const [subFrameworkFilter, setSubFrameworkFilter] = useState<any[]>([]);
  const [subFramework, setSubFramework] = useState('');
  const [filterCategory, SetFilterCategory] = useState<string>('');
  const [isLoadingChildren, setIsLoadingChildren] = useState(true);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [fullAccess, setFullAccess] = useState(false);
  const [filters, setFilters] = useState<any>({
    request: {
      filters: {},
      offset: 0,
      limit: 5,
    },
  });
  const [filterData, setFilterData] = useState();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const frameworkName = searchParams.get('category')?.toLocaleUpperCase();

  // **Handle API Calls with Updated Filters**
  useEffect(() => {
    // Scroll to top when framework or filterCategory changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [framework, filterCategory, subFramework]);
  const fetchContentData = async (updatedFilters: any) => {
    try {
      setIsLoadingChildren(true);

      const data = await ContentSearch({
        channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
        filters: updatedFilters,
      });

      setContentData(data?.result?.content ?? []);
    } catch (error) {
      console.error('Error fetching content data:', error);
    } finally {
      setIsLoadingChildren(false);
    }
  };

  // **Update Filters and Trigger API Call in One Step**
  const handleApplyFilters = async (selectedValues: any) => {
    trackEvent({
      action: 'filter_apply',
      category: 'user',
      label: 'Home Page',
    });
    const { offset, limit, ...filters } = selectedValues;
    setFilters((prevFilters) => {
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
      cleanedFilters.topic = filterCategory ? [filterCategory] : ['Water'];

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

      fetchContentData(newFilters.request.filters);
      return newFilters;
    });
  };
  useEffect(() => {
    trackEvent({
      action: 'view_home_page',
      category: 'Home Page',
    });
  }, []);
  // **Initial Data Fetch Based on frameworkName**
  useEffect(() => {
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
        if (frameworkName) {
          const foundFramework = fdata.find(
            (item: any) =>
              item.name.toLowerCase() === frameworkName.toLowerCase()
          );
          if (foundFramework) {
            selectedFramework = foundFramework;
          }
        }
        const selectedCategory = selectedFramework?.name;
        const selectedIdentifier = selectedFramework?.identifier;

        setFramework(selectedIdentifier);
        SetFilterCategory(selectedCategory);
        localStorage.setItem('category', selectedCategory);

        const newFilters = {
          topic: [selectedCategory],
        };

        setFilters({
          request: {
            filters: newFilters,
            offset: 0,
            limit: 5,
          },
        });

        fetchContentData(newFilters);
      } catch (error) {
        console.error('Error fetching board data:', error);
      } finally {
        setIsLoadingChildren(false);
      }
    };

    init();
  }, [frameworkName]);

  // **Update FilterCategory When Framework Changes**
  useEffect(() => {
    if (framework && frameworkFilter) {
      //@ts-check
      const subFrameworkData = frameworkFilter?.find(
        (item: any) => item.identifier === framework
      );

      const categoryName = subFrameworkData?.name
        ? subFrameworkData.name.charAt(0).toUpperCase() +
          subFrameworkData.name.slice(1).toLowerCase()
        : '';

      SetFilterCategory(categoryName);
      localStorage.setItem('category', categoryName);
      setFullAccess(false);
      const uniqueAssociations = Array.from(
        new Map(
          subFrameworkData?.associations?.map((item: any) => [item?.name, item])
        ).values()
      );

      setSubFrameworkFilter(uniqueAssociations);

      if (filterCategory !== categoryName) {
        setFilters({
          request: { filters: { topic: [categoryName] }, offset: 0, limit: 5 },
        });
      }
    }
  }, [framework, frameworkFilter, frameworkName]);

  // **Listen for Filter Changes and Fetch Content**
  useEffect(() => {
    if (
      filters.request.filters &&
      Object.keys(filters.request.filters).length
    ) {
      fetchContentData(filters.request.filters);
    }
  }, [filters]); // ✅ Fetch only when `filters` change

  // **Handle Content Click**
  const handleCardClick = (content: any) => {
    trackEvent({
      action: `${filterCategory} - ${content?.name}`,
      category: 'user',
      label: 'Home Page',
    });
    localStorage.removeItem('selectedFilters');
    const windowUrl = window.location.pathname;
    const cleanedUrl = windowUrl.replace(/^\//, '');
    const env = cleanedUrl.split('/')[0];

    const telemetryInteract = {
      context: {
        env: env,
        cdata: [],
      },
      edata: {
        id: `${filterCategory} - ${content?.name}`,
        type: TelemetryEventType.CLICK,
        subtype: '',
        pageid: cleanedUrl,
      },
    };
    telemetryFactory.interact(telemetryInteract);
    if (consumedContent.length < 3) {
      router.push(`/contents/${content?.identifier}`);
      setConsumedContent((prev) => {
        const updatedContent = [...prev, content?.identifier];
        localStorage.setItem('consumedContent', JSON.stringify(updatedContent));
        return updatedContent;
      });
    } else if (!localStorage.getItem('token')) {
      setOpenMessageDialog(true);
      localStorage.removeItem('consumedContent');
    } else {
      router.push(`/contents/${content?.identifier}`);
    }
  };
  const handleToggleFullAccess = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const accessValue = event.target.checked ? 'Full Access' : 'all'; // Set 'full' or 'all' based on switch state
    setFullAccess(event.target.checked);
    if (accessValue === 'Full Access') {
      localStorage.setItem('access', accessValue);
    } else {
      localStorage.removeItem('access'); // Remove when unchecked
    }
    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters.request.filters, // Preserve existing filters
        topic: filterCategory ? [filterCategory] : ['Water'],
      };

      if (accessValue === 'Full Access') {
        updatedFilters.access = 'Full Access';
      } else {
        delete updatedFilters.access;
      }

      const newFilters = {
        request: {
          filters: updatedFilters,
          offset: prevFilters.request.offset ?? 0,
          limit: prevFilters.request.limit ?? 5,
        },
      };

      fetchContentData(newFilters.request.filters);
      return newFilters;
    });
  };
  // **Restore Consumed Content from LocalStorage**
  useEffect(() => {
    const storedContent = localStorage.getItem('consumedContent');
    if (storedContent) {
      setConsumedContent(JSON.parse(storedContent));
    }
  }, [frameworkName]);

  // **Handle Dialog Close**
  const handleCloseMessage = () => {
    setOpenMessageDialog(false);
    router.push('/signin');
  };

  console.log('Filters:', frameworkName);
  console.log('Filters filters:', filters);

  console.log('Content Data:', contentData);
  const hasFilter =
    (filters?.request?.filters?.mimeType?.length ?? 0) > 0 ||
    (filters?.request?.filters?.resource?.length ?? 0) > 0 ||
    (filters?.request?.filters?.access?.length ?? 0) > 0;
  const renderFooterComponent = () => {
    if (!isMobile) {
      return <FooterText page="" />;
    }
    return undefined;
  };
  useEffect(() => {
    if (subFramework) {
      const selectedSubFramework = subFrameworkFilter.find(
        (item) => item.identifier === subFramework
      );

      if (selectedSubFramework) {
        const newFilters = {
          ...filters.request.filters,
          topic: filterCategory ? [filterCategory] : ['Water'],
          subTopic: [selectedSubFramework.name], // Add subTopic filter
        };

        setFilters({
          request: {
            filters: newFilters,
            offset: 0,
            limit: 5,
          },
        });

        fetchContentData(newFilters);
      }
    }
  }, [subFramework, subFrameworkFilter]);

  useEffect(() => {
    if (framework && frameworkFilter) {
      // Reset subFramework when framework changes
      setSubFramework(''); // Add this line

      const subFrameworkData = frameworkFilter?.find(
        (item: any) => item.identifier === framework
      );
      // ... rest of your code
    }
  }, [framework, frameworkFilter, frameworkName]);
  const transformDisplayName = (name: string) => {
    if (name === 'Water based STEM and STEM Activities') {
      return 'STEM and STEAM Activities';
    }
    if (name === 'Grassland') {
      return 'Grasslands';
    }
    return name;
  };

  return (
    <Layout isLoadingChildren={isLoadingChildren}>
      <Box display="flex" flexDirection="column" gap="1rem" py="1rem">
        {!isMobile ? (
          <Grid container spacing={2} sx={{ padding: '25px' }}>
            <Grid size={{ xs: 3 }}>
              <Box>
                <FilterDialog
                  frameworkFilter={filterData}
                  filterValues={filters}
                  onApply={handleApplyFilters}
                  isMobile={isMobile}
                  resources={RESOURCE_TYPES}
                />
              </Box>
            </Grid>
            {hasFilter ? (
              <Grid size={{ xs: 9 }}>
                <Box
                  sx={{
                    width: '100%',
                    gap: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '12px',
                  }}
                >
                  <ContentSection
                    contents={contentData.length > 0 ? contentData : []}
                    title={!hasFilter ? '' : undefined}
                    onTitleClick={() => {
                      localStorage.removeItem('subcategory');
                      router.push('/contents');
                    }}
                    handleCardClick={handleCardClick}
                  />
                </Box>
              </Grid>
            ) : (
              <Grid size={{ xs: 9 }}>
                <Box
                  sx={{
                    width: '100%',
                    // gap: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '9px 0px',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    {subFrameworkFilter && subFrameworkFilter.length > 0 && (
                      <Title>{t('Browse by Sub Categories')}</Title>
                    )}
                  </Box>

                  <Box
                    sx={{
                      width: '100%',
                      padding: '12px 0px',
                      gap: '16px',
                      flexDirection: 'column',
                      display: 'flex',
                    }}
                  >
                    <SubFrameworkFilter
                      subFramework={subFramework}
                      setSubFramework={setSubFramework}
                      lastButton={true}
                      subFrameworkFilter={subFrameworkFilter || []}
                    />
                  </Box>

                  <ContentSection
                    contents={contentData.length > 0 ? contentData : []}
                    title={t('')}
                    onTitleClick={() => {
                      localStorage.removeItem('subcategory');
                      router.push('/contents');
                    }}
                    handleCardClick={handleCardClick}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        ) : (
          <Box sx={{ marginTop: '1rem', marginBottom: '2rem' }}>
            <FrameworkFilter
              frameworkFilter={frameworkFilter || []}
              framework={framework}
              setFramework={setFramework}
              fromSubcategory={false}
              onClick={() => {
                setFramework(item.identifier);
                setSubFramework('');
              }}
            />

            {subFrameworkFilter && subFrameworkFilter.length > 0 && (
              <Box
                sx={{
                  paddingTop: '5%',
                  width: '80%',
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <FormControl fullWidth sx={{ maxWidth: 400 }}>
                  <Select
                    value={subFramework || ''}
                    displayEmpty
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      setSubFramework(selectedValue);
                    }}
                    renderValue={(selected) => {
                      if (!selected || selected === '') {
                        return (
                          <span style={{ color: '#999' }}>
                            Browse by Sub Categories
                          </span>
                        );
                      }
                      const selectedItem = subFrameworkFilter.find(
                        (item) => item.identifier === selected
                      );
                      return selectedItem
                        ? transformDisplayName(selectedItem.name)
                        : selected;
                    }}
                    sx={{
                      borderRadius: '50px',
                      fontSize: '14px',
                      height: 40,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: '1px solid #000',
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          borderRadius: '16px',
                          fontSize: '14px',
                        },
                      },
                    }}
                  >
                    {subFrameworkFilter
                      ?.filter(
                        (item) =>
                          item.name !== 'Magazines, Newspapers and Websities'
                      )
                      .map((item) => (
                        <MenuItem key={item.identifier} value={item.identifier}>
                          {transformDisplayName(item.name)}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            <Box
              sx={{
                flexDirection: 'column',
                width: '100%',
                gap: '16px',
                padding: '15px',
                display: 'flex',
              }}
            >
              <ContentSection
                title={t('')}
                handleCardClick={handleCardClick}
                onTitleClick={() => {
                  localStorage.removeItem('subcategory');
                  router.push('/contents');
                }}
                contents={contentData.length > 0 ? contentData : []}
              />
            </Box>
          </Box>
        )}
      </Box>

      <Dialog
        open={openMessageDialog}
        onClose={(event, reason) => {
          if (reason === 'backdropClick') return;
          setOpenMessageDialog(false);
        }}
        disableEscapeKeyDown
        PaperProps={{
          style: {
            maxWidth: '600px',
            maxHeight: 'calc(100vh - 64px)',
            overflow: 'auto',
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography sx={{ fontSize: '22px' }}>Message</Typography>
            <IconButton
              aria-label="close"
              onClick={handleCloseMessage}
              sx={{ ml: 2 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{ fontFamily: 'Poppins', fontSize: '16px', fontWeight: '500' }}
          >
            Great going! You've explored 3 resources. Please login to continue
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', py: 2, px: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseMessage}
            sx={{
              borderRadius: '50px',
              height: '40px',
              width: '30%',
              borderRadius: '50px',
              height: '40px',
              backgroundColor: '#fcd804',
              color: '#000000',
              fontFamily: 'Poppins',
              fontSize: '16px',
              fontWeight: '500',
              textTransform: 'none',
            }}
          >
            {t('Proceed')}
          </Button>
        </DialogActions>
      </Dialog>
      <FooterText page="" />
    </Layout>
  );
}
const SwitchAccess = ({ fullAccess, handleToggleFullAccess }: any) => (
  <Box
    display="flex"
    alignItems="center"
    gap={1}
    marginLeft="auto"
    width={'28%'}
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
        height: 26,
        padding: 0,
        width: 42,
        '& .MuiSwitch-switchBase': {
          transitionDuration: '300ms',
          padding: 0,
          '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(16px)',
            '& + .MuiSwitch-track': {
              background: '#fcd804',
              opacity: 1,
              border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.5,
            },
          },
          '&.Mui-focusVisible .MuiSwitch-thumb': {
            border: '6px solid #fff',
            color: '#33cf4d',
          },

          '&.Mui-disabled + .MuiSwitch-track': {
            background: '#BDBDBD', // Grey track when disabled
            opacity: 0.5,
          },
          '&.Mui-disabled .MuiSwitch-thumb': {
            color: '#BDBDBD', // Grey thumb when disabled
          },
        },
        '& .MuiSwitch-thumb': {
          height: 25,
          boxSizing: 'border-box',

          width: 25,
        },
        '& .MuiSwitch-track': {
          background: fullAccess ? '#fcd804' : '#BDBDBD', // Grey when unchecked
          opacity: 1,
          borderRadius: 26 / 2,
        },
      }}
    />

    <Typography
      sx={{
        color: fullAccess ? '#000000' : '#9E9E9E',
        fontSize: '14px',
        fontWeight: fullAccess ? '600' : '400',
      }}
    >
      Only Full Access
    </Typography>
  </Box>
);
const ContentSection = ({ title, contents, onTitleClick, handleCardClick }) => (
  <Box
    sx={{
      width: '100%',
      gap: '16px',
      display: 'flex',
      flexDirection: 'column',
      padding: '0px',
    }}
  >
    {title && <Title onClick={onTitleClick}>{title}</Title>}

    {contents && contents.length > 0 ? (
      <AtreeCard
        contents={contents}
        handleCardClick={handleCardClick}
        _grid={{ size: { xs: 6, sm: 6, md: 4, lg: 3 } }}
        _card={{ image: atreeLogo.src }}
      />
    ) : (
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          width: '100%',
          fontWeight: 500,
          color: 'text.secondary',
          mt: 2,
        }}
      >
        Oops! We don't have this resource yet on our shelves. Help us stock it
        by recommending it{' '}
        <Link
          href="https://docs.google.com/forms/d/1r4wxm2a2kKH2Veq9_AYIfmWNYJJh5u-nw_SweHC5ydQ/viewform?edit_requested=true"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#0037B9', textDecoration: 'underline' }}
        >
          here
        </Link>
      </Typography>
    )}
  </Box>
);

const FilterSection = ({ frameworkFilter, framework, setFramework }) => (
  <FrameworkFilter
    frameworkFilter={frameworkFilter || []}
    framework={framework}
    setFramework={setFramework}
    fromSubcategory={false}
  />
);

const FrameworkFilter = React.memo<{
  frameworkFilter: Array<{ identifier: string; name: string }>;
  framework: string;
  fromSubcategory?: boolean;
  setFramework: (framework: string) => void;
}>(({ frameworkFilter, framework, setFramework, fromSubcategory }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showForwardArrow, setShowForwardArrow] = useState(true);
  const hasMultipleItems = frameworkFilter?.length > 1;
  const showArrow = hasMultipleItems && frameworkFilter?.length > 0;

  const transformName = (name: string) => {
    if (name === 'Water based STEM and STEM Activities') {
      return 'Water based STEM and STEAM Activities';
    }
    if (name === 'Grassland') {
      return 'Grasslands';
    }
    return name;
  };

  const handleItemClick = (item: any) => {
    if (fromSubcategory) {
      localStorage.setItem('subcategory', item.name);
      router.push(`/contents`);
    } else {
      setFramework(item.identifier);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });

      // Check if we've reached the end after scrolling
      setTimeout(() => {
        if (scrollRef.current) {
          const { scrollWidth, scrollLeft, clientWidth } = scrollRef.current;
          const isAtEnd = Math.abs(scrollWidth - scrollLeft - clientWidth) < 1;
          setShowForwardArrow(!isAtEnd);
        }
      }, 300); // Wait for the scroll to complete
    }
  };

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });

      // Check if we've reached the start after scrolling
      setTimeout(() => {
        if (scrollRef.current) {
          const { scrollLeft } = scrollRef.current;
          const isAtStart = scrollLeft <= 1;
          setShowForwardArrow(isAtStart);
        }
      }, 300); // Wait for the scroll to complete
    }
  };

  // Initial check for scroll position
  useEffect(() => {
    const checkScrollPosition = () => {
      if (scrollRef.current) {
        const { scrollWidth, scrollLeft, clientWidth } = scrollRef.current;
        const isAtEnd = Math.abs(scrollWidth - scrollLeft - clientWidth) < 1;
        setShowForwardArrow(!isAtEnd);
      }
    };

    checkScrollPosition();

    // Add event listener for scroll
    const currentRef = scrollRef.current;
    currentRef?.addEventListener('scroll', checkScrollPosition);

    return () => {
      currentRef?.removeEventListener('scroll', checkScrollPosition);
    };
  }, [frameworkFilter]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fcd804',
        padding: '2px 16px',
        overflow: 'hidden',
      }}
    >
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',

          overflowX: 'auto',
          flex: 1,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {frameworkFilter?.map((frameworkItem) => (
          <Box
            key={frameworkItem.identifier}
            onClick={() => handleItemClick(frameworkItem)}
            sx={{
              cursor: 'pointer',
              fontFamily: 'Poppins',
              fontSize: { xs: '14px', sm: '16px' },
              fontWeight: framework === frameworkItem.identifier ? 700 : 500,
              color:
                framework === frameworkItem.identifier ? 'black' : '#5E5E5E',

              whiteSpace: 'nowrap',
              minWidth: 'fit-content',
              px: 1,
              backgroundColor: 'transparent',
              '&:hover': {
                color: '#000',
              },
            }}
          >
            {transformName(frameworkItem.name)}
          </Box>
        ))}
      </Box>

      {showArrow && (
        <IconButton
          onClick={showForwardArrow ? handleScrollRight : handleScrollLeft}
          sx={{ ml: 1 }}
        >
          {showForwardArrow ? (
            <ArrowForwardIosIcon fontSize="small" />
          ) : (
            <ArrowBackIosIcon fontSize="small" />
          )}
        </IconButton>
      )}
    </Box>
  );
});

const SubFrameworkFilter = React.memo<{
  subFrameworkFilter: Array<{ identifier: string; name: string }>;
  subFramework: string;
  setSubFramework: (subFramework: string) => void;
  lastButton: boolean;
}>(function SubFrameworkFilter({
  subFrameworkFilter,
  subFramework,
  setSubFramework,
}) {
  const { t } = useTranslation();
  const router = useRouter();

  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [filterItems, setFilterItems] = useState<
    Array<{ identifier: string; name: string }>
  >([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const maxItems = isMobile ? 3 : 5;
  useEffect(() => {
    if (subFrameworkFilter) {
      setFilterItems(subFrameworkFilter.slice(0, maxItems));
    }
  }, [subFrameworkFilter]);
  const handleItemClick = (item: any) => {
    localStorage.setItem('subcategory', item.name);
    trackEvent({
      action: 'tags_click',
      category: 'engagement',
      label: `Subcategory -${item.name}`,
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
        id: `Subcategory -${item.name}`,
        type: TelemetryEventType.CLICK,
        subtype: '',
        pageid: cleanedUrl,
      },
    };
    telemetryFactory.interact(telemetryInteract);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    router.push(`/contents`);
  };
  const capitalizeFirstLetter = (str: string) => {
    if (str === 'Water based STEM and STEM Activities') {
      return 'Water based STEM and STEAM Activities';
    }
    if (str === 'Grassland') {
      return 'Grasslands';
    }
    // Default case for other strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  return (
    <Grid container spacing={1}>
      {filterItems
        ?.filter((item) => item.name !== 'Magazines, Newspapers and Websities')
        ?.map((subFrameworkItem: any) => (
          <Grid key={subFrameworkItem.identifier}>
            <Chip
              key={subFrameworkItem.name}
              label={capitalizeFirstLetter(subFrameworkItem.name)}
              variant="outlined"
              sx={{
                height: 32,
                padding: '4px 6px',
                borderRadius: '8px',
                '& .MuiChip-label': {
                  fontSize: '14px',
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  color: '#000000',
                },
              }}
              onClick={() => {
                trackEvent({
                  action: 'subcategory_click',
                  category: 'user',
                  label: 'Home Page',
                });
                handleItemClick(subFrameworkItem);
              }}
            />
          </Grid>
        ))}
      {subFrameworkFilter?.length > (isMobile ? 3 : 6) && (
        <Chip
          label={
            <MoreVertIcon
              fontSize="medium"
              sx={{ width: '11px', height: '11px' }}
            />
          }
          variant="outlined"
          sx={{
            height: 32,
            padding: '4px 6px',
            borderRadius: '8px',
            '& .MuiChip-label': {
              fontSize: '14px',
              fontFamily: 'Poppins',
              fontWeight: 500,
              color: '#000000',
            },
          }}
          onClick={() => {
            trackEvent({
              action: 'subcategory_click',
              category: 'user',
              label: 'Home Page',
            });
            setOpenPopup(true);
          }}
        />
      )}
      {subFrameworkFilter?.length > (isMobile ? 3 : 6) && openPopup && (
        <Dialog
          open={openPopup}
          onClose={() => setOpenPopup(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            style: {
              maxHeight: '80vh',
              overflow: 'hidden',
            },
          }}
        >
          {/* <DialogTitle>Remaining Data</DialogTitle> */}
          <IconButton
            aria-label="close"
            onClick={() => {
              trackEvent({
                action: 'subcategory_click',
                category: 'user',
                label: 'Home Page',
              });
              setOpenPopup(false);
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#484848',
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent sx={{ padding: '45px 30px' }}>
            <FrameworkFilter
              frameworkFilter={subFrameworkFilter}
              framework={subFramework}
              setFramework={setSubFramework}
              fromSubcategory={true}
            />
          </DialogContent>
        </Dialog>
      )}
    </Grid>
  );
});

const Title: React.FC<{
  children: React.ReactNode | string;
  onClick?: () => void;
}> = ({ children, onClick }) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
    >
      <Typography
        sx={{
          fontFamily: 'Poppins',
          fontWeight: 600,
          fontSize: { xs: '20px', md: '18px' },
          lineHeight: '28px',
          color: '#000000',
        }}
      >
        {children}
      </Typography>
      {onClick && (
        <IconButton onClick={onClick}>
          <ChevronRightIcon />
        </IconButton>
      )}
    </Box>
  );
};
