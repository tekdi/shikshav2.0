import dynamic from 'next/dynamic';
import React from 'react';

const youth = () => {
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <iframe
        src="http://localhost:3002"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        title="Embedded Localhost"
      />
    </div>
  );
};

export default youth;
