export type TransferMode = "practice" | "real";

export type RiskFlag = "first-recipient" | "large-amount";

export interface Account {
  id: string;
  bankName: string;
  accountNumber: string;
  nickname: string;
  balance: number;
}

export interface Recipient {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  isFavorite: boolean;
  isRecent: boolean;
  avatarColor: string;
}

export interface TransferDraft {
  mode: TransferMode;
  recipient: Recipient | null;
  amount: number;
  risks: RiskFlag[];
  safetyConfirmed: boolean;
}

export interface TransferRecord {
  id: string;
  recipient: Recipient;
  amount: number;
  mode: TransferMode;
  status: "completed";
  transferredAt: string;
}

export interface AccessibilitySettings {
  largeText: boolean;
  voiceGuide: boolean;
}
