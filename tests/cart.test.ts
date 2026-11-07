import { test } from "node:test";
import assert from "node:assert/strict";
import {
  cartSubtotal,
  purchaseOptions,
  sanitizeCart,
  sanitizeSelection,
  selectionLabel,
  selectionTotal,
  validQuantity,
} from "../lib/cart";
import { products, priceLabel } from "../lib/products";

test("rejects corrupted, unknown, and incomplete purchases", () => {
  assert.deepEqual(sanitizeCart(null), []);
  assert.deepEqual(sanitizeCart({}), []);
  assert.deepEqual(
    sanitizeCart([null, { optionId: "missing", scents: { oud: 1 } }]),
    [],
  );
  assert.deepEqual(
    sanitizeCart([{ optionId: "three", scents: { oud: 2 }, quantity: 1 }]),
    [],
  );
});

test("normalizes cart quantities", () => {
  assert.equal(validQuantity(NaN), 1);
  assert.equal(validQuantity(-3), 1);
  assert.equal(validQuantity(2.7), 2);
  assert.equal(validQuantity(300), 99);
});

test("accepts exact mixed scent selections and preserves separate items", () => {
  const value = [
    { id: "a", optionId: "three", scents: { berry: 2, oud: 1 }, quantity: 2 },
    { id: "b", optionId: "three", scents: { lemon: 3 }, quantity: 1 },
  ];
  assert.deepEqual(sanitizeCart(value), value);
  assert.equal(selectionTotal({ berry: 2, oud: 1 }), 3);
  assert.equal(selectionLabel({ berry: 2, oud: 1 }), "2 Berry · 1 Oud");
});

test("sanitizes selection values and unknown scents", () => {
  assert.deepEqual(sanitizeSelection({ berry: 2.8, missing: 4, oud: -1 }), {
    berry: 2,
  });
});

test("calculates all package prices in USD", () => {
  assert.deepEqual(
    purchaseOptions.map(({ cubes, price }) => [cubes, price]),
    [
      [1, 3.99],
      [3, 9.99],
      [5, 14.99],
      [9, 21.99],
    ],
  );
  assert.equal(
    cartSubtotal([
      { id: "a", optionId: "single", scents: { lemon: 1 }, quantity: 1 },
      {
        id: "b",
        optionId: "nine",
        scents: { lemon: 4, oud: 3, "blue-magic": 2 },
        quantity: 2,
      },
    ]),
    47.97,
  );
});

test("five unique products have local visuals and single-cube pricing", () => {
  assert.equal(products.length, 5);
  assert.equal(new Set(products.map((product) => product.slug)).size, 5);
  assert.ok(
    products.every(
      (product) =>
        product.price === 3.99 &&
        priceLabel(product) === "$3.99" &&
        product.image.endsWith(`/visuals/${product.slug}.png`),
    ),
  );
});
