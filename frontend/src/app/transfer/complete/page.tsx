"use client";
import { useEffect, useState } from "react";
import { AlertTriangle, Check, VolumeX } from "lucide-react";
import { Header, Page, PrimaryLink, SecondaryLink } from "@/components/ui";
import { formatDate, formatWon } from "@/lib/format";
import { useAppStore } from "@/store/app-store";
import type { TransferRecord } from "@/domain/types";
import { loadLatestReceipt } from "@/lib/receipt-storage";

function useCompletedReceipt(receipt: TransferRecord | null) {
  const [savedReceipt, setSavedReceipt] = useState<TransferRecord | null>(null);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  useEffect(() => {
    const latestReceipt = loadLatestReceipt();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavedReceipt(latestReceipt);
    setHasCheckedStorage(true);
  }, []);

  return {
    completedReceipt: receipt ?? savedReceipt,
    hasCheckedStorage,
  };
}

export default function CompletePage() {
  const { receipt, speak } = useAppStore();
  const { completedReceipt, hasCheckedStorage } = useCompletedReceipt(receipt);
  const voiceText = completedReceipt
    ? `${completedReceipt.recipient.name} 님에게 ${formatWon(completedReceipt.amount)} 송금 연습을 잘 마쳤어요.`
    : "";

  useEffect(() => {
    if (voiceText) speak(voiceText);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window)
        window.speechSynthesis.cancel();
    };
  }, [speak, voiceText]);

  const handleStopVoiceGuide = () => window.speechSynthesis?.cancel();

  if (!completedReceipt && !hasCheckedStorage) return null;
  if (!completedReceipt)
    return (
      <>
        <Header backHref="/" title="송금 완료" />
        <Page>
          <h1>완료된 송금이 없어요</h1>
          <p className="lead">처음 화면에서 연습 송금을 시작해 보세요.</p>
          <PrimaryLink href="/">처음 화면으로 이동</PrimaryLink>
        </Page>
      </>
    );
  return (
    <>
      <Header title="바다송금" />
      <Page className="center complete-page">
        <div className="success-mark">
          <Check />
        </div>
        <p className="eyebrow">
          {completedReceipt.mode === "practice" ? "연습 성공" : "송금 완료"}
        </p>
        <h1>성공했어요!</h1>
        <p className="lead">
          {completedReceipt.recipient.name} 님에게{" "}
          {formatWon(completedReceipt.amount)}
          <br />잘 보냈어요 · {formatDate(completedReceipt.transferredAt)}
        </p>
        <button
          type="button"
          className="complete-voice-stop"
          onClick={handleStopVoiceGuide}
        >
          <VolumeX />
          음성 안내 끄기
        </button>
        <section className="summary" aria-label="송금 영수증">
          <div className="summary-row">
            <span>받는 분</span>
            <strong>{completedReceipt.recipient.name}</strong>
          </div>
          <div className="summary-row account-row">
            <span>받는 계좌</span>
            <strong>
              {completedReceipt.recipient.bankName} ·{" "}
              {completedReceipt.recipient.accountNumber}
            </strong>
          </div>
          <div className="summary-row">
            <span>보낸 금액</span>
            <strong>{formatWon(completedReceipt.amount)}</strong>
          </div>
        </section>
        <p className="receipt-id">송금 연습 · 영수증 {completedReceipt.id}</p>
        <a href="/transfer/help" className="wrong-transfer-button">
          <AlertTriangle />
          잘못 보냈어요
        </a>
        <div className="complete-actions">
          <PrimaryLink href="/">처음 화면</PrimaryLink>
          <SecondaryLink href="/history">최근 내역</SecondaryLink>
        </div>
      </Page>
    </>
  );
}
