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
import ReferenceBooks from '../../assets/images/LetsTalkAboutTreesCover.png';
import Water from '../../assets/images/WatercoverTekdi.png';
import Insta from '../component/Insta';
import Layout from '../component/layout/layout';
import { ImageBanner } from '../component/layout/ImageBanner';
import { useEffect, useState } from 'react';
import { ContentSearch } from '@shared-lib';
import Loader from '../component/layout/LoaderComponent';
import FooterText from '../component/FooterText';
import Banner from '../component/Banner';

const catImages = {
  Water,
  Forest: Forests,
  Land,
  'Climate Change': Climatechangebookcover,
  'Activity Books': ActivityBooks,
  Potpourri: ReferenceBooks,
};

type AnimatedCounterProps = {
  target: number;
  duration?: number;
  restartDelay?: number;
};

const AnimatedCounter = ({
  target = 2000,
  duration = 20000,
  restartDelay = 2000,
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const [key, setKey] = useState(0);

  const restartCounter = () => {
    setKey((prev) => prev + 1);
  };

  const triggerRestart = () => {
    setTimeout(restartCounter, restartDelay);
  };

  useEffect(() => {
    const totalSteps = duration / 10;
    const increment = target / totalSteps;

    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);

        // Wait for restartDelay and restart
        setTimeout(() => {
          setCount(0);
          setKey((prev) => prev + 1);
        }, restartDelay);
      } else {
        setCount(Math.ceil(current));
      }
    }, 10);

    return () => clearInterval(interval);
  }, [key, target, duration, restartDelay]);

  return (
    <Typography fontWeight="400" sx={{ fontSize: { xs: '24px', md: '64px' } }}>
      {count}
    </Typography>
  );
};

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
    <Layout footerComponent={<FooterText page={''} />}>
      {loading ? (
        <Loader />
      ) : (
        <Grid container spacing={4} sx={{ mb: 3 }} justifyContent={'center'}>
          <Banner />
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
                      'A digital hub of Environment Education resources contextual to India.'
                    )}
                  </Typography>
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
                      'Change stems from local action. Hope stems from children’s empowerment to act upon local environmental problems. Our mission is to empower environment educators with both hope and action in times of climate change.'
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
                      'A digital hub of Environment Education resources contextual to India.'
                    )}
                  </Typography>
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
                      'Change stems from local action. Hope stems from children’s empowerment to act upon local environmental problems. Our mission is to empower environment educators with both hope and action in times of climate change.'
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
                  width: '100vw',
                  maxWidth: '100%',
                  height: { xs: '63px', md: '170px' },
                  display: 'flex',
                  justifyContent: { xs: 'space-around', md: 'center' },
                  flexWrap: 'wrap',
                  gap: 8,
                  alignItems: 'center',
                  color: '#2B3133',
                  textAlign: 'center',
                }}
              >
                <Box>
                  <AnimatedCounter target={1000} duration={2000} />
                  <Typography
                    fontWeight="400"
                    sx={{ fontSize: { xs: '10px', md: '24px' } }}
                  >
                    RESOURCES
                  </Typography>
                </Box>
                <Box>
                  <AnimatedCounter target={15} duration={2000} />
                  <Typography
                    fontWeight="400"
                    sx={{ fontSize: { xs: '10px', md: '24px' } }}
                  >
                    CATEGORIES
                  </Typography>
                </Box>
                <Box>
                  <AnimatedCounter target={8} duration={2000} />
                  <Typography
                    fontWeight="400"
                    sx={{ fontSize: { xs: '10px', md: '24px' } }}
                  >
                    LANGUAGES
                  </Typography>
                </Box>
              </Box>
              {/* <Typography
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
              </Typography> */}
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
