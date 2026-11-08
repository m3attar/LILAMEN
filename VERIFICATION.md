# LILIAMEN verification

Verified on November 7, 2026, using Next.js 15.5.28, React 19.1.10 and Chromium 156.0.8078.4.

| Check                       | Actual result                                          |
| --------------------------- | ------------------------------------------------------ |
| Dependency installation     | npm install completed; package-lock.json committed     |
| TypeScript                  | npm run typecheck passed                               |
| ESLint                      | npm run lint passed, no warnings                       |
| Unit tests                  | npm test: 6 passed, 0 failed                           |
| Production build            | npm run build passed; all five product paths generated |
| Development server          | Started successfully; homepage HTTP 200 on port 3001   |
| Production browser checks   | npm run test:browser passed all 22 check groups        |
| Production dependency audit | npm audit --omit=dev: 0 vulnerabilities reported       |

Browser checks ran against the actual production export served locally, rather than screenshots or mocked React components. The development server was also started and checked independently. All ten requested non-error routes returned HTTP 200; the custom missing-page route returned HTTP 404. All ten distinct internal link targets returned HTTP 200. No broken images, unexpected HTTP errors, request failures, or application console errors were found. The intentionally missing URL's expected HTTP 404 console message is excluded from the error assertion.

Purchase interactions verified all four package sizes and prices, exact-count enforcement, maximum limits, a mixed 2 Berry + 1 Oud package, subtotal calculation, line-quantity updates, persistence, removal, and invalid-storage recovery. Contact required fields and email-format validation were also browser-tested.

All ten routes were checked for horizontal overflow at 1440×1000, 390×844, 768×1024 and 1024×768. Full-page home screenshots were captured and reviewed. Mobile menu navigation and keyboard skip navigation passed. These are Chromium viewport tests, not physical iPhone or iPad tests.

## DisposableStack investigation

The reported error was **not reproduced**. Browser QA explicitly makes `globalThis.DisposableStack` unavailable before any page script executes, then runs the routes and cart interactions. No resulting application error occurred.

Searches found no `DisposableStack` reference in application source, Next.js client code, React, React DOM or any shipped production JavaScript bundle. Installed references were limited to Next.js's build-time Babel bundle (transform/polyfill metadata), ESLint's global definitions and TypeScript ESLint's library definitions. Their presence alone does not show execution or establish an error source.

The original failing page, stack trace and preview runtime were not supplied. Evidence therefore does not establish whether that original error came from a different application, dependency version, or preview environment. No polyfill was added. Direct iPad Safari and preview-host internals were not available for testing here.

The interface uses ordinary React state, localStorage with guarded reads/writes, and standard DOM events. The supplied product PNGs and inline SVG arrow icons avoid remote font and special-glyph dependencies. Tailwind 4's supported Safari baseline is Safari 16.4; test the actual iPadOS/Safari versions intended for support before launch.

## Remaining launch work

Confirm product specifications, ingredients, safety/use instructions and stock availability. Add the Web3Forms access key for `Liliamen.Support@gmail.com` as the `WEB3FORMS_ACCESS_KEY` GitHub Actions repository variable. Implement and verify server-authoritative pricing, a payment provider, signed payment webhooks, order records, inventory, shipping, taxes, fulfillment and transactional emails. Approve privacy, terms, return policies and public hosting access. Run direct Safari/iPad and complete checkout/refund testing.

No real order, payment, inventory or shipping integration exists in this prototype. The contact form sends the submitted name, reply email and message through Web3Forms after its public access key is configured. Checkout remains disabled.

## Contact delivery investigation

The former FormSubmit AJAX request was reproduced against production. Chrome reported that the response lacked `Access-Control-Allow-Origin`, failed the request with `net::ERR_FAILED`, and the UI surfaced the raw `Failed to fetch` message. Direct OPTIONS and POST checks also received Cloudflare HTTP 522 from FormSubmit. A native HTML POST avoids CORS but still received the same 522, so the service was replaced rather than masking the browser error.

Web3Forms' official documentation specifies a native `POST https://api.web3forms.com/submit` integration and states that an input named `email` becomes Reply-To by default. Although it also documents JSON fetch support, a live preflight check from `https://liliamen.com` was rejected without an allow-origin header. The implementation therefore uses the documented URL-encoded browser form submission, which does not require CORS. Success is shown locally only after Web3Forms accepts the submission and redirects to `/contact/?sent=1`.

## Product-image update and GitHub preparation

The current image update passed TypeScript, ESLint (no warnings), all five unit tests, and the production build again before GitHub preparation. All five 1254 × 1254 public PNGs match the previously verified ZIP extraction byte-for-byte, including the confirmed Lemon/Berry filename swap.

The homepage, shop, all five detail pages, related-product sections and cart consistently reference the mapped PNGs. `object-fit: contain` and automatic image height preserve proportions. The original images have not been recolored or recompressed. The existing Chromium browser suite passed all 20 check groups again before this commit, including routes, images, responsive layouts, keyboard skip navigation, cart persistence and the custom 404. Direct iPad Safari testing remains unverified.

The separate private image-review Site remains available for device review; the original published Site has not been replaced. The GitHub task changes source control only and does not deploy either Site. Product prices, descriptions and disabled checkout behavior are unchanged. Installed dependencies (`node_modules`), build output, scratch files, `.env` files and credentials are excluded from the commit. Existing tests and configuration are retained in the earlier storefront commit in the same history.

## GitHub Pages compatibility

The static export was built and browser-tested at the root path used by `https://liliamen.com/`. All 22 Chromium browser-check groups passed. TypeScript, ESLint and all six unit tests passed. Root-relative Next.js navigation, framework assets, product PNGs, nested product routes, custom 404 links and the persistent client-side cart were checked.

The Pages workflow uploads only `out/`; it does not expose source files, `.env` files, installed dependencies or credentials. The public base path is build configuration, not a secret. GitHub Pages remains a storefront prototype with checkout disabled. Actual deployment status must be verified in GitHub Actions; local compatibility tests alone do not establish a live public URL. No ChatGPT-hosted Site is deployed or reconfigured by this workflow.
