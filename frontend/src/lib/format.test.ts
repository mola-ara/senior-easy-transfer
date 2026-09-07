import { describe, expect, it } from "vitest";
import { formatKoreanAmount, formatWon } from "./format";

describe("formatKoreanAmount", () => {
  it("0원은 영 원으로 읽는다", () => {
    expect(formatKoreanAmount(0)).toBe("영 원");
  });

  it("한 자리 수를 읽는다", () => {
    expect(formatKoreanAmount(5)).toBe("오 원");
  });

  it("10은 일십이 아니라 십으로 읽는다", () => {
    expect(formatKoreanAmount(10)).toBe("십 원");
  });

  it("만 단위를 읽는다", () => {
    expect(formatKoreanAmount(60_000)).toBe("육만 원");
  });

  it("만 단위와 나머지를 함께 읽는다", () => {
    expect(formatKoreanAmount(123_456)).toBe("십이만삼천사백오십육 원");
  });

  it("억 단위를 읽는다", () => {
    expect(formatKoreanAmount(100_000_000)).toBe("일억 원");
  });
});

describe("formatWon", () => {
  it("천 단위 구분 기호와 원을 붙인다", () => {
    expect(formatWon(1_234_000)).toBe("1,234,000원");
  });

  it("0원도 그대로 표시한다", () => {
    expect(formatWon(0)).toBe("0원");
  });
});
