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
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { AtreeCard, ContentSearch } from '@shared-lib';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import atreeLogo from '../../../assets/images/atreeLogo.png';
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
  const router = useRouter();
  const [contentData, setContentData] = useState<any>([]);
  const [relatedContent, setRelatedContent] = useState<any>([]);
  const [consumedContent, setConsumedContent] = useState<string[]>([]);
  const [frameworkFilter, setFrameworkFilter] = useState();
  const [framework, setFramework] = useState('');
  const [subFrameworkFilter, setSubFrameworkFilter] = useState();
  const [subFramework, setSubFramework] = useState('');
  const [filterCategory, SetFilterCategory] = useState<string>('');
  const [isLoadingChildren, setIsLoadingChildren] = useState(true);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const frameworkName = searchParams.get('category')?.toLocaleUpperCase();
  useEffect(() => {
    if (framework) {
      if (frameworkFilter) {
        const subFrameworkData = (frameworkFilter as any).find(
          (item: any) => item.identifier === framework
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
            : ''
        );
        setSubFrameworkFilter(subFrameworkData?.associations || []);
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

        const relatedData = Array.isArray(data?.result?.content)
          ? data.result.content
              .filter((item) => {
                const normalizedTopics = Array.isArray(item.topic)
                  ? item?.topic.map((t: any) => t.trim().toLowerCase())
                  : [];

                return (
                  filterCategory?.trim().toLowerCase() &&
                  normalizedTopics.includes(filterCategory.trim().toLowerCase())
                );
              })
              .flatMap((item) =>
                Array.isArray(item.subTopic)
                  ? item.subTopic
                  : [item.subTopic ?? 'Unknown']
              )
          : [];

        const flattenedContents = relatedData.map((name) => ({
          identifier: name.toLowerCase().replace(/\s+/g, '-'),
          name,
          image: atreeLogo.src,
          year: 'N/A',
        }));

        setRelatedContent(flattenedContents);
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

        const relatedData = Array.isArray(data?.result?.content)
          ? data.result.content
              .filter((item) => {
                const normalizedTopics = Array.isArray(item.topic)
                  ? item.topic.map((t) => t.trim().toLowerCase())
                  : [];

                return (
                  filterCategory?.trim().toLowerCase() &&
                  normalizedTopics.includes(filterCategory.trim().toLowerCase())
                );
              })
              .flatMap((item) =>
                Array.isArray(item.subTopic)
                  ? item.subTopic
                  : [item.subTopic ?? 'Unknown']
              )
          : [];

        const flattenedContents = relatedData.map((name) => ({
          identifier: name.toLowerCase().replace(/\s+/g, '-'),
          name,
          image: atreeLogo.src,
          year: 'N/A',
        }));
        setRelatedContent(flattenedContents);
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
  useEffect(() => {
    console.log('Content Data:', contentData);
    // console.log('Content Data:', relatedContent);
  }, [contentData]);
  const handleCardClick = (content: any) => {
    if (consumedContent.length < 3) {
      router.push(`/contents/${content?.identifier}`);
      setConsumedContent((prev) => {
        const updatedContent = [...prev, content?.identifier];
        localStorage.setItem('consumedContent', JSON.stringify(updatedContent));
        return updatedContent;
      });
    } else {
      if (consumedContent.length >= 3 && !localStorage.getItem('token')) {
        // alert('Please log in to continue');
        setOpenMessageDialog(true);
        localStorage.removeItem('consumedContent');
      } else {
        router.push(`/contents/${content?.identifier}`);
      }
    }
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
            }}
          >
            <Title onClick={() => router.push('/contents')}>
              {t('Read, Watch, Listen')}
            </Title>
            <AtreeCard
              contents={
                contentData.length > 4 ? contentData.slice(0, 4) : contentData
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
            }}
          >
            <Title onClick={() => router.push('/contents')}>
              {t('Related Content')}
            </Title>
            <AtreeCard
              contents={
                contentData.length > 6 ? contentData.slice(4, 10) : contentData
              }
              handleCardClick={handleCardClick}
              _grid={{ size: { xs: 6, sm: 6, md: 4, lg: 3 } }}
              _card={{ image: atreeLogo.src }}
            />
          </Box>
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
