// Next.js prefixes Link navigation automatically; plain image URLs need the same prefix.
export function assetPath(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;
}
