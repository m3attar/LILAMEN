import { productBySlug } from "./products";
export type CartItem = { slug: string; quantity: number };
export const CART_KEY = "lilamen.cart.v1";
export function validQuantity(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(99, Math.max(1, Math.floor(value)))
    : 1;
}
export function sanitizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const result: CartItem[] = [];
  for (const item of value.slice(0, 1000)) {
    if (
      !item ||
      typeof item !== "object" ||
      typeof item.slug !== "string" ||
      !productBySlug(item.slug)
    )
      continue;
    const existing = result.find((i) => i.slug === item.slug);
    if (existing)
      existing.quantity = validQuantity(
        existing.quantity + validQuantity(item.quantity),
      );
    else
      result.push({ slug: item.slug, quantity: validQuantity(item.quantity) });
  }
  return result;
}
export function cartSubtotal(items: CartItem[]): number | null {
  let total = 0;
  for (const item of items) {
    const p = productBySlug(item.slug);
    if (!p || p.price === null) return null;
    total += p.price * item.quantity;
  }
  return total;
}
