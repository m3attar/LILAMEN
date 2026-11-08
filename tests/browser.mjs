import { existsSync } from "node:fs";
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  executablePath:
    process.env.BROWSER_EXECUTABLE ||
    (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
  headless: true,
  args: ["--no-sandbox"],
});
const results = [];
const errors = [];
const httpErrors = [];
let testing404 = false;
const failed = [];
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
await context.addInitScript(() => {
  Object.defineProperty(globalThis, "DisposableStack", {
    value: undefined,
    configurable: true,
    writable: true,
  });
});
const page = await context.newPage();
page.on("pageerror", (e) => errors.push(e.message));
page.on("response", (r) => {
  if (r.status() >= 400 && !r.url().includes("this-page-does-not-exist"))
    httpErrors.push({ url: r.url(), status: r.status() });
});
page.on("console", (m) => {
  if (m.type() === "error" && !testing404)
    errors.push({ text: m.text(), location: m.location() });
});
page.on("requestfailed", (r) =>
  failed.push(r.url() + ": " + r.failure()?.errorText),
);
const origin = process.env.QA_ORIGIN || "http://localhost:3000";
const site = origin + (process.env.QA_BASE_PATH || "");
const routes = [
  "/",
  "/shop/",
  "/products/berry/",
  "/products/oud/",
  "/products/blue-magic/",
  "/products/lemon/",
  "/products/papaya/",
  "/our-story/",
  "/contact/",
  "/cart/",
];
for (const route of routes) {
  const response = await page.goto(site + route, {
    waitUntil: "networkidle",
  });
  assert.equal(response.status(), 200, route);
  await page.locator("h1").waitFor();
  assert.equal(await page.locator("main").count(), 1);
  assert.equal(
    /\bLILAMEN\b/i.test(await page.locator("body").innerText()),
    false,
  );
  assert.ok((await page.title()).includes("LILIAMEN"), `brand title ${route}`);
  assert.equal(
    await page.locator('link[rel="canonical"]').getAttribute("href"),
    `https://liliamen.com${route}`,
    `canonical ${route}`,
  );
  const broken = await page
    .locator("img")
    .evaluateAll((imgs) =>
      imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src),
    );
  assert.deepEqual(broken, [], `images ${route}`);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  );
  assert.equal(overflow, false, route);
  results.push(`PASS route and images ${route}`);
}
await page.goto(site + "/");
const seo = await page.evaluate(() => ({
  canonical: document.querySelector('link[rel="canonical"]')?.href,
  openGraphUrl: document.querySelector('meta[property="og:url"]')?.content,
  openGraphSite: document.querySelector('meta[property="og:site_name"]')
    ?.content,
  structuredData: JSON.parse(
    document.querySelector('script[type="application/ld+json"]')?.textContent ||
      "null",
  ),
}));
assert.equal(seo.canonical, "https://liliamen.com/");
assert.equal(seo.openGraphUrl, "https://liliamen.com/");
assert.equal(seo.openGraphSite, "LILIAMEN");
assert.equal(seo.structuredData["@graph"][0].name, "Liliamen");
assert.equal(seo.structuredData["@graph"][0].url, "https://liliamen.com/");
assert.equal(
  seo.structuredData["@graph"][0].email,
  "Liliamen.Support@gmail.com",
);
assert.ok(
  seo.structuredData["@graph"][0].sameAs.includes(
    "https://www.instagram.com/liliamen_/",
  ),
);
const sitemapResponse = await context.request.get(origin + "/sitemap.xml");
assert.equal(sitemapResponse.status(), 200);
const sitemapText = await sitemapResponse.text();
assert.ok(sitemapText.includes("https://liliamen.com/products/berry/"));
assert.equal(/\blilamen\.com\b/i.test(sitemapText), false);
const robotsResponse = await context.request.get(origin + "/robots.txt");
assert.equal(robotsResponse.status(), 200);
assert.ok(
  (await robotsResponse.text()).includes(
    "Sitemap: https://liliamen.com/sitemap.xml",
  ),
);
results.push("PASS LILIAMEN branding, canonical metadata, sitemap, and robots");

await page.goto(site + "/shop/");
const cardPresentation = await page
  .locator(".product-card")
  .evaluateAll((cards) =>
    cards.map((card) => {
      const container = card.querySelector(".product-image");
      const image = card.querySelector(".product-image img");
      const price = card.querySelector(".pending");
      const containerBox = container.getBoundingClientRect();
      const imageBox = image.getBoundingClientRect();
      const imageStyle = getComputedStyle(image);
      return {
        sameWidth: Math.abs(containerBox.width - imageBox.width) < 1,
        sameHeight: Math.abs(containerBox.height - imageBox.height) < 1,
        objectFit: imageStyle.objectFit,
        padding: imageStyle.padding,
        priceSize: parseFloat(getComputedStyle(price).fontSize),
      };
    }),
  );
assert.equal(cardPresentation.length, 5);
assert.ok(
  cardPresentation.every(
    (card) =>
      card.sameWidth &&
      card.sameHeight &&
      card.objectFit === "cover" &&
      card.padding === "0px" &&
      card.priceSize >= 16,
  ),
);
await page.goto(site + "/products/berry/");
const detailPresentation = await page
  .locator(".detail-art img")
  .evaluate((image) => {
    const containerBox = image.parentElement.getBoundingClientRect();
    const imageBox = image.getBoundingClientRect();
    const style = getComputedStyle(image);
    return {
      sameWidth: Math.abs(containerBox.width - imageBox.width) < 1,
      sameHeight: Math.abs(containerBox.height - imageBox.height) < 1,
      objectFit: style.objectFit,
      padding: style.padding,
    };
  });
assert.deepEqual(detailPresentation, {
  sameWidth: true,
  sameHeight: true,
  objectFit: "cover",
  padding: "0px",
});
results.push("PASS full-bleed product images and readable desktop prices");

await page.goto(site + "/shop/");
const optionPrices = [
  ["Single Cube", "$3.99", 1],
  ["3-Cube Package", "$9.99", 3],
  ["5-Cube Package", "$14.99", 5],
  ["9-Cube Package", "$21.99", 9],
];
for (const [name, price, cubes] of optionPrices) {
  const option = page.getByRole("radio", { name: new RegExp(name) });
  await option.click();
  assert.ok((await option.textContent()).includes(price));
  for (let index = 0; index < cubes; index++) {
    await page.getByRole("button", { name: "Increase Lemon" }).click();
  }
  assert.equal(
    await page
      .getByRole("button", { name: "Add selection to bag" })
      .isDisabled(),
    false,
  );
  assert.equal(
    await page.getByRole("button", { name: "Increase Berry" }).isDisabled(),
    true,
  );
}
results.push("PASS all four options, prices, exact counts, and maximum limits");

await page.getByRole("radio", { name: /3-Cube Package/ }).click();
const addSelection = page.getByRole("button", {
  name: /Choose .* more|Add selection to bag/,
});
assert.equal(await addSelection.isDisabled(), true);
await page.getByRole("button", { name: "Increase Berry" }).click();
await page.getByRole("button", { name: "Increase Berry" }).click();
await page.getByRole("button", { name: "Increase Oud" }).click();
assert.equal(
  await page.getByText("3 / 3 cubes", { exact: true }).isVisible(),
  true,
);
assert.equal(
  await page.getByRole("button", { name: "Increase Lemon" }).isDisabled(),
  true,
);
await page.getByRole("button", { name: "Add selection to bag" }).click();
await page.getByRole("link", { name: "View bag" }).click();
await page.getByRole("heading", { name: "3-Cube Package" }).waitFor();
assert.ok(await page.getByText("2 Berry · 1 Oud").isVisible());
assert.equal(
  await page
    .getByRole("spinbutton", { name: "3-Cube Package quantity" })
    .inputValue(),
  "1",
);
await page
  .getByRole("button", { name: "Increase 3-Cube Package quantity" })
  .click();
assert.equal(
  await page
    .getByRole("spinbutton", { name: "3-Cube Package quantity" })
    .inputValue(),
  "2",
);
await page.reload();
assert.equal(
  await page
    .getByRole("spinbutton", { name: "3-Cube Package quantity" })
    .inputValue(),
  "2",
);
await page
  .getByRole("spinbutton", { name: "3-Cube Package quantity" })
  .fill("999");
await page.getByRole("spinbutton", { name: "3-Cube Package quantity" }).blur();
assert.equal(
  await page
    .getByRole("spinbutton", { name: "3-Cube Package quantity" })
    .inputValue(),
  "99",
);
assert.equal(
  await page.getByRole("button", { name: "Checkout unavailable" }).isDisabled(),
  true,
);
assert.ok(await page.getByText("$989.01", { exact: true }).isVisible());
await page.getByRole("button", { name: "Remove 3-Cube Package" }).click();
await page.getByRole("heading", { name: "A little empty, for now." }).waitFor();
await page.reload();
await page.getByRole("heading", { name: "A little empty, for now." }).waitFor();
results.push(
  "PASS mixed package add / update / cap / persistence / pricing / remove",
);
await page.evaluate(() => localStorage.setItem("lilamen.cart.v2", "{bad json"));
await page.reload();
await page.getByRole("heading", { name: "A little empty, for now." }).waitFor();
results.push("PASS corrupted localStorage recovery");
await page.evaluate(() =>
  localStorage.setItem(
    "lilamen.cart.v2",
    JSON.stringify([
      { optionId: "missing", scents: { berry: 1 }, quantity: 3 },
      {
        id: "single-test",
        optionId: "single",
        scents: { berry: 1 },
        quantity: -8,
      },
    ]),
  ),
);
await page.reload();
assert.equal(
  await page
    .getByRole("spinbutton", { name: "Single Cube quantity" })
    .inputValue(),
  "1",
);
results.push("PASS invalid package and quantity recovery");

await page.goto(site + "/contact/");
const instagramLinks = page.locator(
  'a[href="https://www.instagram.com/liliamen_/"]',
);
assert.equal(await instagramLinks.count(), 2);
for (const instagramLink of await instagramLinks.all()) {
  assert.equal(await instagramLink.getAttribute("target"), "_blank");
  assert.equal(await instagramLink.getAttribute("rel"), "noreferrer");
}
assert.equal(
  await page
    .getByRole("link", { name: "Liliamen.Support@gmail.com" })
    .first()
    .getAttribute("href"),
  "mailto:Liliamen.Support@gmail.com",
);
const contactForm = page.locator("form.contact-form");
assert.equal(
  await contactForm.getAttribute("action"),
  "https://api.web3forms.com/submit",
);
assert.equal(await contactForm.getAttribute("method"), "POST");
assert.equal(
  await page.getByLabel(/Customer email/).getAttribute("name"),
  "email",
);
await page.getByRole("button", { name: "Send message" }).click();
assert.ok(
  await page.getByText("Please enter your email so we can reply.").isVisible(),
);
await page.getByLabel(/Customer name/).fill("Test Customer");
await page.getByLabel(/Customer email/).fill("not-an-email");
await page.getByLabel(/^Message/).fill("A test message");
await page.getByRole("button", { name: "Send message" }).click();
assert.ok(
  await page.getByText("Please enter a valid email address.").isVisible(),
);
results.push("PASS contact native POST wiring, Reply-To field, and validation");
const links = new Set();
for (const route of routes) {
  await page.goto(site + route);
  for (const href of await page
    .locator("a[href]")
    .evaluateAll((links) => links.map((a) => a.getAttribute("href")))) {
    if (href.startsWith("/") && !href.startsWith("//")) links.add(href);
  }
}
for (const href of links) {
  const response = await context.request.get(origin + href);
  assert.equal(response.status(), 200, href);
}
results.push(`PASS all ${links.size} internal link targets`);
await page.goto(site + "/");
await page.screenshot({ path: "work/desktop.png", fullPage: true });
for (const viewport of [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
]) {
  await page.setViewportSize(viewport);
  for (const route of routes) {
    await page.goto(site + route);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `overflow ${viewport.width} ${route}`,
    );
  }
  await page.goto(site + "/");
  await page.screenshot({
    path: `work/layout-${viewport.width}.png`,
    fullPage: true,
  });
  if (viewport.width === 390) {
    await page.goto(site + "/shop/");
    const mobilePrices = await page
      .locator(".product-card .pending")
      .evaluateAll((prices) =>
        prices.map((price) => parseFloat(getComputedStyle(price).fontSize)),
      );
    assert.ok(mobilePrices.every((size) => size >= 15));
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    results.push("PASS readable mobile prices without overlap");
    await page.goto(site + "/");
    await page.getByRole("button", { name: "Toggle navigation" }).click();
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Shop all" })
      .click();
    await page.waitForURL("**/shop/");
  }
  results.push(
    `PASS responsive routes at ${viewport.width}×${viewport.height}`,
  );
}
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(site + "/");
await page.keyboard.press("Tab");
assert.equal(
  await page.evaluate(() => document.activeElement.textContent),
  "Skip to content",
);
await page.keyboard.press("Enter");
assert.equal(await page.evaluate(() => location.hash), "#main");
results.push("PASS keyboard skip navigation");
const before404 = errors.length;
testing404 = true;
const response404 = await page.goto(site + "/this-page-does-not-exist/");
assert.equal(response404.status(), 404);
await page
  .getByRole("heading", { name: "This scent trail ends here." })
  .waitFor();
errors.splice(before404);
results.push("PASS custom 404");
assert.equal(
  await page.evaluate(() => typeof globalThis.DisposableStack),
  "undefined",
);
assert.deepEqual(errors, []);
assert.deepEqual(failed, []);
assert.deepEqual(httpErrors, []);
results.push(
  "PASS no application console errors or failed requests with DisposableStack unavailable",
);
console.log(
  JSON.stringify(
    { browser: await browser.version(), results, errors, failed },
    null,
    2,
  ),
);
await browser.close();
