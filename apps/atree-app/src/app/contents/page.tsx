'use client';

import React, { useEffect } from 'react';
import { setData } from '@shared-lib';
import Layout from '../../component/layout/layout';
import { Box } from '@mui/material';

interface ListProps {}

const List: React.FC<ListProps> = () => {
  const mfe_content = process.env.NEXT_PUBLIC_CONTENT;
  const [isLoadingChildren, setIsLoadingChildren] = React.useState(true);

  useEffect(() => {
    const init = async () => {
      await setData('mfes_content_pages_content', {
        _grid: {
          size: { xs: 12, sm: 12, md: 12, lg: 12 },
        },
        contentTabs: ['content'],
        filters: {
          filters: {
            channel: process.env.NEXT_PUBLIC_CHANNEL_ID,
            status: ['Live'],
          },
        },
      });
      setIsLoadingChildren(false);
    };
    init();
  }, [mfe_content]);

  return (
    <Layout
      isLoadingChildren={isLoadingChildren}
      backTitle={'Content'}
      isFooter={false}
      showLogo={true}
      showTopAppBar={{
        showSearch: true,
        title: 'Jal-Jungle-Jameen',
        subtitle: 'In Classrooms ',
        showMenuIcon: true,
        actionButtonLabel: 'Action',
      }}
    >
      <Box
        sx={{
          padding: 0,
          height: 'calc(100vh - 100px)',
          width: '100vw',
          overflow: 'hidden',
        }}
      >
        <iframe
          src={mfe_content}
          style={{
            display: 'block',
            margin: 0,
            padding: 0,
            width: '100vw',
            height: 'calc(100vh - 100px)',
            border: 'none',
          }}
          title="Embedded Localhost"
        />
      </Box>
    </Layout>
  );
};

export default List;
