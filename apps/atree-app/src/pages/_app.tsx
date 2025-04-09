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
