import { Arrow } from "@/components/arrow";
import Link from "next/link";
import { type Product, priceLabel } from "@/lib/products";
export function ProductCard({
  product: p,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  return (
    <article className="product-card">
      <Link
        href={`/products/${p.slug}/`}
        className="product-image"
        aria-label={`Explore ${p.name}`}
      >
        <span className="product-index">0{index + 1} / THE COLLECTION</span>
        <img
          src={p.image}
          alt={p.imageAlt}
          width={1254}
          height={1254}
          loading="lazy"
        />
        <span className="explore-product">
          Explore scent <Arrow />
        </span>
      </Link>
      <div className="product-meta">
        <div>
          <p className="eyebrow" style={{ color: p.color }}>
            {p.family}
          </p>
          <h3>
            <Link href={`/products/${p.slug}/`}>{p.name}</Link>
          </h3>
        </div>
        <span className="pending">{priceLabel(p)}</span>
      </div>
    </article>
  );
}
