export const metadata = { title: "Contact" };
export default function Contact() {
  return (
    <section className="section contact-page">
      <div className="page-intro">
        <p className="eyebrow">LET’S CONNECT</p>
        <h1>
          A little <em>conversation.</em>
        </h1>
        <p>
          Questions about LILAMEN? We look forward to hearing from you when our
          contact channel opens.
        </p>
      </div>
      <div className="contact-grid">
        <article>
          <span className="eyebrow">CONTACT STATUS</span>
          <h2>
            Coming <em>soon.</em>
          </h2>
          <p>
            Our official customer support email and contact form are being
            finalized. We are not collecting messages or personal details in
            this preview.
          </p>
        </article>
        <div className="faq">
          <h2>A few little answers.</h2>
          <details open>
            <summary>Can I place an order?</summary>
            <p>
              Not yet. You can explore all five scents and build a preview bag.
              Checkout will stay disabled until prices and store operations are
              confirmed.
            </p>
          </details>
          <details>
            <summary>Where will LILAMEN be available?</summary>
            <p>
              This storefront is being prepared for the United States, with
              prices in USD. Shipping coverage and rates will be confirmed
              before launch.
            </p>
          </details>
          <details>
            <summary>Where can I find product details?</summary>
            <p>
              Each scent has its own page. Final specifications, ingredients,
              safety information, and care instructions are pending
              confirmation.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
