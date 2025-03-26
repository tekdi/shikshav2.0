'use client';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import ActivityBooks from '../../assets/images/ActivityBooks.jpeg';
import Climatechangebookcover from '../../assets/images/Climatechangebookcover.png';
import Forests from '../../assets/images/Forests.png';
import instagram_logo from '../../assets/images/instagram_logo.png';
import Land from '../../assets/images/Land.png';
import landingBanner from '../../assets/images/landingBanner.png';

import landingBanner1 from '../../assets/images/banner/Arunachal ke Saaras.jpg';

import landingBanner2 from '../../assets/images/banner/Bavre Beej.jpg';

import landingBanner3 from '../../assets/images/banner/Current Conservation.jpg';

import landingBanner4 from '../../assets/images/banner/I wonder who that is.jpg';

import landingBanner5 from '../../assets/images/banner/Nisargshala.jpg';
import landingBanner6 from '../../assets/images/banner/The Spring of Life (2).jpg';
import landingBanner7 from '../../assets/images/banner/Travelling Seeds.jpg';
import landingBanner8 from '../../assets/images/banner/Whoop, goes the pufferfish.jpg';

import ReferenceBooks from '../../assets/images/LetsTalkAboutTreesCover.png';
import Water from '../../assets/images/WatercoverTekdi.png';
import Insta from '../component/Insta';
import Layout from '../component/layout/layout';
import Carousel from 'react-material-ui-carousel';
import { ImageBanner } from '../component/layout/ImageBanner';
import { useEffect, useState } from 'react';
import { ContentSearch } from '@shared-lib';
import Loader from '../component/layout/LoaderComponent';

const catImages = {
  Water,
  Forest: Forests,
  Land,
  'Climate Change': Climatechangebookcover,
  'Activity Books': ActivityBooks,
  Potpourri: ReferenceBooks,
};
const landingImages = [
  {
    image: landingBanner1?.src,
    id: 1,
  },
  {
    image: landingBanner2?.src,
    id: 2,
  },
  {
    image: landingBanner3?.src,
    id: 3,
  },
  {
    image: landingBanner4?.src,
    id: 4,
  },
  {
    image: landingBanner5?.src,
    id: 5,
  },
  {
    image: landingBanner6?.src,
    id: 6,
  },
  {
    image: landingBanner7?.src,
    id: 7,
  },
  {
    image: landingBanner8?.src,
    id: 8,
  },
];
const LandingPage = () => {
  // const { t } = useTranslation();
  const t = (data: string) => data;
  const [categories, setCategories] = useState<Array<any>>([]);
  const [languageCount, setLanguageCount] = useState(0);
  const [readerCount, setReaderCount] = useState(0);
  const [bookCount, setBookCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const customOrder = [
    'Water',
    'Forest',
    'Land',
    'Climate Change',
    'Activity Books',
    'Potpourri',
  ];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  useEffect(() => {
    const init = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
        const frameworkData = await fetch(url).then((res) => res.json());
        const frameworks = frameworkData?.result?.framework?.categories;
        const fdata =
          frameworks.find((item: any) => item.code === 'topic')?.terms || [];

        const data = await ContentSearch({
          channel: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
        });
        const content = data?.result?.content || [];

        const uniqueLanguages = [
          ...new Set(content.flatMap((item) => item?.language || [])),
        ];
        setBookCount(content?.length);
        setLanguageCount(uniqueLanguages?.length);
        const uniqueReaders = [
          ...new Set(
            content
              .map((item) => item?.reader)
              .filter((reader) => reader !== null)
          ),
        ];
        setReaderCount(uniqueReaders?.length);
        setCategories(fdata || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Stop loading when data is fetched
      }
    };

    init();
  }, []);

  return (
    <Layout
      footerComponent={
        <Grid sx={{ px: 4, py: 1, backgroundColor: 'secondary.main' }}>
          <Typography align="center" gutterBottom sx={{ fontSize: '10px' }}>
            {t(
              'Curated by ATREE: For, Of, and By Environment Educators of India'
            )}
          </Typography>
        </Grid>
      }
    >
      {loading ? (
        <Loader />
      ) : (
        <Grid container spacing={4} sx={{ mb: 3 }} justifyContent={'center'}>
          <Grid width="100%">
            <Carousel
              navButtonsAlwaysVisible
              indicators={false}
              animation="slide"
              autoPlay={true}
              interval={2000}
              swipe={true}
              duration={500}
              stopAutoPlayOnHover={false}
              cycleNavigation={true}
              sx={{
                width: '100%',
                minHeight: { md: '500px' }, // Full height for web
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {landingImages.map((image, index) => (
                <Box
                  key={image.id}
                  sx={{
                    width: '100%',
                    height: { xs: '181px', md: '500px' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ImageBanner
                    key={image.id}
                    name={
                      'A digital hub of Environment Education resources contextual to India'
                    }
                    image={image.image}
                    _image={{ height: { xs: 'auto', md: '500px' } }}
                    _textPosition={{
                      bottom: '0%',
                    }}
                  />
                </Box>
              ))}
            </Carousel>
          </Grid>
          <Grid
            sx={{ px: 4, textAlign: 'center' }}
            container
            spacing={1}
            justifyContent={'center'}
          >
            <Grid
              size={{ xs: 12, sm: 10, md: 12, lg: 12 }}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              {isMobile ? (
                <Box>
                  <Typography
                    variant="body1"
                    align="center"
                    gutterBottom
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '14px', md: '24px' },
                      lineHeight: { xs: '24px', md: '44px' },
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
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '14px', md: '24px' },
                      lineHeight: { xs: '24px', md: '44px' },
                      textAlign: 'center',
                      color: '#000000',
                    }}
                  >
                    {t(
                      'Our mission is to empower environment educators with both hope and action in times of climate change.'
                    )}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography
                    variant="body1"
                    align="center"
                    gutterBottom
                    sx={{
                      fontWeight: 400,
                      fontSize: { xs: '14px', md: '24px' },
                      lineHeight: { xs: '24px', md: '44px' },
                      pl: '55px',
                      pr: '55px',
                      textAlign: 'center',
                      color: '#000000',
                    }}
                  >
                    {t(
                      'Change stems from local action. Hope stems from children’s empowerment to act upon local environmental problems.'
                    )}
                    {t(
                      'Our mission is to empower environment educators with both hope and action in times of climate change.'
                    )}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid
              size={{ xs: 12, sm: 12, md: 12, lg: 12 }}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent={'space-evenly'}
            >
              <Box
                sx={{
                  backgroundColor: '#FCD905',

                  // borderRadius: '8px',
                  width: '100vw',
                  maxWidth: '100%',
                  height: { xs: '63px', md: '178px' },
                  display: 'flex',
                  justifyContent: { xs: 'space-around', md: 'center' },
                  flexWrap: 'wrap',
                  gap: 8,
                  alignItems: 'center',
                  color: '#2B3133',
                  textAlign: 'center',
                }}
              >
                {[
                  { label: 'RESOURCES', value: bookCount },
                  { label: 'CATEGORIES', value: '15' },
                  { label: 'LANGUAGES', value: languageCount },
                  // { label: 'Reader', value: readerCount },
                ].map((item, index) => (
                  <Box key={index}>
                    <Typography
                      fontWeight="400"
                      sx={{ fontSize: { xs: '24px', md: '64px' } }}
                    >
                      {item.value}
                    </Typography>
                    <Typography
                      fontWeight="400"
                      sx={{ fontSize: { xs: '10px', md: '24px' } }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Typography
                variant="body1"
                align="center"
                gutterBottom
                sx={{
                  fontWeight: 400,
                  fontSize: { xs: '14px', md: '24px' },
                  textAlign: 'center',
                  padding: '20px',
                }}
              >
                {t('Choose what best fits your interests and needs')}
              </Typography>
            </Grid>
          </Grid>
          <Grid sx={{ px: 1 }}>
            <Grid container spacing={1}>
              {categories
                ?.filter((category) => category.name !== 'General') // Remove "General"
                ?.sort((a, b) => {
                  const indexA = customOrder.indexOf(a.name);
                  const indexB = customOrder.indexOf(b.name);

                  // If a category is not found in customOrder, push it to the end
                  return (
                    (indexA === -1 ? customOrder.length : indexA) -
                    (indexB === -1 ? customOrder.length : indexB)
                  );
                })
                ?.map((category, index) => (
                  <Grid key={index} size={{ xs: 6, sm: 6, md: 4, lg: 4 }}>
                    <ImageBanner
                      key={index}
                      name={category?.name}
                      _showAvatar={true}
                      _text={{ textAline: 'center' }}
                      _image={{ height: { xs: '200px', md: '300px' } }}
                      image={
                        (
                          catImages?.[
                            category?.name as keyof typeof catImages
                          ] || landingBanner
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
      )}
    </Layout>
  );
};

export default LandingPage;
