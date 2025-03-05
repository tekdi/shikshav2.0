'use client';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
// import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import ActivityBooks from '../../../assets/images/ActivityBooks.png';
import Climatechangebookcover from '../../../assets/images/Climatechangebookcover.png';
import Forests from '../../../assets/images/Forests.png';
import instagram_logo from '../../../assets/images/instagram_logo.png';
import Land from '../../../assets/images/Land.png';
import landingBanner from '../../../assets/images/landingBanner.png';
import ReferenceBooks from '../../../assets/images/LetsTalkAboutTreesCover.png';
import Water from '../../../assets/images/WatercoverTekdi.png';
import Insta from '../../component/Insta';
import Layout from '../../component/layout/layout';

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

  return (
    <Layout
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
      <Grid container spacing={4} sx={{ mb: 3 }}>
        <Grid width={'100%'}>
          <CardComponent
            name={
              'A digital hub of Environment Education resources contextual to India'
            }
            image={landingBanner?.src}
            _image={{ height: '181px' }}
          />
        </Grid>
        <Grid sx={{ px: 4 }} container spacing={3}>
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
        <Grid sx={{ px: 2 }} container spacing={1}>
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
              <Grid key={index} size={{ xs: 6, sm: 6, md: 3, lg: 3 }}>
                <CardComponent
                  key={index}
                  name={category}
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

export const CardComponent = ({
  image,
  name,
  _image,
  _text,
}: {
  image: string;
  name: string;
  _image?: object;
  _text?: object;
}) => {
  return (
    <Card sx={{ width: '100%' }}>
      <CardActionArea>
        <CardMedia component="img" alt={name} sx={_image} image={image} />
        <CardContent
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100px',
            background:
              'linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5) , rgba(0, 0, 0, 0))',
            zIndex: 1,
            ..._text,
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: 'white',
              zIndex: 2,
              mb: 0,
              fontWeight: 700,
              fontSize: '18px',
              lineHeight: '24px',
            }}
          >
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
