"use client";

import { Check, RotateCcw, Type, UsersRound, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Header, Notice, Page, PrimaryButton } from "@/components/ui";
import { HOME_TOUR_STORAGE_KEY } from "@/features/home-tour/tour-data";
import { useAppStore } from "@/store/app-store";

export default function SetupPage() {
  const router = useRouter();
  const { settings, updateSettings, speak } = useAppStore();
  const [ready, setReady] = useState(false);

  const handOff = () => {
    window.localStorage.removeItem(HOME_TOUR_STORAGE_KEY);
    window.speechSynthesis?.cancel();
    setReady(true);
  };

  if (ready)
    return (
      <>
        <Header backHref="/setup" title="사용 준비" />
        <Page className="center">
          <div className="success-mark">
            <Check />
          </div>
          <p className="eyebrow">준비가 끝났어요</p>
          <h1>
            이제 김바다 님께
            <br />
            휴대폰을 전달해 주세요
          </h1>
          <p className="lead">
            아래 버튼을 누르면 처음 화면에서 천천히 설명을 시작해요.
          </p>
          <Notice tone="blue">
            실제 계좌와 돈은 연결되지 않는 연습 서비스라고 먼저 말씀해 주세요.
          </Notice>
          <div className="actions">
            <PrimaryButton onClick={() => router.push("/")}>
              김바다 님 화면 시작하기
            </PrimaryButton>
          </div>
        </Page>
      </>
    );

  return (
    <>
      <Header backHref="/" title="가족·도우미 설정" />
      <Page>
        <p className="eyebrow">사용 전에 미리 준비해요</p>
        <h1>
          김바다 님이 편하도록
          <br />
          화면을 맞춰 주세요
        </h1>
        <p className="lead">
          가족, 은행 직원, 디지털 도우미가 설정하는 화면이에요.
        </p>
        <div className="setup-owner">
          <UsersRound />
          <div>
            <strong>설정하는 분을 위한 화면</strong>
            <span>준비가 끝나면 사용자용 처음 화면으로 바뀝니다.</span>
          </div>
        </div>
        <h2>1. 보기 편하게</h2>
        <div className="setting-card">
          <Type />
          <div className="setting-text">
            <strong>글씨 크게 보기</strong>
            <span>본문과 버튼 글씨를 한 단계 키웁니다.</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.largeText}
            aria-label="글씨 크게 보기"
            className={settings.largeText ? "switch on" : "switch"}
            onClick={() => updateSettings({ largeText: !settings.largeText })}
          >
            <span />
          </button>
        </div>
        <h2>2. 듣기 편하게</h2>
        <div className="setting-card">
          <Volume2 />
          <div className="setting-text">
            <strong>음성으로 설명하기</strong>
            <span>새 화면과 중요한 안내를 천천히 읽습니다.</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.voiceGuide}
            aria-label="음성으로 설명하기"
            className={settings.voiceGuide ? "switch on" : "switch"}
            onClick={() => updateSettings({ voiceGuide: !settings.voiceGuide })}
          >
            <span />
          </button>
        </div>
        <button
          type="button"
          className="voice-test"
          onClick={() =>
            speak(
              "바다송금 음성 안내입니다. 실제 돈 없이 천천히 연습할 수 있어요.",
            )
          }
        >
          <Volume2 />
          음성이 잘 들리는지 시험하기
        </button>
        <h2>3. 처음 설명 준비하기</h2>
        <div className="setup-reset">
          <RotateCcw />
          <div>
            <strong>처음부터 하나씩 알려드려요</strong>
            <span>
              전달 후 환영 안내부터 연습 금액, 송금 버튼 순서로 설명합니다.
            </span>
          </div>
        </div>
        <Notice tone="amber">
          이 화면에서는 실제 개인정보나 계좌번호를 입력하지 마세요.
        </Notice>
        <div className="actions">
          <PrimaryButton onClick={handOff}>
            설정을 마치고 전달할게요
          </PrimaryButton>
        </div>
      </Page>
    </>
  );
}
