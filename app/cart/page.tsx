"use client";
import { Arrow } from "@/components/arrow";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { productBySlug, priceLabel } from "@/lib/products";
import { cartSubtotal } from "@/lib/cart";
export default function Cart() {
  const { items, ready, update, remove } = useCart();
  const subtotal = cartSubtotal(items);
  return (
    <section className="section cart-page">
      <div className="page-intro">
        <p className="eyebrow">YOUR LITTLE COLLECTION</p>
        <h1>
          The <em>shopping bag.</em>
        </h1>
      </div>
      {!ready ? (
        <p role="status">Opening your bag…</p>
      ) : items.length === 0 ? (
        <div className="empty-cart">
          <span>◇</span>
          <h2>A little empty, for now.</h2>
          <p>Find a scent that feels like you.</p>
          <Link className="button" href="/shop/">
            Explore the collection <Arrow />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            {items.map((item) => {
              const p = productBySlug(item.slug);
              if (!p) return null;
              return (
                <article className="cart-item" key={p.slug}>
                  <Link href={`/products/${p.slug}/`}>
                    <img src={p.image} alt={`${p.name} cube concept`} />
                  </Link>
                  <div>
                    <p className="eyebrow">{p.family}</p>
                    <h2>
                      <Link href={`/products/${p.slug}/`}>{p.name}</Link>
                    </h2>
                    <p>{priceLabel(p)}</p>
                    <button
                      className="remove"
                      onClick={() => remove(p.slug)}
                      aria-label={`Remove ${p.name}`}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="quantity-control">
                    <button
                      onClick={() => update(p.slug, item.quantity - 1)}
                      disabled={item.quantity === 1}
                      aria-label={`Decrease ${p.name} quantity`}
                    >
                      −
                    </button>
                    <input
                      aria-label={`${p.name} quantity`}
                      type="number"
                      min="1"
                      max="99"
                      value={item.quantity}
                      onChange={(e) => update(p.slug, e.target.valueAsNumber)}
                    />
                    <button
                      onClick={() => update(p.slug, item.quantity + 1)}
                      disabled={item.quantity === 99}
                      aria-label={`Increase ${p.name} quantity`}
                    >
                      +
                    </button>
                  </div>
                </article>
              );
            })}
            <Link href="/shop/" className="text-link">
              ← Continue exploring
            </Link>
          </div>
          <aside className="cart-summary">
            <p className="eyebrow">BAG SUMMARY</p>
            <div>
              <span>Items</span>
              <span>{items.reduce((n, i) => n + i.quantity, 0)}</span>
            </div>
            <div>
              <span>Subtotal</span>
              <strong>
                {subtotal === null
                  ? "Pending prices"
                  : new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(subtotal)}
              </strong>
            </div>
            <p>
              Prices have not been confirmed. A payable subtotal cannot be
              calculated.
            </p>
            <button
              className="button"
              disabled
              aria-describedby="checkout-note"
            >
              Checkout unavailable
            </button>
            <p id="checkout-note">
              This is a preview bag. No orders, payments, shipping, or taxes are
              processed.
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}
