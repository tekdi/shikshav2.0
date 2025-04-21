import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { getUserCertificates, showCertificate } from '../services/Certificate';
import { CommonCard, ContentItem, Layout } from '@shared-lib';
import AppConst from '../utils/AppConst/AppConst';
import { ProfileMenu } from '../utils/menus';

interface Certificate extends ContentItem {
  courseId: string;
  completedOn: string;
  duration: string;
}
const CertificatesPage = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);

  useEffect(() => {
    console.log('certificate');
    const fetchCertificates = async () => {
      try {
        const response = await getUserCertificates({
          userId: localStorage.getItem('userId') ?? '',
          limit: 3,
          offset,
        });
        const { result } = response;
        if (result) {
          setCertificates((prev) => [...prev, ...result.data]);
        }
        console.log('response', result.data);
        setHasMoreData(response.result?.data.length > 0);
        setIsPageLoading(false);
      } catch (error) {
        console.error('Failed to fetch certificates:', error);
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchCertificates();
  }, [offset]);

  const handleLoadMore = () => {
    setOffset((prev) => prev + 3);
  };
  const handleShowCertificateClick = async (item: any) => {
    const showCertificateData = await showCertificate({
      credentialId: item?.certificateId,
      templateId: item?.usercertificateId,
    });
    console.log('showCertificateData', showCertificateData);
  };
  return (
    <Layout
      isLoadingChildren={isPageLoading}
      showTopAppBar={{
        title: 'Shiksha: My Certificates',
        showMenuIcon: true,
        actionButtonLabel: 'Action',
        ...ProfileMenu(),
      }}
      showFilter={true}
      isFooter={false}
      showLogo={true}
      showBack={true}
    >
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {certificates?.map((item: any) => (
            <Grid key={item?.identifier} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <CommonCard
                minheight="100%"
                title={(item?.name ?? '').trim()}
                image={
                  item?.posterImage && item?.posterImage !== 'undefined'
                    ? item?.posterImage
                    : `${AppConst.BASEPATH}/assets/images/image_ver.png`
                }
                content={item?.description ?? '-'}
                actions={item?.contentType}
                // subheader={item?.contentType}
                orientation="horizontal"
                item={item}
                TrackData={[]}
                type={'Course'}
                onClick={() => handleShowCertificateClick(item)}
              />
            </Grid>
          ))}
        </Grid>
        {hasMoreData && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 2,
            }}
          >
            <Button onClick={handleLoadMore}>Load More</Button>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default CertificatesPage;
