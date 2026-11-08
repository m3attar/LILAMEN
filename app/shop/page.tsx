import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { PurchaseBuilder } from "@/components/purchase-builder";
export const metadata = {
  title: "The collection",
  alternates: { canonical: "/shop/" },
  openGraph: { url: "https://liliamen.com/shop/" },
};
export default function Shop() {
  return (
    <div className="section shop-page">
      <div className="page-intro">
        <p className="eyebrow">THE LILIAMEN COLLECTION</p>
        <h1>
          Find your <em>little thing.</em>
        </h1>
        <p>
          Five scents. One simple form. Explore the collection at your own pace.
        </p>
      </div>
      <div className="collection-bar">
        <span>All scents · 5</span>
        <span>Wooden scent cubes</span>
      </div>
      <div className="shop-grid">
        {products.map((p, i) => (
          <ProductCard key={p.slug} product={p} index={i} />
        ))}
      </div>
      <PurchaseBuilder />
      <aside className="preview-note">
        Build a single cube or a package with any mix of our five scents.
        Checkout remains unavailable while shipping and payment operations are
        finalized.
      </aside>
    </div>
  );
}
