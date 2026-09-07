"use client";

import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Header, Page, Step } from "@/components/ui";
import { recipients } from "@/mocks/data";
import { useAppStore } from "@/store/app-store";
import type { Recipient } from "@/domain/types";

export default function RecipientPage() {
  const router = useRouter();
  const { setRecipient } = useAppStore();
  const [pending, setPending] = useState<Recipient | null>(null);

  const confirm = () => {
    if (!pending) return;
    setRecipient(pending);
    router.push("/transfer/amount");
  };

  return (
    <>
      <Header backHref="/" title="받는 분 선택" cancel />
      <Page>
        <Step current={1} />
        <h1>
          누구에게
          <br />
          보내드릴까요?
        </h1>
        <p className="lead">
          보낼 분을 선택해 주세요.
          <br />
          직접 입력할 수도 있어요.
        </p>
        <div className="person-list">
          {recipients.map((recipient) => (
            <button
              type="button"
              key={recipient.id}
              className="person-card"
              onClick={() => setPending(recipient)}
            >
              <span
                className="avatar"
                style={{ background: recipient.avatarColor }}
              >
                {recipient.name[0]}
              </span>
              <span className="person-info">
                <strong>{recipient.name}</strong>
                <span>
                  {recipient.bankName} · {recipient.accountNumber}
                </span>
              </span>
              <ChevronRight className="chevron" />
            </button>
          ))}
        </div>
        <p className="manual-link">
          <a href="/transfer/account">계좌번호를 내가 입력할래요</a>
        </p>
      </Page>
      {pending && (
        <div className="confirm-layer">
          <div className="confirm-backdrop" onClick={() => setPending(null)} />
          <div className="confirm-dialog">
            <Check />
            <h2>
              <strong className="confirm-person-name">{pending.name} 님</strong>
              이
              <br />
              맞나요?
            </h2>
            <p className="confirm-question">
              {pending.bankName} · {pending.accountNumber}
            </p>
            <div className="yes-no-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => setPending(null)}
              >
                아니요
              </button>
              <button
                type="button"
                className="button primary"
                onClick={confirm}
              >
                예, 맞아요
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
