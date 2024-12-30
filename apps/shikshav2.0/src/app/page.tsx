import styles from './page.module.css';
import dynamic from 'next/dynamic';
// const MfeNext = dynamic(() => import('@mfe-next'), {
//   ssr: false,
// });
// const MfeNext2 = dynamic(() => import('@mfe-next-2'), {
//   ssr: false,
// });
import { useEffect } from 'react';
import { useRouter } from 'next/router';
const MfeNextPage1 = dynamic(() => import('@mfe-next-page-1'), {
  ssr: false,
});
const MfeNextPage2 = dynamic(() => import('@mfe-next-page-2'), {
  ssr: false,
});
export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
    <div>
      <h1>
        <span> Hello there, </span>
        Welcome shikshav2.0 👋
      </h1>
      {/* <MfeNext />
      <MfeNext2 /> */}
      <MfeNextPage1 />
      <MfeNextPage2 />
    </div>
  );
}
