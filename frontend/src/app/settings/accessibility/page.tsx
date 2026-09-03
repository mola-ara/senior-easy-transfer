"use client";
import { Type, Volume2 } from "lucide-react";
import { Header, Notice, Page, VoiceButton } from "@/components/ui";
import { useAppStore } from "@/store/app-store";

export default function AccessibilityPage() {
  const { settings, updateSettings } = useAppStore();
  return (
    <>
      <Header backHref="/" title="접근성 설정" />
      <Page>
        <h1>
          보기와 듣기를
          <br />
          편하게 바꿔요
        </h1>
        <p className="lead">설정은 이 기기의 브라우저에 저장돼요.</p>
        <div className="setting-card">
          <Type />
          <div className="setting-text">
            <strong>글씨 크게 보기</strong>
            <span>본문과 버튼 글씨를 한 단계 키워요.</span>
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
        <div className="setting-card">
          <Volume2 />
          <div className="setting-text">
            <strong>화면 음성 안내</strong>
            <span>새 화면의 제목을 음성으로 알려줘요.</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.voiceGuide}
            aria-label="화면 음성 안내"
            className={settings.voiceGuide ? "switch on" : "switch"}
            onClick={() => updateSettings({ voiceGuide: !settings.voiceGuide })}
          >
            <span />
          </button>
        </div>
        <Notice tone="blue">
          음성 안내는 기기와 브라우저의 한국어 음성을 사용해요.
        </Notice>
        <VoiceButton text="바다송금 음성 안내가 잘 들립니다. 천천히 송금을 도와드릴게요." />
      </Page>
    </>
  );
}
