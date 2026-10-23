# LILAMEN verification

Verified on October 21, 2026, using Node 24.19.0, npm 11.9.0, Next.js 15.5.28, React 19.1.10 and Chromium 154.0.8037.57.

| Check                       | Actual result                                          |
| --------------------------- | ------------------------------------------------------ |
| Dependency installation     | npm install completed; package-lock.json committed     |
| TypeScript                  | npm run typecheck passed                               |
| ESLint                      | npm run lint passed, no warnings                       |
| Unit tests                  | npm test: 5 passed, 0 failed                           |
| Production build            | npm run build passed; all five product paths generated |
| Development server          | Started successfully; homepage HTTP 200 on port 3001   |
| Production browser checks   | npm run test:browser passed all 20 check groups        |
| Production dependency audit | npm audit --omit=dev: 0 vulnerabilities reported       |

Browser checks ran against the actual production export served locally, rather than screenshots or mocked React components. The development server was also started and checked independently. All ten requested non-error routes returned HTTP 200; the custom missing-page route returned HTTP 404. All ten distinct internal link targets returned HTTP 200. No broken images, unexpected HTTP errors, request failures, or application console errors were found. The intentionally missing URL's expected HTTP 404 console message is excluded from the error assertion.

Cart interactions verified: add Oud from its product page; navigate to the bag; increment; refresh and retain quantity; cap excessive quantity at 99; verify checkout is disabled and subtotal is pending; remove; refresh and retain the empty state. Invalid stored JSON, an unknown product and a negative saved quantity were also tested. Unit tests additionally cover duplicate merges, non-finite and fractional quantities, missing data and unconfirmed prices.

All ten routes were checked for horizontal overflow at 1440×1000, 390×844, 768×1024 and 1024×768. Full-page home screenshots were captured and reviewed. Mobile menu navigation and keyboard skip navigation passed. These are Chromium viewport tests, not physical iPhone or iPad tests.

## DisposableStack investigation

The reported error was **not reproduced**. Browser QA explicitly makes `globalThis.DisposableStack` unavailable before any page script executes, then runs the routes and cart interactions. No resulting application error occurred.

Searches found no `DisposableStack` reference in application source, Next.js client code, React, React DOM or any shipped production JavaScript bundle. Installed references were limited to Next.js's build-time Babel bundle (transform/polyfill metadata), ESLint's global definitions and TypeScript ESLint's library definitions. Their presence alone does not show execution or establish an error source.

The original failing page, stack trace and preview runtime were not supplied. Evidence therefore does not establish whether that original error came from a different application, dependency version, or preview environment. No polyfill was added. Direct iPad Safari and preview-host internals were not available for testing here.

The interface uses ordinary React state, localStorage with guarded reads/writes, and standard DOM events. The supplied product PNGs and inline SVG arrow icons avoid remote font and special-glyph dependencies. Tailwind 4's supported Safari baseline is Safari 16.4; test the actual iPadOS/Safari versions intended for support before launch.

## Remaining launch work

Confirm all prices, product specifications, images, ingredients, safety/use instructions and stock availability. Provide an official support channel. Implement and verify server-authoritative pricing, a payment provider, signed payment webhooks, order records, inventory, shipping, taxes, fulfillment and transactional emails. Approve privacy, terms, return policies and public hosting access. Run direct Safari/iPad and complete checkout/refund testing.

No real order, payment, inventory or shipping integration exists in this prototype. No payment or contact details are collected. Checkout remains disabled even if a catalog price is later edited.

## Product-image update and GitHub preparation

The current image update passed TypeScript, ESLint (no warnings), all five unit tests, and the production build again before GitHub preparation. All five 1254 × 1254 public PNGs match the previously verified ZIP extraction byte-for-byte, including the confirmed Lemon/Berry filename swap.

The homepage, shop, all five detail pages, related-product sections and cart consistently reference the mapped PNGs. `object-fit: contain` and automatic image height preserve proportions. The original images have not been recolored or recompressed. The existing Chromium browser suite passed all 20 check groups again before this commit, including routes, images, responsive layouts, keyboard skip navigation, cart persistence and the custom 404. Direct iPad Safari testing remains unverified.

The separate private image-review Site remains available for device review; the original published Site has not been replaced. The GitHub task changes source control only and does not deploy either Site. Product prices, descriptions and disabled checkout behavior are unchanged. Installed dependencies (`node_modules`), build output, scratch files, `.env` files and credentials are excluded from the commit. Existing tests and configuration are retained in the earlier storefront commit in the same history.
