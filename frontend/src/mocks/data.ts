import type { Account, Recipient, TransferRecord } from "@/domain/types";

export const primaryAccount: Account = {
  id: "account-1",
  bankName: "바다은행",
  accountNumber: "110-245-****",
  nickname: "생활비 통장",
  balance: 2_450_000,
};

export const recipients: Recipient[] = [
  {
    id: "recipient-1",
    name: "김영희",
    bankName: "햇살은행",
    accountNumber: "123-****-7890",
    isFavorite: true,
    isRecent: true,
    avatarColor: "#E8F3EE",
  },
  {
    id: "recipient-2",
    name: "박민수",
    bankName: "푸른은행",
    accountNumber: "456-****-2109",
    isFavorite: true,
    isRecent: true,
    avatarColor: "#FFF0DD",
  },
  {
    id: "recipient-3",
    name: "이정자",
    bankName: "마음은행",
    accountNumber: "789-****-3456",
    isFavorite: false,
    isRecent: true,
    avatarColor: "#E9EDFF",
  },
];

export const initialHistory: TransferRecord[] = [
  {
    id: "TR-20260901-001",
    recipient: recipients[0],
    amount: 120_000,
    mode: "real",
    status: "completed",
    transferredAt: "2026-09-01T10:30:00+09:00",
  },
  {
    id: "TR-20260828-002",
    recipient: recipients[1],
    amount: 50_000,
    mode: "practice",
    status: "completed",
    transferredAt: "2026-08-28T14:10:00+09:00",
  },
];
