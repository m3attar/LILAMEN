import Link from "next/link";
import { notFound } from "next/navigation";
import { products, productBySlug, priceLabel } from "@/lib/products";
import { AddToCart } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = productBySlug((await params).slug);
  return { title: p?.name || "Scent not found" };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = productBySlug((await params).slug);
  if (!p) notFound();
  return (
    <>
      <div className="section product-page">
        <div className="breadcrumbs">
          <Link href="/shop/">The collection</Link> / {p.name}
        </div>
        <div className="product-detail">
          <div className="detail-art">
            <img src={p.image} alt={p.imageAlt} width={1254} height={1254} />
          </div>
          <div className="detail-copy">
            <p className="eyebrow" style={{ color: p.color }}>
              {p.family}
            </p>
            <h1>{p.name}</h1>
            <p className="product-type">SCENTED WOODEN CUBE</p>
            <p className="detail-description">{p.description}</p>
            <p className="price">
              {priceLabel(p)} <span>USD</span>
            </p>
            <p className="availability">
              ● Preview collection · availability pending
            </p>
            <AddToCart slug={p.slug} />
            <details open>
              <summary>The little details</summary>
              <p>
                A scented wooden cube from the LILAMEN collection. Dimensions,
                wood type, ingredients, use instructions, and care guidance will
                be confirmed before launch.
              </p>
            </details>
            <details>
              <summary>Shipping & returns</summary>
              <p>
                Shipping rates, destinations, dispatch times, and return terms
                are not yet configured. No orders are being accepted in this
                preview.
              </p>
            </details>
          </div>
        </div>
      </div>
      <section className="section related">
        <p className="eyebrow">ANOTHER MOOD, ANOTHER MOMENT</p>
        <h2>
          Keep <em>exploring.</em>
        </h2>
        <div className="featured-grid">
          {products
            .filter((x) => x.slug !== p.slug)
            .slice(0, 3)
            .map((x) => (
              <ProductCard key={x.slug} product={x} />
            ))}
        </div>
      </section>
    </>
  );
}
