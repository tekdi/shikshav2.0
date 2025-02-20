import React, { useState, useEffect } from 'react';
import { Box, Typography, Pagination, Stack } from '@mui/material';
import { Layout } from '@shared-lib';

interface ListProps {}

const List: React.FC<ListProps> = () => {
  const mfe_content = process.env.NEXT_PUBLIC_CONTENT;
  return (
    <Layout
      isFooter={false}
      showLogo={true}
      showBack={true}
      type="Image"
      showTopAppBar={{
        showSearch: true,
        title: 'Jal-Jungle-Jameen ',
        subtitle: 'In Classrooms ',
        showMenuIcon: true,
        actionButtonLabel: 'Action',
      }}
    >
      <div
        style={{
          padding: 0,
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
        }}
      >
        <iframe
          src={mfe_content}
          style={{
            display: 'block', // Ensures no extra space around the iframe
            margin: 0,
            padding: 0,
            width: '100vw',
            height: '100vh',
            border: 'none',
          }}
          title="Embedded Localhost"
        />
      </div>
    </Layout>
  );
};

export default List;
