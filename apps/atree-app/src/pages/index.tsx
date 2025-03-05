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
import atreeLogo from '../../assets/images/atreeLogo.png';
import Layout from '../component/layout/layout';
// import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

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
  const [isLoadingChildren, setIsLoadingChildren] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    if (framework) {
      if (frameworkFilter) {
        const subFrameworkData = (frameworkFilter as any).find(
          (item: any) => item.identifier === framework
        );
        setSubFrameworkFilter(subFrameworkData?.associations || []);
      }
    }
  }, [framework, frameworkFilter]);

  useEffect(() => {
    const init = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
        const frameworkData = await fetch(url).then((res) => res.json());
        const frameworks = frameworkData?.result?.framework?.categories;
        const fdata =
          frameworks.find((item: any) => item.code === 'topic')?.terms || [];
        console.log(fdata[0]?.name);
        setFramework(fdata[0]?.identifier || '');
        setFrameworkFilter(fdata);

        const data = await ContentSearch({
          type: 'Learning Resource',
          channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
          limit: 4,
          filters: {
            status: ['Live'],
          },
        });
        setContentData(data?.result?.content || []);
        setRelatedContent(data?.result?.content || []);
      } catch (error) {
        console.error('Error fetching board data:', error);
      } finally {
        setIsLoadingChildren(false);
      }
    };
    init();
  }, []);

  const handleCardClick = (content: any) => {
    if (consumedContent.length < 3) {
      router.push(`/contents/${content?.identifier}`);
      setConsumedContent((prev) => [...prev, content?.identifier]);
    } else {
      alert('Please log in to continue');
    }
  };

  return (
    <Layout isLoadingChildren={isLoadingChildren}>
      <Box display="flex" flexDirection="column" gap="3rem" py="3rem" px="14px">
        <FrameworkFilter
          frameworkFilter={frameworkFilter || []}
          framework={framework}
          setFramework={setFramework}
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
            contents={contentData}
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
            contents={relatedContent}
            handleCardClick={handleCardClick}
            _grid={{ size: { xs: 6, sm: 6, md: 4, lg: 3 } }}
            _card={{ image: atreeLogo.src }}
          />
        </Box>
      </Box>
    </Layout>
  );
}

const FrameworkFilter = React.memo<{
  frameworkFilter: Array<{ identifier: string; name: string }>;
  framework: string;
  setFramework: (framework: string) => void;
}>(function FrameworkFilter({ frameworkFilter, framework, setFramework }) {
  return (
    <Grid container spacing={1}>
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
                  ? buttonColors[frameworkItem?.name?.toLowerCase() || '']
                  : '',
            }}
            onClick={() => setFramework(frameworkItem.identifier)}
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

  return (
    <Grid container spacing={1}>
      {filterItems?.map((subFrameworkItem: any) => (
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
