"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Header, Page, Step } from "@/components/ui";
import { formatWon } from "@/lib/format";
import { saveLatestReceipt } from "@/lib/receipt-storage";
import { submitTransfer } from "@/services/transfer-service";
import { useAppStore } from "@/store/app-store";

export default function ReviewPage() {
  const router = useRouter();
  const { draft, setReceipt } = useAppStore();
  const [isRecipientChecked, setIsRecipientChecked] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!draft.recipient || draft.amount <= 0)
      router.replace("/transfer/recipient");
  }, [draft.recipient, draft.amount, router]);

  if (!draft.recipient || draft.amount <= 0) return null;
  const recipient = draft.recipient;

  const handleSend = async () => {
    const record = await submitTransfer(draft.mode, recipient, draft.amount);
    saveLatestReceipt(record);
    setReceipt(record);
    router.replace("/transfer/complete");
  };

  const handleRecipientCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsRecipientChecked(event.target.checked);
  };

  const handleOpenConfirmation = () => setIsConfirmOpen(true);
  const handleCloseConfirmation = () => setIsConfirmOpen(false);

  return (
    <>
      <Header backHref="/transfer/amount" title="최종 확인" cancel />
      <Page>
        <Step current={4} />
        <h1>
          이대로
          <br />
          보내드릴까요?
        </h1>
        <div className="big-summary">
          <span className="to">받는 분</span>
          <strong className="name">{recipient.name} 님</strong>
          <span className="to">
            {recipient.bankName} · {recipient.accountNumber}
          </span>
          <strong className="money">{formatWon(draft.amount)}</strong>
        </div>
        <div className="edit-links">
          <a href="/transfer/recipient">받는 분 다시 선택</a>
          <a href="/transfer/amount">금액 다시 입력</a>
        </div>
        <label className="review-recipient-check">
          <input
            type="checkbox"
            checked={isRecipientChecked}
            onChange={handleRecipientCheck}
          />
          <span>
            <strong>{recipient.name} 님이 맞아요</strong>
            <small>
              {recipient.bankName} · {recipient.accountNumber}
            </small>
          </span>
        </label>
        <div className="actions">
          <button
            type="button"
            className="button primary"
            disabled={!isRecipientChecked}
            onClick={handleOpenConfirmation}
          >
            {draft.mode === "practice" ? "연습 송금 보내기" : "송금 보내기"}
          </button>
        </div>
      </Page>
      {isConfirmOpen && (
        <div className="confirm-layer">
          <div className="confirm-backdrop" onClick={handleCloseConfirmation} />
          <div className="confirm-dialog">
            <Check />
            <h2>
              정말
              <br />
              보낼까요?
            </h2>
            <p className="confirm-question">
              {formatWon(draft.amount)} · {recipient.name} 님
            </p>
            <div className="yes-no-actions">
              <button
                type="button"
                className="button secondary"
                onClick={handleCloseConfirmation}
              >
                아니요
              </button>
              <button
                type="button"
                className="button primary"
                onClick={handleSend}
              >
                예, 보낼게요
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
