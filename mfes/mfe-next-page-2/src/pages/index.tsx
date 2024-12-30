import styles from './index.module.css';
import { useRouter } from 'next/navigation';

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  const router = useRouter();

  const handleNavigationPage1 = () => {
    router.push('/page1'); // Navigates to the "/about" page
  };
  const handleNavigationPage2 = () => {
    router.push('/page2'); // Navigates to the "/about" page
  };

  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span> Hello there, </span>
              Welcome mfe-next-page-2 👋
            </h1>
            <button onClick={handleNavigationPage1}>Page 1</button>
            <button onClick={handleNavigationPage2}>Page 2</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
