import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { FlatCompat } = require("@eslint/eslintrc");
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });
const config = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  { rules: { "@next/next/no-img-element": "off" } },
  {
    ignores: [
      "out/**",
      ".next/**",
      "node_modules/**",
      "work/**",
      "next-env.d.ts",
    ],
  },
];

export default config;
