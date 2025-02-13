// Uncomment this line to use CSS modules
// import styles from './app.module.css';

import { Route, Routes, Link } from 'react-router-dom';

import DisplayIdComponent from '../components/DisplayIdComponent';

//assest
import logo from '../assets/src-react-test.png';

//shared DataClient
import { setData, getData, removeData } from '@shared-lib';
import { useEffect, useState, useRef } from 'react';

//iframe path fix
import { useLocation, useNavigate } from 'react-router-dom';
//end iframe path fix

import AppConst from '../utils/AppConst/AppConst';

export function App() {
  //iframe path fix
  const navigate = useNavigate();
  const location = useLocation();
  const store_key = 'test-react-vite';

  // Reference to track if navigation has already occurred
  const hasNavigated = useRef(false);

  // Restore path from sessionStorage
  useEffect(() => {
    const savedPath = sessionStorage.getItem(store_key);
    if (savedPath && savedPath !== location.pathname && !hasNavigated.current) {
      // Only navigate if the saved path is different and hasn't navigated already
      hasNavigated.current = true; // Prevent future navigations
      navigate(savedPath);
    }
  }, [navigate, location.pathname]);

  // Store path in sessionStorage whenever the route changes
  useEffect(() => {
    const path = location.pathname;
    const updatedPath = path.startsWith('/') ? path.slice(1) : path;
    try {
      sessionStorage.setItem(store_key, updatedPath);
    } catch (e) {
      sessionStorage.removeItem(store_key);
    }
  }, [location]);
  //end iframe path fix

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
          <br />
          from public
          <img
            src={`${AppConst.BASEPATH}public-react-test.png`}
            alt="Logo"
            width="200px"
          />
          <br />
          from src
          <img src={logo} alt="Logo" width="200px" />
          <br />
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
