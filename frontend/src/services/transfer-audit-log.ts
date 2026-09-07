import type { RiskFlag, TransferMode } from "@/domain/types";

export interface TransferAuditEntry {
  id: string;
  recipientId: string;
  amount: number;
  mode: TransferMode;
  risks: RiskFlag[];
  result: "success";
  attemptedAt: string;
}

let auditLog: TransferAuditEntry[] = [];

export function logTransferAttempt(
  entry: Omit<TransferAuditEntry, "id" | "attemptedAt">,
): TransferAuditEntry {
  const record: TransferAuditEntry = {
    ...entry,
    id: `AUDIT-${Date.now()}-${auditLog.length}`,
    attemptedAt: new Date().toISOString(),
  };
  auditLog = [record, ...auditLog];
  return record;
}

export function getTransferAuditLog(): TransferAuditEntry[] {
  return auditLog;
}
