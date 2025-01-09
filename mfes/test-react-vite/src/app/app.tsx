// Uncomment this line to use CSS modules
// import styles from './app.module.css';

import { Route, Routes, Link } from 'react-router-dom';

import DisplayIdComponent from '../components/DisplayIdComponent';

export function App() {

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
      <Routes>
        <Route path="/user/:id" element={<DisplayIdComponent />} />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
