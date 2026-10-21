import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
export const metadata = { title: "The collection" };
export default function Shop() {
  return (
    <div className="section shop-page">
      <div className="page-intro">
        <p className="eyebrow">THE LILAMEN COLLECTION</p>
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
      <aside className="preview-note">
        A collection in the making. Prices, product details, and availability
        are pending confirmation. You can explore and build a preview bag;
        ordering is not open.
      </aside>
    </div>
  );
}
