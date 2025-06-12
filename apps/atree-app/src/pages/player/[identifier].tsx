import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { SunbirdPlayer } from '@shared-lib';
import Layout from '../../component/layout/layout';
import { Box, Typography } from '@mui/material';

const PlayerPage: React.FC = () => {
  const router = useRouter();
  const { identifier } = router.query;

  const [contentTitle, setContentTitle] = useState<string | null>(null);

  useEffect(() => {
    console.log('All localStorage:', localStorage);
    const title = localStorage.getItem('contentData');
    console.log('Retrieved title:', title);
    setContentTitle(title);
  }, []);

  if (!identifier) {
    return <div>Loading...</div>;
  }

  return (
    <Layout
      isFooter={false}
      backIconClick={() => router.back()}
      showBack={true}
      backTitle={
        <Typography
          style={{
            fontWeight: 900,
            fontSize: '22px',
            lineHeight: '28px',
            letterSpacing: 0,
          }}
        >
          {contentTitle || 'Content Player'} {/* Fallback title */}
        </Typography>
      }
      _backButton={{ alignItems: 'center' }}
    >
      {/* <h2>{Contenttitle}</h2> */}
      <Box sx={{ marginTop: '5%' }}>
        <SunbirdPlayer
          identifier={identifier as string}
          // contentData={Contenttitle}
        />
      </Box>
    </Layout>
  );
};

export default PlayerPage;
