'use client';

import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  const router = useRouter();

  const handleNavigationHome = () => {
    router.push('/'); // Navigates to the "/about" page
  };
  return (
    <div>
      <h1>
        <span> Hello there, </span>
        Welcome mfe-next-2 = page 1 👋
      </h1>
      <button onClick={handleNavigationHome}>Home</button>
    </div>
  );
}
