import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: "Contact",
  alternates: { canonical: "/contact/" },
  openGraph: { url: "https://liliamen.com/contact/" },
};
export default function Contact() {
  return (
    <section className="section contact-page">
      <div className="page-intro">
        <p className="eyebrow">LET’S CONNECT</p>
        <h1>
          A little <em>conversation.</em>
        </h1>
        <p>
          Questions about LILIAMEN? Send us a note or find us on social media.
        </p>
      </div>
      <div className="contact-grid">
        <article className="contact-details">
          <span className="eyebrow">CONTACT LILIAMEN</span>
          <h2>
            We’re here to <em>listen.</em>
          </h2>
          <a className="contact-email" href="mailto:Liliamen.Support@gmail.com">
            Liliamen.Support@gmail.com
          </a>
          <div className="social-links">
            <a
              href="https://www.instagram.com/lilamen26/"
              target="_blank"
              rel="noreferrer"
              aria-label="LILIAMEN on Instagram"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" className="fill" />
              </svg>
              <span>
                Instagram<small>@lilamen26</small>
              </span>
            </a>
            <a
              href="https://www.tiktok.com/@lilamen2026"
              target="_blank"
              rel="noreferrer"
              aria-label="LILIAMEN on TikTok"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 4v11.2a4.2 4.2 0 1 1-3.5-4.1V14a1.7 1.7 0 1 0 1 1.55V4h2.5Zm0 0c.4 2.4 2 3.9 4.5 4.2v2.6A7.4 7.4 0 0 1 14 9" />
              </svg>
              <span>
                TikTok<small>@lilamen2026</small>
              </span>
            </a>
          </div>
        </article>
        <div>
          <h2 className="contact-form-title">Send a little note.</h2>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
