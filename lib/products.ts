export type Product = {
  name: string;
  slug: string;
  family: string;
  description: string;
  color: string;
  price: number | null;
  availability: "preview";
  image: string;
};
export const products: Product[] = [
  {
    name: "Berry",
    slug: "berry",
    family: "FRUITY · PLAYFUL",
    description:
      "A berry-inspired scent for those drawn to a softer, fruit-forward mood.",
    color: "#7d3e4b",
    price: null,
    availability: "preview",
    image: "/visuals/berry.svg",
  },
  {
    name: "Oud",
    slug: "oud",
    family: "WOODY · DEEP",
    description: "An oud-inspired scent with a warm, wood-centered character.",
    color: "#65513b",
    price: null,
    availability: "preview",
    image: "/visuals/oud.svg",
  },
  {
    name: "Blue Magic",
    slug: "blue-magic",
    family: "FRESH · INTRIGUING",
    description:
      "A scent named for a fresh, quietly intriguing mood. Final fragrance notes are coming soon.",
    color: "#476777",
    price: null,
    availability: "preview",
    image: "/visuals/blue-magic.svg",
  },
  {
    name: "Lemon",
    slug: "lemon",
    family: "CITRUS · BRIGHT",
    description: "A lemon-inspired scent for a bright, citrus-minded moment.",
    color: "#9c833d",
    price: null,
    availability: "preview",
    image: "/visuals/lemon.svg",
  },
  {
    name: "Papaya",
    slug: "papaya",
    family: "TROPICAL · SUNNY",
    description: "A papaya-inspired scent with a sunny, fruit-forward mood.",
    color: "#b16c48",
    price: null,
    availability: "preview",
    image: "/visuals/papaya.svg",
  },
];
export const productBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);
export const priceLabel = (p: Product) =>
  p.price === null
    ? "Price pending"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(p.price);
