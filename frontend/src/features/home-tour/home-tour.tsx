"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, Volume2, VolumeX, X } from "lucide-react";
import type { HomeTourStep } from "./tour-data";
import { StartCue } from "@/components/ui";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

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
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialogRef.current?.focus();
  }, [step]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialog!.querySelectorAll<HTMLElement>(
        FOCUSABLE_SELECTOR,
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    dialog.addEventListener("keydown", handleKeyDown);
    return () => dialog.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="tour-layer">
      <div className="tour-shade" />
      <div
        ref={dialogRef}
        className={
          isCentered
            ? "tour-dialog tour-dialog-center"
            : "tour-dialog tour-dialog-guided"
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-dialog-title"
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
        <h2 id="tour-dialog-title">{step.title}</h2>
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
