"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  KOREAN_SPEECH_PITCH,
  KOREAN_SPEECH_RATE,
  selectKoreanVoice,
} from "@/lib/speech";

export function useSpeechGuide(): (text: string) => void {
  const preferredVoiceRef = useRef<SpeechSynthesisVoice | undefined>(undefined);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const updatePreferredVoice = () => {
      preferredVoiceRef.current = selectKoreanVoice(
        window.speechSynthesis.getVoices(),
      );
    };

    updatePreferredVoice();
    window.speechSynthesis.addEventListener(
      "voiceschanged",
      updatePreferredVoice,
    );

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        updatePreferredVoice,
      );
      window.speechSynthesis.cancel();
    };
  }, []);

  return useCallback((text: string): void => {
    if (!("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const preferredVoice =
      preferredVoiceRef.current ??
      selectKoreanVoice(window.speechSynthesis.getVoices());

    utterance.lang = "ko-KR";
    utterance.rate = KOREAN_SPEECH_RATE;
    utterance.pitch = KOREAN_SPEECH_PITCH;
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);
}
