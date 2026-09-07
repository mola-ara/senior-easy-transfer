"use client";

import { ChevronLeft, Volume2, VolumeX, X } from "lucide-react";
import type { HomeTourStep } from "./tour-data";
import { StartCue } from "@/components/ui";

const SENTENCE_PATTERN = /[^.!?]+[.!?]?/g;

function splitDescriptionIntoSentences(description: string): string[] {
  return description.match(SENTENCE_PATTERN) ?? [description];
}

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
  const isLastStep = stepIndex === totalSteps;
  const isCentered = step.target === "welcome" || step.target === "complete";
  const sentences = splitDescriptionIntoSentences(step.description);

  return (
    <div className="tour-layer">
      <div className="tour-shade" />
      <div
        className={
          isCentered
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
          {Array.from({ length: totalSteps + 1 }).map((_, index) => (
            <span key={index} className={index <= stepIndex ? "on" : ""} />
          ))}
        </div>
        <h2>{step.title}</h2>
        <p>
          {sentences.map((sentence) => (
            <span className="tour-sentence" key={sentence}>
              {sentence.trim()}
            </span>
          ))}
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
          {isLastStep ? (
            <>
              <StartCue />
              <div className="tour-complete-actions">
                <button
                  type="button"
                  className="tour-understood start-button-glow"
                  onClick={onStartPractice}
                >
                  연습 시작하기
                </button>
                <button type="button" className="tour-back" onClick={onClose}>
                  처음 화면으로 이동
                </button>
              </div>
            </>
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
