"use client";
import { Arrow } from "@/components/arrow";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "./cart-provider";
export function AddToCart({ slug }: { slug: string }) {
  const { add, ready } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  return (
    <div>
      <div className="purchase-row">
        <label className="quantity-label">
          Quantity
          <input
            aria-label="Quantity"
            type="number"
            min="1"
            max="99"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.valueAsNumber || 1)}
            onBlur={() =>
              setQuantity(Math.min(99, Math.max(1, Math.floor(quantity))))
            }
          />
        </label>
        <button
          className="button"
          disabled={!ready}
          onClick={() => {
            add(slug, quantity);
            setAdded(true);
          }}
        >
          Add to bag{" "}
          <span>
            <Arrow />
          </span>
        </button>
      </div>
      {added && (
        <p role="status" className="added">
          Added to your bag. <Link href="/cart/">View bag →</Link>
        </p>
      )}
      <p className="fine-print">
        Preview only. Adding to your bag does not reserve stock or place an
        order.
      </p>
    </div>
  );
}
