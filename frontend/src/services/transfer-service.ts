import { primaryAccount, recipients, initialHistory } from "@/mocks/data";
import { logTransferAttempt } from "./transfer-audit-log";
import type {
  Account,
  Recipient,
  RiskFlag,
  TransferMode,
  TransferRecord,
} from "@/domain/types";

let history: TransferRecord[] = [...initialHistory];

export async function getPrimaryAccount(): Promise<Account> {
  return primaryAccount;
}

export async function getRecipients(
  filter?: "favorite" | "recent",
): Promise<Recipient[]> {
  if (filter === "favorite")
    return recipients.filter((recipient) => recipient.isFavorite);
  if (filter === "recent")
    return recipients.filter((recipient) => recipient.isRecent);
  return recipients;
}

export function calculateRisks(
  recipient: Recipient,
  amount: number,
): RiskFlag[] {
  const risks: RiskFlag[] = [];
  if (!recipient.isFavorite && !recipient.isRecent)
    risks.push("first-recipient");
  if (amount >= 500_000) risks.push("large-amount");
  return risks;
}

export async function submitTransfer(
  mode: TransferMode,
  recipient: Recipient,
  amount: number,
): Promise<TransferRecord> {
  // submitTransfer는 아직 실패 경로가 없어 result가 항상 "success"다.
  // 실패·대기 상태가 생기면 이 지점에서 감사 로그의 result를 분기한다.
  logTransferAttempt({
    recipientId: recipient.id,
    amount,
    mode,
    risks: calculateRisks(recipient, amount),
    result: "success",
  });

  const record: TransferRecord = {
    id: `TR-${Date.now()}`,
    recipient,
    amount,
    mode,
    status: "completed",
    transferredAt: new Date().toISOString(),
  };
  history = [record, ...history];
  return record;
}

export async function getHistory(): Promise<TransferRecord[]> {
  return history;
}
