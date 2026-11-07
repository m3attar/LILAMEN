"use client";
import { Arrow } from "@/components/arrow";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import {
  cartSubtotal,
  purchaseOption,
  selectionLabel,
  selectionProducts,
} from "@/lib/cart";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

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
          <p>Build a selection that feels like you.</p>
          <Link className="button" href="/shop/">
            Explore the collection <Arrow />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            {items.map((item) => {
              const option = purchaseOption(item.optionId);
              if (!option) return null;
              const selectedProducts = selectionProducts(item.scents);
              return (
                <article className="cart-item" key={item.id}>
                  <div className="cart-image-stack" aria-hidden="true">
                    {selectedProducts.slice(0, 3).map((product) => (
                      <img
                        key={product.slug}
                        src={product.image}
                        alt=""
                        width={1254}
                        height={1254}
                      />
                    ))}
                  </div>
                  <div className="cart-item-copy">
                    <p className="eyebrow">
                      {option.cubes} {option.cubes === 1 ? "CUBE" : "CUBES"}
                    </p>
                    <h2>{option.name}</h2>
                    <p className="cart-scents">{selectionLabel(item.scents)}</p>
                    <strong>
                      {money.format(option.price)} <small>USD</small>
                    </strong>
                    <button
                      className="remove"
                      onClick={() => remove(item.id)}
                      aria-label={`Remove ${option.name}`}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="quantity-control">
                    <button
                      onClick={() => update(item.id, item.quantity - 1)}
                      disabled={item.quantity === 1}
                      aria-label={`Decrease ${option.name} quantity`}
                    >
                      −
                    </button>
                    <input
                      aria-label={`${option.name} quantity`}
                      type="number"
                      min="1"
                      max="99"
                      value={item.quantity}
                      onChange={(event) =>
                        update(item.id, event.target.valueAsNumber)
                      }
                    />
                    <button
                      onClick={() => update(item.id, item.quantity + 1)}
                      disabled={item.quantity === 99}
                      aria-label={`Increase ${option.name} quantity`}
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
              <span>Selections</span>
              <span>
                {items.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </div>
            <div>
              <span>Subtotal</span>
              <strong>{money.format(subtotal)}</strong>
            </div>
            <p>
              Shipping and taxes will be confirmed when checkout becomes
              available.
            </p>
            <button
              className="button"
              disabled
              aria-describedby="checkout-note"
            >
              Checkout unavailable
            </button>
            <p id="checkout-note">
              Selections and prices are saved, but payments are not yet
              processed.
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}
