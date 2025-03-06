'use client';
import { Typography } from '@mui/material';
// import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import ActivityBooks from '../../assets/images/ActivityBooks.png';
import Climatechangebookcover from '../../assets/images/Climatechangebookcover.png';
import Forests from '../../assets/images/Forests.png';
import instagram_logo from '../../assets/images/instagram_logo.png';
import Land from '../../assets/images/Land.png';
import landingBanner from '../../assets/images/landingBanner.png';
import ReferenceBooks from '../../assets/images/LetsTalkAboutTreesCover.png';
import Water from '../../assets/images/WatercoverTekdi.png';
import Insta from '../component/Insta';
import Layout from '../component/layout/layout';

import { useRouter } from 'next/router';
import { ImageBanner } from '../component/layout/ImageBanner';

const catImages = {
  Water,
  Forest: Forests,
  Land,
  'Climate Change': Climatechangebookcover,
  'Activity Books': ActivityBooks,
  'Reference Books': ReferenceBooks,
};

const LandingPage = () => {
  // const { t } = useTranslation();
  const t = (data: string) => data;
  const router = useRouter();
  const handleItemClick = (to: string) => {
    router.push(to);
  };
  return (
    <Layout
      onItemClick={handleItemClick}
      footerComponent={
        <Grid sx={{ px: 4, py: 2, backgroundColor: 'secondary.main' }}>
          <Typography variant="body1" align="center" gutterBottom>
            {t(
              'Curated by ATREE: For, Of, and By Environment Educators of India'
            )}
          </Typography>
        </Grid>
      }
    >
      <Grid container spacing={4} sx={{ mb: 3 }} justifyContent={'center'}>
        <Grid width={'100%'}>
          <ImageBanner
            name={
              'A digital hub of Environment Education resources contextual to India'
            }
            image={landingBanner?.src}
            // _image={{ height: '181px' }}
          />
        </Grid>
        <Grid
          sx={{ px: 4, textAlign: 'center' }}
          container
          spacing={2}
          justifyContent={'center'}
        >
          <Grid
            size={{ xs: 12, sm: 10, md: 12, lg: 12 }}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography
              variant="body1"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '24px',
                textAlign: 'center',
                color: '#000000',
              }}
            >
              {t(
                'Change stems from local action. Hope stems from children’s empowerment to act upon local environmental problems.'
              )}
            </Typography>
            <Typography
              variant="body1"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '24px',
                textAlign: 'center',
                color: '#000000',
              }}
            >
              {t(
                'Our mission is to empower environment educators with both hope and action in times of climate change.'
              )}
            </Typography>
          </Grid>
        </Grid>
        <Grid sx={{ px: 2 }} container spacing={1}>
          <Grid
            size={{ xs: 12, sm: 10, md: 12, lg: 12 }}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 500,
                fontSize: '24px',
                textAlign: 'center',
              }}
            >
              1000 BOOKS IN 15 CATEGORIES
            </Typography>
            <Typography
              variant="body1"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 400,
                fontSize: '14px',
                textAlign: 'center',
              }}
            >
              {t('Choose what best fits your interests and needs')}
            </Typography>
          </Grid>
        </Grid>
        <Grid sx={{ px: 1 }}>
          <Grid container spacing={1}>
            {[
              'Water',
              'Forest',
              'Land',
              'Climate Change',
              'Activity Books',
              'Reference Books',
            ].map((category, index) => (
              <Grid key={index} size={{ xs: 6, sm: 6, md: 4, lg: 4 }}>
                <ImageBanner
                  key={index}
                  name={category}
                  _showAvatar={true}
                  _text={{ textAline: 'center' }}
                  image={
                    (
                      catImages?.[category as keyof typeof catImages] ||
                      landingBanner
                    )?.src
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid
          sx={{
            px: 4,
            textAlign: 'center',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '24px',
              textAlign: 'center',
            }}
          >
            {t('Follow Us On')}
          </Typography>
          <Image src={instagram_logo} alt="instagram_logo" />
          <Insta />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default LandingPage;
