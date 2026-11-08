import Link from "next/link";
export function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <Link href="/" className="wordmark">
            LILIAMEN
          </Link>
          <p>
            A little object.
            <br />A more personal everyday.
          </p>
        </div>
        <div>
          <span className="eyebrow">EXPLORE</span>
          <Link href="/shop/">The collection</Link>
          <Link href="/our-story/">Our story</Link>
          <Link href="/contact/">Contact</Link>
        </div>
        <div>
          <span className="eyebrow">A NOTE BEFORE YOU SHOP</span>
          <p>
            Build your scent selection and save it to your bag.
            <br className="desktop" /> Checkout is being finalized.
            <br />
            Orders are not open yet.
          </p>
          <a href="mailto:Liliamen.Support@gmail.com">
            Liliamen.Support@gmail.com
          </a>
          <a
            href="https://www.instagram.com/liliamen_/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram @liliamen_
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} LILIAMEN</span>
        <span>United States · USD</span>
        <span>Scent, simply.</span>
      </div>
    </footer>
  );
}
