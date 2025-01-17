import styles from './index.module.css';
import Link from 'next/link';

//shared DataClient
import { setData, getData, removeData } from '@shared-lib';
import { useState } from 'react';

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */

  const [storeData, setStoreData] = useState('');

  const handleGetData = async () => {
    const value = await getData('myKey');
    console.log('Retrieved value:', value);
    setStoreData(value);
  };

  const handleRemoveData = async () => {
    await removeData('myKey');
  };

  return (
    <div className="wrapper">
      <div className="container">
        <div id="welcome">
          <h1>
            <span> Hello there, </span>
            Welcome mfe-next-page-1 👋
          </h1>
          <h2>Home</h2>
          <Link href="/page2">
            <button>
              <h1>Go to Page 2</h1>
            </button>
          </Link>
          <ul>
            {Array.from({ length: 10 }, (_, i) => (
              <li key={`user_${i}`}>
                <Link href={`/${i + 1}`}>User {i + 1}</Link>
              </li>
            ))}
          </ul>
          <h5>{JSON.stringify(storeData)}</h5>
          <div>
            <button onClick={handleGetData}>Get Data</button>
            <br />
            <button onClick={handleRemoveData}>Remove Data</button>
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
