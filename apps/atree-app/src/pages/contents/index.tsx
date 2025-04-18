'use client';

import React, { useEffect } from 'react';
import { ContentSearchResponse } from '@shared-lib';
import Layout from '../../component/layout/layout';
import { Box } from '@mui/material';
import atreeLogo from '../../../assets/images/placeholder.jpg';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import FooterText from '../../component/FooterText';

interface ListProps {}

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});
const selectedLanguage =
  typeof window !== 'undefined' ? localStorage.getItem('language') : null;
const List: React.FC<ListProps> = () => {
  const mfe_content = process.env.NEXT_PUBLIC_CONTENT;
  const [isLoadingChildren, setIsLoadingChildren] = React.useState(true);
  const router = useRouter();
  const subCategory =
    typeof window !== 'undefined' ? localStorage.getItem('subcategory') : null;
  const storedCategory =
    typeof window !== 'undefined' ? localStorage.getItem('category') : null;
  const selectedLanguage =
    typeof window !== 'undefined' ? localStorage.getItem('language') : null;
  const selectedAccess =
    typeof window !== 'undefined' ? localStorage.getItem('access') : null;
  useEffect(() => {
    const init = async () => {
      setIsLoadingChildren(false);
    };
    init();
  }, [mfe_content]);

  return (
    <Layout
      isLoadingChildren={isLoadingChildren}
      footerComponent={<FooterText page={''} />}
    >
      <Box
        sx={{
          padding: 0,
          minHeight: '100vh', // Ensures full screen height even if the parent has constraints
          width: '100%',
          overflow: { md: 'hidden', xs: 'auto' }, // Prevents unwanted scrolling on desktop
          display: 'flex', // Helps in full-height layout
          flexDirection: 'column',
        }}
      >
        <Content
          {...{
            _grid: {
              size: { xs: 6, sm: 6, md: 4, lg: 3 },
            },
            handleCardClick: (content: ContentSearchResponse) =>
              router.push(`/contents/${content?.identifier}`),
            contentTabs: ['content'],
            filters: {
              filters: {
                channel: process.env.NEXT_PUBLIC_CHANNEL_ID,
                ...(subCategory
                  ? { subTopic: subCategory }
                  : { topic: storedCategory }),
                ...(selectedLanguage ? { language: selectedLanguage } : {}),
                ...(selectedAccess ? { access: selectedAccess } : {}),
                // status: ['Live'],
              },
            },
            _card: {
              cardName: 'AtreeCard',
              image: atreeLogo.src,
            },
            showSearch: false,
            filterBy: true,
            showArrowback: true,
          }}
        />
      </Box>
    </Layout>
  );
};

export default List;
