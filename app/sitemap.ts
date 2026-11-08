import type { MetadataRoute } from "next";
import { products } from "@/lib/products";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://liliamen.com";
  const routes = ["", "/shop/", "/our-story/", "/contact/", "/cart/"];
  return [
    ...routes.map((route) => ({
      url: `${baseUrl}${route || "/"}`,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
