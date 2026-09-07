"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Header, Page, PrimaryButton, Step } from "@/components/ui";
import { KeyboardAwareActions } from "@/components/keyboard-aware-actions";
import { formatKoreanAmount } from "@/lib/format";
import { calculateRisks } from "@/services/transfer-service";
import { useAppStore } from "@/store/app-store";

const READY_ACTION_DELAY_MS = 10_000;

const QUICK_AMOUNTS = [
  { value: 10_000, label: "1만 원" },
  { value: 50_000, label: "5만 원" },
  { value: 100_000, label: "10만 원" },
];

export default function AmountPage() {
  const router = useRouter();
  const { draft, setAmount, setRisks } = useAppStore();
  const [value, setValue] = useState(0);
  const [isReadyActionHighlighted, setIsReadyActionHighlighted] =
    useState(false);
  const [amountAnimationKey, setAmountAnimationKey] = useState(0);
  const readyActionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (readyActionTimerRef.current) {
      window.clearTimeout(readyActionTimerRef.current);
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsReadyActionHighlighted(false);

    if (value > 0) {
      readyActionTimerRef.current = window.setTimeout(
        () => setIsReadyActionHighlighted(true),
        READY_ACTION_DELAY_MS,
      );
    }

    return () => {
      if (readyActionTimerRef.current) {
        window.clearTimeout(readyActionTimerRef.current);
      }
    };
  }, [value]);

  if (!draft.recipient) {
    return (
      <>
        <Header backHref="/transfer/recipient" title="금액 입력" cancel />
        <Page>
          <h1>받는 분을 먼저 선택해 주세요</h1>
          <PrimaryButton onClick={() => router.push("/transfer/recipient")}>
            받는 분 선택하기
          </PrimaryButton>
        </Page>
      </>
    );
  }

  const handleAddAmount = (amount: number) => {
    setValue((current) => current + amount);
    setAmountAnimationKey((current) => current + 1);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = Number(event.target.value.replace(/\D/g, ""));
    setValue(numericValue || 0);
  };

  const handleResetAmount = () => setValue(0);

  const handleSubmit = () => {
    if (value <= 0 || !draft.recipient) return;
    const risks = calculateRisks(draft.recipient, value);
    setAmount(value);
    setRisks(risks);
    router.push(risks.length > 0 ? "/transfer/safety" : "/transfer/review");
  };

  return (
    <>
      <Header backHref="/transfer/recipient" title="금액 입력" cancel />
      <Page className="amount-page">
        <Step current={2} />
        <h1 className="amount-title">
          <strong>{draft.recipient.name} 님에게</strong>
          <br />
          얼마를 보낼까요?
        </h1>
        <div className="amount-entry-card">
          <div
            className={
              amountAnimationKey
                ? "amount-input-wrap amount-changed"
                : "amount-input-wrap"
            }
            key={amountAnimationKey}
          >
            <input
              aria-label="보낼 금액"
              className="amount-input"
              inputMode="numeric"
              pattern="[0-9]*"
              value={value === 0 ? "" : String(value)}
              placeholder="0"
              onChange={handleAmountChange}
            />
            <span className="won">원</span>
          </div>
          {value > 0 && (
            <p className="korean-amount">{formatKoreanAmount(value)}</p>
          )}
        </div>
        <div className="amount-chips">
          {QUICK_AMOUNTS.map((amount) => (
            <button
              type="button"
              key={amount.value}
              onClick={() => handleAddAmount(amount.value)}
            >
              <strong>{amount.label}</strong>
            </button>
          ))}
        </div>
        {value > 0 && (
          <button
            type="button"
            className="reset-amount"
            onClick={handleResetAmount}
          >
            금액을 다시 쓸래요
          </button>
        )}
        <KeyboardAwareActions>
          <PrimaryButton
            className={`amount-submit-action ${isReadyActionHighlighted ? "ready-action" : ""}`}
            disabled={value <= 0}
            onClick={handleSubmit}
          >
            이 금액으로 보낼게요
          </PrimaryButton>
        </KeyboardAwareActions>
      </Page>
    </>
  );
}
