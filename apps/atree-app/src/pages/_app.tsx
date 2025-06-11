'use client'; // Required in Next.js App Router for using hooks
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import './global.css';
import type { AppProps } from 'next/app';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from '../service/keycloack';

import '@fontsource/poppins';
import dynamic from 'next/dynamic';
import {
  fetchFrameworkData,
  processFrameworkData,
} from '../service/apiService';
import { useEffect, useState } from 'react';
import { telemetryFactory } from '../utils/telemetry';
import { useRouter } from 'next/router';
import { TelemetryEventType } from '../utils/app.constant';
const AuthHandler = dynamic(() => import('./AuthHandler'), {
  ssr: false,
});

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
    mode: 'light', // or "dark"
    info: {
      main: '#3E6837',
    },
  },
  typography: {
    fontFamily: 'Poppins',
  },
});

export default function RootLayout({ Component, pageProps }: AppProps) {
  const [frameworkState, setFrameworkState] = useState({
    frameworkData: null,
    frameworkFilter: [],
    framework: '',
  });
  const router = useRouter();
  useEffect(() => {
    telemetryFactory.init();
  }, []);
  useEffect(() => {
    const cleanupHash = () => {
      if (
        window.location.hash &&
        window.location.hash.includes('error=login_required')
      ) {
        history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search
        );
      }
    };

    // Run immediately in case the hash is already there
    cleanupHash();

    // Also run after a slight delay to catch late hash injection
    const timeout = setTimeout(cleanupHash, 500);

    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const windowUrl = url;
      const cleanedUrl = windowUrl.replace(/^\//, '');

      const telemetryImpression = {
        context: {
          env: cleanedUrl,
          cdata: [],
        },
        edata: {
          type: TelemetryEventType.VIEW,
          subtype: '',
          pageid: cleanedUrl ? cleanedUrl : 'landing_page',
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

  const enhancedPageProps = {
    ...pageProps,
    ...frameworkState,
  };
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: 'check-sso', // Ensures it doesn't force login again
        checkLoginIframe: false,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Normalize styles */}
        <AuthHandler />
        <Component {...enhancedPageProps} />
      </ThemeProvider>
    </ReactKeycloakProvider>
  );
}
