import Link from 'next/link';

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
    <div>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span> Hello there, </span>
              Welcome mfe-next-page-1 👋
            </h1>
            <h2>Page 2</h2>
            <Link href="/">
              <button>
                <h1>Go to Home</h1>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
