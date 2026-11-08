import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/components/cart-provider";
export const metadata: Metadata = {
  metadataBase: new URL("https://liliamen.com"),
  title: {
    default: "LILIAMEN — A Little Cube. A Lasting Impression.",
    template: "%s | LILIAMEN",
  },
  description:
    "Explore five scents in a simple wooden form. Discover the LILIAMEN scented wooden cube collection.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://liliamen.com/",
    siteName: "LILIAMEN",
    title: "LILIAMEN — A Little Cube. A Lasting Impression.",
    description:
      "Explore five scents in a simple wooden form. Discover the LILIAMEN scented wooden cube collection.",
    images: [
      {
        url: "/visuals/oud.png",
        width: 1254,
        height: 1254,
        alt: "LILIAMEN scented wooden cube",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LILIAMEN — A Little Cube. A Lasting Impression.",
    description:
      "Explore five scents in a simple wooden form. Discover the LILIAMEN scented wooden cube collection.",
    images: ["/visuals/oud.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://liliamen.com/#organization",
      name: "Liliamen",
      alternateName: "LILIAMEN",
      url: "https://liliamen.com/",
      email: "Liliamen.Support@gmail.com",
      sameAs: [
        "https://www.instagram.com/lilamen26/",
        "https://www.tiktok.com/@lilamen2026",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://liliamen.com/#website",
      url: "https://liliamen.com/",
      name: "Liliamen",
      alternateName: "LILIAMEN",
      publisher: { "@id": "https://liliamen.com/#organization" },
    },
  ],
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <CartProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
