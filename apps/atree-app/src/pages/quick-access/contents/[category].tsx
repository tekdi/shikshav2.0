import React, { useEffect, useState } from 'react';
import Layout from '../../../component/layout/layout';
import FolderComponent from '../../../component/FolderComponent';
import { useRouter } from 'next/router';
import { Box, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

interface Term {
  name: string;
  associations: any[];
}
import atreeLogo from '../../../../assets/images/atreeLogo.png';
import { AtreeCard, ContentSearch } from '@shared-lib';

const MyComponent: React.FC = () => {
  const [categories, setCategories] = useState<Array<any>>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(true);
  const router = useRouter();
  const [contentData, setContentData] = useState<Array<any>>([]);

  const { category } = router.query; // Access the identifier from the URL
  const [subFramework, setSubFramework] = useState('');
  const [searchResults, setSearchResults] = useState<
    { subTopic: string; length: number }[]
  >([]);
  useEffect(() => {
    const init = async () => {
      const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
      const frameworkData = await fetch(url).then((res) => res.json());
      const frameworks = frameworkData?.result?.framework?.categories;
      const fdata =
        frameworks
          .find((item: any) => item.code === 'topic')
          ?.terms?.find((e: Term) => e.name === category)?.associations || [];
      console.log(fdata);
      setCategories(fdata || []);
      const data = await ContentSearch({
        channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
        filters: {
          subTopic: category, // Send each category one by one
        },
      });
      setContentData(data?.result?.content || []);
      if (category) {
        setSearchResults([
          {
            subTopic: Array.isArray(category) ? category[0] : category,
            length: data?.result?.content?.length || 0, // Ensure length is a number
          },
        ]);
      }

      setIsLoadingChildren(false);
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
  return (
    <Layout
      isLoadingChildren={isLoadingChildren}
      _backButton={{ alignItems: 'center' }}
      backTitle={
        <Typography
          style={{
            fontSize: '22px',
            lineHeight: '28px',
            letterSpacing: 0,
          }}
        >
          {category}
        </Typography>
      }
      showBack
      backIconClick={() => router.push('/quick-access')}
    >
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

      <Box
        sx={{
          width: '100%',
          gap: '16px',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
        }}
      >
        <AtreeCard
          contents={
            contentData.length > 6 ? contentData.slice(4, 10) : contentData
          }
          handleCardClick={handleCardClick}
          _grid={{ size: { xs: 6, sm: 6, md: 4, lg: 3 } }}
          _card={{ image: atreeLogo.src }}
        />
      </Box>
    </Layout>
  );
};

export default MyComponent;
