import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping bag",
  alternates: { canonical: "/cart/" },
  robots: { index: false, follow: true },
  openGraph: { url: "https://liliamen.com/cart/" },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
