import { assetPath } from "./asset-path";

export type Product = {
  name: string;
  slug: string;
  family: string;
  description: string;
  color: string;
  price: number | null;
  availability: "preview";
  image: string;
  imageAlt: string;
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
    image: assetPath("/visuals/berry.png"),
    imageAlt:
      "LILAMEN Berry bright red textured scent cube on a warm beige background",
  },
  {
    name: "Oud",
    slug: "oud",
    family: "WOODY · DEEP",
    description: "An oud-inspired scent with a warm, wood-centered character.",
    color: "#65513b",
    price: null,
    availability: "preview",
    image: assetPath("/visuals/oud.png"),
    imageAlt:
      "LILAMEN Oud dark reddish-brown textured scent cube on a warm beige background",
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
    image: assetPath("/visuals/blue-magic.png"),
    imageAlt:
      "LILAMEN Blue Magic blue textured scent cube on a warm beige background",
  },
  {
    name: "Lemon",
    slug: "lemon",
    family: "CITRUS · BRIGHT",
    description: "A lemon-inspired scent for a bright, citrus-minded moment.",
    color: "#9c833d",
    price: null,
    availability: "preview",
    image: assetPath("/visuals/lemon.png"),
    imageAlt:
      "LILAMEN Lemon yellow-gold textured scent cube on a warm beige background",
  },
  {
    name: "Papaya",
    slug: "papaya",
    family: "TROPICAL · SUNNY",
    description: "A papaya-inspired scent with a sunny, fruit-forward mood.",
    color: "#b16c48",
    price: null,
    availability: "preview",
    image: assetPath("/visuals/papaya.png"),
    imageAlt:
      "LILAMEN Papaya lighter rust-red textured scent cube on a warm beige background",
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
