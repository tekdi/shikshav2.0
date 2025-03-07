'use client';

import React, { useEffect } from 'react';
import { setData } from '@shared-lib';
import Layout from '../../component/layout/layout';
import { Box } from '@mui/material';
import atreeLogo from '../../../assets/images/atreeLogo.png';
import dynamic from 'next/dynamic';

interface ListProps {}

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});
const List: React.FC<ListProps> = () => {
  const mfe_content = process.env.NEXT_PUBLIC_CONTENT;
  const [isLoadingChildren, setIsLoadingChildren] = React.useState(true);

  useEffect(() => {
    const init = async () => {
      setIsLoadingChildren(false);
    };
    init();
  }, [mfe_content]);

  return (
    <Layout isLoadingChildren={isLoadingChildren}>
      <Box
        sx={{
          padding: 0,
          height: 'calc(100vh - 100px)',
          width: '100vw',
          overflow: 'hidden',
        }}
      >
        <Content
          {...{
            _grid: {
              size: { xs: 6, sm: 6, md: 4, lg: 3 },
            },
            contentTabs: ['content'],
            filters: {
              filters: {
                channel: process.env.NEXT_PUBLIC_CHANNEL_ID,
                status: ['Live'],
              },
            },
            _card: {
              cardName: 'AtreeCard',
              image: atreeLogo.src,
            },
          }}
        />
      </Box>
    </Layout>
  );
};

export default List;
