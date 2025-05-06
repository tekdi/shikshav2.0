import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { SunbirdPlayer } from '@shared-lib';
import Layout from '../../component/layout/layout';
import { Typography } from '@mui/material';
interface PlayerPageProps {
  id: string; // Define the type for the 'id' prop
}
const PlayerPage: React.FC<PlayerPageProps> = ({ id }) => {
  const router = useRouter();
  const { identifier } = router.query; // Access the identifier from the URL
  if (!identifier) {
    return <div>Loading...</div>;
  }

  return (
    <Layout
      isFooter={false}
      backIconClick={() => router.back()}
      showBack
      _backButton={{ alignItems: 'center' }}
    >
      <SunbirdPlayer identifier={id ? id : (identifier as string)} />
    </Layout>
  );
};

export default PlayerPage;
