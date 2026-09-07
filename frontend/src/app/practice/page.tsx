"use client";

import { useRouter } from "next/navigation";
import { BookOpen, ShieldCheck } from "lucide-react";
import {
  Header,
  Page,
  PrimaryButton,
  SecondaryLink,
  StartCue,
} from "@/components/ui";
import { useAppStore } from "@/store/app-store";

export default function PracticePage() {
  const router = useRouter();
  const { startTransfer } = useAppStore();
  const start = () => {
    startTransfer("practice");
    router.push("/transfer/recipient");
  };

  return (
    <>
      <Header backHref="/" title="연습 송금" cancel />
      <Page className="practice-page">
        <h1>
          실제 돈 없이
          <br />
          먼저 연습해요
        </h1>
        <p className="lead">실제 돈 없이 순서대로 따라 해보세요.</p>
        <div className="practice-points">
          <div>
            <span className="mode-icon">
              <ShieldCheck />
            </span>
            <div>
              <strong>송금을 연습해요</strong>
              <small>실제 돈은 움직이지 않아요.</small>
            </div>
          </div>
          <div>
            <span className="mode-icon">
              <BookOpen />
            </span>
            <div>
              <strong>틀려도 다시 수정할 수 있어요</strong>
              <small>편하게 눌러보면서 익혀보세요.</small>
            </div>
          </div>
        </div>
        <StartCue />
        <div className="actions practice-start-actions">
          <PrimaryButton className="start-button-glow" onClick={start}>
            연습 시작하기
          </PrimaryButton>
          <SecondaryLink href="/">다음에 할게요</SecondaryLink>
        </div>
      </Page>
    </>
  );
}
