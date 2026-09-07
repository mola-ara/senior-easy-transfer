import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.ANSIM_BASE_URL ?? "http://127.0.0.1:3100";
const outputDir = "ui-audit-mobile";
await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();
const results = [];

async function capture(name) {
  await page.screenshot({ path: `${outputDir}/${name}.png`, fullPage: false });
  const metrics = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    height: document.documentElement.clientHeight,
    scrollHeight: document.documentElement.scrollHeight,
    scrollX: window.scrollX,
    offenders: Array.from(document.querySelectorAll("body *"))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName,
          className: element.className?.toString().slice(0, 80),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        };
      })
      .filter((item) => item.left < -1 || item.right > window.innerWidth + 1)
      .slice(0, 8),
  }));
  results.push({
    name,
    ...metrics,
    horizontalOverflow: metrics.scrollWidth > metrics.width,
  });
}

await page.goto(baseUrl);
await page.evaluate(() =>
  localStorage.setItem("bada-home-tour-completed", "true"),
);
await page.reload();
await capture("home");
for (const [name, path] of [
  ["practice", "/practice"],
  ["recipient", "/transfer/recipient"],
  ["account", "/transfer/account"],
  ["history", "/history"],
  ["favorites", "/favorites"],
  ["accessibility", "/settings/accessibility"],
  ["setup", "/setup"],
]) {
  await page.goto(`${baseUrl}${path}`);
  await capture(name);
}

await page.goto(`${baseUrl}/practice`);
await page.getByRole("button", { name: "연습 시작하기" }).click();
await page.getByRole("button", { name: /김영희/ }).click();
await page.getByRole("button", { name: "예, 맞아요" }).click();
await page.locator(".amount-input").fill("60000");
await capture("amount");
await page.getByRole("button", { name: "이 금액으로 보낼게요" }).click();
await capture("review");
await page.getByLabel(/김영희 님이 맞아요/).check();
await page.getByRole("button", { name: /송금 보내기/ }).click();
await capture("send-confirm");
await page.getByRole("button", { name: "예, 보낼게요" }).click();
await page.waitForURL("**/transfer/complete");
await capture("complete");

await page.goto(baseUrl);
await page.evaluate(() => {
  localStorage.setItem(
    "bada-accessibility",
    JSON.stringify({ largeText: true, voiceGuide: false }),
  );
  localStorage.removeItem("bada-home-tour-completed");
});
await page.reload();
await capture("tour-large-welcome");
for (let index = 1; index <= 4; index += 1) {
  await page.getByRole("button", { name: "이해했어요" }).click();
  await capture(`tour-large-${index}`);
}
console.log(JSON.stringify(results, null, 2));
await browser.close();
