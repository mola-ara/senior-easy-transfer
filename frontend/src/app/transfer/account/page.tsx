"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Header, Page, PrimaryButton, Step } from "@/components/ui";
import { KeyboardAwareActions } from "@/components/keyboard-aware-actions";
import { validateAccountNumber } from "@/lib/validation";
import { useAppStore } from "@/store/app-store";

const banks = ["바다은행", "햇살은행", "푸른은행", "마음은행"];
type InputStage = "bank" | "account" | "name" | "review";
const stageNumber: Record<InputStage, number> = {
  bank: 1,
  account: 2,
  name: 3,
  review: 4,
};

export default function AccountPage() {
  const router = useRouter();
  const { setRecipient } = useAppStore();
  const [stage, setStage] = useState<InputStage>("bank");
  const [bank, setBank] = useState("");
  const [account, setAccount] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const accountInput = useRef<HTMLInputElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (stage === "account") accountInput.current?.focus();
      if (stage === "name") nameInput.current?.focus();
    }, 320);
    return () => window.clearTimeout(timer);
  }, [stage]);

  const goToName = () => {
    const nextError = validateAccountNumber(account);
    setError(nextError);
    if (!nextError) setStage("name");
  };

  const submit = () => {
    const digits = account.replace(/\D/g, "");
    setRecipient({
      id: `manual-${digits}`,
      name: name.trim(),
      bankName: bank,
      accountNumber: `${digits.slice(0, 3)}-****-${digits.slice(-4)}`,
      isFavorite: false,
      isRecent: false,
      avatarColor: "#EDF4FF",
    });
    router.push("/transfer/amount");
  };

  return (
    <>
      <Header backHref="/transfer/recipient" title="계좌번호 입력" cancel />
      <Page className="progressive-page">
        <Step current={1} />
        <p className="progressive-count">네 가지 중 {stageNumber[stage]}번째</p>
        {stage === "bank" && (
          <section className="progressive-panel" key="bank">
            <h1>어느 은행인가요?</h1>
            <p className="lead">은행 이름을 하나만 눌러 주세요.</p>
            <div className="bank-choice-list">
              {banks.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => {
                    setBank(item);
                    setStage("account");
                  }}
                >
                  {item}
                  <ChevronRight />
                </button>
              ))}
            </div>
          </section>
        )}
        {stage === "account" && (
          <section className="progressive-panel" key="account">
            <p className="chosen-value">
              <Check />
              {bank}
            </p>
            <h1>
              계좌번호를
              <br />
              입력해 주세요
            </h1>
            <p className="lead">숫자만 눌러도 돼요.</p>
            <div className="field single-field">
              <label htmlFor="account">계좌번호</label>
              <input
                ref={accountInput}
                id="account"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                enterKeyHint="next"
                placeholder="숫자만 입력"
                value={account}
                onChange={(event) => {
                  setAccount(event.target.value.replace(/\D/g, ""));
                  setError(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") goToName();
                }}
              />
            </div>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <KeyboardAwareActions>
              <PrimaryButton disabled={account.length < 8} onClick={goToName}>
                입력했어요
              </PrimaryButton>
            </KeyboardAwareActions>
          </section>
        )}
        {stage === "name" && (
          <section className="progressive-panel" key="name">
            <p className="chosen-value">
              <Check />
              계좌번호 입력 완료
            </p>
            <h1>
              받는 분 이름은
              <br />
              무엇인가요?
            </h1>
            <div className="field single-field">
              <label htmlFor="name">받는 분 이름</label>
              <input
                ref={nameInput}
                id="name"
                autoComplete="off"
                enterKeyHint="done"
                placeholder="예: 김영희"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && name.trim()) setStage("review");
                }}
              />
            </div>
            <KeyboardAwareActions>
              <PrimaryButton
                disabled={!name.trim()}
                onClick={() => setStage("review")}
              >
                입력했어요
              </PrimaryButton>
            </KeyboardAwareActions>
          </section>
        )}
        {stage === "review" && (
          <section className="progressive-panel" key="review">
            <p className="chosen-value">
              <Check />
              입력이 끝났어요
            </p>
            <h1>이 계좌가 맞나요?</h1>
            <div className="account-review-card">
              <strong>{name} 님</strong>
              <span>{bank}</span>
              <span>{account}</span>
            </div>
            <div className="progressive-review-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => setStage("bank")}
              >
                다시 입력할래요
              </button>
              <PrimaryButton onClick={submit}>예, 맞아요</PrimaryButton>
            </div>
          </section>
        )}
      </Page>
    </>
  );
}
