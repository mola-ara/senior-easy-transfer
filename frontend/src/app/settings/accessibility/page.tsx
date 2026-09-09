"use client";

import { Contrast, Languages, Move, Type, Volume2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Header, Notice, Page, VoiceButton } from "@/components/ui";
import type { AssistanceProfile, GuidanceLevel } from "@/domain/types";
import { useAppStore } from "@/store/app-store";

const GUIDANCE_OPTIONS: Array<{
  value: GuidanceLevel;
  title: string;
  description: string;
}> = [
  {
    value: "detailed",
    title: "하나씩 자세히 설명",
    description: "쉬운 말과 금융 용어를 함께 알려드려요.",
  },
  {
    value: "essential",
    title: "필요한 내용만 설명",
    description: "중요한 도움말과 금융 용어만 보여드려요.",
  },
  {
    value: "standard",
    title: "일반 금융 앱처럼 사용",
    description: "익숙한 금융 용어로 간결하게 보여드려요.",
  },
];

interface SupportSwitchProps {
  icon: ReactNode;
  title: string;
  description: string;
  isEnabled: boolean;
  onChange: () => void;
}

function SupportSwitch({
  icon,
  title,
  description,
  isEnabled,
  onChange,
}: SupportSwitchProps) {
  return (
    <div className="setting-card">
      {icon}
      <div className="setting-text">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={isEnabled}
        aria-label={title}
        className={isEnabled ? "switch on" : "switch"}
        onClick={onChange}
      >
        <span />
      </button>
    </div>
  );
}

export default function AccessibilityPage() {
  const { assistanceProfile, updateAssistanceProfile } = useAppStore();
  const [hasStorageError, setHasStorageError] = useState(false);

  const handleProfileChange = (next: Partial<AssistanceProfile>) => {
    const isSaved = updateAssistanceProfile(next);
    setHasStorageError(!isSaved);
  };

  return (
    <>
      <Header backHref="/" title="안내 방법 설정" />
      <Page>
        <p className="eyebrow">언제든 다시 바꿀 수 있어요</p>
        <h1>나에게 편한 안내를 선택해요</h1>
        <p className="lead">
          선택하지 않아도 자세한 안내가 제공돼요. 나이, 장애, 국적은 묻거나
          저장하지 않아요.
        </p>
        <fieldset className="guidance-options">
          <legend>안내 수준</legend>
          {GUIDANCE_OPTIONS.map((option) => (
            <label className="guidance-option" key={option.value}>
              <input
                type="radio"
                name="guidance-level"
                value={option.value}
                checked={assistanceProfile.guidanceLevel === option.value}
                onChange={() =>
                  handleProfileChange({ guidanceLevel: option.value })
                }
              />
              <span>
                <strong>{option.title}</strong>
                <small>{option.description}</small>
              </span>
            </label>
          ))}
        </fieldset>
        <h2>추가 지원</h2>
        <SupportSwitch
          icon={<Type aria-hidden />}
          title="글자를 크게 표시"
          description="본문과 버튼 글자를 한 단계 키워요."
          isEnabled={assistanceProfile.textScale === "large"}
          onChange={() =>
            handleProfileChange({
              textScale:
                assistanceProfile.textScale === "large" ? "default" : "large",
            })
          }
        />
        <SupportSwitch
          icon={<Volume2 aria-hidden />}
          title="화면 내용을 음성으로 안내"
          description="새 화면의 제목과 중요한 안내를 읽어요."
          isEnabled={assistanceProfile.isVoiceGuideEnabled}
          onChange={() =>
            handleProfileChange({
              isVoiceGuideEnabled: !assistanceProfile.isVoiceGuideEnabled,
            })
          }
        />
        <SupportSwitch
          icon={<Contrast aria-hidden />}
          title="높은 명도 대비 사용"
          description="글자와 배경을 더 뚜렷하게 구분해요."
          isEnabled={assistanceProfile.isHighContrastEnabled}
          onChange={() =>
            handleProfileChange({
              isHighContrastEnabled: !assistanceProfile.isHighContrastEnabled,
            })
          }
        />
        <SupportSwitch
          icon={<Move aria-hidden />}
          title="화면 움직임 최소화"
          description="강조 효과와 전환 움직임을 멈춰요."
          isEnabled={assistanceProfile.isReducedMotionEnabled}
          onChange={() =>
            handleProfileChange({
              isReducedMotionEnabled: !assistanceProfile.isReducedMotionEnabled,
            })
          }
        />
        <Notice tone="blue">
          <Languages aria-hidden />
          한국어 안내를 제공해요. 영어 금융 문구는 사용자 검증 후 추가할
          예정이에요.
        </Notice>
        {hasStorageError && (
          <p className="storage-error" role="status">
            설정을 이 기기에 저장하지 못했어요. 현재 화면에는 적용되며 송금은
            계속할 수 있어요.
          </p>
        )}
        <VoiceButton text="바다송금 음성 안내가 잘 들립니다. 안전 확인은 안내 수준과 관계없이 항상 제공됩니다." />
      </Page>
    </>
  );
}
