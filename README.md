# LILAMEN

A premium storefront **prototype**, built with Next.js 15, React 19, TypeScript and Tailwind CSS 4. The production site is a static Next.js export; no server-side commerce service is implied.

## Run locally

Requires Node.js 20.9 or newer and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Next.js on the same computer. For a real iPad, use the deployed private Site URL supplied in the handoff; localhost on the iPad refers to the iPad itself.

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

Patched PostCSS and Sharp versions are pinned through npm overrides; the production build and browser checks were rerun with them.

The production export is in `out/`. Any static host must serve nested `index.html` files and use `404.html` for missing routes.

## Browser QA

```sh
# Start in one terminal after npm run build (Python 3):
python3 tests/serve-export.py
# In another terminal:
npm run test:browser
```

Browser QA uses system Chromium at `/usr/bin/chromium` if available. Otherwise install Playwright's Chromium with `npx playwright install chromium`, or set `BROWSER_EXECUTABLE` to a compatible Chromium executable. Set `QA_ORIGIN` to test a different local origin. The script saves screenshots in `work/`; create that directory before running it in a fresh checkout (`mkdir -p work`). Direct iPad Safari testing is still required before launch.

## Project structure

```text
app/
  layout.tsx, globals.css, page.tsx  Shared layout and homepage
  shop/page.tsx                    All five scents
  products/[slug]/page.tsx          Five generated product pages
  our-story/page.tsx                Brand introduction
  contact/page.tsx                  Contact status and FAQs
  cart/page.tsx                     Persistent preview bag
  not-found.tsx, icon.svg           Custom 404 and site icon
components/
  header.tsx, footer.tsx            Shared navigation
  cart-provider.tsx                localStorage state and synchronization
  product-card.tsx, add-to-cart.tsx Reusable product UI
  arrow.tsx                        Font-independent SVG icon
lib/
  products.ts                      Typed catalog; all prices are null
  cart.ts                          Defensive cart normalization and totals
public/visuals/                     Five original product PNGs and retained SVG assets
 tests/cart.test.ts                 Cart and catalog unit tests
 tests/browser.mjs                  Real Chromium end-to-end checks
 tests/serve-export.py              Local production QA server
.openai/hosting.json                Private Site identity and export directory
```

## Data and business boundaries

- Product prices are deliberately `null` in `lib/products.ts`; the UI says **Price pending**. No fake prices, reviews, specifications, or certifications.
- Cart quantities are whole numbers from 1–99. Unknown products are discarded, duplicate products are merged, corrupt stored JSON is handled, and unavailable storage is reported. The cart persists across navigation and reloads and synchronizes storage changes across tabs.
- Subtotals stay **Pending prices** when any included product lacks a confirmed price. Checkout is disabled for every preview bag. Adding an item neither reserves inventory nor creates an order.
- Product imagery uses the five supplied original PNGs, preserved byte-for-byte at 1254 × 1254 pixels. The earlier SVG illustrations remain in the repository, but storefront imagery uses the PNGs.
- Contact details have not been supplied. The Contact page clearly says the channel is not open and does not collect personal data.
- There are no payment, shipping, tax, inventory, order management, authentication, analytics, email, or contact submission integrations in this storefront.

## Before accepting real orders

Supply and approve prices, availability, final product photographs, dimensions, materials, ingredients, use and safety guidance. Confirm shipping regions, fulfillment, taxes, returns and privacy/terms. Configure a payment provider using server-side secrets and authoritative server-side pricing; verify signed payment webhooks, order records and stock handling. Add a working support channel and transactional email. Test checkout, refunds, accessibility, and the exact iPad/Safari versions you support. Changing a price field alone must not enable checkout.

See `VERIFICATION.md` for actual run results and the DisposableStack investigation.

## Original product image mapping

The ZIP mislabeled Lemon and Berry; the public asset names follow the confirmed visible colors. Product pages, cards, related products and the cart use the shared image paths and alt text in `lib/products.ts`. The homepage hero uses Oud and the story sections use Papaya.

| Scent      | Public asset                    | Visible cube color    | Original ZIP filename |
| ---------- | ------------------------------- | --------------------- | --------------------- |
| Lemon      | `public/visuals/lemon.png`      | Yellow/gold           | `berry.png`           |
| Berry      | `public/visuals/berry.png`      | Bright red            | `lemon.png`           |
| Blue Magic | `public/visuals/blue-magic.png` | Blue                  | `blue-magic.png`      |
| Papaya     | `public/visuals/papaya.png`     | Lighter rust-red      | `papaya.png`          |
| Oud        | `public/visuals/oud.png`        | Darkest reddish-brown | `oud.png`             |

The separate owner-private image-review preview is https://lilamen-image-review.cozyisle5.chatgpt.site. It does not replace the original published prototype. GitHub source synchronization does not itself authorize a Site deployment.

## GitHub Pages

The existing Next.js static export also supports the GitHub project path `/LILAMEN/`. `.github/workflows/pages.yml` builds and verifies the site on pushes to `main` and manual workflow runs, then uploads only `out/` and deploys it through GitHub Pages. No personal access token or new repository secret is required. The workflow uses the built-in GitHub token with `contents: read`, `pages: write`, and deployment-only `id-token: write` permissions.

One-time repository setup: in **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**. The built-in workflow token cannot enable a previously disabled Pages site; this requires a repository-owner setting. Once enabled, inspect the workflow's deployment result for its actual public URL.

To reproduce the project-path build locally:

```sh
NEXT_PUBLIC_BASE_PATH=/LILAMEN npm run build
python3 tests/serve-export.py --base-path /LILAMEN
# In a second terminal:
QA_BASE_PATH=/LILAMEN npm run test:browser
```

`NEXT_PUBLIC_BASE_PATH` is public build configuration, not a secret. Next.js prefixes navigation and framework assets; `lib/asset-path.ts` prefixes the original product image URLs. Leaving it unset preserves root-path builds for the existing ChatGPT-hosted Sites. The cart remains browser-local, checkout stays disabled, and GitHub Pages does not add payment or order processing. Cart data is separate on each hosting origin.
