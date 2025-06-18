'use client';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import ActivityBooks from '../../assets/images/Activity-Book.jpg';
import Climatechangebookcover from '../../assets/images/Climatechangebookcover.jpg';
import Forests from '../../assets/images/Forests.jpg';
import instagram_logo from '../../assets/images/instagram_logo.png';
import Land from '../../assets/images/Land.jpg';
import landingBanner from '../../assets/images/landingBanner.png';
import ReferenceBooks from '../../assets/images/Potpourri.jpg';
import Water from '../../assets/images/Water.jpg';
import Insta from '../component/Insta';
import Layout from '../component/layout/layout';
import { ImageBanner } from '../component/layout/ImageBanner';
import { useEffect, useState } from 'react';
import { ContentSearch, trackEvent } from '@shared-lib';
import Loader from '../component/layout/LoaderComponent';
import FooterText from '../component/FooterText';
import Banner from '../component/Banner';
import DigitalHubBanner from '../component/DigitalHubBanner';
import atreeLogo from '../../public/images/atreeLogo.svg';

interface LandingPageProps {
  frameworkData: any;
  frameworkFilter: any[];
  framework: string;
  setFramework: (framework: string) => void;
}
const catImages = {
  Water,
  Forest: Forests,
  Land,
  'Climate Change': Climatechangebookcover,
  'Activity Books': ActivityBooks,
  Potpourri: ReferenceBooks,
};
const bannerData = [
  {
    image: Water,
    name: 'Banner 1',
    verticalText: 'Adira Andlay/Current Conservation',
  },
  {
    image: Forests,
    name: 'Banner 2',
    verticalText: 'Sriya Singh/Current Conservation',
  },
  {
    image: Land,
    name: 'Banner 3',
    verticalText: 'Aditi Rajan/Current Conservation',
  },
  {
    image: Climatechangebookcover,
    name: 'Banner 4',
    verticalText: 'Prabha Mallya/Current Conservation',
  },
  {
    image: ActivityBooks,
    name: 'Banner 5',
    verticalText: 'Ekisha Poddar/Current Conservation',
  },
  {
    image: ReferenceBooks,
    name: 'Banner 6',
    verticalText: 'Norzin Norbhu/Current Conservation',
  },
];
type AnimatedCounterProps = {
  target: number;
  duration?: number;
  restartDelay?: number;
  fontSize?: string | { xs?: string; sm?: string; md?: string; lg?: string };
  fontWeight?: string | { xs?: string; sm?: string; md?: string; lg?: string };
};

const AnimatedCounter = ({
  target = 2000,
  duration = 20000,
  restartDelay = 2000,
  fontSize = { xs: '24px', md: '64px' },
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    trackEvent({
      action: 'view_landing_page',
      category: 'Landing Page',
    });
  }, []);

  useEffect(() => {
    const totalSteps = duration / 10;
    const increment = target / totalSteps;

    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.ceil(current));
      }
    }, 10);

    return () => clearInterval(interval);
  }, [target, duration]);
  return (
    <Typography
      sx={{
        fontFamily: 'Poppins',
        fontSize: fontSize,
        fontWeight: 700,
        lineHeight: '0.9',
      }}
    >
      {count}
    </Typography>
  );
};

const LandingPage = ({ frameworkData }: LandingPageProps) => {
  const t = (data: string) => data;
  const [categories, setCategories] = useState<Array<any>>([]);

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
        if (!frameworkData) {
          setLoading(true);
          return;
        }
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

        setCategories(fdata || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Stop loading when data is fetched
      }
    };

    init();
  }, [frameworkData]);

  return (
    <Layout
      showTopAppBar={true}
      // footerComponent={<FooterText page={''} />}
      sx={{ padding: 0, margin: 0 }}
    >
      <Grid container justifyContent={'center'} sx={{ padding: 0, margin: 0 }}>
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 8, md: 16 },
            left: { xs: 8, md: 24 },
            zIndex: 10,
          }}
        >
          {/* <Image src={atreeLogo} alt="Logo" width={isMobile ? 50 : 100} /> */}
        </Box>

        <Banner />
        <DigitalHubBanner />
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
              <Box sx={{ px: 1, py: 1 }}>
                <Typography
                  variant="body1"
                  // align="center"
                  sx={{
                    fontWeight: 400,
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: '#000000',
                    mb: 1,
                  }}
                >
                  {t(
                    'Change stems from local action. Hope stems from childrens empowerment to act upon local environmental problems.'
                  )}
                </Typography>

                <Typography
                  variant="body1"
                  // align="center"
                  sx={{
                    fontWeight: 500,
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: '#000000',
                  }}
                >
                  {t(
                    'Our mission is to empower environment educators with both hope and action in times of climate change.'
                  )}
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  marginTop: '50px',
                  marginBottom: '50px',
                  height: { xs: '72px', md: '132px' },
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  align="center"
                  gutterBottom
                  sx={{
                    fontWeight: 500,
                    fontFamily: 'Poppins',
                    fontSize: { xs: '14px', md: '24px' },
                    lineHeight: { xs: '24px', md: '44px' },
                    textAlign: 'center',
                    color: '#000000',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {t(
                    `Change stems from local action. Hope stems from children's empowerment to act upon local environmental problems. Our mission is to empower environment educators with both hope and action in times of climate change.`
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
            sx={{ paddingBottom: '10px' }}
          >
            <Box
              sx={{
                backgroundColor: '#fcd804',
                width: '100vw',
                maxWidth: '100%',
                height: { xs: '63px', md: '170px' },
                display: 'flex',
                justifyContent: { xs: 'space-around', md: 'center' },
                flexWrap: 'wrap',
                gap: isMobile ? 0 : 8,
                alignItems: 'center',
                color: '#2B3133',
                textAlign: 'center',
                marginBottom: '25px',
                padding: '10px',
              }}
            >
              <Box>
                <AnimatedCounter
                  target={1000}
                  duration={2000}
                  fontSize={{ xs: '24px', md: '64px' }}
                />
                <Typography
                  sx={{
                    fontSize: {
                      xs: '10px',
                      md: '24px',
                      fontFamily: 'Poppins',
                      fontWeight: 400,
                    },
                  }}
                >
                  RESOURCES
                </Typography>
              </Box>
              <Box>
                <AnimatedCounter
                  target={15}
                  duration={2000}
                  fontSize={{ xs: '24px', md: '64px' }}
                />
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontSize: { xs: '10px', md: '24px' },
                    fontWeight: 400,
                  }}
                >
                  CATEGORIES
                </Typography>
              </Box>
              <Box>
                <AnimatedCounter
                  target={8}
                  duration={2000}
                  fontSize={{ xs: '24px', md: '64px' }}
                />
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontSize: { xs: '10px', md: '24px', fontWeight: 400 },
                  }}
                >
                  LANGUAGES
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Grid sx={{ px: 1 }}>
          <Grid container spacing={1}>
            {categories
              ?.filter((category) => category.name !== 'General')
              ?.sort((a, b) => {
                const indexA = customOrder.indexOf(a.name);
                const indexB = customOrder.indexOf(b.name);

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
                    _showAvatar={false}
                    _text={{ textAlign: 'center' }}
                    verticalText={
                      bannerData?.map((item) => {
                        return item.verticalText;
                      })[index] || ''
                    }
                    _verticalTextPosition="left"
                    _image={{ height: { xs: 'auto', md: '300px' } }}
                    image={
                      (
                        catImages?.[category?.name as keyof typeof catImages] ||
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
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            px: 4, // Keep consistent horizontal padding
            py: { xs: 4, sm: '72px' }, // Responsive vertical padding
            pt: { xs: '32px', sm: '72px' },
            pb: { xs: '16px', sm: '20px' },
          }}
        >
          <Typography
            align="center"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '18px', sm: '24px' },
              lineHeight: { xs: '22px', sm: '24px' },
              fontFamily: 'Poppins',
              mb: { xs: '32px', sm: '72px' },
            }}
          >
            Follow us on Instagram
          </Typography>
          <Insta />
        </Grid>
      </Grid>

      <FooterText page={''} />
    </Layout>
  );
};

export default LandingPage;
