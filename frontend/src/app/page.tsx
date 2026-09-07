"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRightLeft,
  BookOpen,
  CircleHelp,
  Clock3,
  Heart,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BottomNav, Header, Page } from "@/components/ui";
import { HomeTour } from "@/features/home-tour/home-tour";
import {
  HOME_TOUR_STORAGE_KEY,
  homeTourSteps,
} from "@/features/home-tour/tour-data";
import { formatWon } from "@/lib/format";
import { primaryAccount } from "@/mocks/data";
import { useAppStore } from "@/store/app-store";

export default function HomePage() {
  const router = useRouter();
  const { startTransfer, speak } = useAppStore();
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [tourVoice, setTourVoice] = useState(false);
  const balanceRef = useRef<HTMLElement>(null);
  const transferRef = useRef<HTMLElement>(null);
  const shortcutsRef = useRef<HTMLElement>(null);
  const step = homeTourSteps[tourStep];
  const spokenText = `${step.title}. ${step.description}`;

  const stopVoice = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window)
      window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    if (window.localStorage.getItem(HOME_TOUR_STORAGE_KEY) !== "true") {
      // 첫 마운트 뒤에만 브라우저의 안내 완료 기록을 확인한다.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTourOpen(true);
    }
    return stopVoice;
  }, [stopVoice]);

  useEffect(() => {
    if (!tourOpen || !tourVoice) return;
    speak(spokenText);
  }, [speak, spokenText, tourOpen, tourVoice]);

  const closeTour = useCallback(() => {
    stopVoice();
    setTourOpen(false);
    window.localStorage.setItem(HOME_TOUR_STORAGE_KEY, "true");
  }, [stopVoice]);
  const openTour = () => {
    stopVoice();
    setTourStep(0);
    setTourVoice(false);
    setTourOpen(true);
  };
  const startPractice = () => {
    closeTour();
    startTransfer("practice");
    router.push("/practice");
  };

  return (
    <>
      <Header />
      <Page
        className={tourOpen ? `home-tour-page home-tour-${step.target}` : ""}
      >
        <button type="button" className="learn-app" onClick={openTour}>
          <CircleHelp />앱 알아보기
        </button>
        <h1>
          김바다 님,
          <br />
          무엇을 해볼까요?
        </h1>
        <section
          ref={balanceRef}
          className={`balance-card ${tourOpen && step.target === "balance" ? "tour-target" : ""}`}
          aria-label="연습용 계좌"
        >
          <p>
            {primaryAccount.nickname} · {primaryAccount.accountNumber}
          </p>
          <strong className="balance">
            {formatWon(primaryAccount.balance)}
          </strong>
          <p>송금 연습에 사용하는 금액이에요</p>
        </section>
        <section
          ref={transferRef}
          className={
            tourOpen && step.target === "transfer"
              ? "tour-section tour-target"
              : "tour-section"
          }
          aria-label="송금하기 영역"
        >
          <h2>송금하기</h2>
          <div className="mode-grid">
            <Link
              href="/practice"
              className={`mode-card practice ${tourOpen && step.target === "transfer" ? "tour-primary-choice" : ""}`}
              onClick={() => startTransfer("practice")}
            >
              <span className="mode-icon">
                <BookOpen />
              </span>
              <span>
                <strong>연습 송금</strong>
                <small>실제 돈 없이 천천히 연습해요</small>
              </span>
            </Link>
            <Link
              href="/transfer/recipient"
              className={`mode-card real ${tourOpen && step.target === "transfer" ? "tour-secondary-choice" : ""}`}
              onClick={() => startTransfer("real")}
            >
              <span className="mode-icon">
                <ArrowRightLeft />
              </span>
              <span>
                <strong>송금해 보기</strong>
                <small>설명 없이 바로 연습해요</small>
              </span>
            </Link>
          </div>
        </section>
        <section
          ref={shortcutsRef}
          className={
            tourOpen && step.target === "shortcuts"
              ? "tour-section tour-target"
              : "tour-section"
          }
          aria-label="바로 가기 영역"
        >
          <h2>바로 가기</h2>
          <div className="quick-grid">
            <Link href="/history" className="quick-card">
              <Clock3 />
              최근 송금 내역
            </Link>
            <Link href="/favorites" className="quick-card">
              <Heart />
              자주 보내는 분
            </Link>
          </div>
        </section>
        <div className="notice green">
          <span className="notice-icon">
            <ShieldCheck />
          </span>
          <div>
            <strong>안심하고 이용하세요</strong>
            <br />
            실제 돈이나 계좌는 사용하지 않는 체험 서비스예요.
          </div>
        </div>
        <Link href="/setup" className="helper-setup-link">
          <UsersRound />
          <span>
            <strong>가족·도우미가 미리 준비하기</strong>
            <small>큰 글씨와 음성을 설정한 뒤 전달할 수 있어요</small>
          </span>
        </Link>
        <p className="footer-credit">
          기획·개발 바다소나무 · 포트폴리오 프로젝트
        </p>
      </Page>
      <BottomNav />
      {tourOpen && (
        <HomeTour
          step={step}
          stepIndex={tourStep}
          totalSteps={homeTourSteps.length - 1}
          voiceEnabled={tourVoice}
          onNext={() =>
            setTourStep((current) =>
              Math.min(current + 1, homeTourSteps.length - 1),
            )
          }
          onPrevious={() => setTourStep((current) => Math.max(current - 1, 0))}
          onClose={closeTour}
          onToggleVoice={() => {
            stopVoice();
            setTourVoice((current) => !current);
          }}
          onStartPractice={startPractice}
          onSpeak={() => speak(spokenText)}
        />
      )}
    </>
  );
}
