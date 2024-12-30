import React from 'react';
import { HashRouter } from 'react-router-dom';

import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <HashRouter>
      <Head>
        <title>Welcome to host-app!</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </HashRouter>
  );
}

export default CustomApp;
