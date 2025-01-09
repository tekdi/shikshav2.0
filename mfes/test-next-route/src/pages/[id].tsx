import Link from 'next/link';
import { useRouter } from 'next/router';

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  const router = useRouter();
  const { id } = router.query;
  return (
    <div>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span> Hello there, </span>
              Welcome mfe-next-page-1 👋
            </h1>
            <Link href="/">
              <button>
                <h1>Go to Home</h1>
              </button>
            </Link>
            <div>
              <h1>Received ID: {id}</h1>
            </div>
            <h1>
              URL is : {typeof window !== 'undefined' && window.location.href}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
