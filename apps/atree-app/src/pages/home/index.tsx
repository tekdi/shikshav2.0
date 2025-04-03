/* eslint-disable no-constant-binary-expression */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
'use client';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Switch,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { AtreeCard, ContentSearch, FilterDialog } from '@shared-lib';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import atreeLogo from '../../../assets/images/placeholder.jpg';
import Layout from '../../component/layout/layout';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';
import Loader from '../../component/layout/LoaderComponent';
import { RESOURCE_TYPES, MIME_TYPES } from '../../utils/constantData';
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
  const fetchContentData = async (updatedFilters: any) => {
    try {
      setIsLoadingChildren(true);

      const data = await ContentSearch({
        channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
        filters: updatedFilters,
      });

      setContentData(data?.result?.content || []);
    } catch (error) {
      console.error('Error fetching content data:', error);
    } finally {
      setIsLoadingChildren(false);
    }
  };

  // **Update Filters and Trigger API Call in One Step**
  const handleApplyFilters = async (selectedValues: any) => {
    const { offset, limit, ...filters } = selectedValues;
    setFilters((prevFilters) => {
      const cleanedFilters = {
        ...prevFilters.request.filters, // Preserve existing filters (including access)
        ...Object.fromEntries(
          Object.entries(filters).filter(
            ([_, value]) => Array.isArray(value) && value.length > 0
          )
        ),
      };

      cleanedFilters.topic = filterCategory ? [filterCategory] : ['Water'];

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
        if (frameworkName) {
          const selectedFramework = fdata.find(
            (item: any) =>
              item.name.toLowerCase() === frameworkName.toLowerCase()
          );
          if (selectedFramework) {
            setFramework(selectedFramework.identifier);
          }
        }
        //create filters
        const localCategory = localStorage.getItem('category');
        let selectedCategory = 'Water';
        if (filterCategory) {
          selectedCategory = filterCategory;
        } else if (localCategory) {
          selectedCategory = localCategory;
        }
        const newFilters = {
          topic: [selectedCategory],
        };
        setFilters({ request: { filters: newFilters, offset: 0, limit: 5 } });
        // Fetch content after setting filters
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
  }, [framework, frameworkFilter]);

  // **Listen for Filter Changes and Fetch Content**
  useEffect(() => {
    if (
      filters.request.filters &&
      Object.keys(filters.request.filters).length
    ) {
      fetchContentData(filters.request.filters);
    }
  }, [filters, frameworkName]); // ✅ Fetch only when `filters` change

  // **Handle Content Click**
  const handleCardClick = (content: any) => {
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
    localStorage.setItem('access', accessValue);
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
  console.log('Filters:', filters);

  console.log('Filters:', frameworkName);
  console.log('Content Data:', contentData);
  return (
    <Layout isLoadingChildren={isLoadingChildren}>
      <Box display="flex" flexDirection="column" gap="1rem" py="1rem" px="8px">
        {!isMobile ? (
          <Grid container spacing={2}>
            <Grid size={{ xs: 3 }}>
              <Box>
                <FilterDialog
                  frameworkFilter={filterData}
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
                  width: '100%',
                  gap: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '12px',
                }}
              >
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
                        background: fullAccess
                          ? 'linear-gradient(271.8deg, #E68907 1.15%, #FFBD0D 78.68%)'
                          : '#BDBDBD', // Grey when unchecked
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

                <ContentSection
                  contents={
                    contentData.length > 0
                      ? contentData.slice(0, 4)
                      : [contentData]
                  }
                  title={t('Read, Watch, Listen')}
                  onTitleClick={() => {
                    localStorage.removeItem('subcategory');
                    router.push('/contents');
                  }}
                  handleCardClick={handleCardClick}
                />
              </Box>
              <Box
                sx={{
                  width: '100%',
                  padding: '12px',
                  gap: '16px',
                  flexDirection: 'column',
                  display: 'flex',
                }}
              >
                <Title>{t('Browse by Sub Categories')}</Title>

                <SubFrameworkFilter
                  subFramework={subFramework}
                  setSubFramework={setSubFramework}
                  lastButton={true}
                  subFrameworkFilter={subFrameworkFilter || []}
                />
              </Box>
              <Box
                sx={{
                  width: '100%',
                  flexDirection: 'column',

                  padding: '15px',
                  display: 'flex',
                  gap: '16px',
                }}
              >
                <ContentSection
                  title={t('Related Content')}
                  onTitleClick={() => {
                    localStorage.removeItem('subcategory');
                    router.push('/contents');
                  }}
                  contents={
                    contentData.length > 4 ? contentData.slice(4, 10) : []
                  }
                  handleCardClick={handleCardClick}
                />
              </Box>
            </Grid>
          </Grid>
        ) : (
          <>
            <FrameworkFilter
              frameworkFilter={frameworkFilter || []}
              framework={framework}
              setFramework={setFramework}
              fromSubcategory={false}
            />
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
                title={t('Read, Watch, Listen')}
                handleCardClick={handleCardClick}
                onTitleClick={() => {
                  localStorage.removeItem('subcategory');
                  router.push('/contents');
                }}
                contents={
                  contentData.length > 0 ? contentData.slice(0, 4) : contentData
                }
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                gap: '16px',
                flexDirection: 'column',
                padding: '15px',
              }}
            >
              <Title>{t('Browse by Sub Categories')}</Title>

              <SubFrameworkFilter
                subFrameworkFilter={subFrameworkFilter || []}
                setSubFramework={setSubFramework}
                subFramework={subFramework}
                lastButton={true}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                gap: '16px',
                padding: '15px',
                flexDirection: 'column',
              }}
            >
              <ContentSection
                contents={
                  contentData.length >= 4 ? contentData.slice(4, 10) : []
                }
                title={t('Related Content')}
                handleCardClick={handleCardClick}
                onTitleClick={() => {
                  localStorage.removeItem('subcategory');
                  router.push('/contents');
                }}
              />
            </Box>
          </>
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
        <DialogTitle>Message</DialogTitle>
        <DialogContent>
          <Typography>Please login to continue</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', py: 2, px: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseMessage}
            sx={{ borderRadius: '50px', height: '40px', width: '100%' }}
          >
            {t('Proceed')}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

const ContentSection = ({ title, contents, onTitleClick, handleCardClick }) => (
  <Box
    sx={{
      width: '100%',
      gap: '16px',
      display: 'flex',
      flexDirection: 'column',
      padding: '15px',
    }}
  >
    <Title onClick={onTitleClick}>{title}</Title>
    {contents?.length > 0 ? (
      <AtreeCard
        contents={contents}
        handleCardClick={handleCardClick}
        _grid={{ size: { xs: 6, sm: 6, md: 4, lg: 3 } }}
        _card={{ image: atreeLogo.src }}
      />
    ) : (
      <Typography>No data available...</Typography>
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
}>(function FrameworkFilter({
  frameworkFilter,
  framework,
  setFramework,
  fromSubcategory,
}) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const handleItemClick = (item: any) => {
    if (fromSubcategory) {
      localStorage.setItem('subcategory', item.name);
      router.push(`/contents`);
    } else {
      setFramework(item.identifier);
    }
  };
  return (
    <Grid container spacing={1} display="flex" justifyContent="center">
      {frameworkFilter?.map((frameworkItem: any) => (
        <Grid key={frameworkItem.identifier}>
          <Button
            variant={
              framework === frameworkItem.identifier ? 'contained' : 'outlined'
            }
            sx={{
              borderRadius: '8px',
              borderColor:
                framework !== frameworkItem.identifier ? '#CEE5FF' : '',
              color: framework !== frameworkItem.identifier ? '#171D1E' : '',
              backgroundColor:
                framework === frameworkItem.identifier
                  ? frameworkItem?.name?.toLowerCase() in buttonColors
                    ? buttonColors[
                        frameworkItem?.name?.toLowerCase() as keyof typeof buttonColors
                      ]
                    : ''
                  : '',
            }}
            // onClick={() => setFramework(frameworkItem.identifier)}
            onClick={() => handleItemClick(frameworkItem)}
          >
            {frameworkItem.name}
          </Button>
        </Grid>
      ))}
    </Grid>
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
    router.push(`/contents`);
  };
  return (
    <Grid container spacing={1}>
      {filterItems?.map((subFrameworkItem: any) => (
        <Grid key={subFrameworkItem.identifier}>
          <Button
            // onClick={() => setSubFramework(subFrameworkItem.identifier)}
            onClick={() => handleItemClick(subFrameworkItem)}
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
      {subFrameworkFilter?.length > (isMobile ? 3 : 5) && (
        <Button
          onClick={() => setOpenPopup(true)}
          sx={{
            borderRadius: '8px',
            color: '#001D32',
            backgroundColor: '#E3E9EA',
          }}
        >
          <MoreVertIcon onClick={() => setOpenPopup(true)} />
        </Button>
      )}
      {subFrameworkFilter?.length > (isMobile ? 3 : 5) && openPopup && (
        <Dialog
          open={openPopup}
          onClose={() => setOpenPopup(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            style: {
              maxHeight: '80vh',
              overflow: 'hidden',
            },
          }}
        >
          <DialogTitle>Remaining Data</DialogTitle>
          <DialogContent>
            <FrameworkFilter
              frameworkFilter={subFrameworkFilter}
              framework={subFramework}
              setFramework={setSubFramework}
              fromSubcategory={true}
            />
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', py: 2, px: 3 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenPopup(false)}
              sx={{ borderRadius: '50px', height: '40px', width: '100%' }}
            >
              {t('Close')}
            </Button>
          </DialogActions>
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
          fontStyle: 'normal',
          fontWeight: 700,
          fontSize: '22px',
          lineHeight: '28px',
          color: '#1C170D',
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
