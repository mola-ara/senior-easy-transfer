"use client";

import { ChevronLeft, Volume2, VolumeX, X } from "lucide-react";
import type { HomeTourStep } from "./tour-data";

interface HomeTourProps {
  step: HomeTourStep;
  stepIndex: number;
  totalSteps: number;
  voiceEnabled: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  onToggleVoice: () => void;
  onStartPractice: () => void;
  onSpeak: () => void;
}

export function HomeTour({
  step,
  stepIndex,
  totalSteps,
  voiceEnabled,
  onNext,
  onPrevious,
  onClose,
  onToggleVoice,
  onStartPractice,
  onSpeak,
}: HomeTourProps) {
  const isLast = stepIndex === totalSteps;
  const centered = step.target === "welcome" || step.target === "complete";

  return (
    <div className="tour-layer">
      <div className="tour-shade" />
      <div
        className={
          centered
            ? "tour-dialog tour-dialog-center"
            : "tour-dialog tour-dialog-guided"
        }
        tabIndex={-1}
      >
        <div className="tour-meta">
          <span>
            {stepIndex + 1} / {totalSteps + 1}단계
          </span>
          <button type="button" className="tour-close" onClick={onClose}>
            <X />
            그만보기
          </button>
        </div>
        <div className="tour-progress">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <span key={index} className={index < stepIndex ? "on" : ""} />
          ))}
        </div>
        <h2>{step.title}</h2>
        <p>
          <span className="tour-sentence">{step.description}</span>
        </p>
        <div className="tour-audio-actions">
          <button type="button" onClick={onSpeak}>
            <Volume2 />
            다시 듣기
          </button>
          <button type="button" onClick={onToggleVoice}>
            {voiceEnabled ? <VolumeX /> : <Volume2 />}
            {voiceEnabled ? "음성 끄기" : "음성 켜기"}
          </button>
        </div>
        <div className="tour-actions">
          {isLast ? (
            <button
              type="button"
              className="tour-understood start-button-glow"
              onClick={onStartPractice}
            >
              연습 송금 시작하기
            </button>
          ) : (
            <div className="tour-actions-row">
              <button
                type="button"
                className="tour-back"
                disabled={stepIndex === 0}
                onClick={onPrevious}
              >
                <ChevronLeft />
                이전
              </button>
              <button
                type="button"
                className="tour-understood"
                onClick={onNext}
              >
                이해했어요
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
