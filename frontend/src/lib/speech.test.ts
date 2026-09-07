import { describe, expect, it } from "vitest";
import { selectKoreanVoice } from "@/lib/speech";

const createVoice = (
  name: string,
  lang: string,
  localService = true,
): SpeechSynthesisVoice =>
  ({ name, lang, localService }) as SpeechSynthesisVoice;

describe("selectKoreanVoice", () => {
  it("한국어 Natural 음성을 일반 한국어 음성보다 우선한다", () => {
    const defaultVoice = createVoice("Microsoft Heami", "ko-KR");
    const naturalVoice = createVoice(
      "Microsoft SunHi Online (Natural)",
      "ko-KR",
      false,
    );

    expect(selectKoreanVoice([defaultVoice, naturalVoice])).toBe(naturalVoice);
  });

  it("Natural 음성이 없으면 사용 가능한 한국어 음성을 선택한다", () => {
    const englishVoice = createVoice("English Voice", "en-US");
    const koreanVoice = createVoice("Korean Voice", "ko-KR");

    expect(selectKoreanVoice([englishVoice, koreanVoice])).toBe(koreanVoice);
  });

  it("한국어 음성이 없으면 undefined를 반환한다", () => {
    expect(selectKoreanVoice([createVoice("English Voice", "en-US")])).toBe(
      undefined,
    );
  });
});
