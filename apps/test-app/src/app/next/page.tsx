//'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  const Mfe_Next = process.env.NEXT_PUBLIC_NEXT_PROJECT;

  return (
    <div id="welcome">
      <Link href="/">
        <button>
          <h1>Home</h1>
        </button>
      </Link>
      <h1>Next Microfrontend Iframe</h1>
      <iframe
        src={Mfe_Next}
        style={{
          width: '100vw',
          height: '100vh',
          border: 'none',
        }}
      ></iframe>
    </div>
  );
}
