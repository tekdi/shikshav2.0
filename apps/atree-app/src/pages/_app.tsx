'use client'; // Required in Next.js App Router for using hooks
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import './global.css';
import type { AppProps } from 'next/app';
import { Poppins } from 'next/font/google';
import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web';
import keycloak from '../service/keycloack';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

import '@fontsource/poppins';

interface DecodedToken {
  name?: string;
  preferred_username?: string;
  email?: string;
  [key: string]: any;
}
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'], // Choose weights as needed
  variable: '--font-poppins', // Optional: Set a CSS variable
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
function AuthHandler() {
  const router = useRouter();
  const { initialized, keycloak } = useKeycloak();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);

      if (url.searchParams.get('code') || url.searchParams.get('state')) {
        console.log('Processing Keycloak login response...');
        url.searchParams.delete('code');
        url.searchParams.delete('state');
        url.searchParams.delete('session_state');
        window.history.replaceState({}, document.title, url.pathname);
      }
    }
  }, []);

  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      localStorage.setItem('token', keycloak.token || '');
      localStorage.setItem('refreshToken', keycloak.refreshToken || '');
      const decodedToken = jwtDecode<DecodedToken>(keycloak.token || '');
      localStorage.setItem('username', decodedToken.name || '');
      router.push(`/home`);
    }
  }, [initialized, keycloak.authenticated]);

  return null; // No UI needed, just handling authentication
}
export default function RootLayout({ Component, pageProps }: AppProps) {
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
        <Component {...pageProps} />
      </ThemeProvider>
    </ReactKeycloakProvider>
  );
}
