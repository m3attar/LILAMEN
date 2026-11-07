import { productBySlug, products } from "./products";

export const purchaseOptions = [
  { id: "single", name: "Single Cube", cubes: 1, price: 3.99 },
  { id: "three", name: "3-Cube Package", cubes: 3, price: 9.99 },
  { id: "five", name: "5-Cube Package", cubes: 5, price: 14.99 },
  { id: "nine", name: "9-Cube Package", cubes: 9, price: 21.99 },
] as const;

export type PurchaseOptionId = (typeof purchaseOptions)[number]["id"];
export type ScentSelection = Record<string, number>;
export type CartItem = {
  id: string;
  optionId: PurchaseOptionId;
  scents: ScentSelection;
  quantity: number;
};

export const CART_KEY = "lilamen.cart.v2";

export function purchaseOption(id: string) {
  return purchaseOptions.find((option) => option.id === id);
}

export function validQuantity(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(99, Math.max(1, Math.floor(value)))
    : 1;
}

export function sanitizeSelection(value: unknown): ScentSelection {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result: ScentSelection = {};
  for (const product of products) {
    const raw = (value as Record<string, unknown>)[product.slug];
    if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) {
      result[product.slug] = Math.floor(raw);
    }
  }
  return result;
}

export function selectionTotal(scents: ScentSelection): number {
  return Object.values(scents).reduce((total, quantity) => total + quantity, 0);
}

export function sanitizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const result: CartItem[] = [];
  for (const item of value.slice(0, 100)) {
    if (!item || typeof item !== "object") continue;
    const raw = item as Record<string, unknown>;
    const option =
      typeof raw.optionId === "string"
        ? purchaseOption(raw.optionId)
        : undefined;
    const scents = sanitizeSelection(raw.scents);
    if (!option || selectionTotal(scents) !== option.cubes) continue;
    const id =
      typeof raw.id === "string" && raw.id
        ? raw.id
        : `${option.id}-${result.length}`;
    result.push({
      id,
      optionId: option.id,
      scents,
      quantity: validQuantity(raw.quantity),
    });
  }
  return result;
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const option = purchaseOption(item.optionId);
    return total + (option?.price ?? 0) * item.quantity;
  }, 0);
}

export function selectionLabel(scents: ScentSelection): string {
  return products
    .filter((product) => scents[product.slug])
    .map((product) => `${scents[product.slug]} ${product.name}`)
    .join(" · ");
}

export function selectionProducts(scents: ScentSelection) {
  return Object.keys(scents)
    .map(productBySlug)
    .filter((product) => product !== undefined);
}
