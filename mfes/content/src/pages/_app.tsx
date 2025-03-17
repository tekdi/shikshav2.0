// import { ThemeProvider, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@shikshav2.0/shared';
// import customTheme from '../theme/theme';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const URL_LOGIN = process.env.NEXT_PUBLIC_LOGIN;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accToken = localStorage.getItem('accToken');
      const refToken = localStorage.getItem('refToken');

      if (!accToken && !refToken) {
        //@ts-ignore
        router.replace(URL_LOGIN); // Redirect to login if missing
      }
    }
  }, []);

  return (
    // <ThemeProvider theme={customTheme}>
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
