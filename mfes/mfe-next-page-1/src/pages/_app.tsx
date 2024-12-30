import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

import React from 'react';
import { HashRouter } from 'react-router-dom';
import dynamic from 'next/dynamic';

const AppRoutes = dynamic(() => import('../routes/AppRoutes'), { ssr: false });

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}

export default CustomApp;
