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
  contact/page.tsx                  Contact details and message form
  cart/page.tsx                     Persistent package-selection bag
  not-found.tsx, icon.svg           Custom 404 and site icon
components/
  header.tsx, footer.tsx            Shared navigation
  cart-provider.tsx                localStorage state and synchronization
  product-card.tsx                  Reusable product UI
  purchase-builder.tsx              Package and scent selection
  contact-form.tsx                  Validated FormSubmit integration
  arrow.tsx                        Font-independent SVG icon
lib/
  products.ts                      Typed five-scent catalog
  cart.ts                          Package definitions, normalization and totals
public/visuals/                     Five original product PNGs and retained SVG assets
 tests/cart.test.ts                 Cart and catalog unit tests
 tests/browser.mjs                  Real Chromium end-to-end checks
 tests/serve-export.py              Local production QA server
.openai/hosting.json                Private Site identity and export directory
```

## Data and business boundaries

- Prices are $3.99 for one cube, $9.99 for three, $14.99 for five and $21.99 for nine. Every option supports a freely mixed, exact-count selection of the five scents.
- Each cart line preserves its purchase option and scent quantities. Identical or different selections remain separate lines; line quantities are whole numbers from 1–99. Invalid packages and corrupt stored JSON are discarded. The cart persists across navigation and reloads and synchronizes storage changes across tabs.
- Subtotals use the fixed package prices. Checkout remains disabled while payment, shipping and order operations are unfinished. Adding a selection neither reserves inventory nor creates an order.
- Product imagery uses the five supplied original PNGs, preserved byte-for-byte at 1254 × 1254 pixels. The earlier SVG illustrations remain in the repository, but storefront imagery uses the PNGs.
- Contact messages submit to `lilamen2026@gmail.com` through FormSubmit's static-site-compatible AJAX endpoint. The mailbox owner must approve FormSubmit's one-time activation email after the first submission. No private key is stored in the frontend.
- There are no payment, shipping, tax, inventory, order management, authentication, analytics, or transactional email integrations in this storefront.

## Before accepting real orders

Approve availability, final product photographs, dimensions, materials, ingredients, use and safety guidance. Confirm shipping regions, fulfillment, taxes, returns and privacy/terms. Activate FormSubmit from the email sent to `lilamen2026@gmail.com`. Configure a payment provider using server-side secrets and authoritative server-side pricing; verify signed payment webhooks, order records and stock handling. Test checkout, refunds, accessibility, and the exact iPad/Safari versions you support.

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

The Next.js static export is deployed at the root custom domain `https://liliamen.com/`. `.github/workflows/pages.yml` builds and verifies the site on pushes to `main` and manual workflow runs, then uploads only `out/` and deploys it through GitHub Pages. The exported `CNAME` preserves the custom domain. No personal access token or new repository secret is required. The workflow uses the built-in GitHub token with `contents: read`, `pages: write`, and deployment-only `id-token: write` permissions.

One-time repository setup: in **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**. The built-in workflow token cannot enable a previously disabled Pages site; this requires a repository-owner setting. Once enabled, inspect the workflow's deployment result for its actual public URL.

To reproduce the root-domain build locally:

```sh
npm run build
python3 tests/serve-export.py
# In a second terminal:
npm run test:browser
```

Framework assets, navigation, and product images use root-relative URLs for the custom domain. The cart remains browser-local, checkout stays disabled, and GitHub Pages does not add payment or order processing. Cart data is separate on each hosting origin.
