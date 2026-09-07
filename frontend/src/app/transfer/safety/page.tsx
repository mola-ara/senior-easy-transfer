"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { Header, Notice, Page, PrimaryButton, Step } from "@/components/ui";
import { useAppStore } from "@/store/app-store";
import type { RiskFlag } from "@/domain/types";

const riskCopy: Record<RiskFlag, { title: string; description: string }> = {
  "first-recipient": {
    title: "처음 보내는 계좌예요",
    description: "받는 분 이름과 계좌를 다시 한 번 확인해 주세요.",
  },
  "large-amount": {
    title: "50만 원이 넘는 큰 금액이에요",
    description: "금액이 맞는지 다시 한 번 확인해 주세요.",
  },
};

export default function SafetyPage() {
  const router = useRouter();
  const { draft, confirmSafety } = useAppStore();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!draft.recipient || draft.risks.length === 0) {
      router.replace(
        draft.recipient ? "/transfer/review" : "/transfer/recipient",
      );
    }
  }, [draft.recipient, draft.risks, router]);

  if (!draft.recipient || draft.risks.length === 0) return null;

  const allChecked = draft.risks.every((risk) => checked[risk]);

  const proceed = () => {
    confirmSafety();
    router.push("/transfer/review");
  };

  return (
    <>
      <Header backHref="/transfer/amount" title="안전 확인" cancel />
      <Page>
        <Step current={3} />
        <h1>
          보내기 전에
          <br />꼭 확인해 주세요
        </h1>
        <Notice tone="amber">
          <ShieldAlert />
          지금 상황에 맞는 확인이에요.
        </Notice>
        {draft.risks.map((risk) => (
          <label className="check-card" key={risk}>
            <input
              type="checkbox"
              checked={Boolean(checked[risk])}
              onChange={(event) =>
                setChecked((current) => ({
                  ...current,
                  [risk]: event.target.checked,
                }))
              }
            />
            <span>
              <strong>{riskCopy[risk].title}</strong>
              <span>{riskCopy[risk].description}</span>
            </span>
          </label>
        ))}
        <div className="actions">
          <PrimaryButton disabled={!allChecked} onClick={proceed}>
            모두 확인했어요
          </PrimaryButton>
        </div>
      </Page>
    </>
  );
}
