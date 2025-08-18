import * as React from 'react';
import { Box, Typography, useMediaQuery, useTheme, Grid } from '@mui/material';
import Layout from '../component/layout/layout';
import Banner from '../component/Banner';
import FooterText from '../component/FooterText';
import Image from 'next/image';
import landingBanner2 from '../../assets/images/png/2.png';
import atreelogo from '../../assets/images/ATREE.png';
import { commonStyles } from '../utils/commonStyle';
import { useAppTranslation } from '../utils/i18n.helper';
import { LANGUAGE_KEYS } from '../utils/language.constants';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Loader from '../component/layout/LoaderComponent';
import Link from 'next/link';
import { LANGUAGES } from '../utils/language.constants';

export default function Aboutus() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t, ready, i18n, changeLanguage } = useAppTranslation();
  const [mounted, setMounted] = React.useState(false);
  const [forceUpdate, setForceUpdate] = React.useState(0);
  const [currentBundle, setCurrentBundle] = React.useState<Record<
    string,
    string
  > | null>(null);

  // Force reload translations when language changes
  React.useEffect(() => {
    const reloadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${i18n.language}/common.json`);
        if (!response.ok) {
          throw new Error(`Failed to load ${i18n.language} translations`);
        }
        const resources = await response.json();
        i18n.removeResourceBundle(i18n.language, 'common');
        i18n.addResourceBundle(i18n.language, 'common', resources, true, true);
        setCurrentBundle(resources);
        setForceUpdate((prev) => prev + 1);

        // Debug log
        console.log('Translations reloaded:', {
          language: i18n.language,
          resources,
          hasBundle: i18n.hasResourceBundle(i18n.language, 'common'),
          bundle: i18n.getResourceBundle(i18n.language, 'common'),
        });
      } catch (error) {
        console.error('Error reloading translations:', error);
      }
    };

    if (mounted && ready) {
      reloadTranslations();
    }
  }, [i18n.language, mounted, ready, i18n]);

  React.useEffect(() => {
    setMounted(true);

    // Check if we need to sync language
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && savedLanguage !== i18n.language) {
      changeLanguage(savedLanguage).catch(console.error);
    }
  }, [i18n.language, changeLanguage]);

  // Debug effect to track language changes
  React.useEffect(() => {
    console.log('About Us Language state:', {
      currentLanguage: i18n.language,
      ready,
      mounted,
      hasBundle: i18n.hasResourceBundle(i18n.language, 'common'),
      bundle: i18n.getResourceBundle(i18n.language, 'common'),
      savedLanguage: localStorage.getItem('selectedLanguage'),
      htmlLang: document.documentElement.lang,
      forceUpdate,
      currentBundle,
    });

    // Handle language changes
    const handleLanguageChange = (event: CustomEvent) => {
      const newLanguage = event.detail;
      if (newLanguage !== i18n.language) {
        changeLanguage(newLanguage).catch(console.error);
      }
    };

    // Handle translation reloads
    const handleTranslationsReloaded = (event: CustomEvent) => {
      const language = event.detail;
      console.log('Translations reloaded:', {
        language,
        currentLanguage: i18n.language,
        hasBundle: i18n.hasResourceBundle(language, 'common'),
        bundle: i18n.getResourceBundle(language, 'common'),
      });
      setForceUpdate((prev) => prev + 1);
    };

    window.addEventListener(
      'languageChanged' as any,
      handleLanguageChange as any
    );
    window.addEventListener(
      'translationsReloaded' as any,
      handleTranslationsReloaded as any
    );
    return () => {
      window.removeEventListener(
        'languageChanged' as any,
        handleLanguageChange as any
      );
      window.removeEventListener(
        'translationsReloaded' as any,
        handleTranslationsReloaded as any
      );
    };
  }, [
    i18n.language,
    ready,
    mounted,
    changeLanguage,
    forceUpdate,
    currentBundle,
  ]);

  // Function to get translated text
  const getTranslatedText = React.useCallback(
    (key: keyof typeof LANGUAGE_KEYS) => {
      if (!mounted || !ready) {
        return key;
      }

      try {
        // Try current bundle first
        if (currentBundle?.[key]) {
          return currentBundle[key];
        }

        // Try translation function
        const translation = t(key);
        if (translation && translation !== key) {
          return translation;
        }

        // Try direct bundle access
        const bundle = i18n.getResourceBundle(i18n.language, 'common');
        if (bundle?.[key]) {
          return bundle[key];
        }

        // Try English fallback
        if (i18n.language !== LANGUAGES.ENGLISH) {
          const englishBundle = i18n.getResourceBundle(
            LANGUAGES.ENGLISH,
            'common'
          );
          if (englishBundle?.[key]) {
            return englishBundle[key];
          }
        }

        // Log warning if no translation found
        console.warn(
          `No translation found for key: ${key} in language: ${i18n.language}`,
          {
            currentBundle,
            bundle,
            englishBundle: i18n.getResourceBundle(LANGUAGES.ENGLISH, 'common'),
          }
        );

        return key;
      } catch (error) {
        console.error('Translation error:', error);
        return key;
      }
    },
    [mounted, ready, t, i18n, currentBundle, forceUpdate]
  );

  if (!ready || !mounted) {
    return <Loader />;
  }

  return (
    <Layout isFooter={isMobile}>
      <Banner singleImage={landingBanner2.src} />
      <Grid
        container
        spacing={2}
        direction="column"
        justifyContent="center"
        marginBottom={'25px'}
        sx={commonStyles.responsivePadding}
      >
        <Grid item>
          <Typography
            sx={{
              textAlign: 'left',
              fontWeight: 900,
              fontSize: { xs: '18px', md: '18px' },
              pl: { xs: 3, md: 10 },
              pr: { xs: 3, md: 10 },
              fontFamily: 'Poppins',
            }}
          >
            {getTranslatedText(LANGUAGE_KEYS.SNAIL_TITLE)}
          </Typography>
        </Grid>

        <Grid item>
          <Typography
            sx={{
              textAlign: { xs: 'left', md: 'left' },
              pl: { xs: 3, md: 10 },
              pr: { xs: 3, md: 10 },
              fontSize: { xs: '14px', md: '16px' },
              fontFamily: 'Poppins',
              color: '#000000',
              fontWeight: 400,
              marginBottom: '20px',
            }}
          >
            {getTranslatedText(LANGUAGE_KEYS.SNAIL_SUBTITLE)}
          </Typography>
        </Grid>

        <Grid item>
          <Typography
            sx={{
              textAlign: { xs: 'left', md: 'left' },
              pl: { xs: 3, md: 10 },
              pr: { xs: 3, md: 10 },
              fontFamily: 'Poppins',
              color: '#000000',
              fontSize: { xs: '14px', md: '16px' },
              fontWeight: 400,
              marginBottom: '20px',
            }}
          >
            {getTranslatedText(LANGUAGE_KEYS.SNAIL_VISION)}
          </Typography>
        </Grid>

        <Grid item>
          <Typography
            sx={{
              textAlign: { xs: 'left', md: 'left' },
              pl: { xs: 3, md: 10 },
              pr: { xs: 3, md: 10 },
              fontFamily: 'Poppins',
              color: '#000000',
              fontSize: { xs: '14px', md: '16px' },
              fontWeight: 400,
              marginBottom: '20px',
            }}
          >
            {getTranslatedText(LANGUAGE_KEYS.SNAIL_REPOSITORY)}
          </Typography>
        </Grid>

        <Grid item>
          <Typography
            sx={{
              textAlign: { xs: 'left', md: 'left' },
              pl: { xs: 3, md: 10 },
              pr: { xs: 3, md: 10 },
              fontFamily: 'Poppins',
              color: '#000000',
              fontSize: { xs: '14px', md: '16px' },
              fontWeight: 400,
              marginBottom: '20px',
            }}
          >
            {getTranslatedText(LANGUAGE_KEYS.SNAIL_EXPLORE)}
          </Typography>
        </Grid>

        <Grid item>
          <Typography
            sx={{
              textAlign: { xs: 'left', md: 'left' },
              pl: { xs: 3, md: 10 },
              pr: { xs: 3, md: 10 },
              fontFamily: 'Poppins',
              color: '#000000',
              fontSize: { xs: '14px', md: '16px' },
              fontWeight: 400,
              marginBottom: '20px',
            }}
          >
            {getTranslatedText(LANGUAGE_KEYS.SNAIL_CONTRIBUTE)}
          </Typography>
        </Grid>

        <Grid item>
          <Typography
            sx={{
              textAlign: 'left',
              fontWeight: { xs: 400, md: 400 },
              fontSize: { xs: '18px', md: '18px' },
              pl: { xs: 3, md: 10 },
              pr: { xs: 3, md: 10 },
              fontFamily: 'Poppins',
              color: '#000000',
            }}
          >
            <b>{getTranslatedText(LANGUAGE_KEYS.LEADERSHIP_SUPPORT)}</b>
          </Typography>
        </Grid>

        <Grid item>
          <Typography
            sx={{
              textAlign: { xs: 'left', md: 'left' },
              pl: { xs: 3, md: 10 },
              pr: { xs: 3, md: 10 },
              fontFamily: 'Poppins',
              color: '#000000',
              fontSize: { xs: '14px', md: '16px' },
              fontWeight: 400,
              marginBottom: '20px',
            }}
          >
            {getTranslatedText(LANGUAGE_KEYS.LEADERSHIP_SUPPORT_CONTENT)}
          </Typography>
        </Grid>

        <Grid item>
          <Typography
            sx={{
              textAlign: 'left',
              fontWeight: { xs: 400, md: 400 },
              fontSize: { xs: '18px', md: '18px' },
              pl: { xs: 3, md: 10 },
              pr: { xs: 3, md: 10 },
              fontFamily: 'Poppins',
              color: '#000000',
            }}
          >
            <b>{getTranslatedText(LANGUAGE_KEYS.TEAM)}</b>
          </Typography>
        </Grid>

        <Grid item>
          <Typography
            sx={{
              textAlign: { xs: 'left', md: 'left' },
              pl: { xs: 3, md: 10 },
              pr: { xs: 3, md: 10 },
              fontFamily: 'Poppins',
              color: '#000000',
              fontSize: { xs: '14px', md: '16px' },
              fontWeight: 400,
              marginBottom: '20px',
            }}
          >
            {getTranslatedText(LANGUAGE_KEYS.TEAM_CONTENT)}
          </Typography>
        </Grid>

        <Grid item>
          <Typography
            sx={{
              textAlign: 'left',
              fontWeight: { xs: 400, md: 400 },
              fontSize: { xs: '18px', md: '18px' },
              pl: { xs: 3, md: 10 },
              pr: { xs: 3, md: 10 },
              fontFamily: 'Poppins',
              color: '#000000',
            }}
          >
            <b>{getTranslatedText(LANGUAGE_KEYS.ACKNOWLEDGMENTS)}</b>
          </Typography>
        </Grid>

        <Grid item>
          <Typography
            sx={{
              textAlign: { xs: 'left', md: 'left' },
              pl: { xs: 3, md: 10 },
              pr: { xs: 3, md: 10 },
              fontFamily: 'Poppins',
              color: '#000000',
              fontSize: { xs: '14px', md: '16px' },
              fontWeight: 400,
              marginBottom: '20px',
            }}
          >
            {getTranslatedText(LANGUAGE_KEYS.ACKNOWLEDGMENTS_INTRO)}
          </Typography>
        </Grid>

        <Grid item>
          <Box sx={{ pl: { xs: 3, md: 10 }, pr: { xs: 3, md: 10 } }}>
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '18px', md: '18px' },
                marginBottom: '8px',
              }}
            >
              {getTranslatedText(LANGUAGE_KEYS.FUNDING_SUPPORT)}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '14px', md: '16px' },
                marginBottom: '20px',
              }}
            >
              {getTranslatedText(LANGUAGE_KEYS.FUNDING_SUPPORT_CONTENT)}
            </Typography>

            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '18px', md: '18px' },
                marginBottom: '8px',
                marginTop: '20px',
              }}
            >
              {getTranslatedText(LANGUAGE_KEYS.TECHNICAL_SUPPORT)}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '14px', md: '16px' },
                marginBottom: '20px',
              }}
            >
              {getTranslatedText(LANGUAGE_KEYS.TECHNICAL_SUPPORT_CONTENT)}
            </Typography>

            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '18px', md: '18px' },
                marginBottom: '8px',
                marginTop: '20px',
              }}
            >
              {getTranslatedText(LANGUAGE_KEYS.CONTENT_SUPPORT)}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '14px', md: '16px' },
                marginBottom: '20px',
              }}
            >
              {getTranslatedText(LANGUAGE_KEYS.CONTENT_SUPPORT_CONTENT)}
            </Typography>
          </Box>
        </Grid>

        <Grid item>
          <Box
            sx={{
              width: '100%',
              boxSizing: 'border-box',
              px: { xs: 2, md: 10 },
              mt: 4,
            }}
          >
            <Box
              sx={{
                width: '100%',
                boxSizing: 'border-box',
                border: '1px solid #ccc',
                px: { xs: 2, md: 4 },
                py: { xs: 3, md: 4 },
              }}
            >
              <Grid
                container
                spacing={4}
                direction={isMobile ? 'column' : 'row'}
                alignItems="center"
                justifyContent="center"
              >
                <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: '120px', md: '200px' },
                      height: { xs: '120px', md: '200px' },
                      position: 'relative',
                    }}
                  >
                    <Image
                      src={atreelogo}
                      alt="Organization Logo"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    textAlign: { xs: 'center', md: 'left' },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      px: { xs: 1, md: 2 },
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 900,
                        fontSize: { xs: '14px', md: '16px' },
                        fontFamily: 'Poppins',
                        color: '#000',
                        marginBottom: '8px',
                      }}
                    >
                      <b>{getTranslatedText(LANGUAGE_KEYS.CONTACT_US)}</b>
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: { xs: '14px', md: '16px' },
                        fontFamily: 'Poppins',
                        color: '#000',
                        marginBottom: '8px',
                      }}
                    >
                      {getTranslatedText(LANGUAGE_KEYS.CONTACT_ADDRESS)}
                    </Typography>

                    <Typography
                      sx={{ fontFamily: 'Poppins', marginBottom: '8px' }}
                    >
                      {getTranslatedText(LANGUAGE_KEYS.CONTACT_PHONE)}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontFamily: 'Poppins' }}>
                        {getTranslatedText(LANGUAGE_KEYS.CONTACT_EMAIL)}
                      </Typography>
                      <Typography sx={{ fontFamily: 'Poppins' }}>|</Typography>
                      <Link
                        href="https://www.atree.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'blue',
                          textDecoration: 'underline',
                          fontFamily: 'Poppins',
                        }}
                      >
                        {getTranslatedText(LANGUAGE_KEYS.CONTACT_WEBSITE)}
                      </Link>
                    </Box>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'center', md: 'flex-end' },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: '100%', md: '100%' },
                      height: { xs: '250px', md: '300px' },
                      overflow: 'hidden',
                      px: { xs: 0, md: 2 },
                    }}
                  >
                    <iframe
                      title="Google Map"
                      width="100%"
                      height="100%"
                      style={{ border: 0, borderRadius: '8px' }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src="https://www.google.com/maps?q=Royal+Enclave,+Srirampura,+Jakkur,+Bengaluru,+Karnataka+560064&output=embed"
                    ></iframe>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <FooterText page="" />
    </Layout>
  );
}

export async function getServerSideProps(context: { locale?: string }) {
  const { locale = 'en' } = context;

  try {
    const translations = await serverSideTranslations(
      locale,
      ['common'],
      null,
      ['ABOUT_US']
    );

    if (
      !translations._nextI18Next?.initialI18nStore ||
      !translations._nextI18Next?.initialLocale
    ) {
      throw new Error('Failed to load translations');
    }

    // Debug log the translations
    console.log('About Us Server-side translations loaded:', {
      locale,
      hasTranslations:
        !!translations._nextI18Next?.initialI18nStore[locale]?.common,
      translationKeys: Object.keys(
        translations._nextI18Next?.initialI18nStore[locale]?.common || {}
      ),
      initialLocale: translations._nextI18Next.initialLocale,
    });

    return {
      props: {
        _nextI18Next: {
          initialI18nStore: translations._nextI18Next.initialI18nStore,
          initialLocale: translations._nextI18Next.initialLocale,
        },
      },
    };
  } catch (error) {
    console.error('Error loading translations:', error);
    return { props: { error: 'Failed to load translations' } };
  }
}
