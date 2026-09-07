import { describe, expect, it } from "vitest";
import { getTransferAuditLog, logTransferAttempt } from "./transfer-audit-log";

describe("logTransferAttempt", () => {
  it("id와 시각을 채운 감사 기록을 만들어 반환한다", () => {
    const entry = logTransferAttempt({
      recipientId: "recipient-1",
      amount: 10_000,
      mode: "practice",
      risks: [],
      result: "success",
    });

    expect(entry.id).toBeTruthy();
    expect(entry.attemptedAt).toBeTruthy();
    expect(entry.recipientId).toBe("recipient-1");
  });

  it("기록을 최신순으로 누적한다", () => {
    const before = getTransferAuditLog().length;

    const first = logTransferAttempt({
      recipientId: "recipient-1",
      amount: 10_000,
      mode: "practice",
      risks: [],
      result: "success",
    });
    const second = logTransferAttempt({
      recipientId: "recipient-2",
      amount: 600_000,
      mode: "real",
      risks: ["large-amount"],
      result: "success",
    });

    const log = getTransferAuditLog();
    expect(log.length).toBe(before + 2);
    expect(log[0]).toEqual(second);
    expect(log[1]).toEqual(first);
  });
});
