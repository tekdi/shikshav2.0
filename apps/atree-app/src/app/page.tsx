'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

//shared DataClient
import { setData, getData, removeData } from '@shared-lib';

const TestNextRoute = dynamic(() => import('@test-next-route'), {
  ssr: false,
});

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */

  return <div>hello</div>;
}
