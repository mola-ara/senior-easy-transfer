"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type {
  AccessibilitySettings,
  Recipient,
  TransferDraft,
  TransferRecord,
  TransferMode,
} from "@/domain/types";

const emptyDraft: TransferDraft = {
  mode: "practice",
  recipient: null,
  amount: 0,
  risks: [],
  safetyConfirmed: false,
};

interface AppStoreValue {
  draft: TransferDraft;
  settings: AccessibilitySettings;
  receipt: TransferRecord | null;
  startTransfer: (mode: TransferMode) => void;
  setRecipient: (recipient: Recipient) => void;
  setAmount: (amount: number) => void;
  setRisks: (risks: TransferDraft["risks"]) => void;
  confirmSafety: () => void;
  setReceipt: (receipt: TransferRecord | null) => void;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
  resetDraft: () => void;
  speak: (text: string) => void;
}

const AppStore = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [draft, setDraft] = useState<TransferDraft>(emptyDraft);
  const [receipt, setReceipt] = useState<TransferRecord | null>(null);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    largeText: false,
    voiceGuide: false,
  });

  useEffect(() => {
    const saved = window.localStorage.getItem("bada-accessibility");
    if (saved) {
      try {
        // 브라우저 저장값을 첫 마운트 후 복원한다.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSettings(JSON.parse(saved) as AccessibilitySettings);
      } catch {
        /* 잘못된 로컬 값은 기본값을 사용한다. */
      }
    }
  }, []);

  const speak = (text: string): void => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (settings.voiceGuide && pathname !== "/transfer/complete") {
      const title = document.querySelector("h1")?.textContent;
      if (title) speak(`${title} 화면입니다.`);
    }
    // 경로가 바뀔 때만 새 화면 제목을 안내한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const updateSettings = (next: Partial<AccessibilitySettings>): void => {
    setSettings((current) => {
      const updated = { ...current, ...next };
      window.localStorage.setItem(
        "bada-accessibility",
        JSON.stringify(updated),
      );
      return updated;
    });
  };

  const value = useMemo<AppStoreValue>(
    () => ({
      draft,
      settings,
      receipt,
      startTransfer: (mode) => {
        setDraft({ ...emptyDraft, mode });
        setReceipt(null);
      },
      setRecipient: (recipient) =>
        setDraft((current) => ({
          ...current,
          recipient,
          amount: 0,
          risks: [],
          safetyConfirmed: false,
        })),
      setAmount: (amount) =>
        setDraft((current) => ({
          ...current,
          amount,
          risks: [],
          safetyConfirmed: false,
        })),
      setRisks: (risks) => setDraft((current) => ({ ...current, risks })),
      confirmSafety: () =>
        setDraft((current) => ({ ...current, safetyConfirmed: true })),
      setReceipt,
      updateSettings,
      resetDraft: () => {
        setDraft(emptyDraft);
        setReceipt(null);
      },
      speak,
    }),
    [draft, receipt, settings],
  );

  return <AppStore.Provider value={value}>{children}</AppStore.Provider>;
}

export function useAppStore(): AppStoreValue {
  const value = useContext(AppStore);
  if (!value)
    throw new Error("useAppStore는 AppStoreProvider 안에서 사용해야 합니다.");
  return value;
}
