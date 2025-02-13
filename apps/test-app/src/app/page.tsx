'use client';

import styles from './page.module.css';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

//shared DataClient
import { setData, getData, removeData } from '@shared-lib';
import AppConst from '../utils/AppConst/AppConst';

const TestNextRoute = dynamic(() => import('@test-next-route'), {
  ssr: false,
});

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  const [storeData, setStoreData] = useState('');

  const handleSetData = async () => {
    await setData('myKey', { test: 'test', value: 'hello' });
  };

  const handleGetData = async () => {
    const value = await getData('myKey');
    console.log('Retrieved value:', value);
    setStoreData(value);
  };

  const handleRemoveData = async () => {
    await removeData('myKey');
  };

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
            <br />
            <br />
            <img
              src={`${AppConst.BASEPATH}host-next-test.png`}
              alt="Logo"
              width="200px"
            />
            <br />
            <br />
            <h5>{JSON.stringify(storeData)}</h5>
            <div>
              <button onClick={handleSetData}>Set Data</button>
              <br />
              <button onClick={handleGetData}>Get Data</button>
              <br />
              <button onClick={handleRemoveData}>Remove Data</button>
              <br />
            </div>
          </div>
        </div>
      </div>
      {/* <TestNextRoute /> */}
    </div>
  );
}
