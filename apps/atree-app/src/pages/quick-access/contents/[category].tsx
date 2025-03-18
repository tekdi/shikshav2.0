import React, { useEffect, useState } from 'react';
import Layout from '../../../component/layout/layout';
import FolderComponent from '../../../component/FolderComponent';
import { useRouter } from 'next/router';
import { Button, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import Grid from '@mui/material/Grid2';

interface Term {
  name: string;
  associations: any[];
}
import atreeLogo from '../../../../assets/images/atreeLogo.png';
const Content = dynamic(() => import('@Content'), {
  ssr: false,
});
const MyComponent: React.FC = () => {
  const [categories, setCategories] = useState<Array<any>>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(true);
  const router = useRouter();
  const { category } = router.query; // Access the identifier from the URL
  const [subFramework, setSubFramework] = useState('');
  console.log('id', category);
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
      <Content
        {...{
          _grid: {
            size: { xs: 6, sm: 6, md: 4, lg: 3 },
          },
          contentTabs: ['content'],
          filters: {
            filters: {
              channel: process.env.NEXT_PUBLIC_CHANNEL_ID,
              ...(subFramework && { mimeType: subFramework }),
              query: `${category}`,
            },
          },
          _card: {
            cardName: 'AtreeCard',
            image: atreeLogo.src,
          },
          showSearch: false,
          showFilter: false,
        }}
      />
    </Layout>
  );
};

export default MyComponent;
