'use client'; // Required for App Router with hooks
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import './global.css';
import type { AppProps } from 'next/app';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from '../service/keycloack';
import {
  cleanupAuthErrorFromUrl,
  preKeycloakUrlCleanup,
  shouldSkipKeycloakCheck,
} from '../utils/urlCleanup';
import { appWithTranslation, useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { getInitialLanguage } from '../utils/language.constants';
import nextI18NextConfig from '../../next-i18next.config.js';

import '@fontsource/poppins';
import dynamic from 'next/dynamic';
import {
  fetchFrameworkData,
  processFrameworkData,
} from '../service/apiService';
import { useState } from 'react';
import { telemetryFactory } from '../utils/telemetry';
import { useRouter } from 'next/router';
import { TelemetryEventType } from '../utils/app.constant';

const AuthHandler = dynamic(() => import('./AuthHandler'), {
  ssr: false,
});

// Global styles to prevent scrollbar layout shifts
const globalStyles = {
  html: {
    overflowY: 'scroll',
    scrollbarGutter: 'stable',
    '&::-webkit-scrollbar': {
      width: '8px',
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '4px',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      },
    },
  },
  body: {
    margin: 0,
    padding: 0,
    width: '100%',
    overflowX: 'hidden',
  },
  '#__next': {
    width: '100%',
    overflow: 'hidden',
  },
  '.MuiContainer-root': {
    width: '100%',
    maxWidth: 'none',
    paddingLeft: { xs: '16px', sm: '24px' },
    paddingRight: { xs: '16px', sm: '24px' },
  },
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#0E28AE',
    },
    secondary: {
      main: '#FFBD0D',
    },
    text: {
      secondary: 'grey',
    },
    mode: 'light',
    info: {
      main: '#3E6837',
    },
  },
  typography: {
    fontFamily: 'Poppins',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: globalStyles,
    },
  },
});

function CustomApp({ Component, pageProps }: AppProps) {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [frameworkState, setFrameworkState] = useState({
    frameworkData: null,
    frameworkFilter: [],
    framework: '',
  });

  useEffect(() => {
    // Initialize telemetry without async/await to avoid tslib dependency
    if (typeof window !== 'undefined') {
      telemetryFactory.init();
    }
  }, []);

  // Initialize language
  useEffect(() => {
    const initializeLanguage = async () => {
      if (typeof window !== 'undefined') {
        try {
          const initialLanguage = getInitialLanguage();
          console.log('Initializing with language:', initialLanguage);

          // Set language in i18n
          await i18n.changeLanguage(initialLanguage);
          console.log('Language changed to:', i18n.language);
          console.log('Available languages:', i18n.languages);
          console.log(
            'Loaded namespaces:',
            i18n.reportNamespaces?.getUsedNamespaces()
          );

          // Set HTML lang attribute
          document.documentElement.lang = initialLanguage;

          // Listen for language changes in localStorage
          const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'selectedLanguage' && e.newValue) {
              console.log(
                'Language change detected in _app via storage:',
                e.newValue
              );
              i18n.changeLanguage(e.newValue);
              document.documentElement.lang = e.newValue;
            }
          };

          // Listen for custom language change events
          const handleLanguageChange = (e: CustomEvent) => {
            console.log(
              'Language change detected in _app via custom event:',
              e.detail
            );
            if (e.detail && e.detail !== i18n.language) {
              i18n.changeLanguage(e.detail);
              document.documentElement.lang = e.detail;
            }
          };

          window.addEventListener('storage', handleStorageChange);
          window.addEventListener(
            'languageChanged' as any,
            handleLanguageChange as any
          );

          return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener(
              'languageChanged' as any,
              handleLanguageChange as any
            );
          };
        } catch (error) {
          console.error('Error initializing language:', error);
        }
      }
    };

    initializeLanguage();
  }, [i18n]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const cleanedUrl = url.replace(/^\//, '');

      const telemetryImpression = {
        context: {
          env: cleanedUrl,
          cdata: [],
        },
        edata: {
          type: TelemetryEventType.VIEW,
          subtype: '',
          pageid: cleanedUrl || 'landing_page',
          uri: '',
        },
      };
      telemetryFactory.impression(telemetryImpression);
    };

    // Log initial page load
    handleRouteChange(window.location.pathname);
  }, [router]);

  useEffect(() => {
    let isMounted = true;

    const loadFrameworkData = async () => {
      try {
        const data = await fetchFrameworkData(
          process.env.NEXT_PUBLIC_FRAMEWORK ?? ''
        );
        if (isMounted) {
          setFrameworkState(processFrameworkData(data));
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error loading framework data:', error);
        }
      }
    };

    loadFrameworkData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Pre-cleanup authentication error fragments from URL before Keycloak initialization
  useEffect(() => {
    preKeycloakUrlCleanup();
  }, []);

  const enhancedPageProps = {
    ...pageProps,
    ...frameworkState,
  };

  const handleKeycloakEvent = (event: any, error: any) => {
    if (event === 'onAuthError') {
      console.log('Auth error:', error);
      // Clean up any authentication error fragments from URL
      cleanupAuthErrorFromUrl();

      // If it's a login_required error, don't try to authenticate automatically
      if (error?.error === 'login_required') {
        console.log('Login required, but allowing public access');
      }
    }

    if (event === 'onInitError') {
      console.log('Keycloak init error:', error);
      // Clean up URL on init error too
      cleanupAuthErrorFromUrl();
    }
  };

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          typeof window !== 'undefined'
            ? `${window.location.origin}/signin`
            : '',
        checkLoginIframe: false,
        enableLogging: false,
        // Disable automatic SSO check to prevent loops
        silentCheckSsoFallback: false,
        // Don't automatically redirect on authentication failure
        redirectUri:
          typeof window !== 'undefined'
            ? `${window.location.origin}/signin`
            : '',
        // Disable SSO check completely for public browsing
        silentCheckSso: false,
      }}
      onEvent={handleKeycloakEvent}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...enhancedPageProps} />
      </ThemeProvider>
    </ReactKeycloakProvider>
  );
}

// Pass the configuration object to appWithTranslation
export default appWithTranslation(CustomApp, nextI18NextConfig);
