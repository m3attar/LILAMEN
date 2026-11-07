"use client";

import { Arrow } from "@/components/arrow";
import { useCart } from "@/components/cart-provider";
import { products } from "@/lib/products";
import {
  purchaseOptions,
  selectionLabel,
  selectionTotal,
  type PurchaseOptionId,
  type ScentSelection,
} from "@/lib/cart";
import Link from "next/link";
import { useState } from "react";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function PurchaseBuilder({ initialScent }: { initialScent?: string }) {
  const { addPurchase, ready } = useCart();
  const [optionId, setOptionId] = useState<PurchaseOptionId>("single");
  const [scents, setScents] = useState<ScentSelection>(
    initialScent ? { [initialScent]: 1 } : {},
  );
  const [added, setAdded] = useState(false);
  const option = purchaseOptions.find((item) => item.id === optionId)!;
  const selected = selectionTotal(scents);
  const complete = selected === option.cubes;

  const chooseOption = (id: PurchaseOptionId) => {
    setOptionId(id);
    setScents({});
    setAdded(false);
  };

  const adjust = (slug: string, change: number) => {
    setScents((current) => {
      const currentValue = current[slug] || 0;
      if (change > 0 && selectionTotal(current) >= option.cubes) return current;
      const nextValue = Math.max(0, currentValue + change);
      const next = { ...current };
      if (nextValue) next[slug] = nextValue;
      else delete next[slug];
      return next;
    });
    setAdded(false);
  };

  return (
    <section className="purchase-builder" aria-labelledby="build-heading">
      <div className="builder-heading">
        <div>
          <p className="eyebrow">BUILD YOUR SELECTION</p>
          <h2 id="build-heading">Choose your little collection.</h2>
        </div>
        <p>Every cube is yours to choose. Mix any of our five scents.</p>
      </div>
      <div
        className="package-options"
        role="radiogroup"
        aria-label="Purchase option"
      >
        {purchaseOptions.map((item) => (
          <button
            type="button"
            role="radio"
            aria-checked={item.id === optionId}
            className={
              item.id === optionId
                ? "package-option selected"
                : "package-option"
            }
            key={item.id}
            onClick={() => chooseOption(item.id)}
          >
            <span>{item.name}</span>
            <strong>{money.format(item.price)}</strong>
            <small>
              {item.cubes} {item.cubes === 1 ? "cube" : "cubes"}
            </small>
          </button>
        ))}
      </div>
      <div className="selection-status" aria-live="polite">
        <span>Selected</span>
        <strong>
          {selected} / {option.cubes} cubes
        </strong>
        <span className="selection-track">
          <i style={{ width: `${(selected / option.cubes) * 100}%` }} />
        </span>
      </div>
      <div className="scent-selector">
        {products.map((product) => {
          const quantity = scents[product.slug] || 0;
          return (
            <article className="scent-choice" key={product.slug}>
              <img src={product.image} alt="" width={1254} height={1254} />
              <div>
                <p className="eyebrow" style={{ color: product.color }}>
                  {product.family}
                </p>
                <h3>{product.name}</h3>
              </div>
              <div className="quantity-control builder-quantity">
                <button
                  type="button"
                  onClick={() => adjust(product.slug, -1)}
                  disabled={quantity === 0}
                  aria-label={`Decrease ${product.name}`}
                >
                  −
                </button>
                <output aria-label={`${product.name} quantity`}>
                  {quantity}
                </output>
                <button
                  type="button"
                  onClick={() => adjust(product.slug, 1)}
                  disabled={selected >= option.cubes}
                  aria-label={`Increase ${product.name}`}
                >
                  +
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <div className="builder-summary">
        <div>
          <p className="eyebrow">YOUR SELECTION</p>
          <p>
            {selected
              ? selectionLabel(scents)
              : "Choose the scents that feel like you."}
          </p>
        </div>
        <div className="builder-action">
          <strong>{money.format(option.price)}</strong>
          <button
            className="button"
            type="button"
            disabled={!ready || !complete}
            onClick={() => {
              addPurchase(option.id, scents);
              setAdded(true);
            }}
          >
            {complete
              ? "Add selection to bag"
              : `Choose ${option.cubes - selected} more`}
            <span>
              <Arrow />
            </span>
          </button>
        </div>
      </div>
      {added && (
        <p role="status" className="added">
          Added to your bag. <Link href="/cart/">View bag →</Link>
        </p>
      )}
    </section>
  );
}
