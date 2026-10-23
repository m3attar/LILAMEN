import { test } from "node:test";
import assert from "node:assert/strict";
import { sanitizeCart, validQuantity, cartSubtotal } from "../lib/cart";
import { products, priceLabel } from "../lib/products";
test("rejects corrupted storage and removed products", () => {
  assert.deepEqual(sanitizeCart(null), []);
  assert.deepEqual(sanitizeCart({}), []);
  assert.deepEqual(sanitizeCart([null, { slug: "missing", quantity: 2 }]), []);
});
test("normalizes non-finite, fractional, negative, and excessive quantities", () => {
  assert.equal(validQuantity(NaN), 1);
  assert.equal(validQuantity(Infinity), 1);
  assert.equal(validQuantity(-3), 1);
  assert.equal(validQuantity(2.7), 2);
  assert.equal(validQuantity(300), 99);
  assert.equal(validQuantity("3"), 1);
});
test("merges duplicate products within the cap", () => {
  assert.deepEqual(
    sanitizeCart([
      { slug: "oud", quantity: 60 },
      { slug: "oud", quantity: 60 },
    ]),
    [{ slug: "oud", quantity: 99 }],
  );
});
test("never treats an unconfirmed price as free", () => {
  assert.equal(cartSubtotal([{ slug: "berry", quantity: 2 }]), null);
  assert.equal(cartSubtotal([{ slug: "missing", quantity: 2 }]), null);
  assert.equal(cartSubtotal([]), 0);
  assert.ok(
    products.every(
      (p) => p.price === null && priceLabel(p) === "Price pending",
    ),
  );
});
test("five unique products have local visuals and preview status", () => {
  assert.equal(products.length, 5);
  assert.equal(new Set(products.map((p) => p.slug)).size, 5);
  assert.ok(
    products.every(
      (p) =>
        p.availability === "preview" &&
        p.image.endsWith(`/visuals/${p.slug}.png`),
    ),
  );
});
