import { chromium } from "playwright-core";

/** @typedef {{ text: string, lang: string, rate: number, pitch: number, voice: string | null }} SpeechCall */

const baseUrl = process.env.ANSIM_BASE_URL ?? "http://127.0.0.1:3100";
const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();

await page.addInitScript(() => {
  /** @type {SpeechCall[]} */
  window.__speechCalls = [];
  const originalSpeak = window.speechSynthesis.speak.bind(
    window.speechSynthesis,
  );
  window.speechSynthesis.speak = (utterance) => {
    window.__speechCalls.push({
      text: utterance.text,
      lang: utterance.lang,
      rate: utterance.rate,
      pitch: utterance.pitch,
      voice: utterance.voice?.name ?? null,
    });

    if (navigator.userActivation.isActive) originalSpeak(utterance);
  };
});

await page.goto(baseUrl);
await page.evaluate(() => {
  localStorage.removeItem("bada-home-tour-completed");
  localStorage.removeItem("bada-accessibility");
});
await page.reload();
await page.getByRole("dialog").waitFor();
await page.waitForTimeout(500);

const automaticCalls = await page.evaluate(() => window.__speechCalls);
await page.getByRole("button", { name: "음성 안내 시작" }).click();
const callsAfterTouch = await page.evaluate(() => window.__speechCalls);
const availableKoreanVoices = await page.evaluate(() =>
  window.speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang.toLowerCase().startsWith("ko"))
    .map((voice) => voice.name),
);

console.log(
  JSON.stringify(
    { automaticCalls, callsAfterTouch, availableKoreanVoices },
    null,
    2,
  ),
);

await browser.close();
