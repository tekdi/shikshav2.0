// Uncomment this line to use CSS modules
// import styles from './app.module.css';

import { Route, Routes, Link } from 'react-router-dom';

import DisplayIdComponent from '../components/DisplayIdComponent';

//shared DataClient
import { setData, getData, removeData } from '@shared-lib';
import { useState } from 'react';

export function App() {
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
    <div>
      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <br />
      <hr />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <ul>
            {Array.from({ length: 10 }, (_, i) => (
              <li key={`user_${i}`}>
                <Link to={`/user/${i + 1}`}>User {i + 1}</Link>
              </li>
            ))}
          </ul>
        </ul>
      </div>
      <h5>{JSON.stringify(storeData)}</h5>
      <div>
        <button onClick={handleGetData}>Get Data</button>
        <br />
        <button onClick={handleRemoveData}>Remove Data</button>
        <br />
      </div>
      <Routes>
        <Route path="/user/:id" element={<DisplayIdComponent />} />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
