"use client";
import { useEffect } from "react";
import { AlertTriangle, Check, VolumeX } from "lucide-react";
import { Header, Page, PrimaryLink, SecondaryLink } from "@/components/ui";
import { formatDate, formatWon } from "@/lib/format";
import { useAppStore } from "@/store/app-store";

export default function CompletePage() {
  const { receipt, speak } = useAppStore();
  const voiceText = receipt
    ? `${receipt.recipient.name} 님에게 ${formatWon(receipt.amount)} 송금 연습을 잘 마쳤어요.`
    : "";

  useEffect(() => {
    if (voiceText) speak(voiceText);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window)
        window.speechSynthesis.cancel();
    };
  }, [speak, voiceText]);

  if (!receipt)
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
          {receipt.mode === "practice" ? "연습 성공" : "송금 완료"}
        </p>
        <h1>{receipt.recipient.name} 님에게 잘 보냈어요</h1>
        <p className="lead">
          {formatWon(receipt.amount)} · {formatDate(receipt.transferredAt)}
        </p>
        <button
          type="button"
          className="complete-voice-stop"
          onClick={() => window.speechSynthesis?.cancel()}
        >
          <VolumeX />
          음성 안내 끄기
        </button>
        <section className="summary" aria-label="송금 영수증">
          <div className="summary-row">
            <span>받는 분</span>
            <strong>{receipt.recipient.name}</strong>
          </div>
          <div className="summary-row account-row">
            <span>받는 계좌</span>
            <strong>
              {receipt.recipient.bankName} · {receipt.recipient.accountNumber}
            </strong>
          </div>
          <div className="summary-row">
            <span>보낸 금액</span>
            <strong>{formatWon(receipt.amount)}</strong>
          </div>
        </section>
        <p className="receipt-id">송금 연습 · 영수증 {receipt.id}</p>
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
