import { chromium } from "playwright-core";

const baseUrl = process.env.BADA_BASE_URL ?? "http://127.0.0.1:3100";
const chromePath =
  process.env.CHROME_PATH ??
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
});
const page = await context.newPage();

async function beginTransfer() {
  await page.goto(baseUrl);
  await page.evaluate(() =>
    localStorage.setItem("bada-home-tour-completed", "true"),
  );
  await page.reload();
  await page.getByRole("link", { name: /연습 송금/ }).click();
  await page.getByRole("button", { name: "연습 시작하기" }).click();
}

async function selectRecipient(name) {
  await page.getByRole("button", { name: new RegExp(name) }).click();
  await page.getByRole("button", { name: "예, 맞아요" }).click();
}

try {
  await beginTransfer();
  await selectRecipient("김영희");
  await page.getByLabel("보낼 금액").fill("499000");
  await page.getByRole("button", { name: "이 금액으로 보낼게요" }).click();
  await page.waitForURL("**/transfer/review");
  assert(
    !page.url().includes("/safety"),
    "499,000원은 큰 금액 확인 대상이 아니어야 합니다.",
  );

  await page.getByRole("link", { name: "받는 분 다시 선택" }).click();
  await selectRecipient("박민수");
  assert(
    (await page.getByLabel("보낼 금액").inputValue()) === "",
    "수취인 변경 후 금액이 초기화되어야 합니다.",
  );

  await page.getByLabel("보낼 금액").fill("500000");
  await page.getByRole("button", { name: "이 금액으로 보낼게요" }).click();
  await page.waitForURL("**/transfer/safety");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "모두 확인했어요" }).click();
  await page.getByLabel(/박민수 님이 맞아요/).check();
  await page.getByRole("button", { name: /연습 송금 보내기/ }).click();
  await page.getByRole("button", { name: "예, 보낼게요" }).click();
  await page.waitForURL("**/transfer/complete");
  await page.reload();
  await page.getByRole("heading", { name: "성공했어요!" }).waitFor();

  await page.goto(`${baseUrl}/settings/accessibility`);
  await page.getByRole("switch", { name: "글자를 크게 표시" }).click();
  assert(
    await page
      .locator(".app")
      .evaluate((element) => element.classList.contains("large-text")),
    "큰 글씨 클래스가 적용되어야 합니다.",
  );
  await page.getByRole("radio", { name: /일반 금융 앱처럼 사용/ }).focus();
  await page.keyboard.press("ArrowUp");
  assert(
    await page.getByRole("radio", { name: /필요한 내용만 설명/ }).isChecked(),
    "안내 수준은 키보드로 선택할 수 있어야 합니다.",
  );

  console.log("v1.0 E2E baseline passed");
} finally {
  await browser.close();
}
