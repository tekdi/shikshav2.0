import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

//iframe path fix
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
//end iframe path fix

function CustomApp({ Component, pageProps }: AppProps) {
  //iframe path fix
  const router = useRouter();
  const store_key = 'test-next-route';
  // Reference to track if navigation has already occurred
  const hasNavigated = useRef(false);
  // Restore path from sessionStorage
  useEffect(() => {
    const savedPath = sessionStorage.getItem(store_key);
    if (savedPath && savedPath !== router.asPath && !hasNavigated.current) {
      // Only navigate if the saved path is different and hasn't navigated already
      hasNavigated.current = true; // Prevent future navigations
      router.replace(savedPath); // Replace the history entry with the saved path
    }
  }, [router]);
  // Store path in sessionStorage whenever the route changes
  useEffect(() => {
    const handleRouteChange = (url: any) => {
      const updatedPath = url.replace(/^\/[^/]+\/?/, "");;
      try {
        sessionStorage.setItem(store_key, updatedPath);
      } catch (e) {
        sessionStorage.removeItem(store_key);
      }
    };
    // Listen for route changes
    router.events.on('routeChangeComplete', handleRouteChange);
    // Store the initial path when the app loads
    handleRouteChange(router.asPath);
    // Cleanup the event listener when the component unmounts
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  //end iframe path fix

  return (
    <>
      <Head>
        <title>Welcome to mfe-next-page-1!</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
