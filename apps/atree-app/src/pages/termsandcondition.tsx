import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Layout from '../component/layout/layout';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import Banner from '../component/Banner';
import FooterText from '../component/FooterText';
import { commonStyles } from '../utils/commonStyle';
import landingBanner4 from '../../assets/images/png/4.png';
import { useAppTranslation } from '../utils/i18n.helper';
import { LANGUAGE_KEYS } from '../utils/language.constants';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Loader from '../component/layout/LoaderComponent';

export default function TermsAndConditions() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t, ready, i18n } = useAppTranslation();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Debug effect to track language changes
  React.useEffect(() => {
    console.log('Language state:', {
      currentLanguage: i18n.language,
      ready,
      mounted,
      hasBundle: i18n.hasResourceBundle(i18n.language, 'common'),
      bundle: i18n.getResourceBundle(i18n.language, 'common'),
    });
  }, [i18n.language, ready, mounted]);

  // Function to get translated text
  const getTranslatedText = (key: keyof typeof LANGUAGE_KEYS) => {
    if (!mounted || !ready) {
      return key;
    }

    const translation = t(key);
    if (translation === key) {
      // If translation is missing, try to get it directly from the bundle
      const bundle = i18n.getResourceBundle(i18n.language, 'common');
      return bundle?.[key] || key;
    }
    return translation;
  };

  if (!ready || !mounted) {
    return <Loader />;
  }

  return (
    <Layout isFooter={isMobile}>
      <Banner singleImage={landingBanner4.src} />
      <Grid
        container
        spacing={2}
        direction="column"
        justifyContent="center"
        marginBottom={'25px'}
        sx={commonStyles.responsivePadding}
      >
        <Typography
          sx={{
            textAlign: 'center',
            lineHeight: { xs: '30px', md: '64px' },
            fontWeight: { xs: 800, md: 800 },
            fontSize: { xs: '22px', md: '57px' },
            fontFamily: 'Poppins',
            color: '#000000',
            marginTop: '10px',
            marginBottom: { xs: '10px', md: '47px' },
          }}
        >
          {getTranslatedText(LANGUAGE_KEYS.TERMS_TITLE)}
        </Typography>

        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontSize: { xs: '14px', md: '16px' },
            fontFamily: 'Poppins',
            color: '#000000',
            fontWeight: 400,
          }}
        >
          {getTranslatedText(LANGUAGE_KEYS.TERMS_WELCOME)}
        </Typography>

        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
            fontSize: { xs: '14px', md: '16px' },
            fontWeight: 400,
          }}
        >
          {getTranslatedText(LANGUAGE_KEYS.TERMS_CONTACT)}
        </Typography>

        {/* Login Requirements */}
        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 800, md: 800 },
            fontSize: { xs: '18px', md: '18px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          {getTranslatedText(LANGUAGE_KEYS.TERMS_LOGIN_TITLE)}
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
            fontSize: { xs: '14px', md: '16px' },
            fontWeight: 400,
          }}
        >
          {getTranslatedText(LANGUAGE_KEYS.TERMS_LOGIN_CONTENT)}
        </Typography>

        {/* Continue with other sections similarly */}
        {/* Termination */}
        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 800, md: 800 },
            fontSize: { xs: '18px', md: '18px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          {getTranslatedText(LANGUAGE_KEYS.TERMS_TERMINATION_TITLE)}
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
            fontSize: { xs: '14px', md: '16px' },
            fontWeight: 400,
          }}
        >
          {getTranslatedText(LANGUAGE_KEYS.TERMS_TERMINATION_CONTENT)}
        </Typography>

        {/* Content & IP */}
        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 800, md: 800 },
            fontSize: { xs: '18px', md: '18px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          {getTranslatedText(LANGUAGE_KEYS.TERMS_CONTENT_IP_TITLE)}
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
            fontSize: { xs: '14px', md: '16px' },
            fontWeight: 400,
          }}
        >
          {getTranslatedText(LANGUAGE_KEYS.TERMS_CONTENT_IP_CONTENT)}
        </Typography>

        {/* Copyright */}
        <Typography
          sx={{
            textAlign: 'left',
            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <b>{getTranslatedText(LANGUAGE_KEYS.TERMS_COPYRIGHT_TITLE)}:</b>&nbsp;
          {getTranslatedText(LANGUAGE_KEYS.TERMS_COPYRIGHT_CONTENT)}
        </Typography>

        {/* User Community */}
        <Typography
          sx={{
            textAlign: 'left',
            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <b>{getTranslatedText(LANGUAGE_KEYS.TERMS_USER_COMMUNITY_TITLE)}:</b>
          &nbsp;
          {getTranslatedText(LANGUAGE_KEYS.TERMS_USER_COMMUNITY_CONTENT)}
        </Typography>

        {/* Privacy Policy */}
        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 800, md: 800 },
            fontSize: { xs: '18px', md: '18px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          {getTranslatedText(LANGUAGE_KEYS.TERMS_PRIVACY_TITLE)}
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
            fontSize: { xs: '14px', md: '16px' },
            fontWeight: 400,
          }}
        >
          {getTranslatedText(LANGUAGE_KEYS.TERMS_PRIVACY_CONTENT)}
        </Typography>

        {/* Data Collection */}
        <Typography
          sx={{
            textAlign: 'left',
            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <b>{getTranslatedText(LANGUAGE_KEYS.TERMS_DATA_TITLE)}:</b>&nbsp;
          {getTranslatedText(LANGUAGE_KEYS.TERMS_DATA_CONTENT)}
        </Typography>

        {/* Cookies */}
        <Typography
          sx={{
            textAlign: 'left',
            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <b>{getTranslatedText(LANGUAGE_KEYS.TERMS_COOKIES_TITLE)}:</b>&nbsp;
          {getTranslatedText(LANGUAGE_KEYS.TERMS_COOKIES_CONTENT)}
        </Typography>

        {/* Children's Privacy */}
        <Typography
          sx={{
            textAlign: 'left',
            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <b>{getTranslatedText(LANGUAGE_KEYS.TERMS_CHILDREN_TITLE)}:</b>&nbsp;
          {getTranslatedText(LANGUAGE_KEYS.TERMS_CHILDREN_CONTENT)}
        </Typography>

        {/* Other Websites */}
        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 800, md: 800 },
            fontSize: { xs: '18px', md: '18px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          {getTranslatedText(LANGUAGE_KEYS.TERMS_OTHER_WEBSITES_TITLE)}
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
            fontSize: { xs: '14px', md: '16px' },
            fontWeight: 400,
          }}
        >
          {getTranslatedText(LANGUAGE_KEYS.TERMS_OTHER_WEBSITES_CONTENT)}
        </Typography>

        {/* Disclosure */}
        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 800, md: 800 },
            fontSize: { xs: '18px', md: '18px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          {getTranslatedText(LANGUAGE_KEYS.TERMS_DISCLOSURE_TITLE)}
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
            fontSize: { xs: '14px', md: '16px' },
            fontWeight: 400,
          }}
        >
          {getTranslatedText(LANGUAGE_KEYS.TERMS_DISCLOSURE_CONTENT)}
        </Typography>

        {/* General Readers */}
        <Typography
          sx={{
            textAlign: 'left',
            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <b>{getTranslatedText(LANGUAGE_KEYS.TERMS_GENERAL_READERS_TITLE)}:</b>
          &nbsp;
          {getTranslatedText(LANGUAGE_KEYS.TERMS_GENERAL_READERS_CONTENT)}
        </Typography>

        {/* Logged Readers */}
        <Typography
          sx={{
            textAlign: 'left',
            fontSize: { xs: '14px', md: '16px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          <b>{getTranslatedText(LANGUAGE_KEYS.TERMS_LOGGED_READERS_TITLE)}:</b>
          &nbsp;
          {getTranslatedText(LANGUAGE_KEYS.TERMS_LOGGED_READERS_CONTENT)}
        </Typography>

        {/* Your Rights */}
        <Typography
          sx={{
            textAlign: 'left',
            fontWeight: { xs: 800, md: 800 },
            fontSize: { xs: '18px', md: '18px' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
          }}
        >
          {getTranslatedText(LANGUAGE_KEYS.TERMS_RIGHTS_TITLE)}
        </Typography>
        <Typography
          sx={{
            textAlign: { xs: 'left', md: 'left' },
            pl: { xs: 3, md: 10 },
            pr: { xs: 3, md: 10 },
            fontFamily: 'Poppins',
            color: '#000000',
            fontSize: { xs: '14px', md: '16px' },
            fontWeight: 400,
          }}
        >
          {getTranslatedText(LANGUAGE_KEYS.TERMS_RIGHTS_CONTENT)}
        </Typography>
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
      ['TERMS']
    );

    if (
      !translations._nextI18Next?.initialI18nStore ||
      !translations._nextI18Next?.initialLocale
    ) {
      throw new Error('Failed to load translations');
    }

    // Debug log the translations
    console.log('Server-side translations loaded:', {
      locale,
      hasTranslations:
        !!translations._nextI18Next?.initialI18nStore[locale]?.common,
      translationKeys: Object.keys(
        translations._nextI18Next?.initialI18nStore[locale]?.common || {}
      ),
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
