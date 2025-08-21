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

import { LANGUAGE_KEYS } from '../utils/language.constants';
import { useEffect, useState } from 'react';
import { ContentSearch, trackEvent } from '@shared-lib';
import Loader from '../component/layout/LoaderComponent';
import FooterText from '../component/FooterText';
import Banner from '../component/Banner';
import DigitalHubBanner from '../component/DigitalHubBanner';
import atreeLogo from '../../public/images/atreeLogo.svg';
import { telemetryFactory } from '../utils/telemetry'; // adjust path as needed

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useAppTranslation } from '../utils/i18n.helper';

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
  const { t, ready, i18n } = useAppTranslation();
  const [categories, setCategories] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [translationsLoaded, setTranslationsLoaded] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  const customOrder = [
    'Water',
    'Forest',
    'Land',
    'Climate Change',
    'Activity Books',
    'Potpourri',
  ];

  // Function to get translated category name
  const getTranslatedCategoryName = (categoryName: string) => {
    const categoryNameMap: Record<string, string> = {
      Water: t('WATER'),
      Forest: t('FOREST'),
      Land: t('LAND'),
      'Climate Change': t('CLIMATE_CHANGE'),
      'Activity Books': t('ACTIVITY_BOOKS'),
      Potpourri: t('POTPOURRI'),
    };

    return categoryNameMap[categoryName] || categoryName;
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      console.log('Language change detected in home page:', event.detail);
      setForceUpdate((prev) => prev + 1);
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'selectedLanguage' && event.newValue) {
        console.log('Language change detected via storage:', event.newValue);
        setForceUpdate((prev) => prev + 1);
      }
    };

    window.addEventListener(
      'languageChanged' as any,
      handleLanguageChange as any
    );
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(
        'languageChanged' as any,
        handleLanguageChange as any
      );
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Load translations on mount and when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        console.log(
          'Loading translations for home page, forceUpdate:',
          forceUpdate
        );
        // Load resources for both languages
        await Promise.all([
          i18n.loadNamespaces('common'),
          i18n.loadLanguages(['en', 'hi']),
        ]);
        setTranslationsLoaded(true);
      } catch (error) {
        console.error('Error loading translations:', error);
      }
    };
    loadTranslations();
  }, [i18n, forceUpdate]); // Add forceUpdate as dependency

  // Force re-render when language changes
  useEffect(() => {
    console.log('Home page force update triggered:', forceUpdate);
  }, [forceUpdate]);

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
        setLoading(false);
      }
    };

    init();
  }, [frameworkData]);

  useEffect(() => {
    trackEvent({
      action: 'view_landing_page',
      category: 'Landing Page',
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('id');
      const isLoggedIn = !!userId && userId !== 'Anonymous';

      telemetryFactory.impression({
        edata: {
          type: 'view',
          pageid: 'landing-page',
          uri: window.location.pathname,
          subtype: isLoggedIn ? 'login-user' : 'non-login-user',
        },
        context: {
          env: 'landing',
          cdata: [{ id: isLoggedIn ? userId : 'Anonymous', type: 'User' }],
        },
      });
    }
  }, []);

  // Show loading state until both data and translations are ready
  if (loading || !ready || !translationsLoaded) {
    return <Loader />;
  }

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
                  {t(LANGUAGE_KEYS.CHANGE_STEM)}
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
                  {t(LANGUAGE_KEYS.MISSION_STATEMENT)}
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
                  {t(LANGUAGE_KEYS.CHANGE_STEM)}
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
                  key={`resources-${forceUpdate}`}
                  sx={{
                    fontSize: {
                      xs: '10px',
                      md: '24px',
                      fontFamily: 'Poppins',
                      fontWeight: 400,
                    },
                  }}
                >
                  {t(LANGUAGE_KEYS.RESOURCES)}
                </Typography>
              </Box>
              <Box>
                <AnimatedCounter
                  target={15}
                  duration={2000}
                  fontSize={{ xs: '24px', md: '64px' }}
                />
                <Typography
                  key={`categories-${forceUpdate}`}
                  sx={{
                    fontFamily: 'Poppins',
                    fontSize: { xs: '10px', md: '24px' },
                    fontWeight: 400,
                  }}
                >
                  {t(LANGUAGE_KEYS.CATEGORIES)}
                </Typography>
              </Box>
              <Box>
                <AnimatedCounter
                  target={8}
                  duration={2000}
                  fontSize={{ xs: '24px', md: '64px' }}
                />
                <Typography
                  key={`languages-${forceUpdate}`}
                  sx={{
                    fontFamily: 'Poppins',
                    fontSize: { xs: '10px', md: '24px', fontWeight: 400 },
                  }}
                >
                  {t(LANGUAGE_KEYS.LANGUAGES_COUNT)}
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
                    name={getTranslatedCategoryName(category?.name)}
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
            key={`instagram-${forceUpdate}`}
            align="center"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '18px', sm: '24px' },
              lineHeight: { xs: '22px', sm: '24px' },
              fontFamily: 'Poppins',
              mb: { xs: '32px', sm: '72px' },
            }}
          >
            {t(LANGUAGE_KEYS.FOLLOW_INSTAGRAM)}
          </Typography>
          <Insta />
        </Grid>
      </Grid>

      <FooterText page={''} />
    </Layout>
  );
};

export async function getServerSideProps(context: { locale?: string }) {
  const { locale = 'en' } = context;

  const translations = await serverSideTranslations(locale, ['common'], null, [
    'DIGITAL_HUB_BANNER',
  ]);

  // Ensure translations object has the required properties
  if (
    !translations._nextI18Next?.initialI18nStore ||
    !translations._nextI18Next?.initialLocale
  ) {
    throw new Error('Failed to load translations');
  }

  return {
    props: {
      _nextI18Next: {
        initialI18nStore: translations._nextI18Next.initialI18nStore,
        initialLocale: translations._nextI18Next.initialLocale,
      },
    },
  };
}

export default LandingPage;
