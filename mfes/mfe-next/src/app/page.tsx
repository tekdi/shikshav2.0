'use client';

import styles from './page.module.css';
import { useRouter } from 'next/navigation';

import React from 'react';
import singleSpaReact from 'single-spa-react';

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  const router = useRouter();

  const handleNavigationPage1 = () => {
    router.push('/page1'); // Navigates to the "/about" page
  };
  const handleNavigationPage2 = () => {
    router.push('/page2'); // Navigates to the "/about" page
  };

  return (
    <div>
      <h1>
        <span> Hello there, </span>
        Welcome mfe-next 👋
      </h1>
      <button onClick={handleNavigationPage1}>Page 1</button>
      <button onClick={handleNavigationPage2}>Page 2</button>
    </div>
  );
}

// Expose lifecycle methods for Single-SPA
const lifecycles = singleSpaReact({
  React,
  ReactDOM: require('react-dom'),
  rootComponent: Index,
});
export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
