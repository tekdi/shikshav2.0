//'use client';

import styles from './page.module.css';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const TestNextRoute = dynamic(() => import('@test-next-route'), {
  ssr: false,
});

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span> Hello there, </span>
              Welcome to shikshav2.0 👋
            </h1>
            <br />
            <br />
            <Link href="/next">
              <button>
                <h1>Next Microfrontend Iframe</h1>
              </button>
            </Link>
            <br />
            <br />
            <Link href="/react">
              <button>
                <h1>React Microfrontend Iframe</h1>
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/* <TestNextRoute /> */}
    </div>
  );
}
