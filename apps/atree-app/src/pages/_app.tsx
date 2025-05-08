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
import Layout from '../component/layout/layout';
import { useEffect, useState } from 'react';
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
  const [frameworkData, setFrameworkData] = useState<any>(null);
  const [frameworkFilter, setFrameworkFilter] = useState<any[]>([]);
  const [framework, setFramework] = useState<string>('');
  useEffect(() => {
    let isMounted = true;
    const fetchFrameworkData = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_SSUNBIRD_BASE_URL}/api/framework/v1/read/${process.env.NEXT_PUBLIC_FRAMEWORK}`;
        const frameworkData = await fetch(url).then((res) => res.json());
        if (isMounted) {
          const frameworks = frameworkData?.result?.framework?.categories;
          const fdata =
            frameworks.find((item: any) => item.code === 'topic')?.terms ?? [];
          setFramework(fdata[0]?.identifier ?? '');
          setFrameworkFilter(fdata);
          setFrameworkData(frameworkData);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching board data:', error);
        }
      }
    };

    fetchFrameworkData();
    return () => {
      isMounted = false;
    };
  }, []);

  const enhancedPageProps = {
    ...pageProps,
    frameworkData,
    frameworkFilter,
    framework,
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
