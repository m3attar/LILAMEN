import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/components/cart-provider";
export const metadata: Metadata = {
  title: {
    default: "LILAMEN — A Little Cube. A Lasting Impression.",
    template: "%s | LILAMEN",
  },
  description:
    "Explore five scents in a simple wooden form. Discover the LILAMEN scented wooden cube collection. Storefront preview.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
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
