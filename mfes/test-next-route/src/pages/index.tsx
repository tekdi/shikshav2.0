import styles from './index.module.css';
import Link from 'next/link';

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span> Hello there, </span>
              Welcome mfe-next-page-1 👋
            </h1>
            <h2>Home</h2>
            <Link href="/page2">
              <button>
                <h1>Go to Page 2</h1>
              </button>
            </Link>
            <ul>
              {Array.from({ length: 10 }, (_, i) => (
                <li key={`user_${i}`}>
                  <Link href={`/${i + 1}`}>User {i + 1}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
  );
}

export default Index;
