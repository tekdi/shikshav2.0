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
// import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';
import Loader from '../../component/layout/LoaderComponent';
const buttonColors = {
  water: '#0E28AE',
  land: '#8F4A50',
  forest: '#148A00',
  'climate change': '#CF3D03',
  'activity books': '#23005A',
  'reference books': '#FFBD0D',
  general: '#FFBD0D',
};

export default function Index() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const [contentData, setContentData] = useState<any>([]);
  const [fullAccess, setFullAccess] = useState(false);
  const [filterData, setFilterData] = useState();
  const [consumedContent, setConsumedContent] = useState<string[]>([]);
  const [frameworkFilter, setFrameworkFilter] = useState();
  const [framework, setFramework] = useState('');
  const [subFrameworkFilter, setSubFrameworkFilter] = useState();
  const [subFramework, setSubFramework] = useState('');
  const [filterCategory, SetFilterCategory] = useState<string>('');
  const [isLoadingChildren, setIsLoadingChildren] = useState(true);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const frameworkName = searchParams.get('category')?.toLocaleUpperCase();
  useEffect(() => {
    if (framework) {
      if (frameworkFilter) {
        let subFrameworkData = (frameworkFilter as any).find(
          (item: any) => item.identifier === framework
        );
        subFrameworkData = subFrameworkData.associations?.filter(
          (assoc: any) => assoc.status === 'Live'
        );

        SetFilterCategory(
          subFrameworkData?.name
            ? subFrameworkData.name.charAt(0).toUpperCase() +
                subFrameworkData.name.slice(1).toLowerCase()
            : ''
        );
        localStorage.setItem(
          'category',
          subFrameworkData?.name
            ? subFrameworkData.name.charAt(0).toUpperCase() +
                subFrameworkData.name.slice(1).toLowerCase()
            : 'Water'
        );
        setSubFrameworkFilter(subFrameworkData || []);
      }
    }
  }, [framework, frameworkFilter, filterCategory]);
  useEffect(() => {
    const init = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
        const frameworkData = await fetch(url).then((res) => res.json());
        const frameworks = frameworkData?.result?.framework?.categories;
        const fdata =
          frameworks.find((item: any) => item.code === 'topic')?.terms || [];
        setFramework(fdata[0]?.identifier || '');
        setFrameworkFilter(fdata);
        const frameworksD = frameworkData?.result?.framework;
        const filteredFramework = {
          ...frameworksD,
          categories: frameworksD.categories.filter(
            (category: any) => category.status === 'Live'
          ),
        };
        setFilterData(filteredFramework);
        if (frameworkName) {
          const selectedFramework = fdata.find(
            (item: any) =>
              item.name.toLowerCase() === frameworkName.toLowerCase()
          );

          if (selectedFramework) {
            setFramework(selectedFramework.identifier);
          }
        }

        const filters: any = {
          topic: filterCategory ? [filterCategory] : ['Water'],
        };

        const data = await ContentSearch({
          channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
          filters,
        });
        setContentData(data?.result?.content || []);
      } catch (error) {
        console.error('Error fetching board data:', error);
      } finally {
        setIsLoadingChildren(false);
      }
    };
    init();
  }, [frameworkName]);

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        setIsLoadingChildren(true);
        const filters: any = {
          topic: [filterCategory],
        };

        const data = await ContentSearch({
          channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
          filters,
        });

        setContentData(data?.result?.content || []);
      } catch (error) {
        console.error('Error fetching content data:', error);
      } finally {
        setIsLoadingChildren(false);
      }
    };

    // if (filterCategory) {
    fetchContentData();
    // }
  }, [filterCategory]);

  const handleCardClick = (content: any) => {
    if (!content?.identifier) return;

    setConsumedContent((prev) => {
      const updatedContent = Array.from(new Set([...prev, content.identifier]));

      localStorage.setItem('consumedContent', JSON.stringify(updatedContent));

      if (updatedContent.length < 3) {
        router.push(`/contents/${content.identifier}`);
      } else {
        if (!localStorage.getItem('token')) {
          setOpenMessageDialog(true);
          localStorage.removeItem('consumedContent');
        } else {
          router.push(`/contents/${content.identifier}`);
        }
      }

      return updatedContent;
    });
  };
  useEffect(() => {
    const storedContent = localStorage.getItem('consumedContent');
    if (storedContent) {
      setConsumedContent(JSON.parse(storedContent));
    }
  }, []);
  const handleCloseMessage = () => {
    setOpenMessageDialog(false);
    router.push('/signin');
  };
  const handleApplyFilters = async (selectedValues: any) => {
    // Build filters conditionally
    const updatedFilters: Record<string, any> = {};

    if (fullAccess) {
      updatedFilters.access = 'Full Access';
    }

    if (selectedValues && Object.keys(selectedValues).length > 0) {
      Object.assign(updatedFilters, selectedValues);
    }

    // Pass filters only if there are any
    const requestData: any = {
      channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
    };

    if (Object.keys(updatedFilters).length > 0) {
      requestData.filters = updatedFilters;
    }

    const data = await ContentSearch(requestData);

    setContentData(data?.result?.content || []);
  };
  useEffect(() => {
    console.log('Content Data:', contentData);
  }, [contentData]);
  const handleToggleFullAccess = async (
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
      offset: 0,
    }));

    const data = await ContentSearch({
      channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
      ...filters, // Preserve existing filters
    });

    setContentData(data?.result?.content || []);
  };
  return (
    <Layout>
      {isLoadingChildren ? (
        <Loader />
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          gap="3rem"
          py="1rem"
          px="8px"
        >
          {!isMobile ? (
            <Grid container spacing={2}>
              <Grid size={{ xs: 3 }}>
                <Box>
                  <FilterDialog
                    open={true}
                    frameworkFilter={filterData}
                    filterValues={filters}
                    onApply={handleApplyFilters}
                    isMobile={isMobile}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 9 }}>
                <FrameworkFilter
                  frameworkFilter={frameworkFilter || []}
                  framework={framework}
                  setFramework={setFramework}
                  fromSubcategory={false}
                />
                <Box
                  sx={{
                    width: '100%',
                    gap: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '15px',
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
                        // fontWeight: fullAccess ? '400' : '600',
                        // color: fullAccess ? '#9E9E9E' : '#000000',
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
                  <Title onClick={() => router.push('/contents')}>
                    {t('Read, Watch, Listen')}
                  </Title>
                  <AtreeCard
                    contents={
                      contentData.length > 4
                        ? contentData.slice(0, 4)
                        : contentData
                    }
                    handleCardClick={handleCardClick}
                    _grid={{ size: { xs: 6, sm: 6, md: 4, lg: 3 } }}
                    _card={{ image: atreeLogo.src }}
                  />
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    gap: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '15px',
                  }}
                >
                  <Title>{t('Browse by Sub Categories')}</Title>

                  <SubFrameworkFilter
                    subFrameworkFilter={subFrameworkFilter || []}
                    subFramework={subFramework}
                    setSubFramework={setSubFramework}
                    lastButton={true}
                  />
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    gap: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '15px',
                  }}
                >
                  <Title onClick={() => router.push('/contents')}>
                    {t('Related Content')}
                  </Title>
                  <AtreeCard
                    contents={
                      contentData.length > 6
                        ? contentData.slice(4, 10)
                        : contentData
                    }
                    handleCardClick={handleCardClick}
                    _grid={{ size: { xs: 6, sm: 6, md: 4, lg: 3 } }}
                    _card={{ image: atreeLogo.src }}
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
                  width: '100%',
                  gap: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '15px',
                }}
              >
                <Title onClick={() => router.push('/contents')}>
                  {t('Read, Watch, Listen')}
                </Title>
                <AtreeCard
                  contents={
                    contentData.length > 4
                      ? contentData.slice(0, 4)
                      : contentData
                  }
                  handleCardClick={handleCardClick}
                  _grid={{ size: { xs: 6, sm: 6, md: 4, lg: 3 } }}
                  _card={{ image: atreeLogo.src }}
                />
              </Box>
              <Box
                sx={{
                  width: '100%',
                  gap: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '15px',
                }}
              >
                <Title>{t('Browse by Sub Categories')}</Title>

                <SubFrameworkFilter
                  subFrameworkFilter={subFrameworkFilter || []}
                  subFramework={subFramework}
                  setSubFramework={setSubFramework}
                  lastButton={true}
                />
              </Box>
              <Box
                sx={{
                  width: '100%',
                  gap: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '15px',
                }}
              >
                <Title onClick={() => router.push('/contents')}>
                  {t('Related Content')}
                </Title>
                <AtreeCard
                  contents={
                    contentData.length > 6
                      ? contentData.slice(4, 10)
                      : contentData
                  }
                  handleCardClick={handleCardClick}
                  _grid={{ size: { xs: 6, sm: 6, md: 4, lg: 3 } }}
                  _card={{ image: atreeLogo.src }}
                />
              </Box>
            </>
          )}
        </Box>
      )}

      <Dialog
        open={openMessageDialog}
        onClose={() => setOpenMessageDialog(false)}
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
            {t('Close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

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
    <Grid
      container
      spacing={1}
      display="flex"
      justifyContent="center"
      sx={{
        ...(isMobile
          ? {} // No additional styles for mobile
          : {
              position: 'absolute',
              top: '22px',
              left: '25%',
            }),
      }}
    >
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
                  : '#E3E9EA',
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
  // const theme = useTheme();
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [filterItems, setFilterItems] = useState<
    Array<{ identifier: string; name: string }>
  >([]);

  useEffect(() => {
    if (subFrameworkFilter) {
      // const deviceName = Object.keys(theme.breakpoints.values).find((key) => {
      //   return window.innerWidth <= theme.breakpoints.values?.[key];
      // });
      setFilterItems(subFrameworkFilter.slice(0, 3));
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
      {subFrameworkFilter?.length > 3 && (
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
      {subFrameworkFilter?.length > 3 && openPopup && (
        <Dialog
          open={openPopup}
          onClose={() => setOpenPopup(false)}
          PaperProps={{
            style: {
              maxWidth: '600px',
              maxHeight: 'calc(100vh - 64px)',
              overflow: 'auto',
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
