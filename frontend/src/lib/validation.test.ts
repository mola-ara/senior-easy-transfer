import { describe, expect, it } from "vitest";
import { validateAccountNumber } from "./validation";

describe("validateAccountNumber", () => {
  it("10자리 미만이면 오류 메시지를 반환한다", () => {
    expect(validateAccountNumber("123456789")).toBe(
      "계좌번호를 10자리 이상 입력해 주세요.",
    );
  });

  it("14자리를 초과하면 오류 메시지를 반환한다", () => {
    expect(validateAccountNumber("123456789012345")).toBe(
      "계좌번호가 너무 길어요. 다시 확인해 주세요.",
    );
  });

  it("10자리에서 14자리 사이면 통과한다", () => {
    expect(validateAccountNumber("1234567890")).toBeNull();
    expect(validateAccountNumber("12345678901234")).toBeNull();
  });

  it("하이픈이 섞여 있어도 숫자만 세어 검증한다", () => {
    expect(validateAccountNumber("123-4567-8901")).toBeNull();
  });
});
