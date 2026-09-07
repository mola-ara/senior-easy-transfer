import { describe, expect, it } from "vitest";
import { calculateRisks, getHistory, getRecipients, submitTransfer } from "./transfer-service";
import { getTransferAuditLog } from "./transfer-audit-log";
import type { Recipient } from "@/domain/types";

const favoriteRecipient: Recipient = {
  id: "recipient-favorite",
  name: "김영희",
  bankName: "햇살은행",
  accountNumber: "123-****-7890",
  isFavorite: true,
  isRecent: false,
  avatarColor: "#E8F3EE",
};

const strangerRecipient: Recipient = {
  id: "recipient-stranger",
  name: "홍길동",
  bankName: "마음은행",
  accountNumber: "789-****-3456",
  isFavorite: false,
  isRecent: false,
  avatarColor: "#E9EDFF",
};

describe("calculateRisks", () => {
  it("즐겨찾기·최근 대상이 아니면 first-recipient 위험을 표시한다", () => {
    expect(calculateRisks(strangerRecipient, 10_000)).toEqual([
      "first-recipient",
    ]);
  });

  it("즐겨찾기 대상이면 first-recipient 위험을 표시하지 않는다", () => {
    expect(calculateRisks(favoriteRecipient, 10_000)).toEqual([]);
  });

  it("50만 원 이상이면 large-amount 위험을 표시한다", () => {
    expect(calculateRisks(favoriteRecipient, 500_000)).toEqual([
      "large-amount",
    ]);
  });

  it("49만 9천 원까지는 large-amount 위험을 표시하지 않는다", () => {
    expect(calculateRisks(favoriteRecipient, 499_000)).toEqual([]);
  });

  it("처음 보내는 대상에게 큰 금액을 보내면 두 위험을 모두 표시한다", () => {
    expect(calculateRisks(strangerRecipient, 500_000)).toEqual([
      "first-recipient",
      "large-amount",
    ]);
  });
});

describe("getRecipients", () => {
  it("filter 없이 호출하면 전체 목록을 반환한다", async () => {
    const recipients = await getRecipients();
    expect(recipients.length).toBeGreaterThan(0);
  });

  it("favorite 필터는 즐겨찾기 대상만 반환한다", async () => {
    const recipients = await getRecipients("favorite");
    expect(recipients.every((recipient) => recipient.isFavorite)).toBe(true);
  });

  it("recent 필터는 최근 송금 대상만 반환한다", async () => {
    const recipients = await getRecipients("recent");
    expect(recipients.every((recipient) => recipient.isRecent)).toBe(true);
  });
});

describe("submitTransfer", () => {
  it("완료 상태의 거래 기록을 만들고 내역 맨 앞에 추가한다", async () => {
    const before = await getHistory();

    const record = await submitTransfer("practice", favoriteRecipient, 30_000);

    expect(record.status).toBe("completed");
    expect(record.amount).toBe(30_000);
    expect(record.recipient).toEqual(favoriteRecipient);

    const after = await getHistory();
    expect(after.length).toBe(before.length + 1);
    expect(after[0]).toEqual(record);
  });

  it("성공 시도를 위험 신호와 함께 감사 로그에 남긴다", async () => {
    const auditBefore = getTransferAuditLog().length;

    await submitTransfer("real", favoriteRecipient, 500_000);

    const auditAfter = getTransferAuditLog();
    expect(auditAfter.length).toBe(auditBefore + 1);
    expect(auditAfter[0]).toMatchObject({
      recipientId: favoriteRecipient.id,
      amount: 500_000,
      mode: "real",
      risks: ["large-amount"],
      result: "success",
    });
  });
});
