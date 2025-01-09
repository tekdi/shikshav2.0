import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';

const DisplayIdComponent = () => {
  const { id } = useParams();
  const location: any = useLocation();

  return (
    <div>
      <h1>Received ID: {id}</h1>
      <Link to="/">Home</Link>
      <h1>Location is: {JSON.stringify(location)}</h1>
      <h1>URL is : {window.location.href}</h1>
    </div>
  );
};

export default DisplayIdComponent;
