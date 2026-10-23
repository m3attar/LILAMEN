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
await page.goto(site + "/products/oud/");
await page.getByRole("button", { name: "Add to bag" }).click();
await page.getByRole("link", { name: "View bag" }).click();
await page.getByRole("heading", { name: "Oud", exact: true }).waitFor();
assert.equal(
  await page.getByRole("spinbutton", { name: "Oud quantity" }).inputValue(),
  "1",
);
await page.getByRole("button", { name: "Increase Oud quantity" }).click();
assert.equal(
  await page.getByRole("spinbutton", { name: "Oud quantity" }).inputValue(),
  "2",
);
await page.reload();
assert.equal(
  await page.getByRole("spinbutton", { name: "Oud quantity" }).inputValue(),
  "2",
);
await page.getByRole("spinbutton", { name: "Oud quantity" }).fill("999");
await page.getByRole("spinbutton", { name: "Oud quantity" }).blur();
assert.equal(
  await page.getByRole("spinbutton", { name: "Oud quantity" }).inputValue(),
  "99",
);
assert.equal(
  await page.getByRole("button", { name: "Checkout unavailable" }).isDisabled(),
  true,
);
assert.ok(await page.getByText("Pending prices", { exact: true }).isVisible());
await page.getByRole("button", { name: "Remove Oud" }).click();
await page.getByRole("heading", { name: "A little empty, for now." }).waitFor();
await page.reload();
await page.getByRole("heading", { name: "A little empty, for now." }).waitFor();
results.push(
  "PASS add / update / cap / reload persistence / disabled checkout / remove / empty persistence",
);
await page.evaluate(() => localStorage.setItem("lilamen.cart.v1", "{bad json"));
await page.reload();
await page.getByRole("heading", { name: "A little empty, for now." }).waitFor();
results.push("PASS corrupted localStorage recovery");
await page.evaluate(() =>
  localStorage.setItem(
    "lilamen.cart.v1",
    JSON.stringify([
      { slug: "missing", quantity: 3 },
      { slug: "berry", quantity: -8 },
    ]),
  ),
);
await page.reload();
assert.equal(
  await page.getByRole("spinbutton", { name: "Berry quantity" }).inputValue(),
  "1",
);
results.push("PASS missing product and invalid quantity recovery");
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
