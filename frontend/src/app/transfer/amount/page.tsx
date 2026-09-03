"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Header, Page, PrimaryButton, Step } from "@/components/ui";
import { KeyboardAwareActions } from "@/components/keyboard-aware-actions";
import { formatKoreanAmount, formatWon } from "@/lib/format";
import { calculateRisks } from "@/services/transfer-service";
import { useAppStore } from "@/store/app-store";

const quickAmounts = [10_000, 50_000, 100_000];

export default function AmountPage() {
  const router = useRouter();
  const { draft, setAmount, setRisks } = useAppStore();
  const [value, setValue] = useState(0);
  const [ready, setReady] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    // 금액이 바뀔 때마다 강조 상태를 초기화하고 10초 뒤 다시 켠다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(false);
    if (value > 0)
      timerRef.current = window.setTimeout(() => setReady(true), 10_000);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
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

  const addAmount = (amount: number) => setValue((current) => current + amount);
  const resetAmount = () => setValue(0);

  const submit = () => {
    if (value <= 0 || !draft.recipient) return;
    const risks = calculateRisks(draft.recipient, value);
    setAmount(value);
    setRisks(risks);
    router.push(risks.length > 0 ? "/transfer/safety" : "/transfer/review");
  };

  return (
    <>
      <Header backHref="/transfer/recipient" title="금액 입력" cancel />
      <Page>
        <Step current={2} />
        <h1>
          {draft.recipient.name} 님에게
          <br />
          얼마를 보낼까요?
        </h1>
        <div className="amount-input-wrap">
          <input
            className="amount-input"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value === 0 ? "" : String(value)}
            placeholder="0"
            onChange={(event) =>
              setValue(Number(event.target.value.replace(/\D/g, "")) || 0)
            }
          />
          <span className="won">원</span>
        </div>
        {value > 0 && (
          <p className="korean-amount">한글로 {formatKoreanAmount(value)}</p>
        )}
        <div className="amount-chips">
          {quickAmounts.map((amount) => (
            <button
              type="button"
              key={amount}
              onClick={() => addAmount(amount)}
            >
              <strong>{formatWon(amount)}</strong>
              <span>더하기</span>
            </button>
          ))}
        </div>
        <p className="lead">누르면 지금 금액에 더해져요.</p>
        <button type="button" className="reset-amount" onClick={resetAmount}>
          처음부터 다시 입력
        </button>
        <KeyboardAwareActions>
          <PrimaryButton
            className={ready ? "ready-action" : ""}
            disabled={value <= 0}
            onClick={submit}
          >
            이 금액으로 보낼게요
          </PrimaryButton>
        </KeyboardAwareActions>
      </Page>
    </>
  );
}
