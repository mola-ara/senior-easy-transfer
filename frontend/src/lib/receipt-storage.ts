import type { TransferRecord } from "@/domain/types";

const LATEST_RECEIPT_STORAGE_KEY = "bada-latest-receipt";

export function loadLatestReceipt(): TransferRecord | null {
  const serializedReceipt = window.sessionStorage.getItem(
    LATEST_RECEIPT_STORAGE_KEY,
  );
  if (!serializedReceipt) return null;

  try {
    return JSON.parse(serializedReceipt) as TransferRecord;
  } catch {
    window.sessionStorage.removeItem(LATEST_RECEIPT_STORAGE_KEY);
    return null;
  }
}

export function saveLatestReceipt(receipt: TransferRecord): void {
  window.sessionStorage.setItem(
    LATEST_RECEIPT_STORAGE_KEY,
    JSON.stringify(receipt),
  );
}
